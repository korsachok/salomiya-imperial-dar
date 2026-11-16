-- =============================================================
-- Демо-контент для главной страницы (можно удалить одним DELETE ниже)
-- =============================================================

insert into public.site_content (key, group_name, label, content) values
  ('brand.name', 'general', 'Название питомника',
   '{"ru": "Salomiya Imperial Dar", "en": "Salomiya Imperial Dar"}'::jsonb)
on conflict (key) do update set content = excluded.content;

update public.site_content
   set content = '{"ru": "Русские псовые борзые", "en": "Borzoi"}'::jsonb
 where key = 'hero.subtitle';

update public.site_content
   set content = '{"ru": "Salomiya Imperial Dar — небольшой семейный питомник русских псовых борзых. Мы сохраняем породу в её классическом виде: крепкий костяк, правильные линии, спокойный и уверенный характер.\n\nНаши собаки живут рядом с нами, а не в вольерах. Щенки растут в доме, проходят социализацию и уезжают в новые семьи подготовленными к жизни рядом с человеком. Мы остаёмся на связи с владельцами на протяжении всей жизни собаки."}'::jsonb
 where key = 'about.text';

update public.site_content
   set content = '{"ru": "+7 (900) 000-00-00"}'::jsonb
 where key = 'contacts.phone';

update public.site_content
   set content = '{"ru": "hello@salomiya-dar.ru"}'::jsonb
 where key = 'contacts.email';

update public.site_content
   set content = '{"ru": "https://t.me/"}'::jsonb
 where key = 'contacts.social';

insert into public.dogs (name, slug, sex, birth_date, color, title, description, photos, main_photo, sort_order)
values
  ('Imperia Salomiya', 'imperia-salomiya', 'female', '2021-04-12', 'Белый с рыжими отметинами',
   'ЧРКФ, ЮЧРКФ, «Лучший представитель породы»',
   '{"ru": "Сука классического типа, с длинной головой и высокой посадкой шеи. Уверенная в ринге, спокойная дома."}'::jsonb,
   array['/images/dogs/dog-1.jpg'], '/images/dogs/dog-1.jpg', 1),
  ('Dar Salomiya Bely', 'dar-salomiya-bely', 'male', '2020-02-08', 'Белый',
   'ЧРКФ, Гранд-Чемпион России',
   '{"ru": "Кобель с мощным костяком и свободными движениями. Отличный производитель, даёт стабильно ровные помёты."}'::jsonb,
   array['/images/dogs/dog-2.jpg'], '/images/dogs/dog-2.jpg', 2),
  ('Salomiya Zarya', 'salomiya-zarya', 'female', '2022-06-21', 'Белый с чёрными отметинами',
   'Юный Чемпион России',
   '{"ru": "Молодая сука перспективного разведения, в работе с кинологом с щенячьего возраста."}'::jsonb,
   array['/images/dogs/dog-3.jpg'], '/images/dogs/dog-3.jpg', 3);

insert into public.puppies (name, slug, sex, birth_date, color, litter_name, description, photos, main_photo, price, status, sort_order)
values
  ('Щенок — «Альфа»', 'puppy-alfa', 'male', '2025-09-14', 'Белый с рыжими отметинами', 'Помёт «Осень 2025»',
   '{"ru": "Кобель, 8 недель. Спокойный, любопытный, хорошо идёт на контакт."}'::jsonb,
   array['/images/puppies/puppy-1.jpg'], '/images/puppies/puppy-1.jpg', null, 'available', 1),
  ('Щенок — «Белла»', 'puppy-bella', 'female', '2025-09-14', 'Белый', 'Помёт «Осень 2025»',
   '{"ru": "Сука, 8 недель. Активная и контактная."}'::jsonb,
   array['/images/puppies/puppy-2.jpg'], '/images/puppies/puppy-2.jpg', null, 'reserved', 2),
  ('Щенок — «Веста»', 'puppy-vesta', 'female', '2025-09-14', 'Белый с чёрными отметинами', 'Помёт «Осень 2025»',
   '{"ru": "Сука, 8 недель. Уверенная, с красивой головой."}'::jsonb,
   array['/images/puppies/puppy-3.jpg'], '/images/puppies/puppy-3.jpg', null, 'available', 3);

-- Быстро убрать демо-данные:
-- delete from public.site_content;
-- delete from public.dogs;
-- delete from public.puppies;
