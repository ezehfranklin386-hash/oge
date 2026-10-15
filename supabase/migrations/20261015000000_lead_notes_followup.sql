-- Lead notes + follow-up date for the admin Leads section.
-- Run in the Supabase SQL Editor (or supabase db push). Additive only.

alter table public.leads
  add column if not exists notes text;

alter table public.leads
  add column if not exists follow_up_date date;
