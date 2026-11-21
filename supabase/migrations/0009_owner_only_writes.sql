-- =============================================================
-- 0009: право записи — только владелице питомника
-- =============================================================
-- ПРИЧИНА
-- Политики из 0001/0006/0008 разрешали запись всей роли `authenticated`.
-- Саморегистрация сейчас ОТКРЫТА в Supabase (disable_signup = false),
-- поэтому зарегистрироваться может любой и получить доступ к правке сайта.
--
-- ЧТО ДЕЛАЕТ
-- 1. Создаёт таблицу public.admins — список тех, кому можно писать.
-- 2. Находит владельца по email в auth.users и добавляет его в admins.
-- 3. Заменяет политики: запись и загрузка файлов — только владельцу.
-- 4. Публичное чтение контента не трогает.
--
-- БЕЗОПАСНОСТЬ ЗАПУСКА
-- - UUID нигде не зашит: владелец ищется по email.
-- - Если email не найден, скрипт ОСТАНАВЛИВАЕТСЯ до изменения политик.
-- - Скрипт идемпотентен: его можно запускать повторно.
-- - Перед заменой политик сохраняются их определения
--   в public._policies_backup_0009 — это точка отката.
--
-- ЗАПУСК: файл выполняется ЦЕЛИКОМ, одним нажатием Run.
-- Всё, что нужно поменять, — EMAIL_ВЛАДЕЛИЦЫ в самом начале.
-- =============================================================


-- =============================================================
-- ШАГ 0. Проверка входных данных
-- =============================================================
do $$
declare
  owner_email text := lower('EMAIL_ВЛАДЕЛИЦЫ@example.ru');
  cnt int;
begin
  if owner_email like '%example.ru%' or position('@' in owner_email) = 0 then
    raise exception 'Замените EMAIL_ВЛАДЕЛИЦЫ@example.ru на реальный адрес Дарьи';
  end if;

  select count(*) into cnt from auth.users u where lower(u.email) = owner_email;

  if cnt = 0 then
    raise exception 'Аккаунт % не найден в auth.users. Откройте Authentication -> Users и сверьте адрес.', owner_email;
  end if;

  if cnt > 1 then
    raise exception 'Найдено % аккаунтов с адресом % — уточните, какой принадлежит Дарье.', cnt, owner_email;
  end if;

  raise notice 'Аккаунт найден: %', owner_email;

  -- Запоминаем email на время сессии SQL Editor, чтобы следующие блоки
  -- не зависели от временных таблиц.
  perform set_config('app.owner_email', owner_email, false);
end;
$$;


-- =============================================================
-- ШАГ 1. Таблица владельцев
-- =============================================================
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admin sees self" on public.admins;
create policy "admin sees self"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

comment on table public.admins is
  'Кто может править сайт. Одно имя — один человек.';


-- =============================================================
-- ШАГ 2. Добавить владелицу в admins
-- =============================================================
-- Если переменная сессии потерялась (например, блоки запускали по отдельности),
-- вставка просто ничего не сделает, а следующий блок выдаст понятную ошибку.
insert into public.admins (user_id, note)
select u.id, 'Владелица питомника'
  from auth.users u
 where lower(u.email) = nullif(current_setting('app.owner_email', true), '')
on conflict (user_id) do nothing;

do $$
begin
  if not exists (select 1 from public.admins) then
    raise exception
      'Владелец не добавлен. Запустите файл целиком: он должен выполняться одним нажатием Run.';
  end if;
end;
$$;


-- =============================================================
-- ШАГ 3. Функция «это владелец»
-- =============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;


-- =============================================================
-- ШАГ 4. Резервная копия текущих политик (точка отката)
-- =============================================================
create table if not exists public._policies_backup_0009 (
  schemaname text,
  tablename  text,
  policyname text,
  cmd        text,
  roles      text[],
  qual       text,
  with_check text,
  saved_at   timestamptz not null default now()
);

-- Пишем ровно один раз: повторный запуск не перезапишет исходное состояние.
insert into public._policies_backup_0009
  (schemaname, tablename, policyname, cmd, roles, qual, with_check)
