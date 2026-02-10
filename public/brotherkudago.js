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
      id: "evt-201",
      title: "Кантина Tatooine: ужин и контактный бар",
      startsAt: "2026-02-10T19:00:00+03:00",
      city: "Москва",
      venue: "Кантина | Ресторан-бар Tatooine",
      address: "ул. Петровка, 23/10с5",
      price: { min: 1500, max: 3000, currency: "RUB" },
      tags: ["ресторан", "бар", "этническая музыка"],
      image:
        "https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/628060285_17851450998654319_3642420885353076683_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=103&ig_cache_key=MzgyNDMxOTg4Nzk4OTAzMDQ4OTE3ODUxNDUwOTkyNjU0MzE5.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjc2MHgxMzUwLnNkci5DMyJ9&_nc_ohc=e4ThFcL5xNAQ7kNvwHDvoJm&_nc_oc=AdmH5eoPNahUlFVnEQpq9uz2j70QXwjupMKCtJw8qMWx0hgSm8cPl8-QbSE0GVzhrhQTD1bN95eb-L5Vl599Zqmh&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_gid=wE-kxWQk8B1EFM8dSLMhYA&oh=00_AfuXs_s4Qj5zjQaOzA-8JL-beLDTbfU9USr0DwXhIDW17w&oe=698B921E",
      description:
        "Еда — про память, напитки — про выбор. Контактный бар, этническая музыка, формат для новых знакомств. Профиль: instagram.com/tatooine.rest. Фото: instagram.com/p/DUStq0PDD5Z/ и instagram.com/p/DUN5jpzDE2-/",
      url: "https://www.instagram.com/tatooine.rest/",
    },
    {
      id: "evt-202",
      title: "«Билет в открытое хранение» — Гараж",
      startsAt: "2026-02-05T11:00:00+03:00",
      city: "Москва",
      venue: "МСИ «Гараж»",
      address: "ул. Крымский Вал, 9",
      price: { min: 600, currency: "RUB" },
      tags: ["выставка", "архив", "арт"],
      image: "https://avatars.mds.yandex.net/get-afishanew/5098259/b6d481bb409bbe3e4973ce8bc679981e/s940x380",
      description:
        "Кураторы открывают архивы московского гардероба и показывают, как предметы из хранения заводят диалоги с новыми артистами.",
      url: "https://garagemca.org",
    },
    {
      id: "evt-203",
      title: "Пистоны времени — МАММ",
      startsAt: "2026-02-08T13:00:00+03:00",
      city: "Москва",
      venue: "Мультимедиа Арт Музей",
      address: "ул. Остоженка, 16",
      price: { min: 500, currency: "RUB" },
      tags: ["дизайн", "кинетика", "инсталляция"],
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      description:
        "Кинетические скульптуры и неон проговаривают о том, что означает «город будущего» здесь и сейчас.",
      url: "https://www.mamm-mdf.ru",
    },
    {
      id: "evt-204",
      title: "Фестиваль кофе и крафта «Вкус страны»",
      startsAt: "2026-02-15T11:00:00+03:00",
      city: "Москва",
      venue: "Культурный центр «Винзавод»",
      address: "ул. Докукина, 14",
      price: { min: 400, currency: "RUB" },
      tags: ["кофе", "маркет", "дегустации"],
      image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80",
      description:
        "Зал Винзавода превращается в гастрономический базар: фермеры, барысты и ремесленники всю субботу варят, жарят и связывают.",
      url: "https://winzavod.ru",
    },
    {
      id: "evt-205",
      title: "Останкинская телебашня. Панорама Москвы 360°",
      startsAt: "2026-02-16T10:00:00+03:00",
      city: "Москва",
      venue: "Останкинская телебашня",
      address: "ул. Академика Королёва, 15",
      price: { min: 900, currency: "RUB" },
      tags: ["экскурсия", "панорама", "высота"],
      image: "https://avatars.mds.yandex.net/get-afishanew/5098259/70da5ba866166f38865b016d30ac2beb/1080x608",
      description:
        "Подъём на самую высокую точку столицы и вид на проливы рек с прозрачного пола — лучшее, что можно сделать в ясный день.",
      url: "https://tvtower.ru",
    },
    {
      id: "evt-206",
      title: "Останкинская телебашня. Башня изнутри",
      startsAt: "2026-02-16T18:00:00+03:00",
      city: "Москва",
      venue: "Останкинская телебашня",
      address: "ул. Академика Королёва, 15",
      price: { min: 1100, currency: "RUB" },
      tags: ["экскурсия", "закулисье", "техника"],
      image: "https://avatars.mds.yandex.net/get-afishanew/4395007/ed703f85e81260fc6f7f027cc67e4f44/1080x608",
      description:
        "Гид ведёт по техническим переходам, рассказывает про кабели, лифты и показывает скрытые балконы с видом на башню.",
      url: "https://tvtower.ru",
    },
    {
      id: "evt-207",
      title: "День архитектуры",
      startsAt: "2026-02-12T15:00:00+03:00",
      city: "Москва",
      venue: "Центр «Мосгортур»",
      address: "ул. Сретенка, 10",
      price: { min: 450, currency: "RUB" },
      tags: ["архитектура", "урбанистика", "прогулка"],
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      description:
        "Публичные и закрытые дворы, витрины с авторскими проектами и кофе-брейк внутри жилого особняка — день, чтобы влюбиться в город.",
      url: "https://mosgor.tour",
    },
    {
      id: "evt-208",
      title: "Музыка в планетарии: Jazz & Stars",
      startsAt: "2026-02-20T19:00:00+03:00",
      city: "Москва",
      venue: "Планетарий",
      address: "Просп. Мира, 118",
      price: { min: 4500, currency: "RUB" },
      tags: ["джаз", "звёзды", "свет"],
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
      description:
        "Живой квартет звучит под сферическим куполом, а световые проекции рисуют созвездия прямо над зрителем.",
      url: "https://planetarium.ru",
    },
    {
      id: "evt-209",
      title: "Это лето фестиваль",
      startsAt: "2026-06-06T18:00:00+03:00",
      city: "Москва",
      venue: "Музеон",
      address: "Крымский Вал, 2",
      price: { min: 4000, currency: "RUB" },
      tags: ["фестиваль", "открытый", "арт"],
      image: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1200&q=80",
      description:
        "Поляна в Музеоне с инсталляциями, вечерними концертами и баром на свежем воздухе — летний формат с ноткой джаза.",
      url: "https://museonpark.ru",
    },
    {
      id: "evt-210",
      title: "Катки в парке Горького",
      startsAt: "2026-01-31T19:00:00+03:00",
      city: "Москва",
      venue: "Парк Горького",
      address: "Крымский Вал, 9",
      price: { min: 500, currency: "RUB" },
      tags: ["спорт", "лед", "ночь"],
      image: "https://images.unsplash.com/photo-1444492416850-3001369ed0b2?auto=format&fit=crop&w=1200&q=80",
      description:
        "Горит неон, звучит dj-сет и каждый вечер появляется пара шоу на льду — удобное масштабное свидание.",
      url: "https://gorkypark.ru",
    },
    {
      id: "evt-211",
      title: "Легенды ВИА 70–80-х «Мы из СССР!»",
      startsAt: "2026-02-04T19:00:00+03:00",
      city: "Москва",
      venue: "Кремлёвский дворец",
      address: "ул. Воздвиженка, 1",
      price: { min: 2500, currency: "RUB" },
      tags: ["концерт", "ретро", "оригинал"],
      image: "https://images.unsplash.com/photo-1464375117522-1311d6a5b29a?auto=format&fit=crop&w=1200&q=80",
      description:
        "Ансамбль-кабаре возвращает ВИА и кураж эпохи, а сценические костюмы – это короткое путешествие в СССР.",
      url: "https://kremlinpalace.org",
    },
    {
      id: "evt-212",
      title: "Главный стендап",
      startsAt: "2026-02-25T20:00:00+03:00",
      city: "Москва",
      venue: "Студия StandUp",
      address: "ул. Васька, 14",
      price: { min: 1190, currency: "RUB" },
      tags: ["комедия", "новое", "онлайн"],
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80",
      description:
        "Лучшие комики пробуют свежие шутки и делятся историями про город, пока публика сидит с кокосовыми лимонадами.",
      url: "https://standup-club.ru",
    },
    {
      id: "evt-213",
      title: "Мюзикл «Изумрудный город»",
      startsAt: "2026-02-14T12:00:00+03:00",
      city: "Москва",
      venue: "Цирк",
      address: "пр-т Мира, 40",
      price: { min: 900, currency: "RUB" },
      tags: ["цирк", "сказка", "акробатика"],
      image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1200&q=80",
      description:
        "Сказка про Изумрудный город приобретает цирковую динамику с воздушными трюками и живым оркестром.",
      url: "https://www.circus.ru",
    },
    {
      id: "evt-214",
      title: "Концерт Алексей Чумаков",
      startsAt: "2026-03-08T20:00:00+03:00",
      city: "Москва",
      venue: "Концертный зал «Москва»",
      address: "ул. Тверская, 16",
      price: { min: 3200, currency: "RUB" },
      tags: ["поп", "лирика", "жизнь"],
      image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80",
      description:
        "Хиты, дуэты и шутливые монологи — вечер, где вокалист живо общается с публикой.",
      url: "https://www.moscow-concert.ru",
    },
    {
      id: "evt-215",
      title: "Субботний маркет «Новые имена»",
      startsAt: "2026-02-10T12:00:00+03:00",
      city: "Москва",
      venue: "Лофт «Арма»",
      address: "ул. Лубянский пр-д, 3",
      price: { min: 0, currency: "RUB" },
      tags: ["маркет", "крафт", "сообщество"],
      image: "https://images.unsplash.com/photo-1487202372775-1f9d79a4bd0b?auto=format&fit=crop&w=1200&q=80",
      description:
        "Авторские керамисты, графические художники и звуки винила в одном пространстве гончарной мастерской.",
      url: "https://armalab.ru",
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

  function truncate(text, max) {
    const value = String(text || "").trim();
    if (value.length <= max) return value;
    return `${value.slice(0, max - 1)}…`;
  }

  function eventToCardHtml(event, { isFav, isHighPriority }) {
    const starts = parseDate(event.startsAt);
    const startTime = starts ? formatTime(starts) : "";
    const dayTitle = starts ? humanDayTitle(starts) : "Дата не указана";
    const dayDelta = starts ? daysFromNow(starts) : null;
    const hot = typeof dayDelta === "number" && dayDelta >= 0 && dayDelta <= 1;

    const tags = Array.isArray(event.tags) ? event.tags.slice(0, 3) : [];
    const hotTag = hot ? `<span class="bk-tag bk-tag--hot">скоро</span>` : "";
    const tagHtml = [hotTag, ...tags.map((t) => `<span class="bk-tag">${escapeHtml(t)}</span>`)]
      .filter(Boolean)
      .join("");

    const imageSrc = event.image || FALLBACK_IMAGE;
    const loading = isHighPriority ? "eager" : "lazy";
    const fetchPriority = isHighPriority ? ' fetchpriority="high"' : "";
    const imageHtml = `<img src="${escapeHtml(
      imageSrc
    )}" alt="" width="1200" height="900" loading="${loading}" decoding="async"${fetchPriority} data-fallback="${escapeHtml(
      FALLBACK_IMAGE
    )}">`;

    const description = truncate(event.description || "", 140);

    return `
      <article class="bk-card" data-id="${escapeHtml(event.id)}" data-action="open" role="button" tabindex="0" aria-label="${escapeHtml(
      event.title
    )}">
        <div class="bk-card__media">
          ${imageHtml}
          <button class="bk-card__fav" type="button" aria-label="В избранное" aria-pressed="${
            isFav ? "true" : "false"
          }" data-action="fav">❤</button>
        </div>
        <div class="bk-card__body">
          <h3 class="bk-card__title">${escapeHtml(event.title)}</h3>
          <div class="bk-card__meta">
            <div class="bk-meta">
              <span class="bk-meta__item">📅 ${escapeHtml(dayTitle)}</span>
              <span class="bk-meta__item">🕒 ${escapeHtml(startTime || "—")}</span>
              <span class="bk-meta__item">🎟️ ${escapeHtml(formatPrice(event.price))}</span>
            </div>
          </div>
          <p class="bk-card__desc">${escapeHtml(description || "Описание скоро появится.")}</p>
          <div class="bk-tags">${tagHtml}</div>
        </div>
      </article>
    `;
  }

  function eventToModalHtml(event, { isFav, canPrev, canNext }) {
    const starts = parseDate(event.startsAt);
    const ends = event.endsAt ? parseDate(event.endsAt) : null;
    const when = starts
      ? `${humanDayTitle(starts)} · ${formatTime(starts)}${
          ends ? `–${formatTime(ends)}` : ""
        }`
      : "Дата не указана";

    const tags = Array.isArray(event.tags) ? event.tags : [];
    const imageSrc = event.image || FALLBACK_IMAGE;
    const imageHtml = `<img src="${escapeHtml(
      imageSrc
    )}" alt="" width="1200" height="900" loading="lazy" decoding="async" data-fallback="${escapeHtml(
      FALLBACK_IMAGE
    )}">`;

    const address = event.address ? ` · ${escapeHtml(event.address)}` : "";

    return `
      <div class="bk-modal__content">
        <button class="bk-modal__close" type="submit" value="close" aria-label="Закрыть">✕</button>
        <button class="bk-modal__nav bk-modal__nav--prev" type="button" data-action="modal-prev" aria-label="Предыдущее событие" ${
          canPrev ? "" : "disabled"
        }>
          <span aria-hidden="true">←</span>
          <span>Назад</span>
        </button>
        <button class="bk-modal__nav bk-modal__nav--next" type="button" data-action="modal-next" aria-label="Следующее событие" ${
          canNext ? "" : "disabled"
        }>
          <span>Вперёд</span>
          <span aria-hidden="true">→</span>
        </button>
        <div class="bk-modal__grid">
          <div class="bk-modal__image">${imageHtml}</div>
          <div>
            <h2 class="bk-modal__title">${escapeHtml(event.title)}</h2>
            <div class="bk-meta">
              <span class="bk-meta__item">📅 ${escapeHtml(when)}</span>
              <span class="bk-meta__item">🎟️ ${escapeHtml(formatPrice(event.price))}</span>
            </div>
            <p class="bk-modal__desc">${escapeHtml(event.description || "")}</p>
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
      image: typeof raw?.image === "string" ? raw.image : FALLBACK_IMAGE,
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
    pagination: document.getElementById("bk-pagination"),
    filtersButton: document.getElementById("bk-filters-button"),
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
      htmlParts.push(
        eventToCardHtml(event, { isFav: state.favs.has(event.id), isHighPriority })
      );
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

  function openModalFor(id) {
    if (!dom.modal || !dom.modalBody) return;
    const visibleEvents = getVisibleEventsForCurrentPage();
    const list = visibleEvents.length > 0 ? visibleEvents : EVENTS;
    const event = list.find((e) => e.id === id) ?? findEventById(id);
    if (!event) return;
    const index = list.findIndex((e) => e.id === event.id);
    const canPrev = index > 0;
    const canNext = index >= 0 && index < list.length - 1;
    state.modalEventId = id;
    dom.modalBody.innerHTML = eventToModalHtml(event, {
      isFav: state.favs.has(id),
      canPrev,
      canNext,
    });
    if (!dom.modal.open) {
      if (typeof dom.modal.showModal === "function") dom.modal.showModal();
      else dom.modal.setAttribute("open", "open");
    }
  }

  function closeModal() {
    if (!dom.modal) return;
    state.modalEventId = null;
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
    openModalFor(target.id);
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

  async function init() {
    if (!dom.list) return;

    const hero = document.querySelector('.bk-hero--gonzo');
    if (hero) {
      const onMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        hero.style.setProperty('--bk-hero-shift-x', `${dx * 40}px`);
        hero.style.setProperty('--bk-hero-shift-y', `${dy * 24}px`);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

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
        openModalFor(id);
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
      openModalFor(id);
    });

    if (dom.modal) {
      dom.modal.addEventListener("click", (e) => {
        if (e.target === dom.modal) closeModal();
      });
      dom.modal.addEventListener("close", () => {
        state.modalEventId = null;
      });
    }

    if (dom.modalBody) {
      dom.modalBody.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const prevBtn = target.closest('button[data-action="modal-prev"]');
        if (prevBtn) {
          navigateModal(-1);
          return;
        }
        const nextBtn = target.closest('button[data-action="modal-next"]');
        if (nextBtn) {
          navigateModal(1);
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

    if (dom.filtersButton) {
      dom.filtersButton.addEventListener("click", () => {
        setStatus("Фильтры скоро появятся.");
      });
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
