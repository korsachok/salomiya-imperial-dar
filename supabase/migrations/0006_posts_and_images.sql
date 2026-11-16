-- =============================================================
-- Новости питомника + фото обложки и раздела «О питомнике»
-- Выполнить в Supabase: SQL Editor -> Run
-- =============================================================

-- ---------- 1. Фото на главной ----------
-- Изображения храним ссылками на Supabase Storage в site_content.image_url.
alter table public.site_content
  add column if not exists image_url text;

insert into public.site_content (key, group_name, label, content, image_url) values
  ('hero.image', 'hero', 'Фото на главном экране', '{}'::jsonb, '/images/hero/pomespitz.jpg'),
  ('about.image', 'about', 'Фото в блоке «О питомнике»', '{}'::jsonb, null)
on conflict (key) do nothing;

-- ---------- 2. Лента новостей ----------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique,
  title        text not null,
  excerpt      text,
  body         text,
  cover_photo  text,
  photos       text[] not null default '{}',
  video_url    text,
  published_at timestamptz not null default now(),
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (is_published, published_at desc);

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
  before update on public.posts
  for each row execute function moddatetime(updated_at);

alter table public.posts enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select
  using (is_published = true);

drop policy if exists "auth full access posts" on public.posts;
create policy "auth full access posts"
  on public.posts for all
  to authenticated
  using (true) with check (true);

-- ---------- 3. Видео в Storage ----------
-- В бакет photos добавляем видео, размер — до 50 МБ.
update storage.buckets
   set file_size_limit = 52428800,
       allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/quicktime']
 where id = 'photos';
