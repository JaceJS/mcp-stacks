-- Grant table-level permissions to anon and authenticated roles.
-- RLS policies control row-level access, but GRANT controls table-level access.
-- Tables created via SQL migrations do not get these grants automatically.

-- SELECT: all public tables readable by everyone (RLS filters rows)
grant select on public.stacks        to anon, authenticated;
grant select on public.users         to anon, authenticated;
grant select on public.servers       to anon, authenticated;
grant select on public.stack_servers to anon, authenticated;
grant select on public.stack_tags    to anon, authenticated;
grant select on public.votes         to anon, authenticated;
grant select on public.tags          to anon, authenticated;

-- WRITE: authenticated users need table-level grants; RLS policies enforce row-level restrictions.
-- Without these GRANTs, PostgreSQL returns 42501 even when an RLS policy would allow the operation.
grant insert, update, delete on public.stacks        to authenticated;
grant insert, update, delete on public.stack_servers to authenticated;
grant insert, update, delete on public.stack_tags    to authenticated;
grant insert, delete         on public.votes         to authenticated;
grant update                 on public.users         to authenticated;
