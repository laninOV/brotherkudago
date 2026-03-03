import { Pool } from "pg";
import type { EventRecord, EventCategory, EventsPage, GetEventsPageOptions } from "@/features/events/types";

type DbRow = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  city: string;
  venue: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  category: EventCategory | null;
  duration_min: number | null;
  price_min: string | null;
  price_max: string | null;
  currency: "RUB" | "EUR" | "USD" | null;
  tags_json: unknown;
  image: string | null;
  description: string | null;
  url: string | null;
};

type EventsCursor = {
  startsAt: string;
  id: string;
};

let poolSingleton: Pool | null = null;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  return url;
}

function parsePositiveIntEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function getPool() {
  if (poolSingleton) return poolSingleton;
  poolSingleton = new Pool({
    connectionString: getDatabaseUrl(),
    ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    max: parsePositiveIntEnv("PG_POOL_MAX", 2),
    connectionTimeoutMillis: parsePositiveIntEnv("PG_CONNECT_TIMEOUT_MS", 5000),
    idleTimeoutMillis: parsePositiveIntEnv("PG_IDLE_TIMEOUT_MS", 10000),
    allowExitOnIdle: true,
  });
  return poolSingleton;
}

function seedEvents(): EventRecord[] {
  return [
    {
      id: "db-evt-001",
      title: "Кантина Tatooine: ужин и контактный бар",
      startsAt: "2026-02-10T19:00:00+03:00",
      city: "Москва",
      venue: "Кантина | Ресторан-бар Tatooine",
      address: "ул. Петровка, 23/10с5",
      lat: 55.7648,
      lng: 37.6174,
      category: "cafe",
      durationMin: 120,
      price: { min: 1500, max: 3000, currency: "RUB" },
      tags: ["ресторан", "бар", "этническая музыка"],
      image:
        "https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/628060285_17851450998654319_3642420885353076683_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=103&ig_cache_key=MzgyNDMxOTg4Nzk4OTAzMDQ4OTE3ODUxNDUwOTkyNjU0MzE5.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjc2MHgxMzUwLnNkci5DMyJ9&_nc_ohc=e4ThFcL5xNAQ7kNvwHDvoJm&_nc_oc=AdmH5eoPNahUlFVnEQpq9uz2j70QXwjupMKCtJw8qMWx0hgSm8cPl8-QbSE0GVzhrhQTD1bN95eb-L5Vl599Zqmh&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_gid=wE-kxWQk8B1EFM8dSLMhYA&oh=00_AfuXs_s4Qj5zjQaOzA-8JL-beLDTbfU9USr0DwXhIDW17w&oe=698B921E",
      description:
        "Еда — про память, напитки — про выбор. Контактный бар и музыка для новых знакомств.",
      url: "https://www.instagram.com/tatooine.rest/",
    },
    {
      id: "db-evt-002",
      title: "Ночная экскурсия по музею",
      startsAt: "2026-02-14T21:00:00+03:00",
      city: "Москва",
      venue: "Музей современного искусства",
      address: "ул. Остоженка, 16",
      lat: 55.7391,
      lng: 37.6035,
      category: "event",
      durationMin: 90,
      price: { min: 700, currency: "RUB" },
      tags: ["музеи", "выставки", "события"],
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
      description: "Ночной маршрут с куратором и короткими интерактивами.",
      url: "https://t.me/okolodating_bot",
    },
    {
      id: "db-evt-003",
      title: "Гончарная мастерская",
      startsAt: "2026-02-18T18:30:00+03:00",
      city: "Москва",
      venue: "Арт-студия Песок",
      address: "Петровский бульвар, 9",
      lat: 55.7686,
      lng: 37.6147,
      category: "event",
      durationMin: 100,
      price: { min: 1500, currency: "RUB" },
      tags: ["мастер-классы", "керамика", "общение"],
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
      description: "Лепка, глазурь и приятная компания. Можно прийти одному.",
      url: "https://t.me/okolodating_bot",
    },
    {
      id: "db-evt-004",
      title: "Лекция: искусство и наука",
      startsAt: "2026-02-20T19:30:00+03:00",
      city: "Москва",
      venue: "Лекторий Сфера",
      address: "ул. Бауманская, 7",
      lat: 55.7707,
      lng: 37.6794,
      category: "event",
      durationMin: 90,
      price: { min: 500, currency: "RUB" },
      tags: ["лекции", "наука", "искусство"],
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
      description: "О том, как арт-практики и исследования меняют городской опыт.",
      url: "https://t.me/okolodating_bot",
    },
    {
      id: "db-evt-005",
      title: "Вечер знакомств в баре",
      startsAt: "2026-02-22T20:00:00+03:00",
      city: "Москва",
      venue: "Бар Соседи",
      address: "ул. Покровка, 25",
      lat: 55.7599,
      lng: 37.6478,
      category: "cafe",
      durationMin: 120,
      price: { min: 0, currency: "RUB" },
      tags: ["бары", "знакомства", "встречи"],
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
      description: "Неформатная встреча с модератором и быстрыми ледоколами.",
      url: "https://t.me/okolodating_bot",
    },
    {
      id: "db-evt-006",
      title: "Прогулка по Патрикам",
      startsAt: "2026-02-24T19:00:00+03:00",
      city: "Москва",
      venue: "Патриаршие пруды",
      address: "Патриаршие пруды",
      lat: 55.7636,
      lng: 37.5937,
      category: "walk",
      durationMin: 80,
      price: { min: 0, currency: "RUB" },
      tags: ["прогулка", "атмосфера", "разговоры"],
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
      description: "Вечерний маршрут, чтобы познакомиться и пройтись без спешки.",
      url: "https://t.me/okolodating_bot",
    },
    {
      id: "db-evt-007",
      title: "Парк Горького: маршрут и кофе",
      startsAt: "2026-02-27T13:00:00+03:00",
      city: "Москва",
      venue: "Парк Горького",
      address: "Крымский Вал, 9",
      lat: 55.7299,
      lng: 37.6032,
      category: "place",
      durationMin: 110,
      price: { min: 300, currency: "RUB" },
      tags: ["парк", "кофе", "набережная"],
      image: "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=80",
      description: "Прогулка по набережной и короткая остановка в кофейне.",
      url: "https://t.me/okolodating_bot",
    },
    {
      id: "db-evt-008",
      title: "Jazz & Stars в планетарии",
      startsAt: "2026-03-01T20:00:00+03:00",
      city: "Москва",
      venue: "Планетарий",
      address: "Садовая-Кудринская, 5",
      lat: 55.7612,
      lng: 37.5817,
      category: "event",
      durationMin: 100,
      price: { min: 4500, currency: "RUB" },
      tags: ["джаз", "звезды", "концерт"],
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
      description: "Живой квартет под сферическим куполом и проекции созвездий.",
      url: "https://t.me/okolodating_bot",
    },
    {
      id: "db-evt-009",
      title: "Кофейный маркет выходного дня",
      startsAt: "2026-03-03T11:00:00+03:00",
      city: "Москва",
      venue: "Винзавод",
      address: "4-й Сыромятнический пер., 1/8",
      lat: 55.7546,
      lng: 37.6678,
      category: "cafe",
      durationMin: 90,
      price: { min: 400, currency: "RUB" },
      tags: ["маркет", "кофе", "дегустация"],
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
      description: "Маркет с дегустацией, обжарщиками и живой музыкой на фоне.",
      url: "https://t.me/okolodating_bot",
    },
  ];
}

