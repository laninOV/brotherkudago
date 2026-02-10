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
let initPromise: Promise<void> | null = null;

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  return url;
}

function getPool() {
  if (poolSingleton) return poolSingleton;
  poolSingleton = new Pool({
    connectionString: getDatabaseUrl(),
    ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : undefined,
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

async function initDb() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        starts_at TIMESTAMPTZ NOT NULL,
        ends_at TIMESTAMPTZ,
        city TEXT NOT NULL,
        venue TEXT NOT NULL,
        address TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        category TEXT,
        duration_min INTEGER,
        price_min NUMERIC,
        price_max NUMERIC,
        currency TEXT,
        tags_json JSONB,
        image TEXT,
        description TEXT,
        url TEXT
      );
    `);

    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT;`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS duration_min INTEGER;`);

    await pool.query(`
      UPDATE events
      SET lat = COALESCE(lat, 55.7522),
          lng = COALESCE(lng, 37.6156),
          category = COALESCE(category, 'event')
      WHERE lat IS NULL OR lng IS NULL OR category IS NULL;
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS events_starts_at_id_idx
      ON events (starts_at ASC, id ASC);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS events_category_idx
      ON events (category);
    `);

    const countRes = await pool.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM events");
    const count = Number(countRes.rows[0]?.count ?? "0");
    if (count > 0) return;

    const seed = seedEvents();
    for (const event of seed) {
      await pool.query(
        `INSERT INTO events (
          id, title, starts_at, ends_at, city, venue, address, lat, lng, category, duration_min,
          price_min, price_max, currency, tags_json, image, description, url
        ) VALUES (
          $1, $2, $3::timestamptz, $4::timestamptz, $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15::jsonb, $16, $17, $18
        )`,
        [
          event.id,
          event.title,
          event.startsAt,
          event.endsAt ?? null,
          event.city,
          event.venue,
          event.address ?? null,
          event.lat,
          event.lng,
          event.category ?? "event",
          event.durationMin ?? null,
          event.price?.min ?? null,
          event.price?.max ?? null,
          event.price?.currency ?? null,
          JSON.stringify(event.tags ?? []),
          event.image ?? null,
          event.description ?? null,
          event.url ?? null,
        ]
      );
    }
  })();

  return initPromise;
}

export async function getEventsFromDb(): Promise<EventRecord[]> {
  const page = await getEventsPageFromDb({ limit: 200, datePreset: "all" });
  return page.events;
}

export async function getEventsPageFromDb(options: GetEventsPageOptions): Promise<EventsPage> {
  await initDb();
  const pool = getPool();

  const normalizedLimit = Math.min(Math.max(options.limit ?? 12, 1), 200);
  const cursor = options.cursor ? decodeCursor(options.cursor) : null;

  const params: Array<string | number> = [normalizedLimit + 1];
  let nextParamIndex = 2;
  const where: string[] = [];

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

  const res = await pool.query<DbRow>(
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
    FROM events
    ${whereClause}
    ORDER BY starts_at ASC, id ASC
    LIMIT $1`,
    params
  );

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
