-- Контент питомника: порода — померанский шпиц, по данным из site_content.
-- Выполнить один раз в SQL Editor после 0003.

insert into public.site_content (key, group_name, label, content) values
  ('brand.name',     'general',  'Название питомника', '{"ru": "Salomiya Imperial Dar"}'::jsonb),
  ('about.breed',    'about',    'Порода в заголовке', '{"ru": "Померанский шпиц"}'::jsonb),
  ('hero.eyebrow',   'hero',     'Надпись над заголовком', '{"ru": "Питомник"}'::jsonb),
  ('contacts.email', 'contacts', 'E-mail', '{"ru": ""}'::jsonb)
on conflict (key) do update set content = excluded.content;

-- «Питомник померанских шпицев в Курске. Любовь в каждом пикселе» — это подзаголовок,
-- а не название, поэтому переносим его в hero.subtitle (если там всё ещё название).
update public.site_content
   set content = '{"ru": "Питомник померанских шпицев в Курске. Любовь в каждом пикселе."}'::jsonb
 where key = 'hero.subtitle'
   and content ->> 'ru' in ('Питомник померанских шпицев в Курске. Любовь в каждом пикселе.', 'Померанский шпиц');

update public.site_content
   set content = '{"ru": "Мы создаём не просто собак, а компаньонов с идеальным экстерьером и характером. Наши шпицы живут в доме, проходят социализацию с первых недель и уезжают в новые семьи подготовленными к жизни рядом с человеком. Мы остаёмся на связи с владельцами на протяжении всей жизни собаки."}'::jsonb
 where key = 'about.text';
