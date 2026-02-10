import { useMemo } from 'react'
import type { Place } from '../model/place'
import { tgOpenLink } from '../telegram/telegram'
import { Sheet } from './Sheet'
import { IconHeart, IconHeartFilled, IconX } from './icons'

function routeUrl(place: Place) {
  return `https://yandex.ru/maps/?pt=${place.lng},${place.lat}&z=16&l=map`
}

export function PlaceDetailsSheet({
  open,
  place,
  saved,
  onToggleSaved,
  onClose,
}: {
  open: boolean
  place: Place | null
  saved: boolean
  onToggleSaved: () => void
  onClose: () => void
}) {
  const photos = useMemo(() => {
    if (!place) return []
    const unique = new Set<string>()
    const add = (url: string | undefined) => {
      if (!url) return
      unique.add(url)
    }
    for (const p of place.photos ?? []) add(p)
    add(place.image)
    return Array.from(unique)
  }, [place])

  return (
    <Sheet open={open} onClose={onClose}>
      {!place ? null : (
        <div>
          <div className="detailsGallery" aria-label="Галерея">
            {photos.map((src) => (
              <div key={src} className="detailsGallery__item">
                <img className="detailsGallery__img" src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="detailsHeader">
            <div style={{ minWidth: 0 }}>
              <div className="detailsTitle">{place.title}</div>
              <div className="detailsSubtitle">{place.address}</div>
            </div>
            <div className="detailsHeader__actions">
              <button className="cardFavBtn" aria-pressed={saved} onClick={onToggleSaved}>
                {saved ? <IconHeartFilled /> : <IconHeart />}
              </button>
              <button className="detailsCloseBtn" onClick={onClose} aria-label="Закрыть">
                <IconX />
              </button>
            </div>
          </div>

          {place.description && <div className="detailsText">{place.description}</div>}

          <div className="detailsBadges">
            {place.openNow != null && (
              <span className="badge">{place.openNow ? 'Открыто сейчас' : 'Закрыто сейчас'}</span>
            )}
            {place.durationMin && <span className="badge">{place.durationMin} мин</span>}
            {place.price && <span className="badge">{place.price}</span>}
            {place.tags?.slice(0, 6).map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button className="actionBtn" onClick={() => tgOpenLink(routeUrl(place))}>
              Маршрут
            </button>
            {place.url && (
              <button className="actionBtn" onClick={() => tgOpenLink(place.url!)}>
                Сайт
              </button>
            )}
            <button className="actionBtn" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
