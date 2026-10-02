-- ============================================================
-- G Interior — Initial Schema Migration
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- Creates: tables, constraints, indexes, triggers, is_admin(), RLS.
-- ============================================================

-- ── Tables ───────────────────────────────────────────────────

-- Admins: links auth.users to admin privileges (one source of truth)
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Agents
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  phone text,
  whatsapp text,
  email text,
  photo_url text,
  bio text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Properties (agent_id references agents, so agents must exist first)
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  price numeric(14, 2) not null check (price >= 0),
  listing_type text not null check (listing_type in ('sale', 'rent', 'lease')),
  property_type text,
  beds integer check (beds >= 0),
  baths integer check (baths >= 0),
  size_sqm integer check (size_sqm >= 0),
  address text,
  city_area text,
  city text not null default 'Lagos',
  description text,
  features text[] not null default '{}',
  images text[] not null default '{}',
  is_featured boolean not null default false,
  status text not null default 'available' check (status in ('available', 'sold', 'rented')),
  lat double precision,
  lng double precision,
  agent_id uuid references public.agents (id) on delete set null,
  views integer not null default 0 check (views >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  property_ref text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Leads (enquiries — contains PII, so anon SELECT is denied)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties (id) on delete set null,
  name text not null,
  email text,
  phone text,
  message text,
  source text not null default 'property',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- Site settings (singleton row, id = 'main')
create table if not exists public.site_settings (
  id text primary key default 'main',
  phone text,
  phone_raw text,
  phone2 text,
  phone2_raw text,
  whatsapp text,
  whatsapp_raw text,
  email text,
  address text,
  address_full text,
  instagram text,
  facebook text,
  twitter text,
  linkedin text,
  tiktok text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────

create index if not exists idx_properties_status_featured on public.properties (status, is_featured);
create index if not exists idx_properties_listing_type on public.properties (listing_type);
create index if not exists idx_properties_price on public.properties (price);
create index if not exists idx_properties_city_area on public.properties (city_area);
create index if not exists idx_properties_created_at on public.properties (created_at desc);
create index if not exists idx_agents_active on public.agents (active);
create index if not exists idx_testimonials_approved on public.testimonials (approved);
create index if not exists idx_leads_property_id on public.leads (property_id);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_created_at on public.leads (created_at desc);

-- ── updated_at trigger ───────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_agents_updated_at on public.agents;
create trigger trg_agents_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ── Admin check function ────────────────────────────────────
-- SECURITY DEFINER so it can read the admins table regardless of RLS.
-- Used by both RLS policies (via is_admin()) and the frontend (via rpc).

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ── Row Level Security ──────────────────────────────────────

alter table public.admins enable row level security;
alter table public.properties enable row level security;
alter table public.agents enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;

-- admins: authenticated users can only see their own row
drop policy if exists "admins_self_select" on public.admins;
create policy "admins_self_select" on public.admins
  for select to authenticated
  using (auth.uid() = user_id);

-- properties: everyone sees available; admins do everything
drop policy if exists "properties_public_select" on public.properties;
create policy "properties_public_select" on public.properties
  for select
  using (status = 'available');

drop policy if exists "properties_admin_all" on public.properties;
create policy "properties_admin_all" on public.properties
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- agents: everyone sees active; admins do everything
drop policy if exists "agents_public_select" on public.agents;
create policy "agents_public_select" on public.agents
  for select
  using (active = true);

drop policy if exists "agents_admin_all" on public.agents;
create policy "agents_admin_all" on public.agents
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- testimonials: everyone sees approved; admins do everything
drop policy if exists "testimonials_public_select" on public.testimonials;
create policy "testimonials_public_select" on public.testimonials
  for select
  using (approved = true);

drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all" on public.testimonials
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- leads: anon can only INSERT new leads (no anon SELECT — PII); admins do everything
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert to anon
  with check (status = 'new');

drop policy if exists "leads_admin_all" on public.leads;
create policy "leads_admin_all" on public.leads
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- site_settings: everyone reads; admins write (INSERT needed for upsert of 'main')
drop policy if exists "site_settings_public_select" on public.site_settings;
create policy "site_settings_public_select" on public.site_settings
  for select
  using (true);

drop policy if exists "site_settings_admin_insert" on public.site_settings;
create policy "site_settings_admin_insert" on public.site_settings
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update" on public.site_settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site_settings_admin_delete" on public.site_settings;
create policy "site_settings_admin_delete" on public.site_settings
  for delete to authenticated
  using (public.is_admin());

-- ── Grants ───────────────────────────────────────────────────
-- Supabase default privileges already grant table access to anon/authenticated;
-- RLS is what actually restricts rows. Explicit grants kept for clarity.

grant select on public.properties, public.agents, public.testimonials, public.site_settings to anon, authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.properties, public.agents, public.testimonials, public.site_settings to authenticated;
grant select on public.admins to authenticated;
