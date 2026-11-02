-- Store the customer's explicit email update preference on their own profile.
alter table public.profiles
  add column if not exists email_marketing_opt_in boolean not null default false,
  add column if not exists email_marketing_updated_at timestamptz;

create or replace function public.set_email_marketing_preference_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.email_marketing_opt_in is distinct from old.email_marketing_opt_in then
    new.email_marketing_updated_at := now();
  end if;
  return new;
end;
$$;
revoke all on function public.set_email_marketing_preference_timestamp() from public, anon, authenticated;

drop trigger if exists profiles_email_marketing_preference_timestamp on public.profiles;
create trigger profiles_email_marketing_preference_timestamp
  before update of email_marketing_opt_in on public.profiles
  for each row execute function public.set_email_marketing_preference_timestamp();

revoke select on table public.profiles from authenticated;
grant select (id, full_name, phone, updated_at, email_marketing_opt_in, email_marketing_updated_at)
  on table public.profiles to authenticated;

revoke update on table public.profiles from authenticated;
grant update (full_name, phone, updated_at, email_marketing_opt_in)
  on table public.profiles to authenticated;
