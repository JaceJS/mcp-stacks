-- Migration: create_rls_policies
-- Row Level Security for all public tables.

-- ─── users ─────────────────────────────────────────────────────────────────
alter table public.users enable row level security;

create policy "users: public read"
  on public.users for select
  using (true);

create policy "users: owner update"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── servers ───────────────────────────────────────────────────────────────
alter table public.servers enable row level security;

create policy "servers: public read"
  on public.servers for select
  using (true);

-- ─── tags ──────────────────────────────────────────────────────────────────
alter table public.tags enable row level security;

create policy "tags: public read"
  on public.tags for select
  using (true);

-- ─── stacks ────────────────────────────────────────────────────────────────
alter table public.stacks enable row level security;

create policy "stacks: public read public stacks"
  on public.stacks for select
  using (is_public = true or auth.uid() = user_id);

create policy "stacks: owner insert"
  on public.stacks for insert
  with check (auth.uid() = user_id);

create policy "stacks: owner update"
  on public.stacks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "stacks: owner delete"
  on public.stacks for delete
  using (auth.uid() = user_id);

-- ─── stack_servers ─────────────────────────────────────────────────────────
alter table public.stack_servers enable row level security;

create policy "stack_servers: public read"
  on public.stack_servers for select
  using (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_servers.stack_id
        and (stacks.is_public = true or stacks.user_id = auth.uid())
    )
  );

create policy "stack_servers: owner write"
  on public.stack_servers for all
  using (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_servers.stack_id
        and stacks.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_servers.stack_id
        and stacks.user_id = auth.uid()
    )
  );

-- ─── stack_tags ────────────────────────────────────────────────────────────
alter table public.stack_tags enable row level security;

create policy "stack_tags: public read"
  on public.stack_tags for select
  using (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_tags.stack_id
        and (stacks.is_public = true or stacks.user_id = auth.uid())
    )
  );

create policy "stack_tags: owner write"
  on public.stack_tags for all
  using (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_tags.stack_id
        and stacks.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_tags.stack_id
        and stacks.user_id = auth.uid()
    )
  );

-- ─── votes ─────────────────────────────────────────────────────────────────
alter table public.votes enable row level security;

create policy "votes: public read"
  on public.votes for select
  using (true);

create policy "votes: authenticated insert"
  on public.votes for insert
  with check (auth.uid() = user_id);

create policy "votes: owner delete"
  on public.votes for delete
  using (auth.uid() = user_id);
