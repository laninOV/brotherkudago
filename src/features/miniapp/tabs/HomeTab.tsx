import { useEffect, useMemo, useRef, useState } from 'react'
import type { Place, PlaceCategory } from '../model/place'
import { haversineKm } from '../lib/geo'
import { useAppState } from '../state/AppState'
import { usePlacesState } from '../state/PlacesState'
import { IconHeart, IconHeartFilled, IconSliders } from '../ui/icons'
import { useUserLocation } from '../ui/useUserLocation'
import { PlaceDetailsSheet } from '../ui/PlaceDetailsSheet'

type ChipKey = 'all' | PlaceCategory
type QuickFilterKey = 'near' | 'open' | 'budget' | 'time'

type DeckPlace = Place & { distanceKm: number | null }

function chipLabel(key: ChipKey) {
  switch (key) {
    case 'all':
      return 'Все'
    case 'place':
      return 'Места'
    case 'cafe':
      return 'Кафе'
    case 'walk':
      return 'Прогулки'
    case 'event':
      return 'События'
  }
}

function quickLabel(key: QuickFilterKey) {
  switch (key) {
    case 'near':
      return 'Рядом'
    case 'open':
      return 'Открыто'
    case 'budget':
      return 'Бюджет'
    case 'time':
      return '1–2 ч'
  }
}

