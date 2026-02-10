import type { CSSProperties } from "react";

export function ServicesSection() {
  return (
    <section id="how" className="bk-services" aria-label="Как это работает">
      <div className="bk-services__grid">
        <article className="bk-service-card" style={{ "--bk-card-accent": "var(--bk-accent-2)" } as CSSProperties}>
          <h3>Листай</h3>
          <p>Находи мероприятия в ленте — быстро и без лишних настроек.</p>
          <a className="bk-service-card__button" href="#events">
            Смотреть ленту
          </a>
        </article>
        <article className="bk-service-card" style={{ "--bk-card-accent": "var(--bk-accent-1)" } as CSSProperties}>
          <h3>Сохраняй</h3>
          <p>Добавляй карточки в избранное, чтобы собрать свой список.</p>
          <a className="bk-service-card__button" href="#events">
            В избранное
          </a>
        </article>
        <article className="bk-service-card" style={{ "--bk-card-accent": "#2a82b6" } as CSSProperties}>
          <h3>Иди</h3>
          <p>Если не хочешь идти один — заходи в Telegram и обязательно найдёшь классную компанию.</p>
          <a className="bk-service-card__button" href="https://t.me/okolodating_bot" target="_blank" rel="noopener">
            В Telegram
          </a>
        </article>
      </div>
    </section>
  );
}
