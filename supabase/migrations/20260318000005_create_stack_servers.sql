-- Migration: create_stack_servers
-- Join table: which servers are included in a stack, with ordering and config override.
-- FK → stacks, servers.

create table public.stack_servers (
  id              uuid        primary key default gen_random_uuid(),
  stack_id        uuid        not null references public.stacks(id) on delete cascade,
  server_id       uuid        not null references public.servers(id) on delete cascade,
  config_override jsonb,
  position        int         not null default 0,
  created_at      timestamptz not null default now(),

  unique (stack_id, server_id)
);

create index stack_servers_stack_id_idx on public.stack_servers(stack_id);
