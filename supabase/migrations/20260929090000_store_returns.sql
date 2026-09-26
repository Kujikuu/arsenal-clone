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
