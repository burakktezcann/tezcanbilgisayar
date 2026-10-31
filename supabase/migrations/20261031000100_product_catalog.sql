-- Public catalog data with administrator-only writes.
create table if not exists public.catalog_categories (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  icon text not null default 'fa-box' check (icon ~ '^fa-[a-z0-9-]+$'),
  tone text not null default 'blue' check (tone in ('blue', 'green', 'purple', 'orange')),
  sort_order integer not null default 0 check (sort_order >= 0),
  search_terms text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  category_id text not null references public.catalog_categories(id) on update cascade on delete restrict,
  name text not null check (char_length(name) between 1 and 180),
  description text not null default '',
  brand text not null default '',
  model text not null default '',
  sku text not null default '',
  image_path text not null default '' check (image_path = '' or image_path ~ '^assets/products/[A-Za-z0-9._/-]+$'),
  price numeric(12,2) check (price is null or price >= 0),
  currency text not null default 'TRY' check (currency ~ '^[A-Z]{3}$'),
  stock integer check (stock is null or stock >= 0),
  status text not null default 'draft' check (status in ('draft', 'active')),
  sort_order integer not null default 0 check (sort_order >= 0),
  search_terms text[] not null default '{}',
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_products_attributes_object_check check (jsonb_typeof(attributes) = 'object')
);

create index if not exists catalog_products_public_order_idx
  on public.catalog_products (category_id, sort_order, name)
  where status = 'active';

alter table public.catalog_categories enable row level security;
alter table public.catalog_products enable row level security;

revoke all on table public.catalog_categories from public, anon, authenticated;
revoke all on table public.catalog_products from public, anon, authenticated;
grant select on table public.catalog_categories to anon, authenticated;
grant select on table public.catalog_products to anon, authenticated;
grant insert, update, delete on table public.catalog_categories to authenticated;
grant insert, update, delete on table public.catalog_products to authenticated;

-- Public visitors only see active categories.
drop policy if exists "Public can read active catalog categories" on public.catalog_categories;
create policy "Public can read active catalog categories"
  on public.catalog_categories for select to anon, authenticated
  using (is_active);

-- Public visitors only see active products inside active categories.
drop policy if exists "Public can read active catalog products" on public.catalog_products;
create policy "Public can read active catalog products"
  on public.catalog_products for select to anon, authenticated
  using (
    status = 'active'
    and exists (
      select 1
      from public.catalog_categories as category
      where category.id = catalog_products.category_id
        and category.is_active
    )
  );

-- catalog_role is stored in app_metadata, which end users cannot edit themselves.
drop policy if exists "Catalog admins can manage categories" on public.catalog_categories;
create policy "Catalog admins can manage categories"
  on public.catalog_categories for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

drop policy if exists "Catalog admins can manage products" on public.catalog_products;
create policy "Catalog admins can manage products"
  on public.catalog_products for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

insert into public.catalog_categories (id, name, description, icon, tone, sort_order, search_terms)
values
  ('cpu', 'İşlemci', 'İşlemci modelleri ve uyumluluk seçenekleri.', 'fa-microchip', 'blue', 1, array['cpu', 'processor']),
  ('motherboard', 'Anakart', 'Sistem bileşenleriyle uyumlu anakart seçenekleri.', 'fa-chess-board', 'green', 2, array['motherboard']),
  ('ram', 'RAM', 'Masaüstü ve dizüstü bellek seçenekleri.', 'fa-memory', 'purple', 3, array['bellek', 'memory']),
  ('gpu', 'Ekran Kartı', 'Kullanım amacına uygun ekran kartı seçenekleri.', 'fa-display', 'orange', 4, array['gpu', 'graphics']),
  ('disk', 'Depolama', 'SSD, sabit disk ve taşınabilir depolama seçenekleri.', 'fa-hard-drive', 'blue', 5, array['ssd', 'hdd', 'disk']),
  ('case', 'Kasa', 'Farklı sistem türlerine uygun bilgisayar kasaları.', 'fa-server', 'green', 6, array['bilgisayar kasası', 'case']),
  ('psu', 'Güç Kaynağı', 'Sistemin güç ihtiyacına uygun güç kaynakları.', 'fa-bolt', 'purple', 7, array['power supply', 'psu'])
on conflict (id) do nothing;


