-- Per-customer saved carts. Checkout remains disabled until the store is ready.
create table if not exists public.customer_cart_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_slug text not null references public.catalog_products (slug) on update cascade on delete cascade,
  quantity smallint not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);

create index if not exists customer_cart_items_user_updated_idx
  on public.customer_cart_items (user_id, updated_at desc);

alter table public.customer_cart_items enable row level security;
revoke all on table public.customer_cart_items from public, anon, authenticated;
grant select, insert, update, delete on table public.customer_cart_items to authenticated;

drop policy if exists "Customers can read their own cart" on public.customer_cart_items;
create policy "Customers can read their own cart"
  on public.customer_cart_items for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Customers can add active products to their cart" on public.customer_cart_items;
create policy "Customers can add active products to their cart"
  on public.customer_cart_items for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.catalog_products as product
      where product.slug = customer_cart_items.product_slug
        and product.status = 'active'
    )
  );

drop policy if exists "Customers can update their own cart" on public.customer_cart_items;
create policy "Customers can update their own cart"
  on public.customer_cart_items for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.catalog_products as product
      where product.slug = customer_cart_items.product_slug
        and product.status = 'active'
    )
  );

drop policy if exists "Customers can remove items from their own cart" on public.customer_cart_items;
create policy "Customers can remove items from their own cart"
  on public.customer_cart_items for delete to authenticated
  using (user_id = (select auth.uid()));
