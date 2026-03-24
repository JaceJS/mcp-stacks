-- Migration: create_stack_tags
-- Join table: tags applied to stacks.
-- FK → stacks, tags.

create table public.stack_tags (
  id         uuid        primary key default gen_random_uuid(),
  stack_id   uuid        not null references public.stacks(id) on delete cascade,
  tag_id     uuid        not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),

  unique (stack_id, tag_id)
);

create index stack_tags_stack_id_idx on public.stack_tags(stack_id);
create index stack_tags_tag_id_idx on public.stack_tags(tag_id);
