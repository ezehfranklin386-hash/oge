-- ============================================================
-- G Interior — Property video support
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- Adds a single optional video URL per property (uploaded file
-- in the public "media" bucket, or a pasted YouTube/Vimeo link).
-- Storage RLS needs no change: the media bucket policies are
-- bucket-wide (see 20261002000000_storage_images.sql).
-- ============================================================

alter table public.properties
  add column if not exists video_url text;
