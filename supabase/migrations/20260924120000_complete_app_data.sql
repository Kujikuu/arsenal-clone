-- ================================================================
-- ARSENAL FC APP CLONE — COMPLETE APP DATA
-- Everything the app renders now comes from these tables: fixtures for
-- every team and season, per-team tables, match centre detail, the media
-- hub modules, reactions and all per-user account data.
-- Additive on top of 20260923205852_init_arsenal_schema.sql.
-- ================================================================

-- ----------------------------------------------------------------
-- 1. MATCHES
-- ----------------------------------------------------------------
alter table public.matches add column if not exists team_type text not null default 'men';
alter table public.matches add column if not exists audio_url text;
alter table public.matches drop constraint if exists matches_team_type_check;
alter table public.matches add constraint matches_team_type_check
  check (team_type in ('men', 'women', 'academy'));

alter table public.matches drop constraint if exists matches_competition_check;
update public.matches set competition = 'UEFA Champions League' where competition = 'Champions League';
alter table public.matches add constraint matches_competition_check check (competition in (
  'Premier League', 'UEFA Champions League', 'FA Cup', 'Carabao Cup', 'UEFA Europa League',
  'Emirates Cup', 'Friendly', 'Women''s Super League', 'UEFA Women''s Champions League',
  'Women''s League Cup', 'Premier League 2', 'U18 Premier League', 'UEFA Youth League'
));

create index if not exists matches_team_season_date_idx
  on public.matches (team_type, season, match_date);

-- ----------------------------------------------------------------
-- 2. STANDINGS — one table per team type, season and competition
-- ----------------------------------------------------------------
alter table public.standings add column if not exists team_type text not null default 'men';
alter table public.standings add column if not exists season text not null default '2026/27';
alter table public.standings add column if not exists competition text not null default 'Premier League';
alter table public.standings add column if not exists team_code text;
alter table public.standings add column if not exists trend text not null default 'same';
alter table public.standings drop constraint if exists standings_trend_check;
alter table public.standings add constraint standings_trend_check check (trend in ('up', 'down', 'same'));
alter table public.standings drop constraint if exists standings_team_type_check;
alter table public.standings add constraint standings_team_type_check
  check (team_type in ('men', 'women', 'academy'));
alter table public.standings drop constraint if exists standings_team_name_key;
alter table public.standings drop constraint if exists standings_table_team_key;
alter table public.standings add constraint standings_table_team_key
  unique (team_type, season, competition, team_name);

-- ----------------------------------------------------------------
-- 3. PLAYERS
-- ----------------------------------------------------------------
alter table public.players add column if not exists place_of_birth text;
alter table public.players add column if not exists signed_on date;
-- Full-height card art; when set the player card uses it instead of the cutout photo.
alter table public.players add column if not exists card_panel_url text;

