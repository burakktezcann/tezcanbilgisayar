-- A customer's favorite active catalog products, synced across signed-in devices.
create table if not exists public.customer_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.catalog_products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.customer_favorites enable row level security;
revoke all on table public.customer_favorites from public, anon, authenticated;
grant select, insert, delete on table public.customer_favorites to authenticated;

drop policy if exists "Customers can read their own favorites" on public.customer_favorites;
create policy "Customers can read their own favorites"
  on public.customer_favorites for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Customers can add their own favorites" on public.customer_favorites;
create policy "Customers can add their own favorites"
  on public.customer_favorites for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.catalog_products product where product.id = customer_favorites.product_id and product.status = 'active')
  );

drop policy if exists "Customers can remove their own favorites" on public.customer_favorites;
create policy "Customers can remove their own favorites"
  on public.customer_favorites for delete to authenticated
  using (auth.uid() = user_id);
