-- =============================================================
-- Контент для всех страниц сайта (кроме главной — она уже заполнена)
-- Выполнить в Supabase: SQL Editor -> Run
-- Идемпотентно: обновляет только пустые значения.
-- =============================================================

insert into public.site_content (key, group_name, label, content, image_url) values
  -- ---------- О питомнике ----------
  ('about.title',    'about', 'Заголовок страницы',                       '{"ru": ""}'::jsonb, null),
  ('about.intro',    'about', 'Вводный абзац',                            '{"ru": ""}'::jsonb, null),
  ('about.values',   'about', 'Ценности — по одному пункту в строке',      '{"ru": ""}'::jsonb, null),
  ('about.image2',   'about', 'Второе фото',                              '{}'::jsonb, null),

  -- ---------- Собаки ----------
  ('dogs.title',     'dogs', 'Заголовок страницы',                        '{"ru": ""}'::jsonb, null),
  ('dogs.intro',     'dogs', 'Вводный абзац',                             '{"ru": ""}'::jsonb, null),
  ('dogs.image',     'dogs', 'Фото в шапке',                              '{}'::jsonb, null),

  -- ---------- Щенки ----------
  ('puppies.title',  'puppies', 'Заголовок страницы',                     '{"ru": ""}'::jsonb, null),
  ('puppies.intro',  'puppies', 'Вводный абзац',                          '{"ru": ""}'::jsonb, null),
  ('puppies.how',    'puppies', '«Как забрать щенка» — шаги по строкам',   '{"ru": ""}'::jsonb, null),
  ('puppies.image',  'puppies', 'Фото в шапке',                           '{}'::jsonb, null),

  -- ---------- Галерея ----------
  ('gallery.title',  'gallery', 'Заголовок страницы',                     '{"ru": ""}'::jsonb, null),
  ('gallery.intro',  'gallery', 'Вводный абзац',                          '{"ru": ""}'::jsonb, null),

  -- ---------- Выпускники ----------
  ('graduates.title','graduates', 'Заголовок страницы',                   '{"ru": ""}'::jsonb, null),
  ('graduates.intro','graduates', 'Вводный абзац',                        '{"ru": ""}'::jsonb, null),

  -- ---------- FAQ ----------
  ('faq.title',      'faq', 'Заголовок страницы',                         '{"ru": ""}'::jsonb, null),
  ('faq.intro',      'faq', 'Вводный абзац',                              '{"ru": ""}'::jsonb, null),

  -- ---------- Контакты ----------
  ('contacts.title',    'contacts', 'Заголовок страницы',                 '{"ru": ""}'::jsonb, null),
  ('contacts.intro',    'contacts', 'Вводный абзац',                      '{"ru": ""}'::jsonb, null),
  ('contacts.address',  'contacts', 'Адрес / город',                      '{"ru": ""}'::jsonb, null),
  ('contacts.hours',    'contacts', 'Когда отвечаем',                     '{"ru": ""}'::jsonb, null),
  ('contacts.messenger','contacts', 'Мессенджер (ссылка)',                '{"ru": ""}'::jsonb, null),
  ('contacts.image',    'contacts', 'Фото в шапке',                       '{}'::jsonb, null),

  -- ---------- Подвал и служебное ----------
  ('footer.note',    'general', 'Строка в подвале',                       '{"ru": ""}'::jsonb, null),
  ('notfound.text',  'general', 'Страница 404 — пояснение',               '{"ru": ""}'::jsonb, null)
on conflict (key) do nothing;

update public.site_content
   set content = jsonb_build_object('ru', v.text)
  from (values
    ('about.title',     'Питомник, в котором рождаются компаньоны'),
    ('about.intro',     'Мы занимаемся померанскими шпицами больше десяти лет. Маленький питомник в Курске, где каждая собака — часть семьи, а не единица разведения.'),
    ('about.values',    E'Здоровье и психика — ежегодные обследования и генетические тесты производителей.\nДом, а не вольер — щенки растут рядом с нами, с детьми и другими животными.\nДокументы — метрика РКФ, ветпаспорт, договор и памятка по уходу в комплекте.\nПоддержка — остаёмся на связи с владельцами всю жизнь собаки.'),
    ('dogs.title',      'Наши собаки'),
    ('dogs.intro',      'Производители и выпускники питомника. Все собаки имеют допуск в разведение, выставочные титулы и ежегодные ветеринарные обследования.'),
    ('puppies.title',   'Щенки'),
    ('puppies.intro',   'Щенки из текущих и прошлых помётов. Свободные щенки отмечены, в резерве — забронированы.'),
    ('puppies.how',     E'Выбираете щенка и связываетесь с нами по телефону или в мессенджере.\nЗнакомимся — видеозвонок или визит в питомник.\nБронирование — договор и бронь.\nАктировка и переезд — метрика РКФ, ветпаспорт, прививки по возрасту, переезд в новый дом в 8–12 недель.'),
    ('gallery.title',   'Галерея'),
    ('gallery.intro',   'Будни питомника: выставки, помёты, прогулки и просто шпицы дома.'),
    ('graduates.title', 'Выпускники'),
    ('graduates.intro', 'Щенки, которые уже нашли свои семьи. Мы гордимся каждым — и держим связь с владельцами.'),
    ('faq.title',       'Частые вопросы'),
    ('faq.intro',       'Собрали то, о чём спрашивают чаще всего. Если вашего вопроса здесь нет — напишите нам.'),
    ('contacts.title',  'Свяжитесь с нами'),
    ('contacts.intro',  'Ответим на вопросы о щенках, вязках и поездках в питомник. Пишите в любой удобный канал.'),
    ('contacts.address','Курск, Россия'),
    ('contacts.hours',  'Ежедневно, 10:00–20:00'),
    ('footer.note',     'Питомник померанских шпицев Salomiya Imperial Dar'),
    ('notfound.text',   'Возможно, страница была перемещена. Проверьте адрес или вернитесь на главную.')
  ) as v(key, text)
 where public.site_content.key = v.key
   and coalesce(public.site_content.content ->> 'ru', '') = '';

