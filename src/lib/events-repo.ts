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
  gallery_json: unknown;
  description: string | null;
  url: string | null;
};

type EventsCursor = {
  startsAt: string;
  id: string;
};

let poolSingleton: Pool | null = null;
const ONLY_EVENT_ID = "db-evt-010";

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
      id: "db-evt-010",
      title: "УСАДЬБА ДУБРОВИЦЫ МУЗЕЙ, КОТОРОГО НЕТ",
      startsAt: "2026-02-01T09:00:00+03:00",
      city: "Подольск",
      venue: "Маршрут по городу",
      address: "Московская область, Подольск",
      lat: 55.4317,
      lng: 37.5451,
      category: "walk",
      durationMin: 480,
      price: { min: 0, currency: "RUB" },
      tags: ["маршрут", "поездка", "архитектура", "история"],
      image: "/events/podolsk/podolsk-01.jpg",
      gallery: [
        "/events/podolsk/podolsk-01.jpg",
        "/events/podolsk/podolsk-02.jpg",
        "/events/podolsk/podolsk-03.jpg",
        "/events/podolsk/podolsk-04.jpg",
        "/events/podolsk/podolsk-05.jpg",
        "/events/podolsk/podolsk-06.jpg",
        "/events/podolsk/podolsk-07.jpg",
      ],
      description:
        "Подольск расположен всего в 43 км от Москвы — отличное направление для короткого путешествия на один день. Добраться можно двумя способами: на машине или общественным транспортом (метро + пригородный автобус). В дороге вы проведёте меньше двух часов.\n\nПервой точкой маршрута стоит выбрать усадьба Дубровицы — парковка на территории бесплатная. Здесь же находится знаменитая Церковь Иконы Богоматери Знамения, а после осмотра можно прогуляться по парку вдоль река Десна.\n\nЕсли останется время, загляните и в другие достопримечательности города:\n— Троицкий собор\n— усадьба Ивановское\n— музей-заповедник «Подолье»\n\nДля завтрака подойдёт кафе Здрасте. Если решите остаться в городе до вечера, отправляйтесь на обед или ужин в гастропространство Депо (на Комсомольской улице, 3) — здесь представлена кухня на любой вкус.",
      url: "https://dubrovitsi.ru/",
    },
  ];
}

function mapRow(row: DbRow): EventRecord {
  const tags = Array.isArray(row.tags_json) ? (row.tags_json as string[]) : [];
  const gallery = Array.isArray(row.gallery_json)
    ? row.gallery_json.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
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
    gallery: gallery.length > 0 ? gallery : undefined,
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
  const onlyEventIdParam = nextParamIndex++;
  params.push(ONLY_EVENT_ID);
  where.push(`id = $${onlyEventIdParam}`);

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
        gallery_json,
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
