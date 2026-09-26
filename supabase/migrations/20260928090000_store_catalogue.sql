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