update public.site_content
   set content = jsonb_build_object('ru', E'Мы работаем с 2009 года. Питомник зарегистрирован в РКФ, все помёты проходят актировку и полную вакцинацию.\n\nНаши шпицы живут в доме, а не в вольерах: щенки с первых недель привыкают к людям, звукам и другим животным. Перед передачей каждому щенку делается вакцинация по возрасту, оформляются метрика РКФ и ветпаспорт. Мы остаёмся на связи с владельцами — поможем с уходом, грумингом и вопросами о здоровье.')
 where key = 'about.text'
   and coalesce(content ->> 'ru', '') = '';

update public.site_content set image_url = '/images/hero/pomespitz.jpg'     where key = 'about.image'    and coalesce(image_url, '') = '';
update public.site_content set image_url = '/images/dogs/dog-imperia.jpg'   where key = 'about.image2'   and coalesce(image_url, '') = '';
update public.site_content set image_url = '/images/dogs/dog-zarya.jpg'     where key = 'dogs.image'     and coalesce(image_url, '') = '';
update public.site_content set image_url = '/images/puppies/puppy-alfa.jpg' where key = 'puppies.image'  and coalesce(image_url, '') = '';
update public.site_content set image_url = '/images/hero/pomespitz.jpg'     where key = 'contacts.image' and coalesce(image_url, '') = '';

-- =============================================================
-- Выпускники (карточки собак у владельцев)
-- =============================================================
create table if not exists public.graduates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_city  text,
  birth_year  integer,
  description text,
  photo       text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists graduates_updated_at on public.graduates;
create trigger graduates_updated_at
  before update on public.graduates
  for each row execute function moddatetime(updated_at);

alter table public.graduates enable row level security;

drop policy if exists "public read graduates" on public.graduates;
create policy "public read graduates" on public.graduates for select using (true);

drop policy if exists "auth full access graduates" on public.graduates;
create policy "auth full access graduates" on public.graduates for all to authenticated using (true) with check (true);

insert into public.graduates (name, owner_city, birth_year, description, photo, sort_order) values
  ('Азалия «Аза»', 'Москва', 2023, 'Первая в доме, обожает путешествия и машины.', '/images/puppies/puppy-bella.jpg', 1),
  ('Барс', 'Санкт-Петербург', 2022, 'Выставочная карьера и первая оценка «отлично» в классе.', '/images/puppies/puppy-alfa.jpg', 2),
  ('Ириска', 'Казань', 2024, 'Живёт с двумя детьми, учится трюкам и любит снег.', '/images/puppies/puppy-vesta.jpg', 3);

-- =============================================================
-- FAQ
-- =============================================================
create table if not exists public.faq_items (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists faq_items_updated_at on public.faq_items;
create trigger faq_items_updated_at
  before update on public.faq_items
  for each row execute function moddatetime(updated_at);

alter table public.faq_items enable row level security;

drop policy if exists "public read faq" on public.faq_items;
create policy "public read faq" on public.faq_items for select using (true);

drop policy if exists "auth full access faq" on public.faq_items;
create policy "auth full access faq" on public.faq_items for all to authenticated using (true) with check (true);

insert into public.faq_items (question, answer, sort_order)
select * from (values
  ('Как забронировать щенка?', 'Напишите нам в мессенджер или позвоните. Мы пришлём видео щенка, договор и условия брони. Бронь закрепляет щенка за вами до переезда.', 1),
  ('Сколько стоит щенок?', 'Стоимость зависит от помёта и класса щенка. Актуальные цены этой страницы не указываем — назовём на звонке, без «торга» и скрытых платежей.', 2),
  ('В каком возрасте щенок переезжает в новую семью?', 'Не раньше 8 недель: к этому возрасту есть актировка, первая вакцинация и карантин после неё. Дату переезда согласовываем.', 3),
  ('Можно ли приехать в питомник?', 'Да, по предварительной договорённости. Покажем родителей, условия содержания и щенков.', 4),
  ('Есть ли документы и прививки?', 'Метрика РКФ, ветпаспорт с прививками по возрасту, договор купли-продажи и памятка по уходу.', 5),
  ('Какой уход нужен шпицу?', 'Вычёсывание 2–3 раза в неделю, стрижка у грумера раз в 1–2 месяца, прогулки и регулярные визиты к ветеринару.', 6),
  ('Что если я не смогу оставить собаку?', 'Питомник участвует в судьбе своих выпускников: поможем найти новый дом, а при необходимости примем собаку обратно.', 7)
) as v(question, answer, sort_order)
where not exists (select 1 from public.faq_items);
