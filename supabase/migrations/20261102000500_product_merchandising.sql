-- Home page merchandising flags managed from the catalog editor.
alter table public.catalog_products
  add column if not exists is_bestseller boolean not null default false,
  add column if not exists is_campaign boolean not null default false;

create index if not exists catalog_products_home_bestseller_idx
  on public.catalog_products (sort_order, name)
  where status = 'active' and is_bestseller;

create index if not exists catalog_products_home_campaign_idx
  on public.catalog_products (sort_order, name)
  where status = 'active' and is_campaign;
