-- ================================================================
-- Full schema: the migrations in supabase/migrations concatenated in order.
-- Paste into the Supabase SQL editor for a fresh project, then run seed.sql.
-- ================================================================

-- ================================================================
-- ARSENAL FC APP CLONE SCHEMA
-- Supabase Postgres Migration DDL
-- ================================================================

-- 1. ARTICLES TABLE
create table if not exists public.articles (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subtitle text,
  category text not null check (category in ('Match Report', 'Interview', 'News', 'Transfer', 'Academy', 'Women')),
  content text not null,
  image_url text not null,
  author text not null default 'Arsenal Media',
  read_time text not null default '3 min read',
  published_at timestamptz not null default now(),
  is_featured boolean not null default false,
  tag text,
  created_at timestamptz not null default now()
);

-- 2. MATCHES TABLE
create table if not exists public.matches (
  id text primary key default gen_random_uuid()::text,
  competition text not null check (competition in ('Premier League', 'Champions League', 'FA Cup', 'Carabao Cup', 'Friendly')),
  competition_logo text,
  season text not null default '2024/25',
  round text not null,
  match_date timestamptz not null,
  home_team text not null,
  away_team text not null,
  home_team_logo text not null,
  away_team_logo text not null,
  home_score integer,
  away_score integer,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'finished')),
  minute integer,
  stadium text not null default 'Emirates Stadium',
  referee text,
  lineups_json jsonb,
  timeline_events_json jsonb,
  match_stats_json jsonb,
  created_at timestamptz not null default now()
);

-- 3. STANDINGS TABLE
create table if not exists public.standings (
  id text primary key default gen_random_uuid()::text,
  rank integer not null,
  team_name text not null unique,
  team_logo text not null,
  played integer not null default 0,
  won integer not null default 0,
  drawn integer not null default 0,
  lost integer not null default 0,
  goals_for integer not null default 0,
  goals_against integer not null default 0,
  goal_diff integer not null default 0,
  points integer not null default 0,
  form text,
  updated_at timestamptz not null default now()
);

-- 4. PLAYERS TABLE
create table if not exists public.players (
  id text primary key default gen_random_uuid()::text,
  team_type text not null default 'men' check (team_type in ('men', 'women', 'academy')),
  first_name text not null,
  last_name text not null,
  known_as text,
  shirt_number integer not null,
  position text not null check (position in ('Goalkeeper', 'Defender', 'Midfielder', 'Forward')),
  nationality text not null,
  country_flag text not null,
  date_of_birth date not null,
  photo_url text not null,
  bio text not null,
  appearances integer not null default 0,
  goals integer not null default 0,
  assists integer not null default 0,
  clean_sheets integer default 0,
  created_at timestamptz not null default now()
);

-- 5. VIDEOS TABLE (Arsenal TV)
create table if not exists public.videos (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  category text not null check (category in ('Highlights', 'Interviews', 'Features', 'Classic')),
  youtube_id text not null,
  duration text not null,
  thumbnail_url text not null,
  published_at timestamptz not null default now(),
  views_count text default '125K views',
  created_at timestamptz not null default now()
);

