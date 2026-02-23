export function AboutSection() {
  return (
    <section id="about" className="bk-about-simple" aria-label="О проекте">
      <div className="bk-about-simple__inner">
        <div className="bk-about-simple__grid">
          <article className="bk-about-simple__copy">
            <p className="bk-about-simple__eyebrow">О ПРОЕКТЕ / WHY OKOLO</p>
            <h2>
              ОКОЛО собирает
              <span className="bk-about-simple__accent-word"> живые поводы выйти в город</span>
            </h2>
            <p className="bk-about-simple__lead">
              Мы объединяем события, места и людей в одну ленту, чтобы у тебя всегда был понятный план на вечер.
            </p>
            <p>Выбирай формат, добавляй в избранное и складывай маршрут без лишней рутины.</p>
          </article>

          <article className="bk-about-simple__card">
            <h3>Формула недели</h3>
            <ul>
              <li>1. Смотри подборку в ленте.</li>
              <li>2. Отмечай, что цепляет.</li>
              <li>3. Если не хочешь идти один, пиши в Telegram.</li>
            </ul>
            <a href="https://t.me/okolodating_bot" target="_blank" rel="noopener">
              Подобрать компанию
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
