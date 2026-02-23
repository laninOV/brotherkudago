export function EventsSection() {
  return (
    <section id="events" className="bk-feed bk-feed--catalog" aria-label="Список событий">
      <div className="bk-feed__inner">
        <h2 className="bk-sr-only">Лента событий</h2>

        <div className="bk-feed__controls" aria-label="Управление лентой">
          <div className="bk-feed__controls-col bk-feed__controls-col--left">
            <button
              id="bk-filters-button"
              className="bk-feed__filters"
              type="button"
              data-filter-open
              aria-controls="bk-filter-drawer"
              aria-expanded="false"
            >
              <span className="bk-feed__filters-icon" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span>ФИЛЬТР</span>
              <span className="bk-feed__filters-dot" aria-hidden="true"></span>
            </button>
          </div>

          <p id="bk-feed-pieces" className="bk-feed__pieces" aria-live="polite">
            0 позиций
          </p>

          <div className="bk-feed__controls-col bk-feed__controls-col--right" aria-hidden="true">
            <span className="bk-feed__controls-label">ПОРЯДОК</span>
            <span className="bk-feed__controls-chip">▲▼</span>
            <span className="bk-feed__controls-label">ВИД</span>
            <span className="bk-feed__controls-chip bk-feed__controls-chip--grid">▦</span>
            <span className="bk-feed__controls-chip">↩</span>
          </div>
        </div>

        <p className="bk-feed__all-mark" aria-hidden="true">
          всё
        </p>

        <div id="bk-list" className="bk-list"></div>

        <div className="bk-status-wrapper">
          <div id="bk-status" className="bk-status" aria-live="polite">
            Собираем идеи вокруг города…
          </div>
          <div id="bk-pagination" className="bk-pagination" aria-label="Навигация по страницам"></div>
        </div>
      </div>

      <div id="bk-filter-drawer" className="bk-filter-drawer" aria-hidden="true">
        <button className="bk-filter-drawer__backdrop" type="button" data-filter-close aria-label="Закрыть"></button>
        <aside className="bk-filter-drawer__panel" role="dialog" aria-modal="true" aria-label="Фильтры">
          <button className="bk-filter-drawer__close" type="button" data-filter-close aria-label="Закрыть панель">
            ✕
          </button>
          <h3>НАБОР ФИЛЬТРОВ</h3>
          <section>
            <p>ФОРМАТ</p>
            <ul>
              <li>• Концерты</li>
              <li>• Выставки</li>
              <li>• Вечеринки</li>
            </ul>
          </section>
          <section>
            <p>ЦЕНА</p>
            <ul>
              <li>• Бесплатно</li>
              <li>• До 1500 ₽</li>
              <li>• Любая</li>
            </ul>
          </section>
          <section>
            <p>КОГДА</p>
            <ul>
              <li>• Сегодня</li>
              <li>• На неделе</li>
              <li>• Скоро</li>
            </ul>
          </section>
          <button className="bk-filter-drawer__apply" type="button" data-filter-close>
            ЗАКРЫТЬ
          </button>
        </aside>
      </div>
    </section>
  );
}
