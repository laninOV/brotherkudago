export function SiteFooterSection() {
  return (
    <footer className="bk-site-footer" aria-label="Подвал">
      <div className="bk-site-footer__inner">
        <p className="bk-site-footer__eyebrow">READY FOR TONIGHT?</p>
        <h2 className="bk-site-footer__title">Найди событие и компанию в одном потоке</h2>
        <p className="bk-site-footer__copy">
          Пиши в Telegram, если хочешь быстро подобрать формат вечера, район и людей с похожим настроением.
        </p>
        <a href="https://t.me/okolodating_bot" target="_blank" rel="noopener" className="bk-site-footer__cta">
          Пиши в Telegram
        </a>
      </div>
    </footer>
  );
}
