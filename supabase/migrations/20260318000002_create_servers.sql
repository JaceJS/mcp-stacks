-- Migration: create_servers
-- MCP server registry. No FK dependencies.

create table public.servers (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  description text,
  npm_package text,
  github_url  text,
  icon_url    text,
  category    text,
  is_official boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger servers_set_updated_at
  before update on public.servers
  for each row execute procedure public.set_updated_at();
