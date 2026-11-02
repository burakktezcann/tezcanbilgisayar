-- Keep up to three private PC build drafts for each signed-in customer.
create table if not exists public.customer_system_builds (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot smallint not null check (slot between 1 and 3),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id, slot)
);

alter table public.customer_system_builds enable row level security;

revoke all on table public.customer_system_builds from anon, authenticated;
grant select, insert, update, delete on table public.customer_system_builds to authenticated;

drop policy if exists "Customers can read their own system builds" on public.customer_system_builds;
create policy "Customers can read their own system builds"
  on public.customer_system_builds for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Customers can create their own system builds" on public.customer_system_builds;
create policy "Customers can create their own system builds"
  on public.customer_system_builds for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Customers can update their own system builds" on public.customer_system_builds;
create policy "Customers can update their own system builds"
  on public.customer_system_builds for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Customers can delete their own system builds" on public.customer_system_builds;
create policy "Customers can delete their own system builds"
  on public.customer_system_builds for delete to authenticated
  using (auth.uid() = user_id);