function mapRow(row: DbRow): EventRecord {
  const tags = Array.isArray(row.tags_json) ? (row.tags_json as string[]) : [];
  const priceMin = row.price_min != null ? Number(row.price_min) : null;
  const priceMax = row.price_max != null ? Number(row.price_max) : null;
  const hasPrice = priceMin != null || priceMax != null;

  return {
    id: row.id,
    title: row.title,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    city: row.city,
    venue: row.venue,
    address: row.address ?? undefined,
    lat: Number.isFinite(Number(row.lat)) ? Number(row.lat) : 55.7522,
    lng: Number.isFinite(Number(row.lng)) ? Number(row.lng) : 37.6156,
    category: row.category ?? "event",
    durationMin: row.duration_min ?? undefined,
    price: hasPrice
      ? {
          min: priceMin ?? undefined,
          max: priceMax ?? undefined,
          currency: row.currency ?? "RUB",
        }
      : undefined,
    tags,
    image: row.image ?? undefined,
    description: row.description ?? undefined,
    url: row.url ?? undefined,
  };
}

function encodeCursor(cursor: EventsCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

function decodeCursor(raw: string): EventsCursor | null {
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<EventsCursor>;
    if (typeof parsed?.startsAt !== "string" || typeof parsed?.id !== "string") return null;
    return { startsAt: parsed.startsAt, id: parsed.id };
  } catch {
    return null;
  }
}

