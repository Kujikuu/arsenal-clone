-- ================================================================
-- Push notifications
--   push_tokens          Expo push tokens per signed-in device
--   notification_events  outbox filled by triggers, drained by the
--                        send-notifications Edge Function
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Club name used to decide which matches are "ours". Change it
--    together with lib/brand.ts when rebranding.
-- ----------------------------------------------------------------
create or replace function public.club_name()
returns text
language sql
immutable
as $$ select 'Arsenal'::text $$;

create or replace function public.is_club_match(p_home text, p_away text)
returns boolean
language sql
immutable
as $$ select p_home ilike public.club_name() || '%' or p_away ilike public.club_name() || '%' $$;

-- ----------------------------------------------------------------
-- 2. Device tokens
-- ----------------------------------------------------------------
create table if not exists public.push_tokens (
  token text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('ios', 'android')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists push_tokens_user_idx on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;

drop policy if exists "Users manage own push tokens" on public.push_tokens;
create policy "Users manage own push tokens" on public.push_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A device that changes account keeps its token: let the new owner claim it.
create or replace function public.register_push_token(p_token text, p_platform text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  insert into public.push_tokens (token, user_id, platform)
  values (p_token, auth.uid(), p_platform)
  on conflict (token) do update
    set user_id = excluded.user_id, platform = excluded.platform, updated_at = now();
end;
$$;

revoke all on function public.register_push_token(text, text) from public, anon;
grant execute on function public.register_push_token(text, text) to authenticated;

-- ----------------------------------------------------------------
-- 3. Outbox
-- ----------------------------------------------------------------
create table if not exists public.notification_events (
  id bigint generated always as identity primary key,
  category text not null check (category in ('kickoff', 'lineups', 'goals', 'full_time', 'news', 'tickets')),
  -- null = not tied to a team (e.g. news); otherwise men / women / academy.
  team_type text check (team_type in ('men', 'women', 'academy')),
  title text not null,
  body text not null,
  -- In-app route opened when the notification is tapped, e.g. /match/abc.
  url text,
  dedupe_key text not null unique,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  recipients integer,
  error text
);
create index if not exists notification_events_pending_idx
  on public.notification_events (created_at) where sent_at is null;

-- Service role only: RLS on with no policies.
alter table public.notification_events enable row level security;

create or replace function public.enqueue_notification(
  p_category text,
  p_team_type text,
  p_title text,
  p_body text,
  p_url text,
  p_dedupe_key text
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notification_events (category, team_type, title, body, url, dedupe_key)
  values (p_category, p_team_type, p_title, p_body, p_url, p_dedupe_key)
  on conflict (dedupe_key) do nothing;
$$;

-- ----------------------------------------------------------------
-- 4. Triggers that fill the outbox
-- ----------------------------------------------------------------

-- Goals, from the live match timeline.
create or replace function public.notify_match_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.matches%rowtype;
begin
  if new.type not in ('goal', 'own_goal', 'penalty_goal') then
    return new;
  end if;
  select * into m from public.matches where id = new.match_id;
  if not found or not public.is_club_match(m.home_team, m.away_team) then
    return new;
  end if;
  perform public.enqueue_notification(
    'goals',
    m.team_type,
    'GOAL ' || new.minute_label || ' · ' || m.home_team || ' v ' || m.away_team,
    coalesce(nullif(new.player, ''), new.title) || ' — ' || new.body,
    '/match/' || m.id,
    'goal:' || new.id
  );
  return new;
end;
$$;

drop trigger if exists on_match_event_notify on public.match_events;
create trigger on_match_event_notify
  after insert on public.match_events
  for each row execute function public.notify_match_event();

-- Team news, the first time a line-up is published for a match.
create or replace function public.notify_lineups()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.matches%rowtype;
begin
  select * into m from public.matches where id = new.match_id;
  if not found or m.status = 'finished' or not public.is_club_match(m.home_team, m.away_team) then
    return new;
  end if;
  perform public.enqueue_notification(
    'lineups',
    m.team_type,
    'Team news: ' || m.home_team || ' v ' || m.away_team,
    'The starting XI is in. See who''s playing.',
    '/match/' || m.id,
    'lineups:' || m.id
  );
  return new;
end;
$$;

drop trigger if exists on_lineup_notify on public.match_lineups;
create trigger on_lineup_notify
  after insert on public.match_lineups
  for each row execute function public.notify_lineups();

-- Full time.
create or replace function public.notify_full_time()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'finished' and old.status is distinct from 'finished'
     and public.is_club_match(new.home_team, new.away_team) then
    perform public.enqueue_notification(
      'full_time',
      new.team_type,
      'Full time',
      new.home_team || ' ' || coalesce(new.home_score, 0) || ' - '
        || coalesce(new.away_score, 0) || ' ' || new.away_team,
      '/match/' || new.id,
      'full_time:' || new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_match_full_time_notify on public.matches;
create trigger on_match_full_time_notify
  after update of status on public.matches
  for each row execute function public.notify_full_time();

-- Breaking news: articles flagged is_breaking.
alter table public.articles add column if not exists is_breaking boolean not null default false;

create or replace function public.notify_breaking_news()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_breaking and (tg_op = 'INSERT' or not old.is_breaking) then
    perform public.enqueue_notification(
      'news', null, 'Breaking news', new.title, '/article/' || new.id, 'news:' || new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_article_breaking_notify on public.articles;
create trigger on_article_breaking_notify
  after insert or update of is_breaking on public.articles
  for each row execute function public.notify_breaking_news();

-- Ticket sales opening.
create or replace function public.notify_ticket_sale()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.matches%rowtype;
begin
  if new.status <> 'open' or (tg_op = 'UPDATE' and old.status = 'open') then
    return new;
  end if;
  select * into m from public.matches where id = new.match_id;
  if not found then
    return new;
  end if;
  perform public.enqueue_notification(
    'tickets',
    m.team_type,
    'Tickets on sale',
    new.phase || ' is open for ' || m.home_team || ' v ' || m.away_team || '.',
    '/account/tickets',
    'tickets:' || new.id
  );
  return new;
end;
$$;

drop trigger if exists on_ticket_sale_notify on public.ticket_sales;
create trigger on_ticket_sale_notify
  after insert or update of status on public.ticket_sales
  for each row execute function public.notify_ticket_sale();

-- Kick-off reminders are time based, so the sender calls this each run.
create or replace function public.enqueue_kickoff_reminders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  added integer;
begin
  insert into public.notification_events (category, team_type, title, body, url, dedupe_key)
  select 'kickoff',
         m.team_type,
         'Kick-off in one hour',
         m.home_team || ' v ' || m.away_team || ' · ' || m.competition,
         '/match/' || m.id,
         'kickoff:' || m.id
  from public.matches m
  where m.status = 'scheduled'
    and m.match_date between now() and now() + interval '65 minutes'
    and public.is_club_match(m.home_team, m.away_team)
  on conflict (dedupe_key) do nothing;
  get diagnostics added = row_count;
  return added;
end;
$$;

-- ----------------------------------------------------------------
-- 5. Who receives an event: users with the category switched on,
--    and the women's / academy toggle when the event is for that team.
-- ----------------------------------------------------------------
create or replace function public.notification_tokens(p_event_id bigint)
returns table (token text)
language sql
stable
security definer
set search_path = public
as $$
  select t.token
  from public.notification_events e
  join public.user_settings s on true
  join public.push_tokens t on t.user_id = s.user_id
  where e.id = p_event_id
    and case e.category
          when 'kickoff' then s.notify_kickoff
          when 'lineups' then s.notify_lineups
          when 'goals' then s.notify_goals
          when 'full_time' then s.notify_full_time
          when 'news' then s.notify_news
          when 'tickets' then s.notify_tickets
        end
    and case e.team_type
          when 'women' then s.notify_women
          when 'academy' then s.notify_academy
          else true
        end;
$$;

-- Only the service role (the Edge Function) may run the outbox helpers.
revoke all on function public.enqueue_notification(text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.enqueue_kickoff_reminders() from public, anon, authenticated;
revoke all on function public.notification_tokens(bigint) from public, anon, authenticated;
grant execute on function public.enqueue_kickoff_reminders() to service_role;
grant execute on function public.notification_tokens(bigint) to service_role;
