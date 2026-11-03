-- Order-management foundation. Checkout and payment capture remain disabled until
-- the business and payment provider are ready.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('TB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'received'
    check (status in ('received', 'awaiting_payment', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  currency text not null default 'TRY' check (currency ~ '^[A-Z]{3}$'),
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  shipping_total numeric(12,2) not null default 0 check (shipping_total >= 0),
  tax_total numeric(12,2) not null default 0 check (tax_total >= 0),
  discount_total numeric(12,2) not null default 0 check (discount_total >= 0),
  grand_total numeric(12,2) not null default 0
    check (grand_total >= 0 and grand_total = subtotal + shipping_total + tax_total - discount_total),
  customer_note text not null default '' check (char_length(customer_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.catalog_products (id) on delete set null,
  product_name text not null check (char_length(product_name) between 1 and 180),
  product_sku text not null default '' check (char_length(product_sku) <= 100),
  quantity integer not null check (quantity between 1 and 10000),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(14,2) generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now()
);

-- Address values are immutable order-time snapshots, independent from a customer's saved addresses.
create table if not exists public.order_addresses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  address_type text not null check (address_type in ('shipping', 'billing')),
  recipient_name text not null check (char_length(recipient_name) between 1 and 120),
  phone text not null check (char_length(phone) between 5 and 40),
  address_line text not null check (char_length(address_line) between 5 and 1200),
  district text not null check (char_length(district) between 1 and 120),
  city text not null check (char_length(city) between 1 and 120),
  postal_code text not null default '' check (char_length(postal_code) <= 24),
  country_code text not null default 'TR' check (country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  unique (order_id, address_type)
);

create table if not exists public.order_status_history (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null
    check (status in ('received', 'awaiting_payment', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  note text not null default '' check (char_length(note) <= 1000),
  changed_by uuid references auth.users (id) on delete set null,
  changed_at timestamptz not null default now()
);

-- Store provider references and outcomes only; never store card numbers, CVC, or bank credentials.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null check (char_length(provider) between 1 and 80),
  provider_payment_id text not null default '' check (char_length(provider_payment_id) <= 200),
  provider_reference text not null default '' check (char_length(provider_reference) <= 200),
  payment_method text not null default '' check (char_length(payment_method) <= 80),
  status text not null default 'pending'
    check (status in ('pending', 'authorized', 'captured', 'failed', 'cancelled', 'partially_refunded', 'refunded')),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'TRY' check (currency ~ '^[A-Z]{3}$'),
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 200),
  provider_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_payload) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  carrier text not null default '' check (char_length(carrier) <= 100),
  tracking_number text not null default '' check (char_length(tracking_number) <= 200),
  tracking_url text not null default '' check (tracking_url = '' or tracking_url ~ '^https://'),
  status text not null default 'pending'
    check (status in ('pending', 'label_created', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned')),
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_customer_created_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders (status, created_at desc);
create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists order_addresses_order_idx on public.order_addresses (order_id);
create index if not exists order_status_history_order_time_idx on public.order_status_history (order_id, changed_at desc);
create index if not exists payments_order_created_idx on public.payments (order_id, created_at desc);
create index if not exists shipments_order_created_idx on public.shipments (order_id, created_at desc);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_addresses enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;

revoke all on table public.orders, public.order_items, public.order_addresses,
  public.order_status_history, public.payments, public.shipments from public, anon, authenticated;
grant select on table public.orders, public.order_items, public.order_addresses,
  public.order_status_history, public.payments, public.shipments to authenticated;
grant update (status) on table public.orders to authenticated;
grant all on table public.orders, public.order_items, public.order_addresses,
  public.order_status_history, public.payments, public.shipments to service_role;
grant usage, select on sequence public.order_status_history_id_seq to service_role;

drop policy if exists "Customers can read their own orders" on public.orders;
create policy "Customers can read their own orders"
  on public.orders for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "Order admins can read all orders" on public.orders;
create policy "Order admins can read all orders"
  on public.orders for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');
drop policy if exists "Order admins can update order status" on public.orders;
create policy "Order admins can update order status"
  on public.orders for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

drop policy if exists "Customers can read their own order items" on public.order_items;
create policy "Customers can read their own order items"
  on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = (select auth.uid())));
drop policy if exists "Order admins can read all order items" on public.order_items;
create policy "Order admins can read all order items"
  on public.order_items for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

drop policy if exists "Customers can read their own order addresses" on public.order_addresses;
create policy "Customers can read their own order addresses"
  on public.order_addresses for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_addresses.order_id and o.user_id = (select auth.uid())));
drop policy if exists "Order admins can read all order addresses" on public.order_addresses;
create policy "Order admins can read all order addresses"
  on public.order_addresses for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

drop policy if exists "Customers can read their own order status history" on public.order_status_history;
create policy "Customers can read their own order status history"
  on public.order_status_history for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_status_history.order_id and o.user_id = (select auth.uid())));
drop policy if exists "Order admins can read all order status history" on public.order_status_history;
create policy "Order admins can read all order status history"
  on public.order_status_history for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

-- Payment provider payloads are private to administrators and trusted server-side code.
drop policy if exists "Order admins can read payment records" on public.payments;
create policy "Order admins can read payment records"
  on public.payments for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

drop policy if exists "Customers can read their own shipments" on public.shipments;
create policy "Customers can read their own shipments"
  on public.shipments for select to authenticated
  using (exists (select 1 from public.orders o where o.id = shipments.order_id and o.user_id = (select auth.uid())));
drop policy if exists "Order admins can read all shipments" on public.shipments;
create policy "Order admins can read all shipments"
  on public.shipments for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'catalog_role') = 'admin');

create or replace function public.validate_order_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status and not (
    (old.status = 'received' and new.status in ('awaiting_payment', 'cancelled')) or
    (old.status = 'awaiting_payment' and new.status in ('paid', 'cancelled')) or
    (old.status = 'paid' and new.status in ('preparing', 'cancelled', 'refunded')) or
    (old.status = 'preparing' and new.status in ('shipped', 'cancelled', 'refunded')) or
    (old.status = 'shipped' and new.status in ('delivered', 'refunded')) or
    (old.status = 'delivered' and new.status = 'refunded')
  ) then
    raise exception 'Invalid order status transition: % -> %', old.status, new.status
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create or replace function public.record_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_status_history (order_id, status, changed_by, note)
    values (new.id, new.status, auth.uid(), 'Sipariş kaydı oluşturuldu.');
  elsif new.status is distinct from old.status then
    insert into public.order_status_history (order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create or replace function public.set_order_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.validate_order_status_transition() from public, anon, authenticated;
revoke all on function public.record_order_status_change() from public, anon, authenticated;
revoke all on function public.set_order_updated_at() from public, anon, authenticated;

drop trigger if exists validate_order_status_transition on public.orders;
create trigger validate_order_status_transition
  before update of status on public.orders
  for each row execute function public.validate_order_status_transition();
drop trigger if exists record_order_status_change on public.orders;
create trigger record_order_status_change
  after insert or update of status on public.orders
  for each row execute function public.record_order_status_change();
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders
  for each row execute function public.set_order_updated_at();
drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at before update on public.payments
  for each row execute function public.set_order_updated_at();
drop trigger if exists set_shipments_updated_at on public.shipments;
create trigger set_shipments_updated_at before update on public.shipments
  for each row execute function public.set_order_updated_at();
