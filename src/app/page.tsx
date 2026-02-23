import Script from "next/script";
import { AboutSection } from "@/features/site/sections/AboutSection";
import { EventsSection } from "@/features/site/sections/EventsSection";
import { HeroSection } from "@/features/site/sections/HeroSection";
import { ServicesSection } from "@/features/site/sections/ServicesSection";
import { SiteFooterSection } from "@/features/site/sections/SiteFooterSection";
import { SiteMotionBootstrap } from "@/features/site/animations/SiteMotionBootstrap";

export default function Home() {
  return (
    <>
      <a className="bk-skip" href="#main">
        Перейти к контенту
      </a>
      <header className="bk-header">
        <div className="bk-header__inner">
          <div className="bk-header__left">
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
                <a className="bk-nav__link" href="#events">
                  Каталог
                </a>
                <a className="bk-nav__link" href="#about">
                  О проекте
                </a>
                <a className="bk-nav__link" href="#how">
                  Как начать
                </a>
                <a
                  className="bk-nav__link"
                  href="https://t.me/okolodating_bot"
                  target="_blank"
                  rel="noopener"
                >
                  Телеграм
                </a>
              </div>
            </details>
            <button className="bk-header__shop" type="button" aria-label="Афиша">
              АФИША
            </button>
            <button className="bk-header__search" type="button" aria-label="Открыть поиск">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
                <path d="m16.2 16.2 4 4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="bk-brand" href="/" aria-label="На главную">
            <span className="bk-brand__wordmark">ОКОЛО</span>
            <span className="bk-brand__tagline">места люди знакомства</span>
          </a>

          <div className="bk-header__right" aria-label="Действия">
            <button id="bk-profile-open" className="bk-header__login" type="button" aria-label="Вход в профиль">
              <span className="bk-header__login-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="9.2" cy="10" r="1.1" fill="currentColor" />
                  <circle cx="14.8" cy="10" r="1.1" fill="currentColor" />
                  <path
                    d="M8.6 14.1c.8 1 2 1.6 3.4 1.6s2.6-.6 3.4-1.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>ВХОД</span>
            </button>
            <button className="bk-header__icon" type="button" aria-label="Избранное">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 20.2 4.9 13.8a4.9 4.9 0 0 1 6.9-6.9L12 8l.2-.2a4.9 4.9 0 0 1 6.9 6.9Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="bk-header__icon" type="button" aria-label="Корзина">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3.5 4.5h2.2l1.3 9.2h10.6l2-7H7.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1.4" fill="currentColor" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="bk-main">
        <SiteMotionBootstrap />
        <HeroSection />
        <EventsSection />
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
