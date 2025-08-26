alter table products
add column title_description tsvector generated always as (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B')
) stored;

create index products_title_description_idx
  on products
  using gin (title_description);
