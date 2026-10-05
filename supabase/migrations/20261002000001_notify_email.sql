-- Lead notifications: extra recipient for new-lead emails.
-- Editable in Admin -> Settings ("Notification Email").
-- Nullable — empty means "admin accounts only".

alter table public.site_settings
  add column if not exists notify_email text;
