# ОКОЛО (site + Telegram Mini App) MVP

Единый `Next.js`-проект, в котором:
- сайт доступен на `/`
- Telegram Mini App доступен на `/miniapp`
- обе части читают карточки из одного API `/api/events`

## MVP Scope (текущий этап)

Включено:
- живая афиша событий из Postgres (Supabase)
- единый API `/api/events`
- Supabase Storage для картинок событий
- ручное управление контентом через Supabase Dashboard
- локальное хранение профиля/избранного/истории miniapp (`localStorage`)

Не включено (специально):
- Supabase Auth для пользователей
- синхронизация профиля miniapp через сервер
- matchmaking / совместимость
- встроенная админка на сайте
- native iOS/Android wrapper

## Run (локально)

```bash
npm install
npm run dev
```

Открыть:
- `http://localhost:3000/` — сайт
- `http://localhost:3000/miniapp` — miniapp
- `http://localhost:3000/api/events` — API событий
- `http://localhost:3000/api/health/db` — healthcheck БД

## Local Fallback (без БД)

Если `DATABASE_URL` не задан, API `/api/events` автоматически использует локальный seed-набор из `src/lib/events-repo.ts`.

Это удобно для UI-разработки, но не заменяет продовую схему/миграции.

## Supabase Setup From Zero (MVP)

Ниже шаги для реального запуска с Supabase Cloud.

### 1. Создать проект в Supabase

- Создайте новый проект в Supabase Cloud
- Выберите регион ближе к аудитории/деплою (EU для текущего MVP)
- Сохраните `project ref` и пароль БД

### 2. Установить и залогиниться в Supabase CLI

Через `npx` (без глобальной установки):

```bash
npx supabase@latest login
```

Или установите CLI глобально и используйте `supabase ...`.

### 3. Инициализация уже сделана в репо

В репозитории уже есть:
- `supabase/config.toml`
- `supabase/migrations/*` (schema + seed)

Если хотите перепривязать локально к своему проекту:

```bash
npx supabase@latest link --project-ref <YOUR_PROJECT_REF>
```

### 4. Применить миграции в ваш Supabase проект

```bash
npx supabase@latest db push --linked
```

Что будет создано:
- `public.events`
- индексы под `/api/events`
- `RLS` на `public.events` (без client policies в MVP)
- trigger `updated_at`
- Storage bucket `event-images` (public)
- seed-события `db-evt-*`

## Environment Variables

Скопируйте значения из `.env.example` в ваш `.env.local` (или задайте env в Vercel).

Ключевые переменные:
- `DATABASE_URL` — URL Supabase transaction pooler (`:6543`)
- `PG_SSL=true` — обязателен для Supabase

Опционально (тонкая настройка `pg` pool):
- `PG_POOL_MAX`
- `PG_CONNECT_TIMEOUT_MS`
- `PG_IDLE_TIMEOUT_MS`

## Content Workflow (Storage + Table Editor)

### Загрузка картинки

1. Supabase Dashboard -> `Storage`
2. Bucket `event-images`
3. Upload файла
4. Скопировать public URL

### Создание/редактирование события

1. Supabase Dashboard -> `Table Editor` -> `public.events`
2. Создать/изменить строку
3. Обязательные поля:
   - `id`
   - `title`
   - `starts_at`
   - `city`
   - `venue`
4. Вставить URL картинки в `image`
5. Поставить `is_published = true`

Для черновиков используйте `is_published = false`.

## Events API

`GET /api/events`

### Query params

- `limit`
- `cursor`
- `category` (`event|cafe|walk|place`)
- `nearLat`, `nearLng`, `radiusKm`
- `priceMax`
- `datePreset` (`today|week|all`)

### Response

- `events: EventRecord[]`
- `pageInfo: { limit, hasMore, nextCursor }`

Примечания:
- выдаются только `is_published = true`
- фильтр `today/week` использует `Europe/Moscow`
- при заданном `DATABASE_URL` и отсутствии схемы API вернёт понятную ошибку с подсказкой применить миграции

## DB Healthcheck

`GET /api/health/db`

- при успешном подключении к БД: `200` и JSON с `ok: true`, `db: true`
- без `DATABASE_URL` или при ошибке БД: `503` и диагностическое сообщение

## Architecture

```text
src/
  app/
    page.tsx                  # сайт
    miniapp/
      page.tsx                # вход miniapp
      layout.tsx              # стили miniapp + leaflet css
      miniapp.css
    api/events/route.ts       # общий API карточек
    api/health/db/route.ts    # healthcheck БД
  features/
    events/
      types.ts                # доменные типы событий
    site/
      sections/               # hero/feed/about/services/footer
    miniapp/
      tabs/
      ui/
      state/                  # localStorage state (MVP)
      telegram/
      data/                   # fallback набор для оффлайна
  lib/
    events-repo.ts            # DB reader + fallback + filters + pagination
    events-db.ts              # совместимость (re-export)
supabase/
  config.toml
  migrations/
    *_init_events_mvp.sql
    *_seed_initial_events_mvp.sql
legacy/
  pin-vite/                   # архив исходного Vite miniapp
```

## Smoke Checklist (после деплоя)

- `GET /api/health/db` -> `200`
- `GET /api/events` -> непустой список
- сайт `/` показывает карточки (не `0 позиций`)
- `/miniapp` загружает данные из API
- картинка из `event-images` отображается в карточке

## Notes

- Блок бренда `.bk-brand` не трогается.
- Miniapp получает данные из API, но имеет fallback на `src/features/miniapp/data/places.ts`.
- Runtime auto-migrations/auto-seed удалены из API: схема управляется только через `supabase/migrations`.