export function HomeTab() {
  const location = useUserLocation()
  const { places, loading } = usePlacesState()
  const readyLocation = useMemo(
    () => (location.status === 'ready' ? { lat: location.lat, lng: location.lng } : null),
    [location],
  )
  const { favorites, liked, skipped, viewed, history, toggleInCollection } = useAppState()

  const [chip, setChip] = useState<ChipKey>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [quick, setQuick] = useState<Record<QuickFilterKey, boolean>>({
    near: false,
    open: false,
    budget: false,
    time: false,
  })
  const [selected, setSelected] = useState<Place | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const seenIds = useMemo(() => {
    const seen = history.filter((event) => event.action !== 'view')
    return new Set(seen.map((event) => event.placeId))
  }, [history])

  const deck = useMemo<DeckPlace[]>(() => {
    const user = readyLocation
    const enriched = places.map((place) => ({
      place,
      distanceKm: user ? haversineKm(user, { lat: place.lat, lng: place.lng }) : null,
    }))
    const filtered = enriched
      .filter(({ place }) => (chip === 'all' ? true : place.category === chip))
      .filter(({ place }) => (quick.open ? place.openNow === true : true))
      .filter(({ place }) => (quick.budget ? (place.price ?? '$$') !== '$$$' : true))
      .filter(({ place }) =>
        quick.time ? (place.durationMin ?? 90) >= 60 && (place.durationMin ?? 90) <= 120 : true,
      )
      .filter(({ distanceKm }) => (quick.near ? (distanceKm ?? 999) <= 3.5 : true))
      .filter(({ place }) => !seenIds.has(place.id))
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
      .map(({ place, distanceKm }) => ({ ...place, distanceKm }))

    return filtered
  }, [
    chip,
    places,
    readyLocation,
    quick.budget,
    quick.near,
    quick.open,
    quick.time,
    seenIds,
  ])

  const visibleIndex = deck.length === 0 ? 0 : Math.min(currentIndex, deck.length - 1)
  const currentPlace = deck[visibleIndex]
  const stack = currentPlace ? [currentPlace, ...deck.slice(visibleIndex + 1, visibleIndex + 3)] : []

  const savedIds = useMemo(() => new Set(Object.values(favorites).flat()), [favorites])
  const activeFiltersCount =
    (chip === 'all' ? 0 : 1) + Object.values(quick).filter(Boolean).length

  const chips: ChipKey[] = ['all', 'place', 'cafe', 'walk', 'event']
  const quickKeys: QuickFilterKey[] = ['near', 'open', 'budget', 'time']

  const lastViewedRef = useRef<string | null>(null)
  useEffect(() => {
    if (!currentPlace) return
    if (lastViewedRef.current === currentPlace.id) return
    lastViewedRef.current = currentPlace.id
    viewed(currentPlace)
  }, [currentPlace, viewed])

  const handleChoice = (place: DeckPlace | undefined, action: 'skip' | 'like') => {
    if (!place) return
    if (action === 'like') {
      liked(place)
    } else {
      skipped(place)
    }
    setCurrentIndex(0)
  }

  return (
    <div className="screen">
      <div className="screen__header">
        <div>
          <div className="screen__title">Гид по событиям</div>
          <div className="screen__subtitle">
            Перечисляем уютные места и активности — отмечай понравившиеся и узнавай, кто ещё туда идёт.
          </div>
        </div>
      </div>

      {loading && (
        <div className="screen__subtitle" style={{ padding: '0 16px 8px' }}>
          Обновляем карточки событий…
        </div>
      )}

      <div className="filtersToggleRow">
        <button
          className="filter filtersToggleBtn"
          aria-expanded={filtersOpen}
          aria-controls="home-filters"
          onClick={() => setFiltersOpen((value) => !value)}
        >
          <IconSliders />
          Категории
          {activeFiltersCount > 0 && <span className="filtersCount">{activeFiltersCount}</span>}
        </button>
      </div>

      {filtersOpen && (
        <div className="filtersPanel" id="home-filters">
          <div className="filtersPanel__title">Категории</div>
          <div className="chipWrap" role="tablist" aria-label="Категории">
            {chips.map((key) => (
              <button
                key={key}
                className="pill"
                aria-pressed={chip === key}
                onClick={() => setChip(key)}
              >
                {chipLabel(key)}
              </button>
            ))}
          </div>

          <div className="filtersPanel__title" style={{ marginTop: 12 }}>
            Быстрые фильтры
          </div>
          <div className="filterWrap" aria-label="Фильтры">
            {quickKeys.map((key) => (
              <button
                key={key}
                className="filter"
                aria-pressed={quick[key]}
                onClick={() => setQuick((prev) => ({ ...prev, [key]: !prev[key] }))}
              >
                {quickLabel(key)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="cardStack" aria-live="polite">
        {stack.length === 0 ? (
          <div className="placeCard placeCard--static" style={{ position: 'relative' }}>
            <div className="placeCard__glass" />
            <div className="placeCard__content">
              <div className="placeCard__title">Новых мест пока нет</div>
              <p style={{ marginTop: 8, color: 'var(--muted)' }}>
                Возможно, ты уже просмотрела все подборки. Попробуй расширить фильтры или
                подождать, пока появятся новые лайки от других.
              </p>
            </div>
          </div>
        ) : (
          stack.map((place, index) => {
            const isActive = index === 0
            const distance =
              place.distanceKm != null
                ? `${place.distanceKm.toFixed(place.distanceKm < 10 ? 1 : 0)} км`
                : null

            return (
              <article
                key={place.id + index}
                className="placeCard"
                style={{
                  zIndex: 10 - index,
                  transform: `translateY(${index * 12}px) scale(${1 - index * 0.02})`,
                  opacity: isActive ? 1 : 0.65,
                  pointerEvents: isActive ? 'auto' : 'none',
                  borderColor: isActive ? 'rgba(255,255,255,0.28)' : 'transparent',
                }}
                data-place-id={place.id}
                aria-label={place.title}
                onClick={() => isActive && setSelected(place)}
              >
                {place.image && (
                  <div
                    className="placeCard__bg"
                    style={{ backgroundImage: `url(${place.image})` }}
                  />
                )}
                <div className="placeCard__glass" />
                <button
                  className="cardFavBtn"
                  aria-pressed={savedIds.has(place.id)}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggleInCollection('Хочу посетить', place.id)
                  }}
                >
                  {savedIds.has(place.id) ? <IconHeartFilled /> : <IconHeart />}
                </button>
                <div className="placeCard__content">
                  <div className="placeCard__title">{place.title}</div>
                  <div className="placeCard__meta">
                    {distance && <span className="badge">{distance}</span>}
                    {place.openNow != null && (
                      <span className="badge">
                        {place.openNow ? 'Открыто сейчас' : 'Закрыто сейчас'}
                      </span>
                    )}
                    {place.price && <span className="badge">{place.price}</span>}
                    {place.durationMin && <span className="badge">{place.durationMin} мин</span>}
                  </div>
                  <p style={{ marginTop: 12, color: 'var(--on-media-muted)' }}>{place.description}</p>
                  <div className="placeCard__meta" style={{ marginTop: 10 }}>
                    {place.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>

      <div className="actionsRow">
        <button
          className="actionBtn actionBtn--bad"
          onClick={() => handleChoice(currentPlace, 'skip')}
          disabled={!currentPlace}
        >
          Пропустить
        </button>
        <button
          className="actionBtn actionBtn--good"
          onClick={() => handleChoice(currentPlace, 'like')}
          disabled={!currentPlace}
        >
          Хочу сходить
        </button>
      </div>

      <PlaceDetailsSheet
        open={!!selected}
        place={selected}
        saved={!!selected && savedIds.has(selected.id)}
        onToggleSaved={() => selected && toggleInCollection('Хочу посетить', selected.id)}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