-- ----------------------------------------------------------------
-- 4. VIDEO COLLECTIONS (media hub rails)
-- ----------------------------------------------------------------
create table if not exists public.video_collections (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  team_type text not null default 'club' check (team_type in ('men', 'women', 'academy', 'club')),
  match_id text references public.matches(id) on delete set null,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 5. ARTICLES & VIDEOS
-- ----------------------------------------------------------------
alter table public.articles drop constraint if exists articles_category_check;
alter table public.articles add constraint articles_category_check check (category in (
  'Match Report', 'Interview', 'News', 'Transfer', 'Academy', 'Women', 'Feature', 'Video', 'Gallery'
));
alter table public.articles add column if not exists team_type text not null default 'club';
alter table public.articles drop constraint if exists articles_team_type_check;
alter table public.articles add constraint articles_team_type_check
  check (team_type in ('men', 'women', 'academy', 'club'));
alter table public.articles add column if not exists youtube_id text;
alter table public.articles add column if not exists video_duration text;
alter table public.articles add column if not exists reaction_kind text not null default 'happy';
alter table public.articles add column if not exists reactions_base integer not null default 0;
alter table public.articles add column if not exists match_id text references public.matches(id) on delete set null;

alter table public.videos drop constraint if exists videos_category_check;
alter table public.videos add constraint videos_category_check check (category in (
  'Highlights', 'Interviews', 'Features', 'Classic', 'Full Match', 'Reaction', 'Behind The Scenes'
));
alter table public.videos add column if not exists team_type text not null default 'club';
alter table public.videos drop constraint if exists videos_team_type_check;
alter table public.videos add constraint videos_team_type_check
  check (team_type in ('men', 'women', 'academy', 'club'));
alter table public.videos add column if not exists collection_id text references public.video_collections(id) on delete set null;
alter table public.videos add column if not exists match_id text references public.matches(id) on delete set null;
alter table public.videos add column if not exists sort integer not null default 0;
alter table public.videos add column if not exists reactions_base integer not null default 0;
-- Not every clip has a public YouTube upload; the app falls back to a search link.
alter table public.videos alter column youtube_id drop not null;

-- ----------------------------------------------------------------
-- 6. MATCH CENTRE
-- ----------------------------------------------------------------
create table if not exists public.match_events (
  id text primary key default gen_random_uuid()::text,
  match_id text not null references public.matches(id) on delete cascade,
  sort integer not null,
  minute_label text not null,
  type text not null check (type in (
    'goal', 'own_goal', 'penalty_goal', 'yellow_card', 'red_card', 'sub', 'var',
    'whistle', 'chance', 'corner', 'info'
  )),
  team text check (team in ('home', 'away')),
  player text,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists match_events_match_idx on public.match_events (match_id, sort);

create table if not exists public.match_lineups (
  id text primary key default gen_random_uuid()::text,
  match_id text not null references public.matches(id) on delete cascade,
  side text not null check (side in ('home', 'away')),
  shirt_number integer not null,
  name text not null,
  position text not null,
  photo_url text,
  is_starter boolean not null default true,
  sort integer not null default 0
);
create index if not exists match_lineups_match_idx on public.match_lineups (match_id, side, sort);

create table if not exists public.match_stats (
  id text primary key default gen_random_uuid()::text,
  match_id text not null references public.matches(id) on delete cascade,
  sort integer not null,
  label text not null,
  home_value text not null,
  away_value text not null,
  -- share of the bar owned by the home side, 0..1
  home_share numeric(5, 4) not null check (home_share between 0 and 1)
);
create index if not exists match_stats_match_idx on public.match_stats (match_id, sort);

alter table public.fan_polls add column if not exists match_id text references public.matches(id) on delete cascade;

-- ----------------------------------------------------------------
-- 7. PHOTOS, QUIZZES, EXPERIENCES, REELS
-- ----------------------------------------------------------------
create table if not exists public.photo_galleries (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  team_type text not null default 'club' check (team_type in ('men', 'women', 'academy', 'club')),
  cover_url text not null,
  match_id text references public.matches(id) on delete set null,
  published_at timestamptz not null default now()
);

create table if not exists public.photo_gallery_images (
  id text primary key default gen_random_uuid()::text,
  gallery_id text not null references public.photo_galleries(id) on delete cascade,
  image_url text not null,
  caption text,
  sort integer not null default 0
);
create index if not exists photo_gallery_images_gallery_idx on public.photo_gallery_images (gallery_id, sort);

create table if not exists public.quizzes (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  team_type text not null default 'club' check (team_type in ('men', 'women', 'academy', 'club')),
  cover_url text not null,
  published_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id text primary key default gen_random_uuid()::text,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  sort integer not null,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  correct_index integer not null,
  explanation text
);
create index if not exists quiz_questions_quiz_idx on public.quiz_questions (quiz_id, sort);

create table if not exists public.quiz_attempts (
  id text primary key default gen_random_uuid()::text,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id text primary key default gen_random_uuid()::text,
  category text not null check (category in ('tour', 'museum', 'matchday', 'legends')),
  title text not null,
  subtitle text not null,
  description text not null,
  image_url text not null,
  price_gbp numeric(8, 2) not null,
  duration_minutes integer not null,
  schedule text not null,
  book_url text not null,
  team_type text not null default 'club' check (team_type in ('men', 'women', 'academy', 'club')),
  sort integer not null default 0
);

create table if not exists public.reels (
  id text primary key default gen_random_uuid()::text,
  tag text not null,
  title text not null,
  subtitle text not null,
  image_url text not null,
  article_id text references public.articles(id) on delete set null,
  team_type text not null default 'club' check (team_type in ('men', 'women', 'academy', 'club')),
  is_featured boolean not null default false,
  reactions_base integer not null default 0,
  published_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 8. REACTIONS
-- ----------------------------------------------------------------
create table if not exists public.content_reactions (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('article', 'video', 'reel')),
  target_id text not null,
  kind text not null default 'happy',
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);
create index if not exists content_reactions_target_idx on public.content_reactions (target_type, target_id);

-- ----------------------------------------------------------------
-- 9. ACCOUNT
-- ----------------------------------------------------------------
alter table public.user_profiles add column if not exists phone text;
alter table public.user_profiles add column if not exists date_of_birth date;
alter table public.user_profiles add column if not exists country text;
alter table public.user_profiles add column if not exists postcode text;
alter table public.user_profiles add column if not exists marketing_opt_in boolean not null default false;

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notify_kickoff boolean not null default true,
  notify_lineups boolean not null default true,
  notify_goals boolean not null default true,
  notify_full_time boolean not null default true,
  notify_news boolean not null default false,
  notify_tickets boolean not null default true,
  notify_women boolean not null default false,
  notify_academy boolean not null default false,
  favourite_team_type text not null default 'men' check (favourite_team_type in ('men', 'women', 'academy')),
  currency text not null default 'GBP' check (currency in ('GBP', 'USD')),
  autoplay_video boolean not null default true,
  language text not null default 'en' check (language in ('en', 'es', 'fr', 'ar')),
  calendar_men boolean not null default true,
  calendar_women boolean not null default true,
  calendar_academy boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_sales (
  id text primary key default gen_random_uuid()::text,
  match_id text not null references public.matches(id) on delete cascade,
  phase text not null,
  opens_at timestamptz not null,
  closes_at timestamptz,
  price_from_gbp numeric(8, 2) not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'open', 'sold_out')),
  buy_url text not null
);

