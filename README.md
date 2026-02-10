# ОКОЛО (site + miniapp)

Единый Next.js-проект, в котором:
- сайт доступен на `/`
- miniapp доступен на `/miniapp`
- обе части читают карточки из одного API `/api/events`

## Run

```bash
npm install
npm run dev
```

Открыть:
- `http://localhost:3000/` — сайт
- `http://localhost:3000/miniapp` — miniapp

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
  features/
    events/
      types.ts                # доменные типы событий
    site/
      sections/               # hero/feed/about/services/footer
    miniapp/
      tabs/
      ui/
      state/
      telegram/
      data/                   # fallback набор для оффлайна
  lib/
    events-repo.ts            # DB + сид + фильтры + пагинация
    events-db.ts              # совместимость (re-export)
  shared/
    styles/
      tokens.css
      effects.css
      motion.css
legacy/
  pin-vite/                   # архив исходного Vite miniapp
```

## Events API

`GET /api/events`

Query:
- `limit`
- `cursor`
- `category` (`event|cafe|walk|place`)
- `nearLat`, `nearLng`, `radiusKm`
- `priceMax`
- `datePreset` (`today|week|all`)

Response:
- `events: EventRecord[]`
- `pageInfo: { limit, hasMore, nextCursor }`

## Notes

- Блок бренда `.bk-brand` не трогается.
- Miniapp получает данные из API, но имеет fallback на `src/features/miniapp/data/places.ts`.
