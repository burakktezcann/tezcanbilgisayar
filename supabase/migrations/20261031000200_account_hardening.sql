-- Reduce profile data exposure and index per-user address access.
revoke select on table public.profiles from authenticated;
grant select (id, full_name, phone, updated_at) on table public.profiles to authenticated;

revoke update on table public.profiles from authenticated;
grant update (full_name, phone, updated_at) on table public.profiles to authenticated;

create index if not exists customer_addresses_user_created_idx
  on public.customer_addresses (user_id, created_at desc);
