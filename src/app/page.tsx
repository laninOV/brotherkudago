import Script from "next/script";
import type { CSSProperties } from "react";

export default function Home() {
  return (
    <>
      <a className="bk-skip" href="#main">
        Перейти к контенту
      </a>
      <header className="bk-header">
        <div className="bk-header__inner">
          <nav className="bk-nav bk-nav--left" aria-label="Разделы">
            <a className="bk-nav__link" href="#how">
              Как это работает?
            </a>
            <a className="bk-nav__link" href="#events">
              Лента
            </a>
          </nav>

          <a className="bk-brand" href="/" aria-label="На главную">
            <span className="bk-brand__wordmark">ОКОЛО</span>
            <span className="bk-brand__tagline">места люди знакомства</span>
          </a>

          <div className="bk-nav bk-nav--right" aria-label="Действия">
            <a
              className="bk-pill bk-pill--cta"
              href="https://t.me/okolodating_bot"
              target="_blank"
              rel="noopener"
            >
              Не с кем пойти?
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="bk-main">
        <section className="bk-hero bk-hero--gonzo" aria-label="Главный экран">
          <div className="bk-hero__inner">
            <div className="bk-hero__copy">
              <h1 className="bk-hero__title">Время не ждёт — открой что-то новое!</h1>
              <p className="bk-hero__lead">
                Не упустите шанс узнать о самых интересных местах и событиях вокруг.
              </p>
              <a
                className="bk-hero__cta"
                href="https://t.me/okolodating_bot"
                target="_blank"
                rel="noopener"
              >
                Пойдём вместе?
              </a>
            </div>
            <div className="bk-hero__art" aria-hidden="true">
              <img
                className="bk-hero__sun"
                src="/солнышко image_1769856424448.png"
                alt=""
                width={1120}
                height={928}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <img
                className="bk-hero__flower"
                src="/freepik_br_ed8a600f-0fae-4edc-9ee2-fd1d684aa2a2.png"
                alt=""
                width={1152}
                height={896}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
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
              <path
                d="M32 18v26"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </a>
          <section className="bk-marquee" aria-label="Лента слоганов">
            <div className="bk-marquee__track" aria-hidden="true">
              <span>
                МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ •
                ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА •
              </span>
              <span aria-hidden="true">
                МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ •
                ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА •
              </span>
            </div>
          </section>
        </section>

        <section id="events" className="bk-feed bk-feed--checkered" aria-label="Список событий">
          <div className="bk-feed__inner">
            <h2 className="bk-sr-only">Лента событий</h2>
            <div id="bk-list" className="bk-list"></div>
            <div className="bk-status-wrapper">
              <div id="bk-status" className="bk-status" aria-live="polite">
                Собираем идеи вокруг города…
              </div>
            </div>
          </div>
        </section>

        <section className="bk-marquee" aria-label="Лента слоганов">
          <div className="bk-marquee__track" aria-hidden="true">
            <span>
              МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ •
              ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА •
            </span>
            <span aria-hidden="true">
              МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА • МЕСТА • ЛЮДИ •
              ЗНАКОМСТВА • МЕСТА • ЛЮДИ • ЗНАКОМСТВА •
            </span>
          </div>
        </section>

        <section id="about" className="bk-about-simple" aria-label="О проекте">
          <div className="bk-about-simple__inner">
            <div className="bk-about-simple__grid">
              <div className="bk-about-simple__copy">
                <h2>ОКОЛО — это про людей</h2>
                <p>ОКОЛО помогает выбраться из дома и открыть что-то новое рядом.</p>
                <p>
                  Листай ленту событий, сохраняй то, что нравится, и собирай свой план на неделю.
                </p>
                <p>
                  А если хочется пойти не одному — заходи в Telegram: найдём компанию и подберём идею
                  под настроение.
                </p>
              </div>
              <div className="bk-about-simple__aside" aria-hidden="true">
                <img
                  className="bk-about-simple__art"
                  src="/assets/gonzo/icons/group-56.png"
                  alt=""
                  width={284}
                  height={628}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="bk-services" aria-label="Как это работает">
          <h2 className="bk-services__title">Три простых шага</h2>
          <div className="bk-services__grid">
            <article className="bk-service-card" style={{ "--bk-card-accent": "var(--bk-accent-2)" } as CSSProperties}>
              <img
                className="bk-service-card__icon"
                src="/два%20цветка.png"
                alt=""
                width={1088}
                height={960}
                loading="lazy"
                decoding="async"
              />
              <h3>Листай</h3>
              <p>Находи мероприятия в ленте — быстро и без лишних настроек.</p>
            </article>
            <article className="bk-service-card" style={{ "--bk-card-accent": "var(--bk-accent-1)" } as CSSProperties}>
              <img
                className="bk-service-card__icon"
                src="/assets/gonzo/icons/daisy.svg"
                alt=""
                width={88}
                height={88}
                loading="lazy"
                decoding="async"
              />
              <h3>Сохраняй</h3>
              <p>Добавляй карточки в избранное, чтобы собрать свой список.</p>
            </article>
            <article className="bk-service-card" style={{ "--bk-card-accent": "#2a82b6" } as CSSProperties}>
              <img
                className="bk-service-card__icon"
                src="/цветочек%20в%20очках!.png"
                alt=""
                width={1120}
                height={928}
                loading="lazy"
                decoding="async"
              />
              <h3>Иди</h3>
              <p>Если не хочешь идти один — заходи в Telegram и обязательно найдёшь классную компанию.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="bk-site-footer" aria-label="Подвал">
        <div className="bk-site-footer__inner">
          <img
            className="bk-site-footer__sticker"
            src="/главный цветок!.png"
            alt=""
            aria-hidden="true"
            width={1152}
            height={896}
            loading="lazy"
            decoding="async"
          />
          <div className="bk-site-footer__content">
            <div className="bk-site-footer__marks" aria-hidden="true">
              <div className="bk-site-footer__mark">О</div>
              <div className="bk-site-footer__mark bk-site-footer__mark--alt">Мы тут!</div>
            </div>
            <h2 className="bk-site-footer__title">Мы тут!</h2>
            <a
              href="https://t.me/okolodating_bot"
              target="_blank"
              rel="noopener"
              className="bk-site-footer__cta"
            >
              Пиши в Telegram
            </a>
            <p className="bk-site-footer__copy">
              Пиши сюда с предложениями, идеями и актуальными датами — мы внимательно подхватываем
              любой инфопоток.
            </p>
          </div>
        </div>
      </footer>

      <dialog id="bk-modal" className="bk-modal">
        <form id="bk-modal-form" method="dialog" className="bk-modal__dialog">
          <div id="bk-modal-body"></div>
        </form>
      </dialog>

      <button id="bk-top" className="bk-top" type="button" aria-label="Наверх">
        ↑
      </button>
      <dialog id="bk-auth-modal" className="bk-auth-modal">
        <form method="dialog" className="bk-auth-modal__dialog">
          <button className="bk-auth-modal__close" type="button" aria-label="Закрыть">
            ✕
          </button>
          <div className="bk-auth-modal__grid">
            <div className="bk-auth-modal__copy">
              <p className="bk-auth-modal__eyebrow">Микс событий</p>
              <h3>Войдите, чтобы сохранять подборки и синхронизировать избранное.</h3>
              <p>
                Пока всё хранится локально, но в будущем обязательно привяжем личные кабинеты,
                распределённые подборки и напоминания.
              </p>
            </div>
            <div className="bk-auth-modal__form">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="hi@event.example…"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  required
                />
              </label>
              <label>
                Пароль
                <input
                  type="password"
                  name="password"
                  placeholder="минимум 8 символов…"
                  autoComplete="current-password"
                  required
                />
              </label>
              <div className="bk-auth-modal__actions">
                <button type="submit" className="bk-button">
                  Войти
                </button>
                <button type="button" className="bk-button bk-button--ghost" data-register>
                  Регистрация
                </button>
              </div>
              <p className="bk-auth-modal__tip">
                Этот прототип пока не отправляет запросы — данные будут выгружены в реальный аккаунт
                позже.
              </p>
            </div>
          </div>
        </form>
      </dialog>

      <Script src="/brotherkudago.js" strategy="afterInteractive" />
    </>
  );
}
