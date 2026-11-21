-- =============================================================
-- 0009: права на запись — только владелице питомника
-- =============================================================
-- ПРИЧИНА
-- Политики из 0001/0006/0008 разрешали запись роли `authenticated`
-- целиком. Саморегистрация выключена в дашборде, но это настройка,
-- а не гарантия: при её случайном включении любой зарегистрировавшийся
-- пользователь получал права редактировать весь сайт и загружать файлы.
--
-- ЧТО ДЕЛАЕТ
-- Добавляет политики, требующие совпадения auth.uid() с UUID владельца.
-- UUID НЕ ЗАШИТ В ФАЙЛ: он берётся из таблицы `public.admins`.
-- Старые политики удаляются ТОЛЬКО после того, как новые созданы
-- и владелец добавлен в `admins`. Если таблица `admins` пуста,
-- миграция завершится ошибкой и НИЧЕГО не изменит.
--
-- ПОРЯДОК ЗАПУСКА (SQL Editor, по одному блоку)
--   1. Блок 1 — создать таблицу admins (безопасно, ничего не ломает).
--   2. Блок 2 — вставить UUID владельца (см. инструкцию внизу).
--   3. Блок 3 — заменить политики.
--   4. Блок 4 — проверка.
--
-- ОТКАТ: см. блок 5 в конце файла.
-- =============================================================


-- ---------- БЛОК 1: таблица владельцев ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Владелец видит только свою строку. Анонимам таблица недоступна.
drop policy if exists "admin sees self" on public.admins;
create policy "admin sees self"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

comment on table public.admins is
  'Список аккаунтов с правом редактировать сайт. Одно имя — один человек.';


-- ---------- БЛОК 2: кто владелец ----------
-- UUID берётся из Supabase: Authentication -> Users -> колонка UID.
-- НЕ подставляйте UUID «на глаз» — скопируйте из дашборда.
--
-- insert into public.admins (user_id, note)
-- values ('00000000-0000-0000-0000-000000000000'::uuid, 'Дарья, владелица')
-- on conflict (user_id) do nothing;
--
-- Проверка: должна вернуться ровно 1 строка.
-- select user_id, note from public.admins;


-- ---------- БЛОК 3: заменить политики ----------
-- Запускать ТОЛЬКО после блока 2.
do $$
begin
  if not exists (select 1 from public.admins) then
    raise exception 'public.admins пуста: сначала выполните БЛОК 2 с UUID владельца';
  end if;
end;
$$;

-- Общая проверка «это владелец» для всех таблиц.
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


-- --- Контент: тексты, собаки, щенки, посты, выпускники, FAQ ---
do $$
declare
  t text;
begin
  foreach t in array array['site_content', 'dogs', 'puppies', 'posts', 'graduates', 'faq_items']
  loop
    execute format('drop policy if exists %I on public.%I', 'auth full access ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth insert ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth update ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth delete ' || t, t);
    execute format('drop policy if exists %I on public.%I', 'auth read all ' || t, t);

    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      'owner full access ' || t, t
    );
  end loop;
end;
$$;


-- --- Storage: писать в бакет photos может только владелец ---
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'storage' and tablename = 'objects') then
    drop policy if exists "auth insert photos" on storage.objects;
    drop policy if exists "auth update photos" on storage.objects;
    drop policy if exists "auth delete photos" on storage.objects;

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


-- ---------- БЛОК 4: проверка ----------
-- 4.1 Ни одной политики, пускающей запись кому попало:
-- select tablename, policyname, cmd, roles::text
--   from pg_policies
--  where schemaname in ('public','storage')
--    and cmd in ('INSERT','UPDATE','DELETE','ALL')
--  order by tablename, policyname;
-- Ожидание: у каждой таблицы ровно одна политика владельца (или политика
-- storage с public.is_admin()).

-- 4.2 Публичное чтение на месте:
-- select tablename, policyname, cmd from pg_policies
--  where schemaname = 'public' and cmd = 'SELECT' order by tablename;


-- ---------- БЛОК 5: откат ----------
-- Если после миграции админка перестала сохранять:
--   1) убедитесь, что UUID в public.admins совпадает с UID в Authentication;
--   2) посмотрите ошибку в браузере (F12 -> Network -> ответ сервера).
-- Полный откат к прежнему поведению (НЕ рекомендуется) — раскомментируйте:
--
-- do $$
-- declare t text;
-- begin
--   foreach t in array array['site_content','dogs','puppies','posts','graduates','faq_items']
--   loop
--     execute format('drop policy if exists %I on public.%I', 'owner full access ' || t, t);
--     execute format('create policy %I on public.%I for all to authenticated using (true) with check (true)',
--                    'auth full access ' || t, t);
--   end loop;
-- end; $$;
