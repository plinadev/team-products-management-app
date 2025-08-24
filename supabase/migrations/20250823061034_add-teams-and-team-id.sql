-- Create teams table
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add team_id to profiles
alter table profiles
add column team_id uuid references teams(id) on delete set null;


-- RLS for teams
alter table teams enable row level security;

-- Only team members (via profiles.team_id) can see their team
create policy "Team members can select their team"
on teams for select
using ( id = (select team_id from profiles where id = auth.uid()) );

-- Only the creator can update/delete the team
create policy "Team creator can manage their team"
on teams for all
using ( created_by = auth.uid() );

-- Allow users to insert teams they create
create policy "Users can create their own teams"
on teams for insert
with check (auth.uid() = created_by);

-- A user can set their own team_id
create policy "Users can set their own team_id"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);