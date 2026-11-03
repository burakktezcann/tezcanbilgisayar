-- Private inventory of the computers a signed-in customer owns.
create table if not exists public.customer_owned_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  device_type text not null check (device_type in ('laptop', 'desktop')),
  name text not null check (char_length(name) between 1 and 100),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_owned_devices_user_created_idx
  on public.customer_owned_devices (user_id, created_at desc);

alter table public.customer_owned_devices enable row level security;
revoke all on table public.customer_owned_devices from public, anon, authenticated;
grant select, insert, update, delete on table public.customer_owned_devices to authenticated;

drop policy if exists "Customers can read their own devices" on public.customer_owned_devices;
create policy "Customers can read their own devices"
  on public.customer_owned_devices for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Customers can add their own devices" on public.customer_owned_devices;
create policy "Customers can add their own devices"
  on public.customer_owned_devices for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "Customers can update their own devices" on public.customer_owned_devices;
create policy "Customers can update their own devices"
  on public.customer_owned_devices for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Customers can delete their own devices" on public.customer_owned_devices;
create policy "Customers can delete their own devices"
  on public.customer_owned_devices for delete to authenticated
  using (user_id = (select auth.uid()));
