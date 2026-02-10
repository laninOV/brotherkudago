import Script from "next/script";
import { AboutSection } from "@/features/site/sections/AboutSection";
import { EventsSection } from "@/features/site/sections/EventsSection";
import { HeroSection } from "@/features/site/sections/HeroSection";
import { ServicesSection } from "@/features/site/sections/ServicesSection";
import { SiteFooterSection } from "@/features/site/sections/SiteFooterSection";

export default function Home() {
  return (
    <>
      <a className="bk-skip" href="#main">
        Перейти к контенту
      </a>
      <header className="bk-header">
        <div className="bk-header__inner">
          <details className="bk-menu" aria-label="Меню">
            <summary className="bk-menu__toggle" aria-label="Открыть меню">
              <span className="bk-menu__bar" aria-hidden="true"></span>
              <span className="bk-menu__bar" aria-hidden="true"></span>
              <span className="bk-menu__bar" aria-hidden="true"></span>
            </summary>
            <div className="bk-menu__backdrop" data-menu-close aria-hidden="true"></div>
            <div className="bk-menu__panel" role="navigation" aria-label="Разделы">
              <button className="bk-menu__close" type="button" data-menu-close aria-label="Закрыть меню">
                ✕
              </button>
              <a className="bk-nav__link" href="#how">
                Как это работает?
              </a>
              <a className="bk-nav__link" href="#events">
                Лента
              </a>
            </div>
          </details>

          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
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
              <span className="bk-pill__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <path
                    d="M20.6 4.4c.3-.1.6 0 .8.2.2.2.3.5.2.8l-3 14c-.1.4-.4.6-.7.7-.3.1-.7 0-1-.2l-4.5-3.3-2.2 2.2c-.2.2-.4.3-.7.2-.3-.1-.4-.3-.4-.6l.1-3.2 8.2-7.3-9.2 6-3.6-1.1c-.4-.1-.6-.4-.6-.8s.3-.7.7-.8l15.9-6.3z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Не с кем пойти?
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="bk-main">
        <HeroSection />

        <EventsSection />

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

        <AboutSection />

        <ServicesSection />
      </main>
      <SiteFooterSection />

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
