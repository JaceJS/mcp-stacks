-- Migration: create_users
-- Extends auth.users with public profile data.
-- Synced automatically via trigger on auth.users insert.

create table public.users (
  id            uuid        primary key references auth.users(id) on delete cascade,
  email         text        not null,
  username      text        unique,
  display_name  text,
  avatar_url    text,
  bio           text,
  github_url    text,
  twitter_url   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Trigger: auto-create public.users row when a new auth.users row is inserted
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, avatar_url, display_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger: keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute procedure public.set_updated_at();
