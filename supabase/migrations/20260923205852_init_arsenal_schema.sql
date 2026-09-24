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
