-- Customer profile and address data. Every row is scoped to its owning auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 100),
  phone text check (phone is null or char_length(phone) <= 32),
  age smallint check (age is null or age between 1 and 120),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 60),
  recipient_name text not null check (char_length(recipient_name) between 1 and 100),
  phone text not null check (char_length(phone) between 5 and 32),
  address_line text not null check (char_length(address_line) between 5 and 1000),
  district text not null check (char_length(district) between 1 and 100),
  city text not null check (char_length(city) between 1 and 100),
  postal_code text check (postal_code is null or char_length(postal_code) <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.customer_addresses from anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.customer_addresses to authenticated;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can read their own addresses"
  on public.customer_addresses for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can add their own addresses"
  on public.customer_addresses for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update their own addresses"
  on public.customer_addresses for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users can delete their own addresses"
  on public.customer_addresses for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

-- Backfill accounts created before this migration is applied.
insert into public.profiles (id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (id) do nothing;