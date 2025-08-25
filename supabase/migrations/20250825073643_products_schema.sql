
do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type product_status as enum ('draft', 'active', 'deleted');
  end if;
end$$;


create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  status product_status not null default 'draft',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);


create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_products_touch_updated_at on public.products;
create trigger trg_products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

-- Lifecycle enforcement trigger
-- Rules:
--  - 'draft'  : fully editable; can change to 'active' or 'deleted'
--  - 'active' : can't edit any fields (except allow change to 'deleted')
--  - 'deleted': no further changes
--  - team_id and created_by are immutable after insert
create or replace function public.enforce_product_lifecycle()
returns trigger
language plpgsql
as $$
begin
  if new.team_id <> old.team_id then
    raise exception 'team_id is immutable' using errcode = '23514';
  end if;
  if new.created_by <> old.created_by then
    raise exception 'created_by is immutable' using errcode = '23514';
  end if;

  if old.status = 'deleted' then
    raise exception 'deleted products cannot be modified' using errcode = '23514';
  end if;

  if old.status = 'active' then
    if new.status = 'deleted' then
      if new.title <> old.title
         or new.description is distinct from old.description
         or new.image_url is distinct from old.image_url then
        raise exception 'active products cannot be edited (only status -> deleted allowed)' using errcode = '23514';
      end if;
      return new;
    else
      if new is distinct from old then
        raise exception 'active products are read-only' using errcode = '23514';
      end if;
    end if;
  end if;


  return new;
end;
$$;

drop trigger if exists trg_products_lifecycle on public.products;
create trigger trg_products_lifecycle
before update on public.products
for each row execute function public.enforce_product_lifecycle();

alter table public.products enable row level security;


drop policy if exists "Teammates can select products" on public.products;
create policy "Teammates can select products"
on public.products
for select
using ( team_id = public.team_id_for_user() );

drop policy if exists "Insert products into own team" on public.products;
create policy "Insert products into own team"
on public.products
for insert
with check (
  team_id = public.team_id_for_user()
  and created_by = auth.uid()
);


drop policy if exists "Teammates can update products" on public.products;
create policy "Teammates can update products"
on public.products
for update
using ( team_id = public.team_id_for_user() )
with check ( team_id = public.team_id_for_user() );


drop policy if exists "Delete products" on public.products;


create index if not exists idx_products_team_created_at
  on public.products (team_id, created_at desc);

create index if not exists idx_products_team_status
  on public.products (team_id, status);

create index if not exists idx_products_created_by
  on public.products (created_by);
