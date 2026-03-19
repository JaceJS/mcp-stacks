create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, avatar_url, display_name)
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data->>'email', new.id::text),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'user_name'
    )
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    raise warning 'handle_new_user: failed for %. Error: %', new.id, sqlerrm;
    return new;
end;
$$;
