-- MVP events schema for site + Telegram Mini App.
-- Data is read via Next.js API (/api/events), not directly from client-side Supabase SDK.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.events (
  id text primary key,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  city text not null,
  venue text not null,
  address text,
  lat double precision,
  lng double precision,
  category text not null default 'event',
  duration_min integer,
  price_min numeric,
  price_max numeric,
  currency text,
  tags_json jsonb not null default '[]'::jsonb,
  image text,
  description text,
  url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_category_check check (category in ('event', 'cafe', 'walk', 'place')),
  constraint events_currency_check check (currency is null or currency in ('RUB', 'EUR', 'USD')),
  constraint events_ends_at_after_starts_at_check check (ends_at is null or ends_at >= starts_at),
  constraint events_price_min_lte_price_max_check check (price_min is null or price_max is null or price_min <= price_max),
  constraint events_lat_range_check check (lat is null or (lat >= -90 and lat <= 90)),
  constraint events_lng_range_check check (lng is null or (lng >= -180 and lng <= 180))
);

create index if not exists events_published_starts_at_id_idx
  on public.events (starts_at asc, id asc)
  where is_published = true;

create index if not exists events_published_category_starts_at_id_idx
  on public.events (category, starts_at asc, id asc)
  where is_published = true;

create index if not exists events_published_price_min_idx
  on public.events (price_min)
  where is_published = true and price_min is not null;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

alter table public.events enable row level security;

-- No anon/auth policies in MVP on purpose.
-- Events are served by the Next.js API using server-side DATABASE_URL.

insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;
