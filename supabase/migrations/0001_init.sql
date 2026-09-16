-- Nexa Code Project Quote System — initial schema
-- All monetary/config values live in pricing_config, which is never granted
-- to the anon or authenticated roles (service_role bypasses RLS by default).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type project_category as enum (
  'informational',
  'ecommerce',
  'booking',
  'membership',
  'web_application'
);

create type web_app_subtype as enum (
  'saas',
  'marketplace',
  'client_portal',
  'admin_dashboard',
  'custom_web_app',
  'custom_software'
);

create type build_modifier as enum ('new_build', 'redesign');
create type design_modifier as enum ('templated', 'bespoke');

create type complexity_band as enum ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');
create type risk_band as enum ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

create type quote_status as enum (
  'NEW',
  'ASSESSED',
  'NEEDS_REVIEW',
  'CONSULTATION_SCHEDULED',
  'CONSULTATION_COMPLETE',
  'QUOTE_DRAFT',
  'QUOTE_SENT',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED'
);

create type invoice_status as enum ('unpaid', 'partial', 'paid', 'overdue', 'void');

-- ---------------------------------------------------------------------------
-- Staff (admin dashboard access)
-- ---------------------------------------------------------------------------

create table staff_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'staff')),
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from staff_profiles where id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Quote requests (the Project Assessment record)
-- ---------------------------------------------------------------------------

create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  client_name text,
  client_email text,
  client_phone text,
  client_company text,

  category project_category not null,
  web_app_subtype web_app_subtype,
  build_modifier build_modifier not null default 'new_build',
  design_modifier design_modifier not null default 'templated',

  questionnaire jsonb not null default '{}'::jsonb,

  complexity_score numeric,
  complexity_band complexity_band,
  risk_score numeric,
  risk_band risk_band,

  red_flag boolean not null default false,
  red_flag_reasons jsonb not null default '[]'::jsonb,

  estimated_hours jsonb,
  estimated_price_low numeric,
  estimated_price_high numeric,
  estimated_timeline_weeks_low int,
  estimated_timeline_weeks_high int,

  status quote_status not null default 'NEW',
  admin_notes text,
  assigned_to uuid references staff_profiles (id)
);

create index quote_requests_status_idx on quote_requests (status);
create index quote_requests_created_at_idx on quote_requests (created_at desc);

-- ---------------------------------------------------------------------------
-- Consultations
-- ---------------------------------------------------------------------------

create table consultations (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references quote_requests (id) on delete cascade,
  created_at timestamptz not null default now(),

  requested_at timestamptz,
  scheduled_at timestamptz,

  contact_name text,
  contact_email text,
  contact_phone text,

  status text not null default 'REQUESTED',
  notes text
);

create index consultations_quote_request_id_idx on consultations (quote_request_id);

-- ---------------------------------------------------------------------------
-- Official quotations
-- ---------------------------------------------------------------------------

create table official_quotes (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references quote_requests (id) on delete cascade,
  created_at timestamptz not null default now(),

  quote_number text not null unique,
  issued_date date not null default current_date,
  validity_days int not null default 14,

  final_scope text,
  deliverables jsonb not null default '[]'::jsonb,
  timeline_text text,

  price_total numeric,
  deposit_amount numeric,
  balance_amount numeric,
  terms text,

  status text not null default 'DRAFT',
  access_token uuid not null default gen_random_uuid() unique,

  sent_at timestamptz,
  accepted_at timestamptz
);

create index official_quotes_quote_request_id_idx on official_quotes (quote_request_id);

create table quote_line_items (
  id uuid primary key default gen_random_uuid(),
  official_quote_id uuid not null references official_quotes (id) on delete cascade,
  description text not null,
  amount numeric not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------

create table invoices (
  id uuid primary key default gen_random_uuid(),
  official_quote_id uuid not null references official_quotes (id) on delete cascade,
  created_at timestamptz not null default now(),

  invoice_number text not null unique,
  subtotal numeric not null,
  tax_amount numeric not null default 0,
  total numeric not null,
  amount_due numeric not null,
  balance numeric not null default 0,

  due_date date,
  status invoice_status not null default 'unpaid',
  payment_instructions text
);

create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices (id) on delete cascade,
  description text not null,
  amount numeric not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Feedback loop (estimate vs. actual)
-- ---------------------------------------------------------------------------

create table project_actuals (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references quote_requests (id) on delete cascade,
  created_at timestamptz not null default now(),

  estimated_hours jsonb,
  final_approved_hours jsonb,
  actual_hours jsonb,

  estimated_price_low numeric,
  estimated_price_high numeric,
  final_price numeric,

  project_start_date date,
  completion_date date,
  duration_days int
);

-- ---------------------------------------------------------------------------
-- Pricing configuration (server-side only — never exposed to the browser)
-- ---------------------------------------------------------------------------

create table pricing_config (
  id int primary key default 1 check (id = 1),
  config jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references staff_profiles (id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table staff_profiles enable row level security;
alter table quote_requests enable row level security;
alter table consultations enable row level security;
alter table official_quotes enable row level security;
alter table quote_line_items enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table project_actuals enable row level security;
alter table pricing_config enable row level security;

-- staff_profiles: a staff member can read their own row; no anon/authenticated
-- writes at all (accounts are provisioned manually via the Supabase dashboard
-- or a service-role script, never through the app).
create policy "staff can read own profile"
  on staff_profiles for select
  using (id = auth.uid());

-- quote_requests / consultations: no anon or authenticated policies exist for
-- insert — submissions happen exclusively through Edge Functions using the
-- service role key, which bypasses RLS entirely. Staff can read/update everything.
create policy "staff can read quote_requests"
  on quote_requests for select
  using (is_staff());

create policy "staff can update quote_requests"
  on quote_requests for update
  using (is_staff());

create policy "staff can read consultations"
  on consultations for select
  using (is_staff());

create policy "staff can update consultations"
  on consultations for update
  using (is_staff());

create policy "staff can read official_quotes"
  on official_quotes for select
  using (is_staff());

create policy "staff can write official_quotes"
  on official_quotes for all
  using (is_staff())
  with check (is_staff());

create policy "staff can read quote_line_items"
  on quote_line_items for select
  using (is_staff());

create policy "staff can write quote_line_items"
  on quote_line_items for all
  using (is_staff())
  with check (is_staff());

create policy "staff can read invoices"
  on invoices for select
  using (is_staff());

create policy "staff can write invoices"
  on invoices for all
  using (is_staff())
  with check (is_staff());

create policy "staff can read invoice_line_items"
  on invoice_line_items for select
  using (is_staff());

create policy "staff can write invoice_line_items"
  on invoice_line_items for all
  using (is_staff())
  with check (is_staff());

create policy "staff can read project_actuals"
  on project_actuals for select
  using (is_staff());

create policy "staff can write project_actuals"
  on project_actuals for all
  using (is_staff())
  with check (is_staff());

-- pricing_config: intentionally NO policies for anon or authenticated roles.
-- Only the service_role (used exclusively inside Edge Functions) can read or
-- write this table. This is the enforcement point for "never expose internal
-- pricing configuration to the browser" — even a client-side bug cannot leak
-- it, because there is no grant path for it to travel through.

insert into pricing_config (id, config) values (1, '{}'::jsonb);
