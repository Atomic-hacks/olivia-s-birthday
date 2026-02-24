create table if not exists public.birthday_profiles (
  profile_id text primary key,
  name text not null,
  birthday date not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists birthday_profiles_set_updated_at on public.birthday_profiles;
create trigger birthday_profiles_set_updated_at
before update on public.birthday_profiles
for each row execute function public.set_updated_at();

alter table public.birthday_profiles enable row level security;

-- Service role writes through API routes, so deny direct anonymous access by default.
drop policy if exists "deny anon select" on public.birthday_profiles;
create policy "deny anon select"
on public.birthday_profiles
for select
to anon
using (false);
