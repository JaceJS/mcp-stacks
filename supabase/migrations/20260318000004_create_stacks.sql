-- Migration: create_stacks
-- User-created MCP stacks. FK → users.

create table public.stacks (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  title       text        not null,
  slug        text        not null unique,
  description text,
  config_json jsonb,
  is_public   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index stacks_user_id_idx on public.stacks(user_id);
create index stacks_slug_idx on public.stacks(slug);

create trigger stacks_set_updated_at
  before update on public.stacks
  for each row execute procedure public.set_updated_at();
