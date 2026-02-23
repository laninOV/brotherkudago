export function ServicesSection() {
  return (
    <section id="how" className="bk-services" aria-label="Как это работает">
      <div className="bk-services__inner">
        <p className="bk-services__eyebrow">HOW IT WORKS</p>
        <h2 className="bk-services__title">Три шага, чтобы вечер случился</h2>
        <div className="bk-services__grid">
          <article className="bk-service-card">
            <p className="bk-service-card__index">01</p>
            <h3>Открой каталог</h3>
            <p>Смотри подборку событий и мест в одном экране.</p>
            <a className="bk-service-card__button" href="#events">
              Смотреть
            </a>
          </article>

          <article className="bk-service-card">
            <p className="bk-service-card__index">02</p>
            <h3>Собери маршрут</h3>
            <p>Добавь карточки в избранное и зафиксируй план на неделю.</p>
            <a className="bk-service-card__button" href="#events">
              В избранное
            </a>
          </article>

          <article className="bk-service-card">
            <p className="bk-service-card__index">03</p>
            <h3>Иди с кем-то</h3>
            <p>В Telegram ты сможешь найти компаньона по душе.</p>
            <a className="bk-service-card__button" href="https://t.me/okolodating_bot" target="_blank" rel="noopener">
              Написать
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
