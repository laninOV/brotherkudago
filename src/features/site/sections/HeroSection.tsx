export function HeroSection() {
  return (
    <section className="bk-hero bk-hero--gonzo" aria-label="Главный экран">
      <div className="bk-hero__inner">
        <div className="bk-hero__copy bk-hero__copy--stacked">
          <h1 className="bk-hero__title">Время не ждёт!</h1>
        </div>
        <div className="bk-hero__art bk-hero__art--center" aria-hidden="true">
          <img
            className="bk-hero__sun"
            src="/sun.png"
            alt=""
            width={1120}
            height={928}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <img
            className="bk-hero__flower"
            src="/flower-glasses.png"
            alt=""
            width={1152}
            height={896}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <img className="bk-hero__bee" src="/bee.png" alt="" width={88} height={88} loading="lazy" decoding="async" />
          <span className="bk-hero__cta-secondary">Открой что-то новое!</span>
        </div>
      </div>
      <a className="bk-scrollhint" href="#events" aria-label="Прокрутить вниз к ленте">
        <span className="bk-scrollhint__text">листай вниз</span>
        <svg className="bk-scrollhint__arrow" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M14 26c8 10 18 18 18 18s10-8 18-18"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M32 18v26" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </a>
      <section className="bk-marquee" aria-label="Лента слоганов">
        <div className="bk-marquee__track" aria-hidden="true">
          <span>
            КАФЕ • МУЗЕИ • ВЕЧЕРИНКИ • ЛЮДИ • СВИДАНИЯ • ВЫСТАВКИ • КВЕСТЫ • ОБЩЕНИЕ • КИНО • ПРОГУЛКИ • РЕСТОРАНЫ • ЛЕКЦИИ •
            ТЕАТРЫ • БАРЫ • СОБЫТИЯ • КОНЦЕРТЫ • ВСТРЕЧИ • МАСТЕР-КЛАССЫ • ХОББИ • ПУТЕШЕСТВИЯ • ФЕСТИВАЛИ • ИГРЫ • ТАНЦЫ •
            СПОРТ • ОТДЫХ • ИСКУССТВО • НАУКА • КНИГИ • ФОТО • ШОУ • ТРЕНИНГИ • ТРЕНИРОВКИ • БИБЛИОТЕКИ • МЕРОПРИЯТИЯ •
            ЗНАКОМСТВА • ПРАЗДНИКИ • КУЛИНАРИЯ • ПРОГУЛКИ •
          </span>
          <span aria-hidden="true">
            КАФЕ • МУЗЕИ • ВЕЧЕРИНКИ • ЛЮДИ • СВИДАНИЯ • ВЫСТАВКИ • КВЕСТЫ • ОБЩЕНИЕ • КИНО • ПРОГУЛКИ • РЕСТОРАНЫ • ЛЕКЦИИ •
            ТЕАТРЫ • БАРЫ • СОБЫТИЯ • КОНЦЕРТЫ • ВСТРЕЧИ • МАСТЕР-КЛАССЫ • ХОББИ • ПУТЕШЕСТВИЯ • ФЕСТИВАЛИ • ИГРЫ • ТАНЦЫ •
            СПОРТ • ОТДЫХ • ИСКУССТВО • НАУКА • КНИГИ • ФОТО • ШОУ • ТРЕНИНГИ • ТРЕНИРОВКИ • БИБЛИОТЕКИ • МЕРОПРИЯТИЯ •
            ЗНАКОМСТВА • ПРАЗДНИКИ • КУЛИНАРИЯ • ПРОГУЛКИ •
          </span>
        </div>
      </section>
    </section>
  );
}