create table if not exists public.user_tickets (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id text not null references public.matches(id) on delete cascade,
  sale_id text references public.ticket_sales(id) on delete set null,
  block text not null,
  row_label text not null,
  seat text not null,
  barcode text not null unique,
  created_at timestamptz not null default now(),
  unique (user_id, match_id)
);

create table if not exists public.tour_bookings (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  experience_id text not null references public.experiences(id) on delete cascade,
  tour_date date not null,
  guests integer not null check (guests between 1 and 10),
  created_at timestamptz not null default now()
);

create table if not exists public.legal_documents (
  slug text primary key,
  title text not null,
  body text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  topic text not null,
  message text not null check (char_length(message) between 5 and 4000),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 10. ROW LEVEL SECURITY
-- ----------------------------------------------------------------
alter table public.video_collections enable row level security;
alter table public.match_events enable row level security;
alter table public.match_lineups enable row level security;
alter table public.match_stats enable row level security;
alter table public.photo_galleries enable row level security;
alter table public.photo_gallery_images enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.experiences enable row level security;
alter table public.reels enable row level security;
alter table public.content_reactions enable row level security;
alter table public.user_settings enable row level security;
alter table public.ticket_sales enable row level security;
alter table public.user_tickets enable row level security;
alter table public.tour_bookings enable row level security;
alter table public.legal_documents enable row level security;
alter table public.support_messages enable row level security;

-- Club content is public.
do $$
declare t text;
begin
  foreach t in array array[
    'video_collections', 'match_events', 'match_lineups', 'match_stats', 'photo_galleries',
    'photo_gallery_images', 'quizzes', 'quiz_questions', 'experiences', 'reels',
    'ticket_sales', 'legal_documents'
  ] loop
    execute format('drop policy if exists "Allow public read access on %1$s" on public.%1$I', t);
    execute format('create policy "Allow public read access on %1$s" on public.%1$I for select using (true)', t);
  end loop;
end $$;

-- Per-user rows are only visible to and editable by their owner.
drop policy if exists "Users manage own quiz attempts" on public.quiz_attempts;
create policy "Users manage own quiz attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own reactions" on public.content_reactions;
create policy "Users manage own reactions" on public.content_reactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own settings" on public.user_settings;
create policy "Users manage own settings" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users read own tickets" on public.user_tickets;
create policy "Users read own tickets" on public.user_tickets
  for select using (auth.uid() = user_id);

drop policy if exists "Users manage own tour bookings" on public.tour_bookings;
create policy "Users manage own tour bookings" on public.tour_bookings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Anyone can send a support message" on public.support_messages;
create policy "Anyone can send a support message" on public.support_messages
  for insert with check (user_id is null or auth.uid() = user_id);

-- The init migration's profile policy had no WITH CHECK for inserts from other ids.
drop policy if exists "Allow users to insert/update own profile" on public.user_profiles;
create policy "Allow users to insert/update own profile" on public.user_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Bookmarks need a WITH CHECK too.
drop policy if exists "Allow users to manage own bookmarks" on public.user_bookmarks;
create policy "Allow users to manage own bookmarks" on public.user_bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- 11. FUNCTIONS
-- ----------------------------------------------------------------

-- Create the profile and settings rows for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, gunner_id_number)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1), 'Gooner'),
    'GID-' || upper(substr(replace(new.id::text, '-', ''), 1, 10))
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that signed up before the trigger existed.
insert into public.user_profiles (id, full_name, gunner_id_number)
select u.id,
       coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1), 'Gooner'),
       'GID-' || upper(substr(replace(u.id::text, '-', ''), 1, 10))
