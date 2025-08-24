create or replace function public.team_id_for_user()
returns uuid
language sql
security definer
set search_path = public
as $$
  select team_id from profiles where id = auth.uid();
$$;


create policy "Users can view team members"
on profiles
for select
using (
  team_id is not null
  and team_id = public.team_id_for_user()
);