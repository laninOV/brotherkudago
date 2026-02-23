import { MARQUEE_WORDS } from "@/features/site/constants/marquee";

export function HeroSection() {
  return (
    <section className="bk-hero" aria-label="Главный экран">
      <div className="bk-hero__inner">
        <div className="bk-hero__rail" aria-hidden="true">
          <span>ОКОЛО В ГОРОДЕ</span>
          <span>СОБЫТИЯ И ЛЮДИ</span>
        </div>

        <div className="bk-hero__panel">
          <p className="bk-hero__eyebrow">ГОРОДСКОЙ МИКС / НЕДЕЛЬНЫЙ ДРОП</p>
          <h1 className="bk-hero__title">
            <span className="bk-hero__title-main">Старое</span>
            <span className="bk-hero__title-sub">это новое</span>
            <span className="bk-hero__title-sub">новое</span>
          </h1>
          <p className="bk-hero__lead">
            Добрая афиша города: находи места, где легко познакомиться и провести вечер вместе.
          </p>
        </div>
        <div className="bk-hero__media">
          <img
            className="bk-hero__photo"
            src="/iloveeventfest_files/peter-van-rooijen-band-s800x600.jpg"
            alt="Люди на музыкальном событии"
            width={800}
            height={600}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <p className="bk-hero__overlay" aria-hidden="true">
          ИГРА НА ПАУЗЕ
        </p>

        <a className="bk-hero__cta" href="#events">
          СМОТРЕТЬ АФИШУ →
        </a>
      </div>

      <div className="bk-feed__ticker bk-hero__ticker" aria-label="Декоративная строка">
        <div className="bk-feed__ticker-track" aria-hidden="true">
          <span>{MARQUEE_WORDS}</span>
          <span>{MARQUEE_WORDS}</span>
        </div>
      </div>
    </section>
  );
}
