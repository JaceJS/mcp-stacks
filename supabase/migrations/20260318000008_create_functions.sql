-- Migration: create_functions
-- Database functions and triggers for business logic.

-- ─── slugify ───────────────────────────────────────────────────────────────
-- Converts a string to a URL-safe slug.
-- Usage: select slugify('Hello World!') → 'hello-world'

create or replace function public.slugify(value text)
returns text
language plpgsql
immutable strict
as $$
begin
  return lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(trim(value), '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
end;
$$;

-- ─── get_vote_count ────────────────────────────────────────────────────────
-- Returns the number of votes for a given stack.

create or replace function public.get_vote_count(stack_id uuid)
returns bigint
language sql
stable
as $$
  select count(*) from public.votes where votes.stack_id = $1;
$$;
