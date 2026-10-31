-- Store category-specific product specifications as a validated JSON object.
alter table public.catalog_products
  add column if not exists attributes jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'catalog_products_attributes_object_check'
      and conrelid = 'public.catalog_products'::regclass
  ) then
    alter table public.catalog_products
      add constraint catalog_products_attributes_object_check
      check (jsonb_typeof(attributes) = 'object');
  end if;
end;
$$;

