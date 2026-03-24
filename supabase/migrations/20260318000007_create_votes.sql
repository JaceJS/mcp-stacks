-- Migration: create_votes
-- One vote per user per stack (unique constraint).
-- FK → users, stacks.

create table public.votes (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  stack_id   uuid        not null references public.stacks(id) on delete cascade,
  created_at timestamptz not null default now(),

  unique (user_id, stack_id)
);

create index votes_stack_id_idx on public.votes(stack_id);
create index votes_user_id_idx on public.votes(user_id);
