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
