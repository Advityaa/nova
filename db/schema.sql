-- Nova Events — database schema (Vercel Postgres / Neon)
-- Money is always stored as integer `fen` (RMB cents). Never floats.
-- Run with: npm run db:migrate

create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ------------------------------------------------------------------
-- events
-- ------------------------------------------------------------------
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  type         text not null,                 -- e.g. Techno / Rooftop / Pool (display + mood key)
  color        text not null,                 -- mood/accent color (hex), drives --cardc / --accent
  accent_ink   text not null default '#ffffff', -- ink paired with `color` (drawer/hero accent-ink) [added: needed for identical look]
  lineup       text,
  venue        text,
  area         text,
  address      text,
  weekday      text,                          -- display weekday label e.g. "FRI" [added: source labels are non-calendar]
  starts_at    timestamptz,                   -- real start datetime; DD.MM shown in UI is derived from this
  doors        text,                          -- display door/time range e.g. "20:00–02:00"
  status       text not null default 'draft'
               check (status in ('draft','onsale','soldout','past')),
  status_label text,                          -- marketing badge on cards e.g. "Selling fast" [added: preserve exact chip text]
  hero_image   text,
  description  text,
  featured     boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists events_status_idx    on events (status);
create index if not exists events_starts_at_idx  on events (starts_at);
create index if not exists events_featured_idx   on events (featured);

-- ------------------------------------------------------------------
-- ticket_tiers
-- ------------------------------------------------------------------
create table if not exists ticket_tiers (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events (id) on delete cascade,
  name        text not null,
  description text,
  price_fen   integer not null,               -- RMB cents. ¥118 => 11800
  capacity    integer,
  sold        integer not null default 0,
  sort        integer not null default 0
);

create index if not exists ticket_tiers_event_idx on ticket_tiers (event_id, sort);

-- ------------------------------------------------------------------
-- gallery_images
-- ------------------------------------------------------------------
create table if not exists gallery_images (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete set null,
  url        text not null,
  caption    text,
  sort       integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_sort_idx on gallery_images (sort);

-- ------------------------------------------------------------------
-- enquiries (contact form submissions)
-- ------------------------------------------------------------------
create table if not exists enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  company    text,
  email      text,
  contact    text not null,
  event_type text,
  message    text,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_idx on enquiries (created_at desc);

-- ------------------------------------------------------------------
-- sponsors (optional)
-- ------------------------------------------------------------------
create table if not exists sponsors (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  logo_url text,
  sort     integer not null default 0
);

-- ------------------------------------------------------------------
-- orders + order_items (checkout pipeline)
-- ------------------------------------------------------------------
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid references events (id) on delete set null,
  customer_name text not null,
  email         text,
  phone         text,
  amount_fen    integer not null,               -- RMB cents, computed server-side from tier prices
  status        text not null default 'pending'
                check (status in ('pending','paid','failed')),
  provider      text not null default 'mock',
  provider_ref  text,
  created_at    timestamptz not null default now(),
  paid_at       timestamptz
);

create index if not exists orders_status_idx  on orders (status);
create index if not exists orders_created_idx  on orders (created_at desc);

create table if not exists order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders (id) on delete cascade,
  tier_id        uuid references ticket_tiers (id) on delete set null,
  qty            integer not null,
  unit_price_fen integer not null                -- snapshot of the tier price at purchase time
);

create index if not exists order_items_order_idx on order_items (order_id);

-- ------------------------------------------------------------------
-- users (admin auth)
-- ------------------------------------------------------------------
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  role          text not null default 'admin'
                check (role in ('owner','admin')),
  name          text,
  created_at    timestamptz not null default now()
);

create index if not exists users_email_idx on users (lower(email));

alter table enquiries add column if not exists email text;
