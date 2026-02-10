export function SiteFooterSection() {
  return (
    <footer className="bk-site-footer" aria-label="Подвал">
      <div className="bk-site-footer__inner">
        <img
          className="bk-site-footer__sticker"
          src="/lemon-skate.png"
          alt=""
          aria-hidden="true"
          width={1152}
          height={896}
          loading="lazy"
          decoding="async"
        />
        <div className="bk-site-footer__content">
          <h2 className="bk-site-footer__title">Мы тут!</h2>
          <a href="https://t.me/okolodating_bot" target="_blank" rel="noopener" className="bk-site-footer__cta">
            Пиши в Telegram
          </a>
          <p className="bk-site-footer__copy">
            Пиши сюда с предложениями, идеями и актуальными датами — мы внимательно подхватываем любой инфопоток.
          </p>
        </div>
      </div>
    </footer>
  );
}