from auth.users u
on conflict do nothing;
insert into public.user_settings (user_id) select id from auth.users on conflict (user_id) do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_touch on public.user_profiles;
create trigger user_profiles_touch before update on public.user_profiles
  for each row execute function public.touch_updated_at();
drop trigger if exists user_settings_touch on public.user_settings;
create trigger user_settings_touch before update on public.user_settings
  for each row execute function public.touch_updated_at();

-- Reaction totals (seeded base + real reactions) and whether the caller reacted.
create or replace function public.get_reactions(p_target_type text, p_target_ids text[])
returns table (target_id text, total integer, reacted boolean)
language sql
stable
security definer
set search_path = public
as $$
  with base as (
    select a.id as target_id, a.reactions_base as base from public.articles a
      where p_target_type = 'article' and a.id = any (p_target_ids)
    union all
    select v.id, v.reactions_base from public.videos v
      where p_target_type = 'video' and v.id = any (p_target_ids)
    union all
    select r.id, r.reactions_base from public.reels r
      where p_target_type = 'reel' and r.id = any (p_target_ids)
  )
  select b.target_id,
         (b.base + count(cr.id))::integer as total,
         coalesce(bool_or(cr.user_id = auth.uid()), false) as reacted
  from base b
  left join public.content_reactions cr
    on cr.target_type = p_target_type and cr.target_id = b.target_id
  group by b.target_id, b.base;
$$;

create or replace function public.toggle_reaction(p_target_type text, p_target_id text, p_kind text default 'happy')
returns table (target_id text, total integer, reacted boolean)
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to react' using errcode = '28000';
  end if;

  delete from public.content_reactions cr
  where cr.user_id = auth.uid() and cr.target_type = p_target_type and cr.target_id = p_target_id;

  if not found then
    insert into public.content_reactions (user_id, target_type, target_id, kind)
    values (auth.uid(), p_target_type, p_target_id, p_kind);
  end if;

  return query select * from public.get_reactions(p_target_type, array[p_target_id]);
