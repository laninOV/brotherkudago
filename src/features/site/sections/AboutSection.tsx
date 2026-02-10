export function AboutSection() {
  return (
    <section id="about" className="bk-about-simple" aria-label="О проекте">
      <div className="bk-about-simple__inner">
        <div className="bk-about-simple__grid">
          <div className="bk-about-simple__copy">
            <h2>
              ОКОЛО — про людей <span className="bk-about-simple__accent-word">и живые впечатления</span>
            </h2>
            <p className="bk-about-simple__lead">
              ОКОЛО помогает выбраться из дома и открыть <span className="bk-about-simple__accent">новое рядом</span> — от камерных
              выставок до шумных вечеринок.
            </p>
            <p>Листай ленту событий, сохраняй то, что нравится, и собирай свой личный маршрут на неделю.</p>
            <p>
              А если хочется пойти не одному — заходи в <span className="bk-about-simple__accent">Telegram</span>: найдём компанию и
              подберём идею под настроение.
            </p>
          </div>
          <div className="bk-about-simple__aside" aria-hidden="true">
            <div className="bk-about-simple__frame">
              <span className="bk-about-simple__mini bk-about-simple__mini--a"></span>
              <span className="bk-about-simple__mini bk-about-simple__mini--b"></span>
              <span className="bk-about-simple__mini bk-about-simple__mini--c"></span>
              <img
                className="bk-about-simple__art"
                src="/main-flower.png"
                alt=""
                width={1120}
                height={928}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
