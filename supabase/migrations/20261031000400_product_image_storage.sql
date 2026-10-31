-- Public product images; only catalog administrators may write files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Catalog admins can manage product images" on storage.objects;
create policy "Catalog admins can manage product images"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'product-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin'
  )
  with check (
    bucket_id = 'product-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin'
  );

alter table public.catalog_products
  drop constraint if exists catalog_products_image_path_check;
alter table public.catalog_products
  add constraint catalog_products_image_path_check check (
    image_path = ''
    or image_path ~ '^assets/products/[A-Za-z0-9._/-]+$'
    or image_path ~ '^https://[A-Za-z0-9.-]+/storage/v1/object/public/product-images/[A-Za-z0-9._/-]+$'
  );

