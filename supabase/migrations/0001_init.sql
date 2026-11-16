-- =============================================================
-- Salomiya Imperial Dar — схема БД (Шаг 1.2)
-- Выполнить целиком в Supabase: SQL Editor -> New query -> Run
-- =============================================================

create extension if not exists "pgcrypto";
create extension if not exists "moddatetime";

-- ---------- 1. Универсальные контент-блоки (тексты) ----------
-- Каждый редактируемый текст на сайте = одна строка.
-- content = { "ru": "...", "en": "..." }, ключи языков можно менять.
create table if not exists public.site_content (
  key         text primary key,                 -- напр. 'hero.title'
  content     jsonb not null default '{}'::jsonb,
  group_name  text not null default 'general',  -- группировка в CMS: hero, about, contacts...
  label       text,                             -- подпись для владельца в CMS
  updated_at  timestamptz not null default now()
);

comment on table public.site_content is 'Тексты сайта. Ключ -> JSON со значениями по языкам.';

-- ---------- 2. Взрослые собаки ----------
create table if not exists public.dogs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  sex           text check (sex in ('male', 'female')),
  birth_date    date,
  color         text,
  title         text,                           -- титулы: ЧРКФ, ЮЧРКФ...
  description   jsonb not null default '{}'::jsonb,  -- { "ru": "...", "en": "..." }
  photos        text[] not null default '{}',   -- пути: /images/dogs/...
  main_photo    text,
  father_name   text,
  mother_name   text,
  is_active     boolean not null default true,  -- показывать на сайте
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists dogs_active_sort_idx
  on public.dogs (is_active, sort_order);

-- ---------- 3. Щенки ----------
create table if not exists public.puppies (
  id            uuid primary key default gen_random_uuid(),
  name          text,
  slug          text unique,
  sex           text check (sex in ('male', 'female')),
  birth_date    date,
  color         text,
  litter_name   text,                           -- помёт / кличка помёта
  description   jsonb not null default '{}'::jsonb,
  photos        text[] not null default '{}',
  main_photo    text,
  price         numeric(10, 2),
  status        text not null default 'available'
                check (status in ('available', 'reserved', 'sold', 'archived')),
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists puppies_active_sort_idx
  on public.puppies (is_active, status, sort_order);

-- ---------- 4. Автообновление updated_at ----------
drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function moddatetime(updated_at);

drop trigger if exists dogs_updated_at on public.dogs;
create trigger dogs_updated_at
  before update on public.dogs
  for each row execute function moddatetime(updated_at);

drop trigger if exists puppies_updated_at on public.puppies;
create trigger puppies_updated_at
  before update on public.puppies
  for each row execute function moddatetime(updated_at);

-- ---------- 5. RLS: читают все, пишет только админ ----------
alter table public.site_content enable row level security;
alter table public.dogs         enable row level security;
alter table public.puppies      enable row level security;

drop policy if exists "public read site_content" on public.site_content;
create policy "public read site_content"
  on public.site_content for select
  using (true);

drop policy if exists "public read visible dogs" on public.dogs;
create policy "public read visible dogs"
  on public.dogs for select
  using (is_active = true);

drop policy if exists "public read visible puppies" on public.puppies;
create policy "public read visible puppies"
  on public.puppies for select
  using (is_active = true and status <> 'archived');

-- Полный доступ (включая скрытые записи) — только вошедшим пользователям.
-- Владелица создаётся в Authentication -> Users (email + пароль),
-- саморегистрацию оставьте выключенной.
drop policy if exists "auth full access site_content" on public.site_content;
create policy "auth full access site_content"
  on public.site_content for all
  to authenticated
  using (true) with check (true);

drop policy if exists "auth full access dogs" on public.dogs;
create policy "auth full access dogs"
  on public.dogs for all
  to authenticated
  using (true) with check (true);

drop policy if exists "auth full access puppies" on public.puppies;
create policy "auth full access puppies"
  on public.puppies for all
  to authenticated
  using (true) with check (true);

-- ---------- 6. Стартовые тексты ----------
insert into public.site_content (key, group_name, label, content) values
  ('hero.title',    'hero',     'Заголовок на главной',  '{"ru": "Питомник Salomiya Imperial Dar"}'::jsonb),
  ('hero.subtitle', 'hero',     'Подзаголовок',          '{"ru": "Русские псовые борзые"}'::jsonb),
  ('about.text',    'about',    'Текст «О питомнике»',   '{"ru": ""}'::jsonb),
  ('contacts.phone','contacts', 'Телефон',               '{"ru": ""}'::jsonb),
  ('contacts.email','contacts', 'E-mail',                '{"ru": ""}'::jsonb),
  ('contacts.social','contacts','Ссылки на соцсети',     '{"ru": ""}'::jsonb)
on conflict (key) do nothing;
