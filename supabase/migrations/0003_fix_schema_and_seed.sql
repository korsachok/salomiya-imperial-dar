-- =============================================================
-- Догоняем схему (равняем на supabase/migrations/0001_init.sql)
-- Выполнить целиком в Supabase: SQL Editor -> Run
-- =============================================================

alter table public.dogs
  add column if not exists slug          text,
  add column if not exists sex           text,
  add column if not exists birth_date    date,
  add column if not exists title         text,
  add column if not exists photos        text[] not null default '{}',
  add column if not exists main_photo    text,
  add column if not exists father_name   text,
  add column if not exists mother_name   text,
  add column if not exists sort_order    integer not null default 0,
  add column if not exists updated_at    timestamptz not null default now();

alter table public.puppies
  add column if not exists slug          text,
  add column if not exists sex           text,
  add column if not exists birth_date    date,
  add column if not exists litter_name   text,
  add column if not exists photos        text[] not null default '{}',
  add column if not exists main_photo    text,
  add column if not exists price         numeric(10, 2),
  add column if not exists sort_order    integer not null default 0,
  add column if not exists updated_at    timestamptz not null default now();

-- Ограничения (пропускаем, если такие уже есть)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dogs_sex_check') then
    alter table public.dogs
      add constraint dogs_sex_check check (sex in ('male', 'female'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'puppies_sex_check') then
    alter table public.puppies
      add constraint puppies_sex_check check (sex in ('male', 'female'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'puppies_status_check') then
    alter table public.puppies
      add constraint puppies_status_check
      check (status in ('available', 'reserved', 'sold', 'archived'));
  end if;
end $$;

create unique index if not exists dogs_slug_key on public.dogs (slug);
create unique index if not exists puppies_slug_key on public.puppies (slug);
create index if not exists dogs_active_sort_idx on public.dogs (is_active, sort_order);
create index if not exists puppies_active_sort_idx on public.puppies (is_active, status, sort_order);

-- Триггеры updated_at
create extension if not exists moddatetime;

drop trigger if exists dogs_updated_at on public.dogs;
create trigger dogs_updated_at
  before update on public.dogs
  for each row execute function moddatetime(updated_at);

drop trigger if exists puppies_updated_at on public.puppies;
create trigger puppies_updated_at
  before update on public.puppies
  for each row execute function moddatetime(updated_at);

-- RLS-политики (на случай, если не применились раньше)
alter table public.dogs    enable row level security;
alter table public.puppies enable row level security;

drop policy if exists "public read visible dogs" on public.dogs;
create policy "public read visible dogs"
  on public.dogs for select using (is_active = true);

drop policy if exists "public read visible puppies" on public.puppies;
create policy "public read visible puppies"
  on public.puppies for select using (is_active = true and status <> 'archived');

drop policy if exists "auth full access dogs" on public.dogs;
create policy "auth full access dogs"
  on public.dogs for all to authenticated using (true) with check (true);

drop policy if exists "auth full access puppies" on public.puppies;
create policy "auth full access puppies"
  on public.puppies for all to authenticated using (true) with check (true);

-- =============================================================
-- Демо-данные: 3 собаки + 3 щенка (файлы из _source -> public/images)
-- =============================================================

insert into public.dogs
  (name, slug, sex, birth_date, color, title, description, photos, main_photo, is_active, sort_order)
values
  ('Imperia Salomiya', 'imperia-salomiya', 'female', '2021-04-12', 'Кремовый',
   'ЧРКФ, ЮЧРКФ',
   '{"ru": "Сука классического типа: правильная голова, компактный корпус, густая шерсть. Спокойная дома, уверенная в ринге."}'::jsonb,
   array['/images/dogs/dog-imperia.jpg'], '/images/dogs/dog-imperia.jpg', true, 1),

  ('Dar Salomiya', 'dar-salomiya', 'male', '2020-02-08', 'Оранжевый',
   'ЧРКФ, Гранд-Чемпион России',
   '{"ru": "Кобель с крепким костяком и правильными линиями. Даёт стабильно ровные помёты."}'::jsonb,
   array['/images/dogs/dog-dar.jpg'], '/images/dogs/dog-dar.jpg', true, 2),

  ('Salomiya Zarya', 'salomiya-zarya', 'female', '2022-06-21', 'Соболиный',
   'Юный Чемпион России',
   '{"ru": "Молодая сука перспективного разведения, с щенячьего возраста занимается с хендлером."}'::jsonb,
   array['/images/dogs/dog-zarya.jpg'], '/images/dogs/dog-zarya.jpg', true, 3)
on conflict (slug) do nothing;

insert into public.puppies
  (name, slug, sex, birth_date, color, litter_name, description, photos, main_photo, price, status, is_active, sort_order)
values
  ('Альфа', 'puppy-alfa', 'male', '2025-09-14', 'Оранжевый', 'Помёт «Осень 2025»',
   '{"ru": "Кобель, 8 недель. Спокойный, любопытный, хорошо идёт на контакт."}'::jsonb,
   array['/images/puppies/puppy-alfa.jpg'], '/images/puppies/puppy-alfa.jpg', null, 'available', true, 1),

  ('Белла', 'puppy-bella', 'female', '2025-09-14', 'Кремовый', 'Помёт «Осень 2025»',
   '{"ru": "Сука, 8 недель. Активная, контактная, любит играть с детьми."}'::jsonb,
   array['/images/puppies/puppy-bella.jpg'], '/images/puppies/puppy-bella.jpg', null, 'reserved', true, 2),

  ('Веста', 'puppy-vesta', 'female', '2025-09-14', 'Соболиный', 'Помёт «Осень 2025»',
   '{"ru": "Сука, 8 недель. Уверенная, с красивой головой и хорошим костяком."}'::jsonb,
   array['/images/puppies/puppy-vesta.jpg'], '/images/puppies/puppy-vesta.jpg', null, 'available', true, 3)
on conflict (slug) do nothing;

-- Удалить демо-данные:
-- delete from public.dogs where slug in ('imperia-salomiya','dar-salomiya','salomiya-zarya');
-- delete from public.puppies where slug in ('puppy-alfa','puppy-bella','puppy-vesta');
