# Salomiya Imperial Dar — сайт и админ-панель

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
```

Переменные окружения — в `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Миграции

Выполнять по порядку в Supabase → SQL Editor:

1. `0001_init.sql` — таблицы, RLS
2. `0003_fix_schema_and_seed.sql` — догоняет схему под 0001 + демо-данные
3. `0004_content_pomeranian.sql` — тексты сайта
4. `0005_storage.sql` — бакет `photos` для загрузки фото

`0002_seed_demo.sql` — устаревший вариант демо-данных, применять не нужно.

## Админка

`/admin` → редирект на `/admin/login`. Пользователь создаётся в Supabase →
Authentication → Users (включить «Auto Confirm User»), саморегистрацию выключить.

- `/admin/content` — тексты сайта (`site_content`)
- `/admin/dogs` — собаки, фото в Supabase Storage
- `/admin/puppies` — щенки, статус свободен / резерв / продан

## Структура

- `src/app/(site)` — публичная часть
- `src/app/admin` — CMS, защищена `src/middleware.ts`
- `src/lib/content.ts` — чтение данных из Supabase
- `public/images` — фото на диске (`hero/`, `dogs/`, `puppies/`)
- `_source` — исходники фото/видео, в git не попадают
