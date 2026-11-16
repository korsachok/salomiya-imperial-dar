-- =============================================================
-- Storage для фото собак и щенков (CMS)
-- Выполнить в Supabase: SQL Editor -> Run
-- =============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read photos" on storage.objects;
create policy "public read photos"
  on storage.objects for select
  using (bucket_id = 'photos');

drop policy if exists "auth insert photos" on storage.objects;
create policy "auth insert photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');

drop policy if exists "auth update photos" on storage.objects;
create policy "auth update photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'photos')
  with check (bucket_id = 'photos');

drop policy if exists "auth delete photos" on storage.objects;
create policy "auth delete photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos');

-- =============================================================
-- Шаг 1: создать пользователя Дарьи
-- Authentication -> Users -> Add user
--   email: daria@salomiya-dar.ru (любой), пароль: длинный случайный
--   галочка "Auto Confirm User" должна быть включена
-- Затем в Authentication -> Providers -> Email выключить "Enable sign ups"
-- (или Authentication -> Settings -> "Allow new users to sign up" = off)
-- =============================================================

-- Шаг 2 (опционально): ограничить запись только её аккаунтом.
-- Скопируйте UUID из Authentication -> Users и раскомментируйте —
-- заменив этим пару политик "auth full access ..." из 0001_init.sql.

-- drop policy if exists "auth full access dogs" on public.dogs;
-- create policy "auth full access dogs"
--   on public.dogs for all to authenticated
--   using (auth.uid() = 'UUID_ДАРЬИ'::uuid)
--   with check (auth.uid() = 'UUID_ДАРЬИ'::uuid);