function getMoscowDateKey(value: string) {
  return new Date(value).toLocaleDateString("en-CA", { timeZone: "Europe/Moscow" });
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

function compareEventPosition(event: EventRecord, cursor: EventsCursor) {
  const leftTime = new Date(event.startsAt).getTime();
  const rightTime = new Date(cursor.startsAt).getTime();
  if (leftTime === rightTime) return event.id.localeCompare(cursor.id);
  return leftTime - rightTime;
}

function getEventsPageFromSeed(options: GetEventsPageOptions): EventsPage {
  const normalizedLimit = Math.min(Math.max(options.limit ?? 12, 1), 200);
  const cursor = options.cursor ? decodeCursor(options.cursor) : null;
  const now = Date.now();
  const nowMoscowDateKey = getMoscowDateKey(new Date(now).toISOString());

  const filtered = seedEvents()
    .slice()
    .sort((a, b) => {
      const timeDelta = new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      return timeDelta === 0 ? a.id.localeCompare(b.id) : timeDelta;
    })
    .filter((event) => {
      if (cursor && compareEventPosition(event, cursor) <= 0) return false;
      if (options.category && event.category !== options.category) return false;
      if (typeof options.priceMax === "number" && Number.isFinite(options.priceMax)) {
        const minPrice = event.price?.min;
        if (typeof minPrice === "number" && minPrice > options.priceMax) return false;
      }
      if (
        typeof options.nearLat === "number" &&
        Number.isFinite(options.nearLat) &&
        typeof options.nearLng === "number" &&
        Number.isFinite(options.nearLng)
      ) {
        const distance = distanceKm(options.nearLat, options.nearLng, event.lat, event.lng);
        const radius = options.radiusKm ?? 4.5;
        if (distance > radius) return false;
      }
      if (options.datePreset === "today") {
        return getMoscowDateKey(event.startsAt) === nowMoscowDateKey;
      }
      if (options.datePreset === "week") {
        const eventTime = new Date(event.startsAt).getTime();
        return eventTime >= now && eventTime < now + 7 * 24 * 60 * 60 * 1000;
      }
      return true;
    });

  const hasMore = filtered.length > normalizedLimit;
  const pageEvents = hasMore ? filtered.slice(0, normalizedLimit) : filtered;
  const last = pageEvents.at(-1);
  const nextCursor = hasMore && last ? encodeCursor({ startsAt: last.startsAt, id: last.id }) : null;

  return {
    events: pageEvents,
    pageInfo: {
      limit: normalizedLimit,
      hasMore,
      nextCursor,
    },
  };
}

function getPgErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const maybeCode = (error as { code?: unknown }).code;
  return typeof maybeCode === "string" ? maybeCode : null;
}

function formatDbReadError(error: unknown) {
  const code = getPgErrorCode(error);

  if (code === "42P01") {
    return new Error(
      "Database schema is missing: table `public.events` was not found. Apply Supabase migrations (for example: `supabase db push --linked`)."
    );
  }

  if (code === "42703") {
    return new Error(
      "Database schema is outdated: expected `public.events` columns are missing. Apply the latest Supabase migrations (`supabase db push --linked`)."
    );
  }

  if (code === "42501") {
    return new Error(
      "Database permissions/RLS blocked the query. Ensure the server connects with a privileged DATABASE_URL and that migrations were applied."
    );
  }

  if (error instanceof Error) return error;
  return new Error("Unknown database error while querying events.");
}

