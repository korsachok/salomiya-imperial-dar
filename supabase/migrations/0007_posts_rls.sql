-- Политика INSERT/UPDATE/DELETE для постов: только авторизованным.
-- Выполнить в Supabase: SQL Editor -> Run
-- (идемпотентно, можно запускать повторно)

alter table public.posts enable row level security;

drop policy if exists "auth read all posts" on public.posts;
create policy "auth read all posts"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "auth insert posts" on public.posts;
create policy "auth insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

drop policy if exists "auth update posts" on public.posts;
create policy "auth update posts"
  on public.posts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "auth delete posts" on public.posts;
create policy "auth delete posts"
  on public.posts for delete
  to authenticated
  using (true);

-- Проверить, какие политики сейчас есть:
-- select policyname, cmd, roles, qual, with_check
--   from pg_policies where schemaname = 'public' and tablename = 'posts';
