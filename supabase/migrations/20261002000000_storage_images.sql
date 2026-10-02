-- ============================================================
-- G Interior — Storage (image uploads for properties & agents)
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- Creates: public "media" bucket + storage.objects RLS policies.
-- Folder prefixes: properties/, agents/ (no separate buckets).
-- ============================================================

-- Bucket: public so every public render site keeps working with
-- plain public URLs (no signed URLs, no render-site changes).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- storage.objects RLS: everyone (anon included) reads;
-- only admins write. Reuses public.is_admin() from init migration.

drop policy if exists "media_public_select" on storage.objects;
create policy "media_public_select" on storage.objects
  for select
  using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