export async function getEventsDbHealth() {
  if (!hasDatabaseUrl()) {
    return {
      ok: false,
      db: false,
      mode: "seed-fallback" as const,
      error: "DATABASE_URL is not configured. /api/events will use local seed fallback data.",
    };
  }

  try {
    await getPool().query("SELECT 1");
    return {
      ok: true,
      db: true,
      mode: "database" as const,
    };
  } catch (error) {
    const formatted = formatDbReadError(error);
    return {
      ok: false,
      db: false,
      mode: "database" as const,
      error: formatted.message,
    };
  }
}

export async function getEventsFromDb(): Promise<EventRecord[]> {
  const page = await getEventsPageFromDb({ limit: 200, datePreset: "all" });
  return page.events;
}

export async function getEventsPageFromDb(options: GetEventsPageOptions): Promise<EventsPage> {
  if (!hasDatabaseUrl()) {
    return getEventsPageFromSeed(options);
  }

  const pool = getPool();

  const normalizedLimit = Math.min(Math.max(options.limit ?? 12, 1), 200);
  const cursor = options.cursor ? decodeCursor(options.cursor) : null;

  const params: Array<string | number> = [normalizedLimit + 1];
  let nextParamIndex = 2;
  const where: string[] = ["is_published = TRUE"];

  if (cursor) {
    const startsAtParam = nextParamIndex++;
    const idParam = nextParamIndex++;
    params.push(cursor.startsAt, cursor.id);
    where.push(`(starts_at, id) > ($${startsAtParam}::timestamptz, $${idParam}::text)`);
  }

  if (options.category) {
    const p = nextParamIndex++;
    params.push(options.category);
    where.push(`category = $${p}`);
  }

  if (typeof options.priceMax === "number" && Number.isFinite(options.priceMax)) {
    const p = nextParamIndex++;
    params.push(options.priceMax);
    where.push(`(price_min IS NULL OR price_min <= $${p})`);
  }

  if (
    typeof options.nearLat === "number" &&
    Number.isFinite(options.nearLat) &&
    typeof options.nearLng === "number" &&
    Number.isFinite(options.nearLng)
  ) {
    const latParam = nextParamIndex++;
    const lngParam = nextParamIndex++;
    const radiusParam = nextParamIndex++;
    params.push(options.nearLat, options.nearLng, options.radiusKm ?? 4.5);

    where.push(`
      lat IS NOT NULL AND lng IS NOT NULL AND
      (
        6371 * acos(
          LEAST(
            1,
            GREATEST(
              -1,
              cos(radians($${latParam})) * cos(radians(lat)) * cos(radians(lng) - radians($${lngParam})) +
              sin(radians($${latParam})) * sin(radians(lat))
            )
          )
        )
      ) <= $${radiusParam}
    `);
  }

  const datePreset = options.datePreset ?? "all";
  if (datePreset === "today") {
    where.push(`DATE(starts_at AT TIME ZONE 'Europe/Moscow') = DATE(NOW() AT TIME ZONE 'Europe/Moscow')`);
  } else if (datePreset === "week") {
    where.push(`starts_at >= NOW() AND starts_at < NOW() + INTERVAL '7 day'`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

  let res: { rows: DbRow[] };
  try {
    res = await pool.query<DbRow>(
      `SELECT
        id,
        title,
        starts_at::text,
        ends_at::text,
        city,
        venue,
        address,
        lat,
        lng,
        category,
        duration_min,
        price_min::text,
        price_max::text,
        currency,
        tags_json,
        image,
        description,
        url
      FROM public.events
      ${whereClause}
      ORDER BY starts_at ASC, id ASC
      LIMIT $1`,
      params
    );
  } catch (error) {
    throw formatDbReadError(error);
  }

  const rows = res.rows;
  const hasMore = rows.length > normalizedLimit;
  const pageRows = hasMore ? rows.slice(0, normalizedLimit) : rows;
  const events = pageRows.map(mapRow);
  const last = pageRows.at(-1);
  const nextCursor = hasMore && last ? encodeCursor({ startsAt: last.starts_at, id: last.id }) : null;

  return {
    events,
    pageInfo: {
      limit: normalizedLimit,
      hasMore,
      nextCursor,
    },
  };
}