-- 6. FAN POLLS & POLL OPTIONS & VOTES
create table if not exists public.fan_polls (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  category text not null default 'General',
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id text primary key default gen_random_uuid()::text,
  poll_id text not null references public.fan_polls(id) on delete cascade,
  label text not null,
  sub_label text,
  image_url text,
  votes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_votes (
  id text primary key default gen_random_uuid()::text,
  poll_id text not null references public.fan_polls(id) on delete cascade,
  option_id text not null references public.poll_options(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

-- Helper RPC for incrementing vote counts
create or replace function public.increment_poll_option_vote(target_option_id text)
returns void as $$
begin
  update public.poll_options
  set votes_count = votes_count + 1
  where id = target_option_id;
end;
$$ language plpgsql security definer;

-- 7. MATCH PREDICTIONS
create table if not exists public.match_predictions (
  id text primary key default gen_random_uuid()::text,
  match_id text not null references public.matches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  home_score_pred integer not null,
  away_score_pred integer not null,
  first_scorer_pred text not null,
  points_awarded integer default null,
  created_at timestamptz not null default now(),
  unique (match_id, user_id)
);

-- 8. STORE PRODUCTS (Arsenal Direct)
create table if not exists public.store_products (
  id text primary key default gen_random_uuid()::text,
  category text not null check (category in ('Kits', 'Training', 'Retro', 'Accessories')),
  title text not null,
  description text not null,
  price_gbp numeric(8,2) not null,
  price_usd numeric(8,2) not null,
  main_image_url text not null,
  gallery_urls text[] not null default '{}',
  sizes text[] not null default '{"S","M","L","XL","XXL"}',
  is_customizable boolean not null default false,
  badge text,
  external_buy_url text not null,
  created_at timestamptz not null default now()
);

-- 9. USER PROFILES
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  favorite_player_id text references public.players(id) on delete set null,
  gunner_id_number text not null unique,
  membership_tier text not null default 'Digital Fan' check (membership_tier in ('Red Member', 'Silver Member', 'Junior Gunner', 'Digital Fan')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. USER BOOKMARKS
create table if not exists public.user_bookmarks (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id text references public.articles(id) on delete cascade,
  video_id text references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint one_target_check check (
    (article_id is not null and video_id is null) or
    (article_id is null and video_id is not null)
  )
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================
alter table public.articles enable row level security;
alter table public.matches enable row level security;
alter table public.standings enable row level security;
alter table public.players enable row level security;
alter table public.videos enable row level security;
alter table public.fan_polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.match_predictions enable row level security;
alter table public.store_products enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_bookmarks enable row level security;

-- Public read policies for club content
drop policy if exists "Allow public read access on articles" on public.articles;
create policy "Allow public read access on articles" on public.articles for select using (true);

drop policy if exists "Allow public read access on matches" on public.matches;
create policy "Allow public read access on matches" on public.matches for select using (true);

drop policy if exists "Allow public read access on standings" on public.standings;
create policy "Allow public read access on standings" on public.standings for select using (true);

drop policy if exists "Allow public read access on players" on public.players;
create policy "Allow public read access on players" on public.players for select using (true);

drop policy if exists "Allow public read access on videos" on public.videos;
create policy "Allow public read access on videos" on public.videos for select using (true);

drop policy if exists "Allow public read access on fan_polls" on public.fan_polls;
create policy "Allow public read access on fan_polls" on public.fan_polls for select using (true);

drop policy if exists "Allow public read access on poll_options" on public.poll_options;
create policy "Allow public read access on poll_options" on public.poll_options for select using (true);

drop policy if exists "Allow public read access on store_products" on public.store_products;
create policy "Allow public read access on store_products" on public.store_products for select using (true);

-- Authenticated User policies
drop policy if exists "Allow users to read poll votes" on public.poll_votes;
create policy "Allow users to read poll votes" on public.poll_votes for select using (true);

drop policy if exists "Allow users to insert poll votes" on public.poll_votes;
create policy "Allow users to insert poll votes" on public.poll_votes for insert with check (auth.uid() = user_id);

drop policy if exists "Allow users to read match predictions" on public.match_predictions;
create policy "Allow users to read match predictions" on public.match_predictions for select using (true);

drop policy if exists "Allow users to manage own predictions" on public.match_predictions;
create policy "Allow users to manage own predictions" on public.match_predictions for all using (auth.uid() = user_id);

drop policy if exists "Allow public read of profiles" on public.user_profiles;
create policy "Allow public read of profiles" on public.user_profiles for select using (true);

drop policy if exists "Allow users to insert/update own profile" on public.user_profiles;
create policy "Allow users to insert/update own profile" on public.user_profiles for all using (auth.uid() = id);

drop policy if exists "Allow users to manage own bookmarks" on public.user_bookmarks;
create policy "Allow users to manage own bookmarks" on public.user_bookmarks for all using (auth.uid() = user_id);

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

-- Some youth players have no official Premier League photo yet.
alter table public.players alter column photo_url drop not null;

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

-- ================================================================
-- Staff role, content management, media storage and hardening
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Profiles are private. The init migration let anyone (including
--    the anon key shipped in the app) read every profile, which now
--    holds phone, date of birth and postcode.
-- ----------------------------------------------------------------
drop policy if exists "Allow public read of profiles" on public.user_profiles;

-- Members may edit their details, not their Gunner ID or membership tier.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- auth.uid() is null for the service role, Studio and migrations.
  if auth.uid() is not null then
    new.id := old.id;
    new.gunner_id_number := old.gunner_id_number;
    new.membership_tier := old.membership_tier;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_fields on public.user_profiles;
create trigger protect_profile_fields
  before update on public.user_profiles
  for each row execute function public.protect_profile_fields();

-- ----------------------------------------------------------------
-- 2. Staff (editors / admins) can manage club content from a signed-in
--    client, e.g. a CMS or future in-app tools. Grant access with:
--      insert into public.staff_members (user_id, role) values ('<uuid>', 'editor');
-- ----------------------------------------------------------------
create table if not exists public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('editor', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.staff_members enable row level security;

drop policy if exists "Staff read own membership" on public.staff_members;
create policy "Staff read own membership" on public.staff_members
  for select using (auth.uid() = user_id);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select exists (select 1 from public.staff_members where user_id = auth.uid()) $$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated, service_role;

do $$
declare t text;
begin
  foreach t in array array[
    'articles', 'matches', 'standings', 'players', 'videos', 'video_collections',
    'fan_polls', 'poll_options', 'store_products', 'match_events', 'match_lineups',
    'match_stats', 'photo_galleries', 'photo_gallery_images', 'quizzes', 'quiz_questions',
    'experiences', 'reels', 'ticket_sales', 'legal_documents'
  ] loop
    execute format('drop policy if exists "Staff manage %1$s" on public.%1$I', t);
    execute format(
      'create policy "Staff manage %1$s" on public.%1$I for all to authenticated '
      'using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- Staff work the support inbox.
drop policy if exists "Staff read support messages" on public.support_messages;
create policy "Staff read support messages" on public.support_messages
  for select to authenticated using (public.is_staff());

drop policy if exists "Staff update support messages" on public.support_messages;
create policy "Staff update support messages" on public.support_messages
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------
-- 3. Media bucket for article, video, player and product images.
--    Public read; only staff upload or change files.
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Staff upload media" on storage.objects;
create policy "Staff upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "Staff update media" on storage.objects;
create policy "Staff update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "Staff delete media" on storage.objects;
create policy "Staff delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_staff());

-- ----------------------------------------------------------------
-- 4. Support form rate limit: the form is open to guests, so cap
--    messages per email address and per account.
-- ----------------------------------------------------------------
create index if not exists support_messages_email_created_idx
  on public.support_messages (lower(email), created_at);

create or replace function public.limit_support_messages()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent integer;
begin
  select count(*) into recent
  from public.support_messages
  where created_at > now() - interval '1 hour'
    and (lower(email) = lower(new.email) or (new.user_id is not null and user_id = new.user_id));
  if recent >= 3 then
    raise exception 'Too many messages. Please try again later.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists limit_support_messages on public.support_messages;
create trigger limit_support_messages
  before insert on public.support_messages
  for each row execute function public.limit_support_messages();

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

-- ================================================================
-- Store: in-app shop with bag, checkout and orders
--   store_product_variants  stock per product and size
--   user_wishlist           saved products per user
--   shipping_addresses      delivery addresses per user
--   promo_codes             discount codes (never readable by clients)
--   orders / order_items    placed orders; written only by the
--                           create_store_order() RPC and Stripe webhook
--   stripe_customers        Stripe customer per user (service role only)
--
-- Prices, stock and discounts are always computed here, never taken
-- from the client. quote_store_cart() prices a bag for display and
-- create_store_order() uses the same pricing to place the order and
-- reserve stock in one transaction. Payment is confirmed only by the
-- stripe-webhook Edge Function.
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Products and variants
-- ----------------------------------------------------------------
alter table public.store_products add column if not exists customisation_price_gbp numeric(8,2) not null default 15;
alter table public.store_products add column if not exists customisation_price_usd numeric(8,2) not null default 20;
alter table public.store_products add column if not exists is_active boolean not null default true;
-- Kept for reference; the app now sells in-app.
alter table public.store_products alter column external_buy_url drop not null;

create table if not exists public.store_product_variants (
  id text primary key default gen_random_uuid()::text,
  product_id text not null references public.store_products(id) on delete cascade,
  size text not null,
  sku text unique,
  stock integer not null default 0 check (stock >= 0),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size)
);
create index if not exists store_product_variants_product_idx
  on public.store_product_variants (product_id, position);

-- Existing products get one variant per listed size.
insert into public.store_product_variants (product_id, size, sku, stock, position)
select p.id, s.size, upper(p.id || '-' || regexp_replace(s.size, '\s+', '', 'g')), 25, s.ord::int
from public.store_products p, unnest(p.sizes) with ordinality as s(size, ord)
on conflict (product_id, size) do nothing;

alter table public.store_product_variants enable row level security;

drop policy if exists "Public read store variants" on public.store_product_variants;
create policy "Public read store variants" on public.store_product_variants for select using (true);

-- ----------------------------------------------------------------
-- 2. Wishlist and addresses
-- ----------------------------------------------------------------
create table if not exists public.user_wishlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.store_products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.user_wishlist enable row level security;

drop policy if exists "Users manage own wishlist" on public.user_wishlist;
create policy "Users manage own wishlist" on public.user_wishlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.shipping_addresses (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null check (length(btrim(full_name)) between 1 and 100),
  line1 text not null check (length(btrim(line1)) between 1 and 120),
  line2 text check (length(line2) <= 120),
  city text not null check (length(btrim(city)) between 1 and 80),
  region text check (length(region) <= 80),
  postcode text not null check (length(btrim(postcode)) between 1 and 20),
  country text not null check (length(btrim(country)) between 1 and 60),
  phone text check (length(phone) <= 30),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shipping_addresses_user_idx on public.shipping_addresses (user_id);
create unique index if not exists shipping_addresses_one_default
  on public.shipping_addresses (user_id) where is_default;

alter table public.shipping_addresses enable row level security;

drop policy if exists "Users manage own addresses" on public.shipping_addresses;
create policy "Users manage own addresses" on public.shipping_addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Making an address the default clears the previous one.
create or replace function public.shipping_address_single_default()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.is_default then
    update public.shipping_addresses
      set is_default = false
      where user_id = new.user_id and id <> new.id and is_default;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists shipping_address_single_default on public.shipping_addresses;
create trigger shipping_address_single_default
  before insert or update on public.shipping_addresses
  for each row execute function public.shipping_address_single_default();

-- ----------------------------------------------------------------
-- 3. Promo codes
-- ----------------------------------------------------------------
create table if not exists public.promo_codes (
  code text primary key check (code = upper(code) and code ~ '^[A-Z0-9]{3,20}$'),
  description text,
  percent_off integer check (percent_off between 1 and 100),
  amount_off_gbp numeric(8,2) check (amount_off_gbp > 0),
  amount_off_usd numeric(8,2) check (amount_off_usd > 0),
  free_shipping boolean not null default false,
  min_subtotal_gbp numeric(8,2) not null default 0,
  min_subtotal_usd numeric(8,2) not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer check (max_redemptions > 0),
  redemptions integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (percent_off is not null or amount_off_gbp is not null or free_shipping),
  check ((amount_off_gbp is null) = (amount_off_usd is null))
);

-- Clients never read codes directly; they are checked by quote_store_cart().
alter table public.promo_codes enable row level security;

-- ----------------------------------------------------------------
-- 4. Orders
-- ----------------------------------------------------------------
create sequence if not exists public.order_number_seq start 100001;

create table if not exists public.orders (
  id text primary key default gen_random_uuid()::text,
  order_number text not null unique default ('AFC' || nextval('public.order_number_seq')),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending_payment' check (status in (
    'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  currency text not null check (currency in ('GBP', 'USD')),
  subtotal numeric(10,2) not null check (subtotal >= 0),
  discount numeric(10,2) not null default 0 check (discount >= 0),
  shipping numeric(10,2) not null default 0 check (shipping >= 0),
  total numeric(10,2) not null check (total >= 0),
  promo_code text references public.promo_codes(code) on delete set null,
  shipping_address jsonb not null,
  stripe_payment_intent_id text unique,
  tracking_number text,
  expires_at timestamptz,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_pending_idx on public.orders (expires_at) where status = 'pending_payment';

create table if not exists public.order_items (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text references public.store_products(id) on delete set null,
  variant_id text references public.store_product_variants(id) on delete set null,
  title text not null,
  image_url text,
  size text not null,
  custom_name text,
  custom_number text,
  unit_price numeric(10,2) not null,
  customisation_price numeric(10,2) not null default 0,
  quantity integer not null check (quantity between 1 and 10),
  line_total numeric(10,2) not null,
  position integer not null default 0
);
create index if not exists order_items_order_idx on public.order_items (order_id, position);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Read-only for customers; writes go through the functions below.
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "Users read own order items" on public.order_items;
create policy "Users read own order items" on public.order_items
  for select using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));

create table if not exists public.stripe_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  customer_id text not null unique,
  created_at timestamptz not null default now()
);
alter table public.stripe_customers enable row level security;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists store_product_variants_touch on public.store_product_variants;
create trigger store_product_variants_touch before update on public.store_product_variants
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------
-- 5. Staff manage the shop
-- ----------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['store_product_variants', 'promo_codes', 'orders', 'order_items'] loop
    execute format('drop policy if exists "Staff manage %1$s" on public.%1$I', t);
    execute format(
      'create policy "Staff manage %1$s" on public.%1$I for all to authenticated '
      'using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- ----------------------------------------------------------------
-- 6. Pricing
-- ----------------------------------------------------------------

-- Prices a bag. p_items is [{variant_id, quantity, custom_name?, custom_number?}].
-- Raises on invalid input; stock is reported per line (`stock`) rather than
-- enforced, so the bag can show "only 2 left" before checkout.
create or replace function public.quote_store_cart(
  p_currency text,
  p_items jsonb,
  p_promo_code text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  gbp boolean := p_currency = 'GBP';
  item jsonb;
  v record;
  qty integer;
  custom_name text;
  custom_number text;
  unit numeric;
  custom numeric;
  lines jsonb := '[]'::jsonb;
  subtotal numeric := 0;
  discount numeric := 0;
  shipping numeric;
  free_shipping boolean := false;
  promo public.promo_codes%rowtype;
  promo_code text := nullif(upper(btrim(coalesce(p_promo_code, ''))), '');
  promo_error text;
  min_subtotal numeric;
  -- Flat delivery, free above the threshold (the app reads it from the quote).
  shipping_flat numeric := case when gbp then 4.95 else 6.95 end;
  free_threshold numeric := case when gbp then 75 else 100 end;
begin
  if p_currency is null or p_currency not in ('GBP', 'USD') then
    raise exception 'Unsupported currency' using errcode = '22023';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your bag is empty' using errcode = '22023';
  end if;
  if jsonb_array_length(p_items) > 30 then
    raise exception 'Too many items in your bag' using errcode = '22023';
  end if;

  for item in select value from jsonb_array_elements(p_items) loop
    qty := case when item->>'quantity' ~ '^\d{1,3}$' then (item->>'quantity')::integer end;
    if qty is null or qty < 1 or qty > 10 then
      raise exception 'Quantity must be between 1 and 10' using errcode = '22023';
    end if;

    select vr.id as variant_id, vr.size, vr.stock, p.id as product_id, p.title,
           p.main_image_url, p.is_customizable,
           case when gbp then p.price_gbp else p.price_usd end as price,
           case when gbp then p.customisation_price_gbp else p.customisation_price_usd end as custom_price
      into v
      from public.store_product_variants vr
      join public.store_products p on p.id = vr.product_id
      where vr.id = item->>'variant_id' and p.is_active;
    if not found then
      raise exception 'An item in your bag is no longer available' using errcode = 'P0002';
    end if;

    custom_name := nullif(upper(btrim(coalesce(item->>'custom_name', ''))), '');
    custom_number := nullif(btrim(coalesce(item->>'custom_number', '')), '');
    if custom_name is not null or custom_number is not null then
      if not v.is_customizable then
        raise exception '% cannot be personalised', v.title using errcode = '22023';
      end if;
      if custom_name is not null and custom_name !~ '^[A-Z][A-Z .''-]{0,11}$' then
        raise exception 'Shirt names can use up to 12 letters' using errcode = '22023';
      end if;
      if custom_number is not null and custom_number !~ '^[0-9]{1,2}$' then
        raise exception 'Shirt numbers must be between 0 and 99' using errcode = '22023';
      end if;
      custom := v.custom_price;
    else
      custom := 0;
    end if;

    unit := v.price;
    subtotal := subtotal + (unit + custom) * qty;
    lines := lines || jsonb_build_object(
      'variant_id', v.variant_id,
      'product_id', v.product_id,
      'title', v.title,
      'image_url', v.main_image_url,
      'size', v.size,
      'stock', v.stock,
      'quantity', qty,
      'custom_name', custom_name,
      'custom_number', custom_number,
      'unit_price', unit,
      'customisation_price', custom,
      'line_total', (unit + custom) * qty
    );
  end loop;

  if promo_code is not null then
    select * into promo from public.promo_codes pc where pc.code = promo_code;
    min_subtotal := case when gbp then promo.min_subtotal_gbp else promo.min_subtotal_usd end;
    if not found or not promo.is_active
       or (promo.starts_at is not null and promo.starts_at > now())
       or (promo.ends_at is not null and promo.ends_at < now()) then
      promo_error := 'This code isn''t valid';
    elsif promo.max_redemptions is not null and promo.redemptions >= promo.max_redemptions then
      promo_error := 'This code has been fully redeemed';
    elsif subtotal < min_subtotal then
      promo_error := format('Spend %s%s to use this code',
        case when gbp then '£' else '$' end, to_char(min_subtotal, 'FM999990.00'));
    else
      discount := round(subtotal * coalesce(promo.percent_off, 0) / 100.0, 2)
        + coalesce(case when gbp then promo.amount_off_gbp else promo.amount_off_usd end, 0);
      discount := least(discount, subtotal);
      free_shipping := promo.free_shipping;
    end if;
  end if;

  shipping := case when free_shipping or subtotal - discount >= free_threshold then 0 else shipping_flat end;

  return jsonb_build_object(
    'currency', p_currency,
    'lines', lines,
    'subtotal', subtotal,
    'discount', discount,
    'shipping', shipping,
    'total', subtotal - discount + shipping,
    'free_shipping_threshold', free_threshold,
    'promo', case when promo_code is not null and promo_error is null
      then jsonb_build_object('code', promo.code, 'description', promo.description) end,
    'promo_error', promo_error
  );
end;
$$;

revoke all on function public.quote_store_cart(text, jsonb, text) from public;
grant execute on function public.quote_store_cart(text, jsonb, text) to anon, authenticated, service_role;

-- ----------------------------------------------------------------
-- 7. Order lifecycle
-- ----------------------------------------------------------------

-- Returns an order's stock to the shelves. Internal: callers guard the status.
create or replace function public.release_order_stock(p_order_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.store_product_variants v
    set stock = v.stock + i.qty
    from (
      select variant_id, sum(quantity)::integer as qty
      from public.order_items
      where order_id = p_order_id and variant_id is not null
      group by variant_id
    ) i
    where v.id = i.variant_id;
$$;

-- Takes an order's items off the shelves, or raises if any size ran out.
create or replace function public.reserve_order_stock(p_order_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  line record;
begin
  -- Fixed lock order so concurrent checkouts cannot deadlock.
  for line in
    select i.variant_id, sum(i.quantity)::integer as qty, min(i.title) as title, min(i.size) as size
    from public.order_items i
    where i.order_id = p_order_id and i.variant_id is not null
    group by i.variant_id
    order by i.variant_id
  loop
    update public.store_product_variants
      set stock = stock - line.qty
      where id = line.variant_id and stock >= line.qty;
    if not found then
      raise exception 'Not enough stock: % (size %)', line.title, line.size
        using errcode = 'P0001', hint = 'out_of_stock';
    end if;
  end loop;
end;
$$;

-- Cancels an unpaid order and releases its stock. Idempotent.
create or replace function public.cancel_pending_order(p_order_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
    set status = 'cancelled', cancelled_at = now()
    where id = p_order_id and status = 'pending_payment';
  if not found then
    return false;
  end if;
  perform public.release_order_stock(p_order_id);
  return true;
end;
$$;

-- Places an order for the signed-in user: prices the bag, snapshots the
-- address, reserves stock and returns the pending order. Any earlier
-- unpaid order is cancelled first so an abandoned checkout never holds stock.
create or replace function public.create_store_order(
  p_currency text,
  p_items jsonb,
  p_address_id text,
  p_promo_code text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  address public.shipping_addresses%rowtype;
  quote jsonb;
  new_order public.orders%rowtype;
  previous text;
begin
  if uid is null then
    raise exception 'Sign in to check out' using errcode = '28000';
  end if;

  select * into address from public.shipping_addresses where id = p_address_id and user_id = uid;
  if not found then
    raise exception 'Choose a delivery address' using errcode = 'P0002';
  end if;

  for previous in
    select id from public.orders where user_id = uid and status = 'pending_payment'
  loop
    perform public.cancel_pending_order(previous);
  end loop;

  quote := public.quote_store_cart(p_currency, p_items, p_promo_code);
  if quote->>'promo_error' is not null then
    raise exception '%', quote->>'promo_error' using errcode = '22023', hint = 'promo';
  end if;

  insert into public.orders (
    user_id, currency, subtotal, discount, shipping, total, promo_code, shipping_address, expires_at
  ) values (
    uid,
    p_currency,
    (quote->>'subtotal')::numeric,
    (quote->>'discount')::numeric,
    (quote->>'shipping')::numeric,
    (quote->>'total')::numeric,
    quote->'promo'->>'code',
    jsonb_build_object(
      'full_name', address.full_name, 'line1', address.line1, 'line2', address.line2,
      'city', address.city, 'region', address.region, 'postcode', address.postcode,
      'country', address.country, 'phone', address.phone
    ),
    now() + interval '30 minutes'
  )
  returning * into new_order;

  insert into public.order_items (
    order_id, product_id, variant_id, title, image_url, size, custom_name, custom_number,
    unit_price, customisation_price, quantity, line_total, position
  )
  select new_order.id, l->>'product_id', l->>'variant_id', l->>'title', l->>'image_url', l->>'size',
         l->>'custom_name', l->>'custom_number', (l->>'unit_price')::numeric,
         (l->>'customisation_price')::numeric, (l->>'quantity')::integer,
         (l->>'line_total')::numeric, ord::integer
  from jsonb_array_elements(quote->'lines') with ordinality as t(l, ord);

  perform public.reserve_order_stock(new_order.id);
  return new_order;
end;
$$;

revoke all on function public.create_store_order(text, jsonb, text, text) from public, anon;
grant execute on function public.create_store_order(text, jsonb, text, text) to authenticated;

-- Called by the Stripe webhook once a payment succeeds. Returns
--   'paid'      order is (now) paid
--   'refund'    order had been cancelled and its stock is gone: refund it
--   'mismatch'  amount or currency differs from the order: do not fulfil
--   'unknown'   no order for this payment intent
create or replace function public.mark_order_paid(
  p_payment_intent_id text,
  p_amount_minor bigint,
  p_currency text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
begin
  select * into o from public.orders where stripe_payment_intent_id = p_payment_intent_id for update;
  if not found then
    return 'unknown';
  end if;
  if o.status not in ('pending_payment', 'cancelled') then
    return 'paid';
  end if;
  if round(o.total * 100) <> p_amount_minor or lower(o.currency) <> lower(p_currency) then
    return 'mismatch';
  end if;

  if o.status = 'cancelled' then
    -- Paid after the order expired: take the stock again if it is still there.
    begin
      perform public.reserve_order_stock(o.id);
    exception when sqlstate 'P0001' then
      update public.orders set status = 'refunded' where id = o.id;
      return 'refund';
    end;
  end if;

  update public.orders
    set status = 'paid', paid_at = now(), cancelled_at = null, expires_at = null
    where id = o.id;
  if o.promo_code is not null then
    update public.promo_codes set redemptions = redemptions + 1 where code = o.promo_code;
  end if;
  return 'paid';
end;
$$;

-- Called by the Stripe webhook when a payment fails for good or is cancelled.
create or replace function public.cancel_order_payment(p_payment_intent_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select public.cancel_pending_order(id) from public.orders
      where stripe_payment_intent_id = p_payment_intent_id),
    false
  );
$$;

-- Releases stock held by checkouts that were never paid. Run every few
-- minutes from pg_cron (see supabase/functions/stripe-webhook/README.md).
create or replace function public.expire_pending_orders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  expired integer := 0;
  o text;
begin
  for o in
    select id from public.orders
    where status = 'pending_payment' and expires_at < now()
    for update skip locked
  loop
    if public.cancel_pending_order(o) then
      expired := expired + 1;
    end if;
  end loop;
  return expired;
end;
$$;

do $$
declare f text;
begin
  foreach f in array array[
    'public.release_order_stock(text)', 'public.reserve_order_stock(text)',
    'public.cancel_pending_order(text)', 'public.mark_order_paid(text, bigint, text)',
    'public.cancel_order_payment(text)', 'public.expire_pending_orders()'
  ] loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;

-- ================================================================
-- Store catalogue: the full club store experience
--   store_categories / store_product_categories   menu tree
--   product families (match kit + kit type), details, size charts
--   store_print_options / patches / specials      shirt printing
--   store_promotions                             sale prices
--   store_shipping_rates                         delivery by zone
--   gift_cards                                   paid with at checkout
--   store_reviews / votes / questions            product reviews
--   stock_notifications                          back-in-stock alerts
--   store_home_modules                           shop home content
--
-- quote_store_cart() and create_store_order() are redefined to price
-- printing, patches, promotions, the members' discount, delivery
-- methods and gift cards. Everything is still computed here.
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Categories
-- ----------------------------------------------------------------
create table if not exists public.store_categories (
  id text primary key default gen_random_uuid()::text,
  parent_id text references public.store_categories(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  image_url text,
  position integer not null default 0,
  show_in_menu boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists store_categories_parent_idx on public.store_categories (parent_id, position);

create table if not exists public.store_product_categories (
  product_id text not null references public.store_products(id) on delete cascade,
  category_id text not null references public.store_categories(id) on delete cascade,
  position integer not null default 0,
  primary key (product_id, category_id)
);
create index if not exists store_product_categories_category_idx
  on public.store_product_categories (category_id);

-- Every category with each of its ancestors (and itself).
create or replace view public.store_category_ancestors as
with recursive walk as (
  select id as category_id, id as ancestor_id, 0 as depth from public.store_categories
  union all
  select w.category_id, c.parent_id, w.depth + 1
  from walk w
  join public.store_categories c on c.id = w.ancestor_id
  where c.parent_id is not null
)
select category_id, ancestor_id, depth from walk;

-- ----------------------------------------------------------------
-- 2. Products: families, details, size charts
-- ----------------------------------------------------------------
create table if not exists public.store_size_charts (
  id text primary key,
  title text not null,
  columns text[] not null,
  -- [["XS", "32.5-34\"", ...], ...]
  rows jsonb not null default '[]'::jsonb
);

alter table public.store_products add column if not exists brand text;
alter table public.store_products add column if not exists compare_at_price_gbp numeric(8,2);
alter table public.store_products add column if not exists compare_at_price_usd numeric(8,2);
-- Products of one kit (home / away / third / goalkeeper) share a family.
alter table public.store_products add column if not exists family_id text;
alter table public.store_products add column if not exists kit_role text;
-- The same item for mens / womens / kids shares a profile group.
alter table public.store_products add column if not exists profile text not null default 'unisex';
alter table public.store_products add column if not exists profile_group_id text;
alter table public.store_products add column if not exists size_chart_id text references public.store_size_charts(id) on delete set null;
alter table public.store_products add column if not exists details jsonb not null default '{}'::jsonb;
alter table public.store_products add column if not exists returnable boolean not null default true;
alter table public.store_products add column if not exists popularity integer not null default 0;
alter table public.store_products add column if not exists member_discount_eligible boolean not null default true;
alter table public.store_products add column if not exists back_image_url text;

alter table public.store_products drop constraint if exists store_products_kit_role_check;
alter table public.store_products add constraint store_products_kit_role_check
  check (kit_role is null or kit_role in ('home', 'away', 'third', 'goalkeeper'));
alter table public.store_products drop constraint if exists store_products_profile_check;
alter table public.store_products add constraint store_products_profile_check
  check (profile in ('mens', 'womens', 'kids', 'baby', 'unisex'));
-- Categories now come from store_product_categories; keep the old column open.
alter table public.store_products drop constraint if exists store_products_category_check;

create index if not exists store_products_family_idx on public.store_products (family_id);
create index if not exists store_products_profile_group_idx on public.store_products (profile_group_id);

-- ----------------------------------------------------------------
-- 3. Printing
-- ----------------------------------------------------------------
create table if not exists public.store_print_options (
  product_id text primary key references public.store_products(id) on delete cascade,
  -- Which squad the player list comes from.
  team_type text not null default 'men' check (team_type in ('men', 'women')),
  player_price_gbp numeric(8,2) not null default 15,
  player_price_usd numeric(8,2) not null default 20,
  name_price_gbp numeric(8,2) not null default 7.5,
  name_price_usd numeric(8,2) not null default 10,
  number_price_gbp numeric(8,2) not null default 7.5,
  number_price_usd numeric(8,2) not null default 10,
  fonts text[] not null default '{premier_league,arsenal}'
);

create table if not exists public.store_print_specials (
  id text primary key,
  label text not null,
  number text not null check (number ~ '^[0-9]{1,2}$'),
  position integer not null default 0
);

create table if not exists public.store_patches (
  id text primary key,
  name text not null,
  price_gbp numeric(8,2) not null,
  price_usd numeric(8,2) not null,
  position integer not null default 0
);

create table if not exists public.store_product_patches (
  product_id text not null references public.store_products(id) on delete cascade,
  patch_id text not null references public.store_patches(id) on delete cascade,
  primary key (product_id, patch_id)
);

-- Name printed for a player, e.g. "SAKA", "ØDEGAARD", "BRUNO G.".
create or replace function public.player_print_name(p public.players)
returns text
language sql
immutable
as $$
  select upper(regexp_replace(
    case when p.known_as is not null and position(' ' in p.known_as) = 0 then p.known_as else p.last_name end,
    '\s*\(.*\)', '', 'g'))
$$;

-- ----------------------------------------------------------------
-- 4. Promotions, shipping, gift cards
-- ----------------------------------------------------------------
create table if not exists public.store_promotions (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  percent_off integer not null check (percent_off between 1 and 90),
  product_id text references public.store_products(id) on delete cascade,
  category_id text references public.store_categories(id) on delete cascade,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  check (product_id is not null or category_id is not null)
);

-- Best running promotion per product (direct, or via any ancestor category).
create or replace view public.store_product_promotions as
select pr.id as product_id, max(p.percent_off) as percent_off
from public.store_products pr
join public.store_promotions p
  on p.active
 and (p.starts_at is null or p.starts_at <= now())
 and (p.ends_at is null or p.ends_at > now())
 and (
   p.product_id = pr.id
   or p.category_id in (
     select a.ancestor_id
     from public.store_product_categories pc
     join public.store_category_ancestors a on a.category_id = pc.category_id
     where pc.product_id = pr.id
   )
 )
group by pr.id;

-- Price in a currency: (price, compare_at). A promotion wins over a manual was-price.
create or replace function public.store_price(p public.store_products, p_currency text)
returns table (price numeric, compare_at numeric)
language sql
stable
as $$
  with base as (
    select case when p_currency = 'GBP' then p.price_gbp else p.price_usd end as base,
           case when p_currency = 'GBP' then p.compare_at_price_gbp else p.compare_at_price_usd end as was,
           (select percent_off from public.store_product_promotions sp where sp.product_id = p.id) as pct
  )
  select case when pct is not null then round(base * (100 - pct) / 100.0, 2) else base end,
         case when pct is not null then base when was > base then was end
  from base
$$;

create table if not exists public.store_shipping_rates (
  zone text not null check (zone in ('UK', 'EU', 'US', 'ROW')),
  method text not null check (method in ('standard', 'express', 'nominated')),
  label text not null,
  eta text not null,
  price_gbp numeric(8,2) not null,
  price_usd numeric(8,2) not null,
  free_over_gbp numeric(8,2),
  free_over_usd numeric(8,2),
  position integer not null default 0,
  primary key (zone, method)
);

create table if not exists public.gift_cards (
  code text primary key check (code ~ '^[A-Z0-9]{8,24}$'),
  currency text not null check (currency in ('GBP', 'USD')),
  initial_balance numeric(10,2) not null check (initial_balance > 0),
  balance numeric(10,2) not null check (balance >= 0),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
-- Never readable by clients: checked by quote_store_cart().
alter table public.gift_cards enable row level security;

-- ----------------------------------------------------------------
-- 5. Orders: new snapshot columns
-- ----------------------------------------------------------------
alter table public.orders add column if not exists member_discount numeric(10,2) not null default 0;
alter table public.orders add column if not exists shipping_zone text;
alter table public.orders add column if not exists shipping_method text;
alter table public.orders add column if not exists gift_card_code text references public.gift_cards(code) on delete set null;
alter table public.orders add column if not exists gift_card_amount numeric(10,2) not null default 0;
-- What the card is charged: total minus gift card.
alter table public.orders add column if not exists amount_due numeric(10,2);
-- Set when the receipt email goes out, so webhook retries never resend it.
alter table public.orders add column if not exists receipt_sent_at timestamptz;
update public.orders set amount_due = total where amount_due is null;

alter table public.order_items add column if not exists print_type text check (print_type in ('player', 'custom'));
alter table public.order_items add column if not exists player_id text;
alter table public.order_items add column if not exists print_font text;
alter table public.order_items add column if not exists patch_id text;
alter table public.order_items add column if not exists patch_name text;
alter table public.order_items add column if not exists print_price numeric(10,2) not null default 0;
alter table public.order_items add column if not exists patch_price numeric(10,2) not null default 0;
alter table public.order_items add column if not exists compare_at numeric(10,2);

-- ----------------------------------------------------------------
-- 6. Reviews and questions
-- ----------------------------------------------------------------
create table if not exists public.store_reviews (
  id text primary key default gen_random_uuid()::text,
  product_id text not null references public.store_products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Gooner',
  country text,
  rating integer not null check (rating between 1 and 5),
  title text not null check (length(btrim(title)) between 1 and 120),
  body text not null check (length(btrim(body)) between 1 and 3000),
  verified boolean not null default false,
  helpful_count integer not null default 0,
  unhelpful_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists store_reviews_product_idx on public.store_reviews (product_id, created_at desc);
create unique index if not exists store_reviews_one_per_user
  on public.store_reviews (product_id, user_id) where user_id is not null;

create table if not exists public.store_review_votes (
  review_id text not null references public.store_reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  helpful boolean not null,
  primary key (review_id, user_id)
);

create table if not exists public.store_questions (
  id text primary key default gen_random_uuid()::text,
  product_id text not null references public.store_products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Gooner',
  question text not null check (length(btrim(question)) between 3 and 500),
  answer text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists store_questions_product_idx on public.store_questions (product_id, created_at desc);

create or replace view public.store_product_ratings as
select product_id,
       round(avg(rating)::numeric, 1) as average,
       count(*)::integer as total,
       jsonb_build_object(
         '5', count(*) filter (where rating = 5), '4', count(*) filter (where rating = 4),
         '3', count(*) filter (where rating = 3), '2', count(*) filter (where rating = 2),
         '1', count(*) filter (where rating = 1)
       ) as breakdown
from public.store_reviews
group by product_id;

-- Reviewers are named "First L." and marked verified when they bought the product.
create or replace function public.prepare_store_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  full_name text;
begin
  if auth.uid() is null then
    return new; -- service role / seed
  end if;
  new.user_id := auth.uid();
  new.helpful_count := 0;
  new.unhelpful_count := 0;
  select btrim(p.full_name), p.country into full_name, new.country
    from public.user_profiles p where p.id = auth.uid();
  new.author_name := coalesce(
    nullif(split_part(full_name, ' ', 1), '') ||
      coalesce(' ' || nullif(left(split_part(full_name, ' ', 2), 1), '') || '.', ''),
    'Gooner');
  new.verified := exists (
    select 1 from public.orders o
    join public.order_items i on i.order_id = o.id
    where o.user_id = auth.uid()
      and o.status in ('paid', 'processing', 'shipped', 'delivered')
      and i.product_id = new.product_id
  );
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists prepare_store_review on public.store_reviews;
create trigger prepare_store_review before insert on public.store_reviews
  for each row execute function public.prepare_store_review();

create or replace function public.count_review_votes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rid text := coalesce(new.review_id, old.review_id);
begin
  update public.store_reviews r set
    helpful_count = (select count(*) from public.store_review_votes v where v.review_id = rid and v.helpful),
    unhelpful_count = (select count(*) from public.store_review_votes v where v.review_id = rid and not v.helpful)
  where r.id = rid;
  return null;
end;
$$;

drop trigger if exists count_review_votes on public.store_review_votes;
create trigger count_review_votes after insert or update or delete on public.store_review_votes
  for each row execute function public.count_review_votes();

create or replace function public.prepare_store_question()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  new.user_id := auth.uid();
  new.answer := null;
  new.answered_at := null;
  select coalesce(nullif(split_part(btrim(p.full_name), ' ', 1), ''), 'Gooner') into new.author_name
    from public.user_profiles p where p.id = auth.uid();
  return new;
end;
$$;

drop trigger if exists prepare_store_question on public.store_questions;
create trigger prepare_store_question before insert on public.store_questions
  for each row execute function public.prepare_store_question();

-- ----------------------------------------------------------------
-- 7. Back in stock
-- ----------------------------------------------------------------
create table if not exists public.stock_notifications (
  user_id uuid not null references auth.users(id) on delete cascade,
  variant_id text not null references public.store_product_variants(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, variant_id)
);

-- Personal notifications: the outbox can target one member.
alter table public.notification_events add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.notification_events drop constraint if exists notification_events_category_check;
alter table public.notification_events add constraint notification_events_category_check
  check (category in ('kickoff', 'lineups', 'goals', 'full_time', 'news', 'tickets', 'store'));

create or replace function public.notification_tokens(p_event_id bigint)
returns table (token text)
language sql
stable
security definer
set search_path = public
as $$
  select t.token
  from public.notification_events e
  join public.push_tokens t on t.user_id = e.user_id
  where e.id = p_event_id and e.user_id is not null
  union
  select t.token
  from public.notification_events e
  join public.user_settings s on true
  join public.push_tokens t on t.user_id = s.user_id
  where e.id = p_event_id
    and e.user_id is null
    and case e.category
          when 'kickoff' then s.notify_kickoff
          when 'lineups' then s.notify_lineups
          when 'goals' then s.notify_goals
          when 'full_time' then s.notify_full_time
          when 'news' then s.notify_news
          when 'tickets' then s.notify_tickets
          else false
        end
    and case e.team_type
          when 'women' then s.notify_women
          when 'academy' then s.notify_academy
          else true
        end;
$$;
revoke all on function public.notification_tokens(bigint) from public, anon, authenticated;
grant execute on function public.notification_tokens(bigint) to service_role;

create or replace function public.notify_back_in_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  product public.store_products%rowtype;
  n record;
begin
  if old.stock > 0 or new.stock <= 0 then
    return new;
  end if;
  select * into product from public.store_products where id = new.product_id;
  for n in delete from public.stock_notifications where variant_id = new.id returning user_id loop
    insert into public.notification_events (category, user_id, title, body, url, dedupe_key)
    values (
      'store', n.user_id, 'Back in stock',
      product.title || ' is back in size ' || new.size || '. Grab it before it goes again.',
      '/store/' || product.id,
      'stock:' || new.id || ':' || n.user_id || ':' || extract(epoch from now())::bigint
    )
    on conflict (dedupe_key) do nothing;
  end loop;
  return new;
end;
$$;

drop trigger if exists notify_back_in_stock on public.store_product_variants;
create trigger notify_back_in_stock after update of stock on public.store_product_variants
  for each row execute function public.notify_back_in_stock();

-- ----------------------------------------------------------------
-- 8. Shop home content
-- ----------------------------------------------------------------
create table if not exists public.store_home_modules (
  id text primary key,
  kind text not null check (kind in (
    'hero', 'ticker', 'product_tabs', 'collection_carousel', 'category_carousel',
    'player_carousel', 'product_carousel', 'trust'
  )),
  title text,
  payload jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  active boolean not null default true
);

-- ----------------------------------------------------------------
-- 9. Row level security
-- ----------------------------------------------------------------
do $$
declare t text;
begin
  -- Public catalogue, staff managed.
  foreach t in array array[
    'store_categories', 'store_product_categories', 'store_size_charts', 'store_print_options',
    'store_print_specials', 'store_patches', 'store_product_patches', 'store_promotions',
    'store_shipping_rates', 'store_home_modules'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public read %1$s" on public.%1$I', t);
    execute format('create policy "Public read %1$s" on public.%1$I for select using (true)', t);
  end loop;
  foreach t in array array[
    'store_categories', 'store_product_categories', 'store_size_charts', 'store_print_options',
    'store_print_specials', 'store_patches', 'store_product_patches', 'store_promotions',
    'store_shipping_rates', 'store_home_modules', 'gift_cards', 'store_reviews', 'store_questions'
  ] loop
    execute format('drop policy if exists "Staff manage %1$s" on public.%1$I', t);
    execute format(
      'create policy "Staff manage %1$s" on public.%1$I for all to authenticated '
      'using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

alter table public.store_reviews enable row level security;
drop policy if exists "Public read reviews" on public.store_reviews;
create policy "Public read reviews" on public.store_reviews for select using (true);
drop policy if exists "Members write reviews" on public.store_reviews;
create policy "Members write reviews" on public.store_reviews
  for insert to authenticated with check (auth.uid() is not null);
drop policy if exists "Members delete own reviews" on public.store_reviews;
create policy "Members delete own reviews" on public.store_reviews
  for delete to authenticated using (auth.uid() = user_id);

alter table public.store_review_votes enable row level security;
drop policy if exists "Members manage own votes" on public.store_review_votes;
create policy "Members manage own votes" on public.store_review_votes
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.store_questions enable row level security;
drop policy if exists "Read answered or own questions" on public.store_questions;
create policy "Read answered or own questions" on public.store_questions
  for select using (answer is not null or auth.uid() = user_id);
drop policy if exists "Members ask questions" on public.store_questions;
create policy "Members ask questions" on public.store_questions
  for insert to authenticated with check (auth.uid() is not null);

alter table public.stock_notifications enable row level security;
drop policy if exists "Members manage own stock alerts" on public.stock_notifications;
create policy "Members manage own stock alerts" on public.stock_notifications
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- 10. Browsing
-- ----------------------------------------------------------------

-- Ancestors of a category, root first, for breadcrumbs.
create or replace function public.store_category_path(p_slug text)
returns table (id text, slug text, title text, depth integer)
language sql
stable
as $$
  select c.id, c.slug, c.title, a.depth
  from public.store_categories target
  join public.store_category_ancestors a on a.category_id = target.id
  join public.store_categories c on c.id = a.ancestor_id
  where target.slug = p_slug
  order by a.depth desc
$$;

create or replace function public.store_tile(p public.store_products, p_currency text)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p.id, 'title', p.title, 'main_image_url', p.main_image_url, 'badge', p.badge,
    'brand', p.brand, 'profile', p.profile, 'popularity', p.popularity,
    'price', sp.price, 'compare_at', sp.compare_at,
    'sold_out', not exists (
      select 1 from public.store_product_variants v where v.product_id = p.id and v.stock > 0
    )
  )
  from public.store_price(p, p_currency) sp
$$;

-- One entry point for listings, search, carousels, wishlist and recommendations.
-- Returns {total, products[], facets{profiles, sizes, brands, max_price}}.
create or replace function public.browse_store(
  p_currency text default 'GBP',
  p_category text default null,
  p_query text default null,
  p_profiles text[] default null,
  p_sizes text[] default null,
  p_brands text[] default null,
  p_max_price numeric default null,
  p_sort text default 'relevance',
  p_limit integer default 24,
  p_offset integer default 0,
  p_ids text[] default null,
  p_family text default null,
  p_exclude text default null,
  p_on_sale boolean default false
)
returns jsonb
language plpgsql
stable
as $$
declare
  category_ids text[];
  words text[];
  result jsonb;
begin
  if p_currency not in ('GBP', 'USD') then
    raise exception 'Unsupported currency' using errcode = '22023';
  end if;
  if p_category is not null then
    select array_agg(a.category_id) into category_ids
    from public.store_category_ancestors a
    join public.store_categories c on c.id = a.ancestor_id
    where c.slug = p_category;
    if category_ids is null then
      return jsonb_build_object('total', 0, 'products', '[]'::jsonb, 'facets', '{}'::jsonb);
    end if;
  end if;
  words := array_remove(regexp_split_to_array(
    lower(btrim(regexp_replace(coalesce(p_query, ''), '[%_\\]', ' ', 'g'))), '\s+'), '');

  with base as (
    select p.*, sp.price as cur_price, sp.compare_at as cur_compare
    from public.store_products p
    cross join lateral public.store_price(p, p_currency) sp
    where p.is_active
      and (p_ids is null or p.id = any (p_ids))
      and (p_family is null or p.family_id = p_family)
      and (p_exclude is null or p.id <> p_exclude)
      and (category_ids is null or exists (
        select 1 from public.store_product_categories pc
        where pc.product_id = p.id and pc.category_id = any (category_ids)))
      and (coalesce(array_length(words, 1), 0) = 0 or not exists (
        select 1 from unnest(words) w
        where lower(p.title || ' ' || coalesce(p.brand, '') || ' ' || coalesce(p.description, '') || ' ' ||
          coalesce((select string_agg(c.title, ' ') from public.store_product_categories pc
                    join public.store_categories c on c.id = pc.category_id
                    where pc.product_id = p.id), '')) not like '%' || w || '%'))
  ),
  filtered as (
    select * from base b
    where (p_profiles is null or b.profile = any (p_profiles))
      and (p_brands is null or b.brand = any (p_brands))
      and (p_max_price is null or b.cur_price <= p_max_price)
      and (not p_on_sale or b.cur_compare is not null)
      and (p_sizes is null or exists (
        select 1 from public.store_product_variants v
        where v.product_id = b.id and v.stock > 0 and v.size = any (p_sizes)))
  ),
  page as (
    select f.id, row_number() over (
      order by
        case when p_ids is not null then array_position(p_ids, f.id) end,
        case when p_sort = 'price_asc' then f.cur_price end asc,
        case when p_sort = 'price_desc' then f.cur_price end desc,
        case when p_sort = 'name' then f.title end asc,
        case when p_sort = 'newest' then f.created_at end desc,
        f.popularity desc, f.created_at desc, f.id
    ) as ord
    from filtered f
    order by ord
    limit greatest(1, least(p_limit, 100)) offset greatest(0, p_offset)
  )
  select jsonb_build_object(
    'total', (select count(*) from filtered),
    'products', coalesce((
      select jsonb_agg(public.store_tile(pr, p_currency) order by pg.ord)
      from page pg
      join public.store_products pr on pr.id = pg.id), '[]'::jsonb),
    'facets', jsonb_build_object(
      'profiles', coalesce((select jsonb_agg(distinct b.profile) from base b), '[]'::jsonb),
      'brands', coalesce((select jsonb_agg(distinct b.brand) from base b where b.brand is not null), '[]'::jsonb),
      'sizes', coalesce((
        select jsonb_agg(s.size order by
          coalesce(array_position(array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One Size'], s.size), 100), s.pos, s.size)
        from (select v.size, min(v.position) as pos from public.store_product_variants v
              join base b on b.id = v.product_id group by v.size) s), '[]'::jsonb),
      'max_price', (select max(b.cur_price) from base b)
    )
  ) into result;
  return result;
end;
$$;

grant execute on function public.browse_store(text, text, text, text[], text[], text[], numeric, text, integer, integer, text[], text, text, boolean) to anon, authenticated;

-- Everything the product page needs in one call.
create or replace function public.get_store_product(p_id text, p_currency text default 'GBP')
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'product', to_jsonb(p) - 'external_buy_url',
    'price', sp.price,
    'compare_at', sp.compare_at,
    'variants', coalesce((select jsonb_agg(to_jsonb(v) order by v.position)
                          from public.store_product_variants v where v.product_id = p.id), '[]'::jsonb),
    'family', coalesce((
      select jsonb_agg(jsonb_build_object('id', f.id, 'kit_role', f.kit_role, 'image_url', f.main_image_url, 'title', f.title)
        order by array_position(array['home', 'away', 'third', 'goalkeeper'], f.kit_role))
      from public.store_products f
      where p.family_id is not null and f.family_id = p.family_id and f.is_active
        and f.profile = p.profile and f.kit_role is not null), '[]'::jsonb),
    'profiles', coalesce((
      select jsonb_agg(jsonb_build_object('id', g.id, 'profile', g.profile)
        order by array_position(array['mens', 'womens', 'kids', 'baby', 'unisex'], g.profile))
      from public.store_products g
      where p.profile_group_id is not null and g.profile_group_id = p.profile_group_id and g.is_active), '[]'::jsonb),
    'size_chart', (select to_jsonb(c) from public.store_size_charts c where c.id = p.size_chart_id),
    'print', (select to_jsonb(o) || jsonb_build_object(
        'player_price', case when p_currency = 'GBP' then o.player_price_gbp else o.player_price_usd end,
        'name_price', case when p_currency = 'GBP' then o.name_price_gbp else o.name_price_usd end,
        'number_price', case when p_currency = 'GBP' then o.number_price_gbp else o.number_price_usd end,
        'players', coalesce((
          select jsonb_agg(jsonb_build_object('id', pl.id, 'name', public.player_print_name(pl), 'number', pl.shirt_number)
            order by pl.shirt_number)
          from public.players pl where pl.team_type = o.team_type), '[]'::jsonb),
        'specials', coalesce((select jsonb_agg(to_jsonb(s) order by s.position) from public.store_print_specials s), '[]'::jsonb))
      from public.store_print_options o where o.product_id = p.id),
    'patches', coalesce((
      select jsonb_agg(jsonb_build_object('id', pa.id, 'name', pa.name,
        'price', case when p_currency = 'GBP' then pa.price_gbp else pa.price_usd end) order by pa.position)
      from public.store_product_patches pp join public.store_patches pa on pa.id = pp.patch_id
      where pp.product_id = p.id), '[]'::jsonb),
    'category', (
      select jsonb_build_object('slug', c.slug, 'title', c.title)
      from public.store_product_categories pc join public.store_categories c on c.id = pc.category_id
      where pc.product_id = p.id
      order by pc.position, (select max(depth) from public.store_category_ancestors a where a.category_id = c.id) desc
      limit 1),
    'rating', (select to_jsonb(r) - 'product_id' from public.store_product_ratings r where r.product_id = p.id)
  )
  from public.store_products p
  cross join lateral public.store_price(p, p_currency) sp
  where p.id = p_id and p.is_active
$$;

grant execute on function public.get_store_product(text, text) to anon, authenticated;

-- ----------------------------------------------------------------
-- 11. Pricing a bag
-- ----------------------------------------------------------------
create or replace function public.is_store_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and membership_tier in ('Red Member', 'Silver Member', 'Junior Gunner')
  )
$$;

drop function if exists public.quote_store_cart(text, jsonb, text);

-- p_items: [{variant_id, quantity, print?: {type: 'player'|'custom', player_id?, special_id?,
--            name?, number?, font?, patch_id?}}]. Legacy custom_name / custom_number are read too.
create or replace function public.quote_store_cart(
  p_currency text,
  p_items jsonb,
  p_promo_code text default null,
  p_zone text default 'UK',
  p_method text default 'standard',
  p_gift_card text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  gbp boolean := p_currency = 'GBP';
  member boolean := public.is_store_member();
  item jsonb;
  pr jsonb;
  v record;
  opts public.store_print_options%rowtype;
  pl public.players%rowtype;
  sp public.store_print_specials%rowtype;
  patch public.store_patches%rowtype;
  qty integer;
  print_type text;
  print_name text;
  print_number text;
  print_font text;
  print_price numeric;
  patch_price numeric;
  unit numeric;
  was numeric;
  line_total numeric;
  lines jsonb := '[]'::jsonb;
  subtotal numeric := 0;
  member_discount numeric := 0;
  discount numeric := 0;
  shipping numeric;
  free_shipping boolean := false;
  promo public.promo_codes%rowtype;
  promo_code text := nullif(upper(btrim(coalesce(p_promo_code, ''))), '');
  promo_error text;
  min_subtotal numeric;
  rate public.store_shipping_rates%rowtype;
  standard public.store_shipping_rates%rowtype;
  card public.gift_cards%rowtype;
  card_code text := nullif(upper(regexp_replace(coalesce(p_gift_card, ''), '[\s-]', '', 'g')), '');
  card_error text;
  card_amount numeric := 0;
  total numeric;
begin
  if p_currency is null or p_currency not in ('GBP', 'USD') then
    raise exception 'Unsupported currency' using errcode = '22023';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your bag is empty' using errcode = '22023';
  end if;
  if jsonb_array_length(p_items) > 30 then
    raise exception 'Too many items in your bag' using errcode = '22023';
  end if;
  select * into rate from public.store_shipping_rates where zone = p_zone and method = p_method;
  if not found then
    raise exception 'We can''t deliver there with that option' using errcode = '22023', hint = 'shipping';
  end if;
  select * into standard from public.store_shipping_rates where zone = p_zone and method = 'standard';

  for item in select value from jsonb_array_elements(p_items) loop
    qty := case when item->>'quantity' ~ '^\d{1,3}$' then (item->>'quantity')::integer end;
    if qty is null or qty < 1 or qty > 10 then
      raise exception 'Quantity must be between 1 and 10' using errcode = '22023';
    end if;

    select vr.id as variant_id, vr.size, vr.stock, p.id as product_id, p.title, p.main_image_url,
           p.member_discount_eligible, p.returnable, price.price, price.compare_at
      into v
      from public.store_product_variants vr
      join public.store_products p on p.id = vr.product_id
      cross join lateral public.store_price(p, p_currency) price
      where vr.id = item->>'variant_id' and p.is_active;
    if not found then
      raise exception 'An item in your bag is no longer available' using errcode = 'P0002';
    end if;

    -- Printing: explicit print object, or the legacy custom_name / custom_number fields.
    pr := coalesce(item->'print', case
      when coalesce(item->>'custom_name', '') <> '' or coalesce(item->>'custom_number', '') <> ''
      then jsonb_build_object('type', 'custom', 'name', item->>'custom_name', 'number', item->>'custom_number')
    end);
    print_type := null; print_name := null; print_number := null; print_font := null;
    print_price := 0; patch_price := 0; patch := null; pl := null; sp := null;

    if pr is not null and jsonb_typeof(pr) = 'object' and pr ? 'type' then
      select * into opts from public.store_print_options where product_id = v.product_id;
      if not found then
        raise exception '% cannot be personalised', v.title using errcode = '22023';
      end if;
      print_type := pr->>'type';
      if print_type = 'player' then
        if coalesce(pr->>'special_id', '') <> '' then
          select * into sp from public.store_print_specials where id = pr->>'special_id';
          if not found then raise exception 'Choose a player to print' using errcode = '22023'; end if;
          print_name := sp.label; print_number := sp.number;
        else
          select * into pl from public.players where id = pr->>'player_id' and team_type = opts.team_type;
          if not found then raise exception 'Choose a player to print' using errcode = '22023'; end if;
          print_name := public.player_print_name(pl); print_number := pl.shirt_number::text;
        end if;
        print_price := case when gbp then opts.player_price_gbp else opts.player_price_usd end;
      elsif print_type = 'custom' then
        print_name := nullif(upper(btrim(coalesce(pr->>'name', ''))), '');
        print_number := nullif(btrim(coalesce(pr->>'number', '')), '');
        if print_name is null and print_number is null then
          raise exception 'Add a name or number to print' using errcode = '22023';
        end if;
        if print_name is not null and print_name !~ '^[A-Z][A-Z .''-]{0,11}$' then
          raise exception 'Shirt names can use up to 12 letters' using errcode = '22023';
        end if;
        if print_number is not null and print_number !~ '^[0-9]{1,2}$' then
          raise exception 'Shirt numbers must be between 0 and 99' using errcode = '22023';
        end if;
        print_price := case when print_name is null then 0 else case when gbp then opts.name_price_gbp else opts.name_price_usd end end
          + case when print_number is null then 0 else case when gbp then opts.number_price_gbp else opts.number_price_usd end end;
      else
        raise exception 'Unknown personalisation' using errcode = '22023';
      end if;

      print_font := coalesce(nullif(pr->>'font', ''), opts.fonts[1]);
      if not (print_font = any (opts.fonts)) then
        raise exception 'That kit font isn''t available for this shirt' using errcode = '22023';
      end if;

      if coalesce(pr->>'patch_id', '') <> '' then
        select pa.* into patch from public.store_patches pa
          join public.store_product_patches pp on pp.patch_id = pa.id and pp.product_id = v.product_id
          where pa.id = pr->>'patch_id';
        if not found then
          raise exception 'That patch isn''t available for this shirt' using errcode = '22023';
        end if;
        patch_price := case when gbp then patch.price_gbp else patch.price_usd end;
      end if;
    end if;

    unit := v.price;
    was := v.compare_at;
    line_total := (unit + print_price + patch_price) * qty;
    subtotal := subtotal + line_total;
    -- Members save 10% on eligible full-price items (not on printing or sale lines).
    if member and v.member_discount_eligible and was is null then
      member_discount := member_discount + round(unit * qty * 0.10, 2);
    end if;

    lines := lines || jsonb_build_object(
      'variant_id', v.variant_id, 'product_id', v.product_id, 'title', v.title,
      'image_url', v.main_image_url, 'size', v.size, 'stock', v.stock, 'quantity', qty,
      'returnable', v.returnable and print_type is null,
      'unit_price', unit, 'compare_at', was,
      'print', case when print_type is null then null else jsonb_build_object(
        'type', print_type, 'player_id', pl.id, 'special_id', sp.id, 'name', print_name,
        'number', print_number, 'font', print_font, 'patch_id', patch.id, 'patch_name', patch.name) end,
      'custom_name', print_name, 'custom_number', print_number,
      'print_price', print_price, 'patch_price', patch_price,
      'customisation_price', print_price + patch_price,
      'line_total', line_total
    );
  end loop;

  if promo_code is not null then
    select * into promo from public.promo_codes pc where pc.code = promo_code;
    min_subtotal := case when gbp then promo.min_subtotal_gbp else promo.min_subtotal_usd end;
    if not found or not promo.is_active
       or (promo.starts_at is not null and promo.starts_at > now())
       or (promo.ends_at is not null and promo.ends_at < now()) then
      promo_error := 'This code isn''t valid';
    elsif promo.max_redemptions is not null and promo.redemptions >= promo.max_redemptions then
      promo_error := 'This code has been fully redeemed';
    elsif subtotal < min_subtotal then
      promo_error := format('Spend %s%s to use this code',
        case when gbp then '£' else '$' end, to_char(min_subtotal, 'FM999990.00'));
    else
      discount := round((subtotal - member_discount) * coalesce(promo.percent_off, 0) / 100.0, 2)
        + coalesce(case when gbp then promo.amount_off_gbp else promo.amount_off_usd end, 0);
      discount := least(discount, subtotal - member_discount);
      free_shipping := promo.free_shipping;
    end if;
  end if;

  shipping := case when gbp then rate.price_gbp else rate.price_usd end;
  if p_method = 'standard' and (
    free_shipping or subtotal - member_discount - discount >=
      coalesce(case when gbp then rate.free_over_gbp else rate.free_over_usd end, 'infinity'::numeric)) then
    shipping := 0;
  end if;
  total := subtotal - member_discount - discount + shipping;

  if card_code is not null then
    select * into card from public.gift_cards g where g.code = card_code;
    if not found or not card.active or (card.expires_at is not null and card.expires_at < now()) then
      card_error := 'This gift card isn''t valid';
    elsif card.currency <> p_currency then
      card_error := format('This gift card is in %s', card.currency);
    elsif card.balance <= 0 then
      card_error := 'This gift card has no balance left';
    else
      card_amount := least(card.balance, total);
    end if;
  end if;

  return jsonb_build_object(
    'currency', p_currency,
    'zone', p_zone,
    'method', p_method,
    'lines', lines,
    'subtotal', subtotal,
    'member', member,
    'member_discount', member_discount,
    'discount', discount,
    'shipping', shipping,
    'total', total,
    'gift_card', case when card_amount > 0 then jsonb_build_object(
      'code', card.code, 'amount', card_amount, 'balance_after', card.balance - card_amount) end,
    'gift_card_error', card_error,
    'amount_due', total - card_amount,
    'free_shipping_threshold', case when gbp then standard.free_over_gbp else standard.free_over_usd end,
    'shipping_options', coalesce((
      select jsonb_agg(jsonb_build_object(
        'method', r.method, 'label', r.label, 'eta', r.eta,
        'price', case when r.method = 'standard' and (free_shipping or subtotal - member_discount - discount >=
                   coalesce(case when gbp then r.free_over_gbp else r.free_over_usd end, 'infinity'::numeric))
                 then 0 else case when gbp then r.price_gbp else r.price_usd end end
      ) order by r.position)
      from public.store_shipping_rates r where r.zone = p_zone), '[]'::jsonb),
    'promo', case when promo_code is not null and promo_error is null
      then jsonb_build_object('code', promo.code, 'description', promo.description) end,
    'promo_error', promo_error
  );
end;
$$;

revoke all on function public.quote_store_cart(text, jsonb, text, text, text, text) from public;
grant execute on function public.quote_store_cart(text, jsonb, text, text, text, text) to anon, authenticated, service_role;

-- ----------------------------------------------------------------
-- 12. Orders
-- ----------------------------------------------------------------

-- Takes the gift card amount off its balance, or raises if it no longer covers it.
create or replace function public.reserve_order_gift_card(p_order_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
begin
  select * into o from public.orders where id = p_order_id;
  if o.gift_card_code is null or o.gift_card_amount <= 0 then
    return;
  end if;
  update public.gift_cards set balance = balance - o.gift_card_amount
    where code = o.gift_card_code and balance >= o.gift_card_amount;
  if not found then
    raise exception 'Your gift card balance has changed' using errcode = 'P0001', hint = 'gift_card';
  end if;
end;
$$;

create or replace function public.release_order_gift_card(p_order_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.gift_cards g set balance = g.balance + o.gift_card_amount
  from public.orders o
  where o.id = p_order_id and g.code = o.gift_card_code and o.gift_card_amount > 0;
$$;

create or replace function public.cancel_pending_order(p_order_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
    set status = 'cancelled', cancelled_at = now()
    where id = p_order_id and status = 'pending_payment';
  if not found then
    return false;
  end if;
  perform public.release_order_stock(p_order_id);
  perform public.release_order_gift_card(p_order_id);
  return true;
end;
$$;

-- Marks an order paid and counts its promo code. Shared by the webhook and
-- orders fully covered by a gift card.
create or replace function public.settle_order(p_order_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  used_code text;
begin
  update public.orders
    set status = 'paid', paid_at = now(), cancelled_at = null, expires_at = null
    where id = p_order_id
    returning promo_code into used_code;
  if used_code is not null then
    update public.promo_codes set redemptions = redemptions + 1 where promo_codes.code = used_code;
  end if;
end;
$$;

drop function if exists public.create_store_order(text, jsonb, text, text);

create or replace function public.create_store_order(
  p_currency text,
  p_items jsonb,
  p_address_id text,
  p_promo_code text default null,
  p_zone text default 'UK',
  p_method text default 'standard',
  p_gift_card text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  address public.shipping_addresses%rowtype;
  quote jsonb;
  new_order public.orders%rowtype;
  previous text;
begin
  if uid is null then
    raise exception 'Sign in to check out' using errcode = '28000';
  end if;

  select * into address from public.shipping_addresses where id = p_address_id and user_id = uid;
  if not found then
    raise exception 'Choose a delivery address' using errcode = 'P0002';
  end if;

  for previous in
    select id from public.orders where user_id = uid and status = 'pending_payment'
  loop
    perform public.cancel_pending_order(previous);
  end loop;

  quote := public.quote_store_cart(p_currency, p_items, p_promo_code, p_zone, p_method, p_gift_card);
  if quote->>'promo_error' is not null then
    raise exception '%', quote->>'promo_error' using errcode = '22023', hint = 'promo';
  end if;
  if quote->>'gift_card_error' is not null then
    raise exception '%', quote->>'gift_card_error' using errcode = '22023', hint = 'gift_card';
  end if;

  insert into public.orders (
    user_id, currency, subtotal, member_discount, discount, shipping, total, amount_due,
    promo_code, gift_card_code, gift_card_amount, shipping_zone, shipping_method,
    shipping_address, expires_at
  ) values (
    uid,
    p_currency,
    (quote->>'subtotal')::numeric,
    (quote->>'member_discount')::numeric,
    (quote->>'discount')::numeric,
    (quote->>'shipping')::numeric,
    (quote->>'total')::numeric,
    (quote->>'amount_due')::numeric,
    quote->'promo'->>'code',
    quote->'gift_card'->>'code',
    coalesce((quote->'gift_card'->>'amount')::numeric, 0),
    p_zone,
    p_method,
    jsonb_build_object(
      'full_name', address.full_name, 'line1', address.line1, 'line2', address.line2,
      'city', address.city, 'region', address.region, 'postcode', address.postcode,
      'country', address.country, 'phone', address.phone
    ),
    now() + interval '30 minutes'
  )
  returning * into new_order;

  insert into public.order_items (
    order_id, product_id, variant_id, title, image_url, size, custom_name, custom_number,
    unit_price, compare_at, customisation_price, print_type, player_id, print_font, patch_id,
    patch_name, print_price, patch_price, quantity, line_total, position
  )
  select new_order.id, l->>'product_id', l->>'variant_id', l->>'title', l->>'image_url', l->>'size',
         l->'print'->>'name', l->'print'->>'number', (l->>'unit_price')::numeric,
         (l->>'compare_at')::numeric, (l->>'customisation_price')::numeric,
         l->'print'->>'type', coalesce(l->'print'->>'player_id', l->'print'->>'special_id'),
         l->'print'->>'font', l->'print'->>'patch_id', l->'print'->>'patch_name',
         (l->>'print_price')::numeric, (l->>'patch_price')::numeric,
         (l->>'quantity')::integer, (l->>'line_total')::numeric, ord::integer
  from jsonb_array_elements(quote->'lines') with ordinality as t(l, ord);

  perform public.reserve_order_stock(new_order.id);
  perform public.reserve_order_gift_card(new_order.id);

  -- Fully covered by a gift card: nothing to charge.
  if new_order.amount_due = 0 then
    perform public.settle_order(new_order.id);
    select * into new_order from public.orders where id = new_order.id;
  end if;
  return new_order;
end;
$$;

revoke all on function public.create_store_order(text, jsonb, text, text, text, text, text) from public, anon;
grant execute on function public.create_store_order(text, jsonb, text, text, text, text, text) to authenticated;

create or replace function public.mark_order_paid(
  p_payment_intent_id text,
  p_amount_minor bigint,
  p_currency text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
begin
  select * into o from public.orders where stripe_payment_intent_id = p_payment_intent_id for update;
  if not found then
    return 'unknown';
  end if;
  if o.status not in ('pending_payment', 'cancelled') then
    return 'paid';
  end if;
  if round(coalesce(o.amount_due, o.total) * 100) <> p_amount_minor or lower(o.currency) <> lower(p_currency) then
    return 'mismatch';
  end if;

  if o.status = 'cancelled' then
    -- Paid after the order expired: take the stock (and gift card) again if still there.
    begin
      perform public.reserve_order_stock(o.id);
      perform public.reserve_order_gift_card(o.id);
    exception when sqlstate 'P0001' then
      update public.orders set status = 'refunded' where id = o.id;
      return 'refund';
    end;
  end if;

  perform public.settle_order(o.id);
  return 'paid';
end;
$$;

do $$
declare f text;
begin
  foreach f in array array[
    'public.reserve_order_gift_card(text)', 'public.release_order_gift_card(text)',
    'public.cancel_pending_order(text)', 'public.settle_order(text)',
    'public.mark_order_paid(text, bigint, text)', 'public.notify_back_in_stock()',
    'public.prepare_store_review()', 'public.count_review_votes()', 'public.prepare_store_question()'
  ] loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;

-- ================================================================
-- Store returns
--   store_returns / store_return_items   return requests per order
--
-- request_store_return() lets a member ask to return items from a paid
-- order within the returns window. Printed or non-returnable items and
-- quantities already being returned are refused. Staff move the request
-- through approved → received → refunded (or rejected).
-- ================================================================

create table if not exists public.store_returns (
  id text primary key default gen_random_uuid()::text,
  return_number text not null unique default ('RTN' || lpad((floor(random() * 1000000))::int::text, 6, '0')),
  order_id text not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'requested' check (status in ('requested', 'approved', 'received', 'refunded', 'rejected')),
  reason text not null check (reason in ('too_small', 'too_big', 'not_as_described', 'faulty', 'changed_mind', 'other')),
  notes text check (length(notes) <= 1000),
  refund_amount numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists store_returns_user_idx on public.store_returns (user_id, created_at desc);
create index if not exists store_returns_order_idx on public.store_returns (order_id);

create table if not exists public.store_return_items (
  return_id text not null references public.store_returns(id) on delete cascade,
  order_item_id text not null references public.order_items(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  primary key (return_id, order_item_id)
);

alter table public.store_returns enable row level security;
alter table public.store_return_items enable row level security;

drop policy if exists "Users read own returns" on public.store_returns;
create policy "Users read own returns" on public.store_returns
  for select using (auth.uid() = user_id);

drop policy if exists "Users read own return items" on public.store_return_items;
create policy "Users read own return items" on public.store_return_items
  for select using (exists (
    select 1 from public.store_returns r where r.id = return_id and r.user_id = auth.uid()
  ));

do $$
declare t text;
begin
  foreach t in array array['store_returns', 'store_return_items'] loop
    execute format('drop policy if exists "Staff manage %1$s" on public.%1$I', t);
    execute format(
      'create policy "Staff manage %1$s" on public.%1$I for all to authenticated '
      'using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

drop trigger if exists store_returns_touch on public.store_returns;
create trigger store_returns_touch before update on public.store_returns
  for each row execute function public.touch_updated_at();

-- 28 days from receipt; a week is allowed for delivery.
create or replace function public.store_return_deadline(o public.orders)
returns timestamptz
language sql
stable
as $$ select o.paid_at + interval '35 days' $$;

-- Items of an order that can still be returned, with how many.
create or replace function public.returnable_order_items(p_order_id text)
returns table (order_item_id text, title text, size text, image_url text, returnable_quantity integer, reason text)
language sql
stable
security definer
set search_path = public
as $$
  select i.id, i.title, i.size, i.image_url,
         greatest(0, i.quantity - coalesce((
           select sum(ri.quantity) from public.store_return_items ri
           join public.store_returns r on r.id = ri.return_id
           where ri.order_item_id = i.id and r.status <> 'rejected'), 0))::integer,
         case
           when i.print_type is not null or i.patch_id is not null then 'Personalised items can''t be returned'
           when p.returnable is false then 'This item can''t be returned'
         end
  from public.order_items i
  join public.orders o on o.id = i.order_id
  left join public.store_products p on p.id = i.product_id
  where i.order_id = p_order_id and o.user_id = auth.uid()
  order by i.position
$$;

revoke all on function public.returnable_order_items(text) from public, anon;
grant execute on function public.returnable_order_items(text) to authenticated;

-- p_items: [{order_item_id, quantity}]
create or replace function public.request_store_return(
  p_order_id text,
  p_items jsonb,
  p_reason text,
  p_notes text default null
)
returns public.store_returns
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  o public.orders%rowtype;
  item jsonb;
  line record;
  qty integer;
  created public.store_returns%rowtype;
begin
  if uid is null then
    raise exception 'Sign in to request a return' using errcode = '28000';
  end if;
  select * into o from public.orders where id = p_order_id and user_id = uid for update;
  if not found then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;
  if o.status not in ('paid', 'processing', 'shipped', 'delivered') or o.paid_at is null then
    raise exception 'This order can''t be returned' using errcode = '22023';
  end if;
  if now() > public.store_return_deadline(o) then
    raise exception 'The 28 day returns window for this order has closed' using errcode = '22023';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Choose the items to return' using errcode = '22023';
  end if;

  insert into public.store_returns (order_id, user_id, reason, notes)
  values (o.id, uid, p_reason, nullif(btrim(coalesce(p_notes, '')), ''))
  returning * into created;

  for item in select value from jsonb_array_elements(p_items) loop
    qty := case when item->>'quantity' ~ '^\d{1,2}$' then (item->>'quantity')::integer end;
    select * into line from public.returnable_order_items(o.id) r where r.order_item_id = item->>'order_item_id';
    if not found or qty is null or qty < 1 then
      raise exception 'Choose the items to return' using errcode = '22023';
    end if;
    if line.reason is not null then
      raise exception '%: %', line.title, line.reason using errcode = '22023';
    end if;
    if qty > line.returnable_quantity then
      raise exception 'You can return up to % of %', line.returnable_quantity, line.title using errcode = '22023';
    end if;
    insert into public.store_return_items (return_id, order_item_id, quantity)
    values (created.id, line.order_item_id, qty);
  end loop;
  return created;
end;
$$;

revoke all on function public.request_store_return(text, jsonb, text, text) from public, anon;
grant execute on function public.request_store_return(text, jsonb, text, text) to authenticated;
