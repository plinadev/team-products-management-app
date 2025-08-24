-- Allow users to find a team by invite code (for joining)
create policy "Users can find team by invite code"
on teams for select
using ( invite_code is not null );
