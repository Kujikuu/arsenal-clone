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
