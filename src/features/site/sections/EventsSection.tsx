export function EventsSection() {
  return (
    <section id="events" className="bk-feed bk-feed--checkered" aria-label="Список событий">
      <div className="bk-feed__inner">
        <h2 className="bk-sr-only">Лента событий</h2>
        <div className="bk-feed__controls" aria-label="Управление лентой">
          <button id="bk-filters-button" className="bk-feed__filters" type="button">
            Фильтры
          </button>
        </div>
        <div id="bk-list" className="bk-list"></div>
        <div className="bk-status-wrapper">
          <div id="bk-status" className="bk-status" aria-live="polite">
            Собираем идеи вокруг города…
          </div>
          <div id="bk-pagination" className="bk-pagination" aria-label="Навигация по страницам"></div>
        </div>
      </div>
    </section>
  );
}
