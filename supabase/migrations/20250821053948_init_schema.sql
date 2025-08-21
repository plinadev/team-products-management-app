-- Create profiles table
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  first_name text,
  last_name text,
  avatar_url text,
  role text check (role in ('member', 'admin')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Policy: a user can see their own profile
create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

-- Policy: a user can insert their own profile
create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

-- Policy: a user can update their own profile
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);