select schemaname, tablename, policyname, cmd, roles, qual, with_check
  from pg_policies
 where ((schemaname = 'public' and tablename in
         ('site_content','dogs','puppies','posts','graduates','faq_items'))
     or (schemaname = 'storage' and tablename = 'objects'))
   and not exists (select 1 from public._policies_backup_0009);


-- =============================================================
-- ШАГ 5. Замена политик: запись — только владельцу
-- =============================================================
do $$
declare
  t text;
begin
  foreach t in array array['site_content','dogs','puppies','posts','graduates','faq_items']
  loop
    -- Старые политики записи из 0001/0006/0007/0008.
    execute format('drop policy if exists %I on public.%I', 'auth full access ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth insert ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth update ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth delete ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth read all ' || t, t);

    -- Политика владельца. drop перед create — идемпотентность.
    execute format('drop policy if exists %I on public.%I', 'owner full access ' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated '
      'using (public.is_admin()) with check (public.is_admin())',
      'owner full access ' || t, t
    );
  end loop;
end;
$$;


-- =============================================================
-- ШАГ 6. Storage: загрузка и удаление фото — только владельцу
-- =============================================================
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'storage' and tablename = 'objects') then
    drop policy if exists "auth insert photos" on storage.objects;
    drop policy if exists "auth update photos" on storage.objects;
    drop policy if exists "auth delete photos" on storage.objects;
    drop policy if exists "owner insert photos" on storage.objects;
    drop policy if exists "owner update photos" on storage.objects;
    drop policy if exists "owner delete photos" on storage.objects;

    -- Публичное чтение файлов остаётся: фото показываются на сайте.
    create policy "owner insert photos"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'photos' and public.is_admin());

    create policy "owner update photos"
      on storage.objects for update to authenticated
      using (bucket_id = 'photos' and public.is_admin())
      with check (bucket_id = 'photos' and public.is_admin());

    create policy "owner delete photos"
      on storage.objects for delete to authenticated
      using (bucket_id = 'photos' and public.is_admin());
  end if;
end;
$$;


-- =============================================================
-- ШАГ 7. Итоговое сообщение
-- =============================================================
do $$
begin
  raise notice 'Готово: владелец в public.admins, политики записи только для него.';
end;
$$;


-- =============================================================
-- ШАГ 8. ПРОВЕРКА. Запустите эти запросы отдельно.
-- =============================================================

-- 8.1 Владелец добавлен (ожидаем 1 строку):
-- select user_id, note, created_at from public.admins;

-- 8.2 Политики записи: у каждой таблицы ровно одна "owner full access ...":
-- select schemaname, tablename, policyname, cmd, roles::text
--   from pg_policies
--  where schemaname in ('public', 'storage')
--    and cmd in ('INSERT','UPDATE','DELETE','ALL')
--  order by schemaname, tablename, policyname;

-- 8.3 Публичное чтение не сломано:
-- select tablename, policyname from pg_policies
--  where schemaname = 'public' and cmd = 'SELECT' order by tablename;

-- 8.4 Защитные таблицы существуют:
-- select relname, relrowsecurity from pg_class
--  where relname in ('admins','_policies_backup_0009');


-- =============================================================
-- ОТКАТ
-- =============================================================
-- Если админка перестала сохранять:
--   1) 8.1 должна вернуть ВАШУ строку;
--   2) войдите в панель и выполните: select public.is_admin(); — должно быть true.
--
-- Если true нет, в admins лежит чужой UUID. Исправьте:
--
--   delete from public.admins;
--   insert into public.admins (user_id, note)
--   select id, 'Владелица' from auth.users
--    where lower(email) = lower('EMAIL_ДАРЬИ');
--
-- Полный откат (НЕ рекомендуется: снова открывает запись всем зарегистрированным):
--
-- do $$
-- declare t text;
-- begin
--   foreach t in array array['site_content','dogs','puppies','posts','graduates','faq_items']
--   loop
--     execute format('drop policy if exists %I on public.%I', 'owner full access ' || t, t);
--     execute format(
--       'create policy %I on public.%I for all to authenticated using (true) with check (true)',
--       'auth full access ' || t, t);
--   end loop;
-- end;
-- $$;
