-- ================================================================
-- Live data from football-data.org (sync-football-data Edge Function)
-- ================================================================

-- Rows imported from the API carry its id, e.g. 'fd:537785'. Seeded and
-- staff-entered rows leave it null.
alter table public.matches add column if not exists external_id text;
create unique index if not exists matches_external_id_key on public.matches (external_id);

-- The free plan has no goal-by-goal timeline, so for imported matches a goal
-- alert is raised when the live score goes up. Hand-entered goals still come
-- from match_events (see 20260926090000_push_notifications.sql).
create or replace function public.notify_score_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.external_id is null
     or new.status <> 'live'
     or not public.is_club_match(new.home_team, new.away_team)
     or coalesce(new.home_score, 0) + coalesce(new.away_score, 0)
        <= coalesce(old.home_score, 0) + coalesce(old.away_score, 0) then
    return new;
  end if;
  perform public.enqueue_notification(
    'goals',
    new.team_type,
    'GOAL · ' || new.home_team || ' v ' || new.away_team,
    new.home_team || ' ' || coalesce(new.home_score, 0) || ' - '
      || coalesce(new.away_score, 0) || ' ' || new.away_team,
    '/match/' || new.id,
    'score:' || new.id || ':' || coalesce(new.home_score, 0) || '-' || coalesce(new.away_score, 0)
  );
  return new;
end;
$$;

drop trigger if exists on_match_score_notify on public.matches;
create trigger on_match_score_notify
  after update of home_score, away_score on public.matches
  for each row execute function public.notify_score_change();

-- Let the app subscribe to live scores and the match timeline.
do $$
declare t text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    return;
  end if;
  foreach t in array array['matches', 'match_events'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