end;
$$;

-- Full-text-ish search over articles and videos, paged per kind with totals.
create or replace function public.search_content(
  p_query text default '',
  p_kind text default 'all',
  p_team_type text default null,
  p_limit integer default 4,
  p_offset integer default 0
)
returns table (kind text, id text, title text, image_url text, published_at timestamptz, total bigint)
language sql
stable
set search_path = public
as $$
  with q as (
    select '%' || replace(replace(replace(coalesce(trim(p_query), ''), '\', '\\'), '%', '\%'), '_', '\_') || '%' as pattern
  ),
  results as (
    select 'article'::text as kind, a.id, a.title, a.image_url, a.published_at
    from public.articles a, q
    where (a.title ilike q.pattern or coalesce(a.subtitle, '') ilike q.pattern or a.content ilike q.pattern)
      and (p_team_type is null or a.team_type = p_team_type)
    union all
    select 'video'::text, v.id, v.title, v.thumbnail_url, v.published_at
    from public.videos v, q
    where v.title ilike q.pattern
      and (p_team_type is null or v.team_type = p_team_type)
  ),
  ranked as (
    select r.*,
           count(*) over (partition by r.kind) as total,
           row_number() over (partition by r.kind order by r.published_at desc, r.id) as rn
    from results r
    where p_kind = 'all' or r.kind = p_kind
  )
  select ranked.kind, ranked.id, ranked.title, ranked.image_url, ranked.published_at, ranked.total
  from ranked
  where ranked.rn > p_offset and ranked.rn <= p_offset + p_limit
  order by ranked.kind, ranked.rn;
$$;

-- Claim a seat from an open ticket sale.
create or replace function public.claim_ticket(p_sale_id text)
returns public.user_tickets
language plpgsql
security definer
set search_path = public
as $$
declare
  sale public.ticket_sales;
  ticket public.user_tickets;
begin
  if auth.uid() is null then
    raise exception 'Sign in to buy tickets' using errcode = '28000';
  end if;

  select * into sale from public.ticket_sales where id = p_sale_id;
  if not found then
    raise exception 'Ticket sale not found' using errcode = 'P0002';
  end if;
  if sale.status <> 'open' then
    raise exception 'This sale is not open' using errcode = 'P0001';
  end if;

  select * into ticket from public.user_tickets where user_id = auth.uid() and match_id = sale.match_id;
  if found then
    return ticket;
  end if;

  insert into public.user_tickets (user_id, match_id, sale_id, block, row_label, seat, barcode)
  values (
    auth.uid(),
    sale.match_id,
    sale.id,
    (array['7', '12', '19', '25', '96', '100', '112', '124'])[1 + floor(random() * 8)::int],
    chr(65 + floor(random() * 20)::int),
    (1 + floor(random() * 40)::int)::text,
    upper(substr(md5(auth.uid()::text || sale.id || clock_timestamp()::text), 1, 16))
  )
  returning * into ticket;

  return ticket;
end;
$$;

-- Vote counts are maintained by a trigger instead of a client-callable RPC,
-- so a vote can only ever be counted once per user.
create or replace function public.count_poll_vote()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.poll_options set votes_count = votes_count + 1 where id = new.option_id;
  return new;
end;
$$;

drop trigger if exists poll_votes_count on public.poll_votes;
create trigger poll_votes_count after insert on public.poll_votes
  for each row execute function public.count_poll_vote();

revoke all on function public.increment_poll_option_vote(text) from public, anon, authenticated;

-- Permanently delete the caller's account; cascades to all their rows.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
revoke all on function public.claim_ticket(text) from public, anon;
grant execute on function public.claim_ticket(text) to authenticated;
revoke all on function public.toggle_reaction(text, text, text) from public, anon;
grant execute on function public.toggle_reaction(text, text, text) to authenticated;
grant execute on function public.get_reactions(text, text[]) to anon, authenticated;
grant execute on function public.search_content(text, text, text, integer, integer) to anon, authenticated;
