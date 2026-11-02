-- Let customers keep one preferred delivery address on their account.
alter table public.customer_addresses
  add column if not exists is_default boolean not null default false;

with users_without_default as (
  select distinct address.user_id
  from public.customer_addresses as address
  where not exists (
    select 1 from public.customer_addresses as chosen
    where chosen.user_id = address.user_id and chosen.is_default
  )
), ranked_addresses as (
  select address.id, row_number() over (
    partition by address.user_id
    order by address.created_at asc, address.id asc
  ) as position
  from public.customer_addresses as address
  join users_without_default using (user_id)
)
update public.customer_addresses as address
set is_default = (ranked_addresses.position = 1)
from ranked_addresses
where address.id = ranked_addresses.id
  and ranked_addresses.position = 1;

create unique index if not exists customer_addresses_one_default_per_user_idx
  on public.customer_addresses (user_id)
  where is_default;
