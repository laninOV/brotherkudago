(function () {
  "use strict";

  // Keep hero height correct across devices: match CSS --bk-header-h to actual header height.
  (function syncHeaderHeight() {
    const header = document.querySelector(".bk-header");
    if (!header) return;

    let t = null;
    const set = () => {
      document.documentElement.style.setProperty(
        "--bk-header-h",
        `${header.offsetHeight}px`
      );
    };

    set();
    window.addEventListener(
      "resize",
      () => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(set, 120);
      },
      { passive: true }
    );
  })();

  (function menuDrawer() {
    const menu = document.querySelector(".bk-menu");
    if (!menu) return;

    const closeMenu = () => {
      if (menu.hasAttribute("open")) {
        menu.removeAttribute("open");
      }
    };

    menu.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-menu-close]")) {
        closeMenu();
      }
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  })();

  /**
   * Модель события (карточки):
   * - id: string
   * - title: string
   * - startsAt: ISO string (с таймзоной)
   * - endsAt?: ISO string
   * - city: string
   * - venue: string
   * - address?: string
   * - price?: { min?: number, max?: number, currency: "RUB" | "EUR" | "USD" }
   * - tags?: string[]
   * - image?: string (path)
   * - description?: string
   * - url?: string
  */

  const FALLBACK_IMAGE = "/main-flower.png";
  const CATEGORY_LABELS = {
    event: "событие",
    cafe: "кафе",
    walk: "прогулка",
    place: "место",
  };

  // Fallback mock cards for offline/dev only.
  const USE_PLACEHOLDER_EVENTS = false;

  function makePlaceholderEvents(count) {
    const base = new Date("2026-02-01T18:00:00+03:00");
    const images = [
      FALLBACK_IMAGE,
      FALLBACK_IMAGE,
      FALLBACK_IMAGE,
    ];

    const titles = [
      "Камерный концерт: встреча",
      "Гончарная: свидание",
      "Выставка без спешки",
      "Прогулка и кофе",
      "Кино + обсуждение",
      "Лекция и вопросы",
      "Маркет и находки",
      "Импровизация в баре",
      "Танцы для новичков",
    ];

    const tags = [
      ["встреча", "музыка", "лайт"],
      ["свидание", "мастерская", "уют"],
      ["выставка", "арт", "тихо"],
      ["прогулка", "кофе", "разговоры"],
      ["кино", "обсуждение", "вечер"],
      ["лекция", "люди", "идеи"],
      ["маркет", "ремесло", "подарки"],
      ["импровизация", "бар", "смех"],
      ["танцы", "новички", "вечеринка"],
    ];

    const result = [];
    for (let i = 0; i < count; i++) {
      const d = new Date(base.getTime() + i * 24 * 60 * 60 * 1000);
      d.setHours(18 + (i % 3), 0, 0, 0);
      result.push({
        id: `mock-${String(i + 1).padStart(2, "0")}`,
        title: titles[i % titles.length],
        startsAt: d.toISOString(),
        city: "Москва",
        venue: ["ОКОЛО", "Тёплое место", "Новый зал"][i % 3],
        address: "",
        price: i % 4 === 0 ? { min: 0, currency: "RUB" } : { min: 900 + i * 150, currency: "RUB" },
        tags: tags[i % tags.length],
        image: images[i % images.length],
        description:
          i % 2 === 0
            ? "Плейсхолдер для отладки карточек. Тут будет описание события, чтобы проверить переносы и высоту блока."
            : "Плейсхолдер карточки для дизайна и взаимодействия (избранное, модалка, кнопки).",
        url: "https://t.me/okolodating_bot",
      });
    }
    return result;
  }

  const REAL_EVENTS = [
    {
      id: "evt-200",
      title: "УСАДЬБА ДУБРОВИЦЫ МУЗЕЙ, КОТОРОГО НЕТ",
      startsAt: "2026-01-30T09:00:00+03:00",
      city: "Подольск",
      venue: "Маршрут по городу",
      address: "Московская область, Подольск",
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

  let EVENTS = USE_PLACEHOLDER_EVENTS ? makePlaceholderEvents(12) : REAL_EVENTS;

  const LS = {
    favs: "bk:favs",
    favsOnly: "bk:favsOnly",
  };

  function readFavsOnlyFromUrl() {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("favs")) return null;
    const raw = params.get("favs");
    return raw === "1" || raw === "true";
  }

  function syncFavsOnlyUrl(isFavsOnly) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (isFavsOnly) url.searchParams.set("favs", "1");
    else url.searchParams.delete("favs");
    window.history.replaceState({}, "", url);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createCuratedQueue() {
    return shuffleArray(EVENTS.slice());
  }

  function parseDate(iso) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDateRu(date) {
    const parts = new Intl.DateTimeFormat("ru-RU", {
      weekday: "short",
      day: "2-digit",
      month: "long",
    }).formatToParts(date);
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    return `${weekday} · ${day} ${month}`;
  }

  function formatTime(date) {
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  }

  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function humanDayTitle(date) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (sameDay(date, now)) return "Сегодня";
    if (sameDay(date, tomorrow)) return "Завтра";
    return formatDateRu(date);
  }

  function formatPrice(price) {
    if (!price) return "Цена не указана";
    const { min, max, currency } = price;
    const fmt = (v) =>
      new Intl.NumberFormat("ru-RU").format(Math.round(Number(v)));
    const curr = currency === "RUB" ? "₽" : currency;
    if (min === 0 && (max == null || max === 0)) return "Бесплатно";
    if (min != null && max != null && min !== max) return `${fmt(min)}–${fmt(max)} ${curr}`;
    if (min != null) return `от ${fmt(min)} ${curr}`;
    if (max != null) return `до ${fmt(max)} ${curr}`;
    return "Цена не указана";
  }

  function getEventCategoryLabel(event) {
    const raw = typeof event?.category === "string" ? event.category : "event";
    return CATEGORY_LABELS[raw] || CATEGORY_LABELS.event;
  }

  function getEventWhenLabel(event) {
    const date = parseDate(event?.startsAt);
    if (!date) return "дата уточняется";
    return `${humanDayTitle(date)} · ${formatTime(date)}`;
  }

  function getEventVenueLine(event) {
    const city = typeof event?.city === "string" ? event.city : "";
    const venue = typeof event?.venue === "string" ? event.venue : "";
    const line = [city, venue].filter(Boolean).join(" · ");
    return line || "Локация уточняется";
  }

  function getEventAccentLabel(event) {
    const priceLabel = formatPrice(event?.price);
    if (priceLabel !== "Цена не указана") return priceLabel;

    if (Array.isArray(event?.tags)) {
      const firstTag = event.tags.find((tag) => typeof tag === "string" && tag.trim().length > 0);
      if (firstTag) return firstTag;
    }

    return "подборка";
  }

  function daysFromNow(date) {
    const now = new Date();
    const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const ms = b.getTime() - a.getTime();
    return Math.round(ms / 86400000);
  }

  function readFavs() {
    try {
      const raw = localStorage.getItem(LS.favs);
      if (!raw) return new Set();
      const ids = JSON.parse(raw);
      if (!Array.isArray(ids)) return new Set();
      return new Set(ids.filter((x) => typeof x === "string"));
    } catch {
      return new Set();
    }
  }

  function writeFavs(favs) {
    try {
      localStorage.setItem(LS.favs, JSON.stringify(Array.from(favs)));
    } catch {
      // ignore
    }
  }

  function readBool(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return raw === "true";
    } catch {
      return fallback;
    }
  }

  function writeBool(key, value) {
    try {
      localStorage.setItem(key, value ? "true" : "false");
    } catch {
      // ignore
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function hashString(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  function getEventGallery(event) {
    const gallery = Array.isArray(event.gallery)
      ? event.gallery.filter((item) => typeof item === "string" && item.length > 0)
      : [];
    if (gallery.length > 0) return gallery;
    if (typeof event.image === "string" && event.image.length > 0) return [event.image];
    return [FALLBACK_IMAGE];
  }

  function getEventLocationLabel(event) {
    const city = typeof event.city === "string" ? event.city : "";
    const venue = typeof event.venue === "string" ? event.venue : "";
    const address = typeof event.address === "string" ? event.address : "";
    const head = [city, venue].filter(Boolean).join(" · ");
    if (!address) return head || "Локация уточняется";
    return head ? `${head} — ${address}` : address;
  }

  function renderDescriptionHtml(rawDescription) {
    const lines = String(rawDescription || "").split(/\r?\n/);
    const blocks = [];
    let paragraphLines = [];
    let listItems = [];

    const flushParagraph = () => {
      if (!paragraphLines.length) return;
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
      paragraphLines = [];
    };

    const flushList = () => {
      if (!listItems.length) return;
      blocks.push({ type: "list", items: [...listItems] });
      listItems = [];
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }
      if (trimmed.startsWith("—")) {
        flushParagraph();
        listItems.push(trimmed.replace(/^—\s*/, ""));
        continue;
      }
      flushList();
      paragraphLines.push(trimmed);
    }

    flushParagraph();
    flushList();

    if (!blocks.length) {
      return `<p class="bk-modal__desc">Описание скоро появится.</p>`;
    }

    return blocks
      .map((block) => {
        if (block.type === "paragraph") {
          return `<p class="bk-modal__desc">${escapeHtml(block.text)}</p>`;
        }
        return `<ul class="bk-modal__list">${block.items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>`;
      })
      .join("");
  }

  function eventToCardHtml(event, { isHighPriority }) {
    const gallery = getEventGallery(event);
    const imageSrc = gallery[0] || FALLBACK_IMAGE;
    const loading = isHighPriority ? "eager" : "lazy";
    const fetchPriority = isHighPriority ? ' fetchpriority="high"' : "";
    const categoryLabel = getEventCategoryLabel(event);
    const whenLabel = getEventWhenLabel(event);
    const venueLine = getEventVenueLine(event);
    const accentLabel = getEventAccentLabel(event);
    const imageHtml = `<img src="${escapeHtml(
      imageSrc
    )}" alt="" width="1200" height="900" loading="${loading}" decoding="async"${fetchPriority} data-fallback="${escapeHtml(
      FALLBACK_IMAGE
    )}">`;

    return `
      <article class="bk-card" data-id="${escapeHtml(event.id)}" data-action="open" role="button" tabindex="0" aria-label="${escapeHtml(
        event.title
      )}">
        <div class="bk-card__media">
          ${imageHtml}
        </div>
        <div class="bk-card__body">
          <div class="bk-card__panel">
            <div class="bk-card__eyebrow">
              <span class="bk-card__eyebrow-item">${escapeHtml(categoryLabel)}</span>
              <span class="bk-card__eyebrow-item">${escapeHtml(whenLabel)}</span>
            </div>
            <h3 class="bk-card__title">${escapeHtml(event.title)}</h3>
            <p class="bk-card__location">${escapeHtml(venueLine)}</p>
            <div class="bk-card__footer">
              <span class="bk-card__accent">${escapeHtml(accentLabel)}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function eventToModalHtml(event, { isFav, activeImageIndex }) {
    const tags = Array.isArray(event.tags) ? event.tags : [];
    const gallery = getEventGallery(event);
    const safeImageIndex = Number.isFinite(activeImageIndex)
      ? Math.max(0, Math.min(gallery.length - 1, activeImageIndex))
      : 0;
    const imageSrc = gallery[safeImageIndex] || FALLBACK_IMAGE;
    const categoryLabel = getEventCategoryLabel(event);
    const whenLabel = getEventWhenLabel(event);
    const accentLabel = getEventAccentLabel(event);
    const locationLabel = getEventLocationLabel(event);
    const descriptionHtml = renderDescriptionHtml(event.description || "");
    const thumbsHtml =
      gallery.length > 1
        ? `<div class="bk-modal__thumbs" aria-label="Галерея">
            ${gallery
              .map(
                (src, index) => `
                  <button
                    class="bk-modal__thumb ${index === safeImageIndex ? "is-active" : ""}"
                    type="button"
                    data-action="modal-thumb"
                    data-index="${index}"
                    aria-label="Фото ${index + 1}"
                    aria-pressed="${index === safeImageIndex ? "true" : "false"}"
                  >
                    <img src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" data-fallback="${escapeHtml(
                  FALLBACK_IMAGE
                )}">
                  </button>
                `
              )
              .join("")}
          </div>`
        : "";

    return `
      <div class="bk-modal__content">
        <button class="bk-modal__close" type="submit" value="close" aria-label="Закрыть">✕</button>
        <div class="bk-modal__grid">
          <div class="bk-modal__media">
            <div class="bk-modal__image">
              <img src="${escapeHtml(
                imageSrc
              )}" alt="" width="1200" height="900" loading="lazy" decoding="async" data-fallback="${escapeHtml(
      FALLBACK_IMAGE
    )}">
            </div>
            ${thumbsHtml}
          </div>
          <div>
            <div class="bk-modal__eyebrow">
              <span class="bk-modal__eyebrow-item">${escapeHtml(categoryLabel)}</span>
              <span class="bk-modal__eyebrow-item">${escapeHtml(whenLabel)}</span>
              <span class="bk-modal__eyebrow-item">${escapeHtml(accentLabel)}</span>
            </div>
            <h2 class="bk-modal__title">${escapeHtml(event.title)}</h2>
            <div class="bk-meta bk-meta--modal">
              <span class="bk-meta__item">${escapeHtml(locationLabel)}</span>
            </div>
            <div class="bk-modal__text">${descriptionHtml}</div>
            <div class="bk-modal__row">
              <button class="bk-pill" type="button" data-action="fav" aria-pressed="${
                isFav ? "true" : "false"
              }">❤ Избранное</button>
              <a class="bk-pill" href="${escapeHtml(event.url || "#")}" target="_blank" rel="noreferrer noopener">Открыть ссылку</a>
            </div>
            <div class="bk-modal__row">
              ${tags.map((t) => `<span class="bk-tag">${escapeHtml(t)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function byStartsAtAsc(a, b) {
    const da = parseDate(a.startsAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    const db = parseDate(b.startsAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    if (da !== db) return da - db;
    return String(a.id).localeCompare(String(b.id), "ru-RU");
  }

  function normalizeEvent(raw, index) {
    const id = typeof raw?.id === "string" && raw.id ? raw.id : `api-${index + 1}`;
    const startsAt =
      typeof raw?.startsAt === "string" && raw.startsAt
        ? raw.startsAt
        : new Date().toISOString();
    const gallery = Array.isArray(raw?.gallery)
      ? raw.gallery.filter((item) => typeof item === "string" && item.length > 0)
      : [];
    const image = typeof raw?.image === "string" ? raw.image : FALLBACK_IMAGE;
    const normalizedGallery = gallery.length > 0 ? gallery : image ? [image] : [FALLBACK_IMAGE];

    return {
      id,
      title: typeof raw?.title === "string" ? raw.title : "Без названия",
      startsAt,
      endsAt: typeof raw?.endsAt === "string" ? raw.endsAt : undefined,
      city: typeof raw?.city === "string" ? raw.city : "Москва",
      venue: typeof raw?.venue === "string" ? raw.venue : "Локация",
      address: typeof raw?.address === "string" ? raw.address : "",
      price: raw?.price ?? undefined,
      tags: Array.isArray(raw?.tags) ? raw.tags : [],
      image,
      gallery: normalizedGallery,
      description: typeof raw?.description === "string" ? raw.description : "",
      url: typeof raw?.url === "string" ? raw.url : "https://t.me/okolodating_bot",
    };
  }

  function normalizePagePayload(payload) {
    const items = Array.isArray(payload?.events) ? payload.events : [];
    const pageInfo = payload?.pageInfo ?? {};
    return {
      events: items.map(normalizeEvent),
      pageInfo: {
        hasMore: Boolean(pageInfo.hasMore),
        nextCursor: typeof pageInfo.nextCursor === "string" ? pageInfo.nextCursor : null,
      },
    };
  }

  async function loadEventsPageFromApi({ cursor, limit }) {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    const res = await fetch(`/api/events?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Events API failed: ${res.status}`);
    const payload = await res.json();
    return normalizePagePayload(payload);
  }

  const dom = {
    list: document.getElementById("bk-list"),
    status: document.getElementById("bk-status"),
    feedPieces: document.getElementById("bk-feed-pieces"),
    pagination: document.getElementById("bk-pagination"),
    filtersButton: document.getElementById("bk-filters-button"),
    filterDrawer: document.getElementById("bk-filter-drawer"),
    filterOpenButtons: document.querySelectorAll("[data-filter-open]"),
    filterCloseButtons: document.querySelectorAll("[data-filter-close]"),
    favsToggle: document.getElementById("bk-favs-toggle"),
    favsCount: document.getElementById("bk-favs-count"),
    profileToggle: document.getElementById("bk-profile-open"),
    authModal: document.getElementById("bk-auth-modal"),
    authClose: document.querySelector(".bk-auth-modal__close"),
    modal: document.getElementById("bk-modal"),
    modalForm: document.getElementById("bk-modal-form"),
    modalBody: document.getElementById("bk-modal-body"),
    toTop: document.getElementById("bk-top"),
  };

  const state = {
    pageSize: 12,
    currentPage: 1,
    favsOnly: readFavsOnlyFromUrl() ?? readBool(LS.favsOnly, false),
    favs: readFavs(),
    modalEventId: null,
    modalImageIndex: 0,
    pageCache: new Map(),
    pageCursorByPage: new Map([[1, null]]),
    hasMoreByPage: new Map(),
    useApi: true,
    isLoadingPage: false,
  };

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setStatus(text) {
    if (!dom.status) return;
    dom.status.textContent = text;
  }

  function setFeedPiecesCount(count) {
    if (!dom.feedPieces) return;
    const safeCount = Number.isFinite(count) && count > 0 ? count : 0;
    dom.feedPieces.textContent = `${safeCount} позиций`;
  }

  function updateFavsCount() {
    if (!dom.favsCount) return;
    dom.favsCount.textContent = String(state.favs.size);
  }

  function applyFavsOnly() {
    if (!dom.favsToggle) return;
    dom.favsToggle.setAttribute("aria-pressed", state.favsOnly ? "true" : "false");
  }

  function getFallbackSourceEvents() {
    return EVENTS.slice().sort(byStartsAtAsc);
  }

  function getPageEvents(page) {
    return state.pageCache.get(page) ?? [];
  }

  function getVisibleEventsForCurrentPage() {
    let events = getPageEvents(state.currentPage);
    if (state.favsOnly) {
      events = events.filter((event) => state.favs.has(event.id));
    }
    return events;
  }

  function findEventById(id) {
    for (const pageEvents of state.pageCache.values()) {
      const found = pageEvents.find((event) => event.id === id);
      if (found) return found;
    }
    return EVENTS.find((event) => event.id === id);
  }

  async function ensurePageLoaded(page) {
    if (state.pageCache.has(page)) return true;

    if (!state.useApi) {
      const source = getFallbackSourceEvents();
      const offset = (page - 1) * state.pageSize;
      const slice = source.slice(offset, offset + state.pageSize);
      const hasMore = offset + state.pageSize < source.length;
      state.pageCache.set(page, slice);
      state.hasMoreByPage.set(page, hasMore);
      if (hasMore) state.pageCursorByPage.set(page + 1, `local:${page + 1}`);
      return slice.length > 0 || page === 1;
    }

    const cursor = state.pageCursorByPage.get(page);
    if (page !== 1 && typeof cursor !== "string") return false;

    state.isLoadingPage = true;
    try {
      const payload = await loadEventsPageFromApi({
        cursor: page === 1 ? null : cursor,
        limit: state.pageSize,
      });

      state.pageCache.set(page, payload.events);
      state.hasMoreByPage.set(page, payload.pageInfo.hasMore);
      if (payload.pageInfo.hasMore && payload.pageInfo.nextCursor) {
        state.pageCursorByPage.set(page + 1, payload.pageInfo.nextCursor);
      }

      // If API returns an empty first page, fall back to local card set
      // so the catalog still renders a usable default card.
      if (page === 1 && payload.events.length === 0) {
        state.useApi = false;
        state.pageCache.clear();
        state.pageCursorByPage.clear();
        state.hasMoreByPage.clear();
        state.pageCursorByPage.set(1, null);
        return ensurePageLoaded(page);
      }

      return payload.events.length > 0 || page === 1;
    } catch {
      // Degrade gracefully to local fallback set if API is unavailable.
      state.useApi = false;
      state.pageCache.clear();
      state.pageCursorByPage.clear();
      state.hasMoreByPage.clear();
      state.pageCursorByPage.set(1, null);
      return ensurePageLoaded(page);
    } finally {
      state.isLoadingPage = false;
    }
  }

  function renderPagination() {
    if (!dom.pagination) return;
    const current = state.currentPage;
    const hasPrev = current > 1;
    const hasNext = Boolean(
      state.pageCache.has(current + 1) || state.hasMoreByPage.get(current)
    );

    dom.pagination.innerHTML = `
      <button type="button" class="bk-pagination__nav" data-page-action="prev" ${hasPrev ? "" : "disabled"}>Туда</button>
      <button type="button" class="bk-pagination__nav" data-page-action="next" ${hasNext ? "" : "disabled"}>Сюда</button>
    `;
  }

  async function renderCurrentPage() {
    if (!dom.list) return;
    dom.list.innerHTML = "";

    const loaded = await ensurePageLoaded(state.currentPage);
    if (!loaded && state.currentPage > 1) {
      state.currentPage -= 1;
      return renderCurrentPage();
    }

    let slice = getPageEvents(state.currentPage);
    if (state.favsOnly) {
      slice = slice.filter((event) => state.favs.has(event.id));
    }
    setFeedPiecesCount(slice.length);

    if (slice.length === 0) {
      setStatus(
        state.favsOnly
          ? "Пока пусто — добавь события в избранное."
          : "Скоро появятся новые подборки."
      );
      renderPagination();
      return;
    }

    const htmlParts = [];
    for (const [index, event] of slice.entries()) {
      const isHighPriority = state.currentPage === 1 && index < 2;
      htmlParts.push(eventToCardHtml(event, { isHighPriority }));
    }

    dom.list.insertAdjacentHTML("beforeend", htmlParts.join(""));
    setStatus(`Страница ${state.currentPage}`);
    renderPagination();
  }

  function toggleFav(id) {
    if (state.favs.has(id)) state.favs.delete(id);
    else state.favs.add(id);
    writeFavs(state.favs);
    updateFavsCount();
  }

  function openModalFor(id, options = {}) {
    if (!dom.modal || !dom.modalBody) return;
    const requestedImageIndex = Number(options.imageIndex ?? 0);
    const visibleEvents = getVisibleEventsForCurrentPage();
    const list = visibleEvents.length > 0 ? visibleEvents : EVENTS;
    const event = list.find((e) => e.id === id) ?? findEventById(id);
    if (!event) return;
    const gallery = getEventGallery(event);
    const activeImageIndex = Number.isFinite(requestedImageIndex)
      ? Math.max(0, Math.min(gallery.length - 1, requestedImageIndex))
      : 0;

    state.modalEventId = id;
    state.modalImageIndex = activeImageIndex;
    dom.modalBody.innerHTML = eventToModalHtml(event, {
      isFav: state.favs.has(id),
      activeImageIndex,
    });
    if (!dom.modal.open) {
      if (typeof dom.modal.showModal === "function") dom.modal.showModal();
      else dom.modal.setAttribute("open", "open");
    }
  }

  function closeModal() {
    if (!dom.modal) return;
    state.modalEventId = null;
    state.modalImageIndex = 0;
    if (typeof dom.modal.close === "function") dom.modal.close();
    else dom.modal.removeAttribute("open");
  }

  function syncCardFavButtons() {
    if (!dom.list) return;
    for (const btn of dom.list.querySelectorAll('button[data-action="fav"]')) {
      const card = btn.closest("[data-id]");
      if (!card) continue;
      const id = card.getAttribute("data-id");
      btn.setAttribute("aria-pressed", state.favs.has(id) ? "true" : "false");
    }
  }

  function syncModalFavButton() {
    if (!dom.modalBody || !state.modalEventId) return;
    const btn = dom.modalBody.querySelector('button[data-action="fav"]');
    if (!btn) return;
    btn.setAttribute("aria-pressed", state.favs.has(state.modalEventId) ? "true" : "false");
  }

  function navigateModal(direction) {
    if (!state.modalEventId) return;
    const events = getVisibleEventsForCurrentPage();
    if (!events.length) return;
    const index = events.findIndex((event) => event.id === state.modalEventId);
    if (index < 0) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= events.length) return;
    const target = events[nextIndex];
    if (!target) return;
    openModalFor(target.id, { imageIndex: 0 });
  }

  async function rerender({ keepScroll }) {
    const scrollY = window.scrollY;
    await renderCurrentPage();
    syncCardFavButtons();
    applyFavsOnly();
    if (keepScroll) window.scrollTo({ top: scrollY });
  }

  function openAuthModal() {
    if (!dom.authModal) return;
    if (typeof dom.authModal.showModal === "function") dom.authModal.showModal();
    else dom.authModal.setAttribute("open", "open");
  }

  function closeAuthModal() {
    if (!dom.authModal) return;
    if (typeof dom.authModal.close === "function") dom.authModal.close();
    else dom.authModal.removeAttribute("open");
  }

  function openFilterDrawer() {
    if (!dom.filterDrawer) return;
    dom.filterDrawer.classList.add("is-open");
    dom.filterDrawer.setAttribute("aria-hidden", "false");
    if (dom.filtersButton) dom.filtersButton.setAttribute("aria-expanded", "true");
  }

  function closeFilterDrawer() {
    if (!dom.filterDrawer) return;
    dom.filterDrawer.classList.remove("is-open");
    dom.filterDrawer.setAttribute("aria-hidden", "true");
    if (dom.filtersButton) dom.filtersButton.setAttribute("aria-expanded", "false");
  }

  async function init() {
    if (!dom.list) return;

    document.addEventListener(
      "error",
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLImageElement)) return;
        const fallback = target.dataset.fallback;
        if (!fallback || target.src === fallback) return;
        target.src = fallback;
      },
      true
    );

    setStatus("Загружаем карточки из базы...");
    state.pageCache.clear();
    state.pageCursorByPage.clear();
    state.hasMoreByPage.clear();
    state.pageCursorByPage.set(1, null);
    await ensurePageLoaded(1);

    updateFavsCount();
    applyFavsOnly();
    syncFavsOnlyUrl(state.favsOnly);
    await renderCurrentPage();

    if (dom.favsToggle) {
      dom.favsToggle.addEventListener("click", async () => {
        state.favsOnly = !state.favsOnly;
        writeBool(LS.favsOnly, state.favsOnly);
        syncFavsOnlyUrl(state.favsOnly);
        state.currentPage = 1;
        await rerender({ keepScroll: false });
      });
    }

    if (dom.pagination) {
      dom.pagination.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const navBtn = target.closest("[data-page-action]");
        if (!navBtn) return;
        const action = navBtn.getAttribute("data-page-action");
        if (action === "prev" && state.currentPage > 1) {
          state.currentPage -= 1;
          await rerender({ keepScroll: false });
        }
        if (action === "next") {
          const nextPage = state.currentPage + 1;
          const canMove =
            state.pageCache.has(nextPage) ||
            state.hasMoreByPage.get(state.currentPage) === true;
          if (!canMove) return;
          const loaded = await ensurePageLoaded(nextPage);
          if (!loaded) return;
          state.currentPage = nextPage;
          await rerender({ keepScroll: false });
        }
      });
    }

    if (dom.profileToggle) {
      dom.profileToggle.addEventListener("click", openAuthModal);
    }

    if (dom.authClose) {
      dom.authClose.addEventListener("click", (event) => {
        event.preventDefault();
        closeAuthModal();
      });
    }

    for (const openBtn of dom.filterOpenButtons) {
      openBtn.addEventListener("click", (event) => {
        event.preventDefault();
        openFilterDrawer();
        setStatus("Фильтры добавим в следующем функциональном цикле.");
      });
    }

    for (const closeBtn of dom.filterCloseButtons) {
      closeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        closeFilterDrawer();
      });
    }

    dom.list.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const actionEl = target.closest("[data-action]");
      const card = target.closest("[data-id]");
      if (!card) return;
      const id = card.getAttribute("data-id");
      if (!id) return;
      const action = actionEl?.getAttribute("data-action");

      if (action === "fav") {
        e.preventDefault();
        toggleFav(id);
        syncCardFavButtons();
        syncModalFavButton();
        if (state.favsOnly && !state.favs.has(id)) void rerender({ keepScroll: true });
        return;
      }

      if (action === "open") {
        e.preventDefault();
        openModalFor(id, { imageIndex: 0 });
        return;
      }

      if (action === "link") {
        return;
      }
    });

    dom.list.addEventListener("keydown", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const card = target.closest(".bk-card[data-id]");
      if (!card) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      const id = card.getAttribute("data-id");
      if (!id) return;
      openModalFor(id, { imageIndex: 0 });
    });

    if (dom.modal) {
      dom.modal.addEventListener("click", (e) => {
        if (e.target === dom.modal) closeModal();
      });
      dom.modal.addEventListener("close", () => {
        state.modalEventId = null;
        state.modalImageIndex = 0;
      });
    }

    if (dom.modalBody) {
      dom.modalBody.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const thumbBtn = target.closest('button[data-action="modal-thumb"]');
        if (thumbBtn) {
          if (!state.modalEventId) return;
          const thumbIndex = Number(thumbBtn.getAttribute("data-index"));
          openModalFor(state.modalEventId, {
            imageIndex: Number.isFinite(thumbIndex) ? thumbIndex : 0,
          });
          return;
        }
        const btn = target.closest('button[data-action="fav"]');
        if (!btn || !state.modalEventId) return;
        toggleFav(state.modalEventId);
        syncModalFavButton();
        syncCardFavButtons();
        if (state.favsOnly && !state.favs.has(state.modalEventId)) {
          closeModal();
          void rerender({ keepScroll: true });
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dom.filterDrawer?.classList.contains("is-open")) {
        e.preventDefault();
        closeFilterDrawer();
        return;
      }
      if (!state.modalEventId || !dom.modal || !dom.modal.open) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateModal(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateModal(1);
      }
    });

    const onScroll = () => {
      const y = window.scrollY || 0;
      if (dom.toTop) dom.toTop.classList.toggle("bk-top--show", y > 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    if (dom.toTop) {
      dom.toTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      void init();
    });
  } else {
    void init();
  }
})();
