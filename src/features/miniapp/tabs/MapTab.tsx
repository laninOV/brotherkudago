import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet'
import type { Place, PlaceCategory } from '../model/place'
import { haversineKm } from '../lib/geo'
import { useUserLocation } from '../ui/useUserLocation'
import { useAppState } from '../state/AppState'
import { usePlacesState } from '../state/PlacesState'
import { PlaceDetailsSheet } from '../ui/PlaceDetailsSheet'
import { IconSliders } from '../ui/icons'

type ChipKey = 'all' | PlaceCategory
type QuickFilterKey = 'near' | 'open' | 'budget' | 'time'

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

export function MapTab() {
  const location = useUserLocation()
  const { places: sourcePlaces, loading } = usePlacesState()
  const { toggleInCollection, favorites } = useAppState()
  const [chip, setChip] = useState<ChipKey>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [quick, setQuick] = useState<Record<QuickFilterKey, boolean>>({
    near: false,
    open: false,
    budget: false,
    time: false,
  })
  const [selected, setSelected] = useState<Place | null>(null)
  const [recenterTick, setRecenterTick] = useState(0)

  const places = useMemo(() => {
    const user =
      location.status === 'ready' ? { lat: location.lat, lng: location.lng } : null
    const base = chip === 'all' ? sourcePlaces : sourcePlaces.filter((p) => p.category === chip)
    const enriched = base.map((p) => ({
      place: p,
      distanceKm: user ? haversineKm(user, { lat: p.lat, lng: p.lng }) : null,
    }))

    return enriched
      .filter(({ place }) => (quick.open ? place.openNow === true : true))
      .filter(({ place }) => (quick.budget ? (place.price ?? '$$') !== '$$$' : true))
      .filter(({ place }) =>
        quick.time ? (place.durationMin ?? 90) >= 60 && (place.durationMin ?? 90) <= 120 : true,
      )
      .filter(({ distanceKm }) => (quick.near ? (distanceKm ?? 999) <= 3.5 : true))
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
      .map(({ place }) => place)
  }, [chip, location, sourcePlaces, quick.budget, quick.near, quick.open, quick.time])

  const center: [number, number] =
    location.status === 'ready' ? [location.lat, location.lng] : [55.7522, 37.6156]

  const chips: ChipKey[] = ['all', 'place', 'cafe', 'walk', 'event']
  const quickKeys: QuickFilterKey[] = ['near', 'open', 'budget', 'time']

  const savedIds = new Set(Object.values(favorites).flat())
  const activeFiltersCount =
    (chip === 'all' ? 0 : 1) + Object.values(quick).filter(Boolean).length

  return (
    <div className="screen">
      <div className="screen__header">
        <div>
          <div className="screen__title">Карта</div>
          <div className="screen__subtitle">Пины + быстрый просмотр</div>
        </div>
      </div>

      {loading && <div className="screen__notice">Загружаем точки на карте…</div>}

      <div className="filtersToggleRow">
        <button
          className="filter filtersToggleBtn"
          aria-expanded={filtersOpen}
          aria-controls="map-filters"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <IconSliders />
          Фильтры
          {activeFiltersCount > 0 && <span className="filtersCount">{activeFiltersCount}</span>}
        </button>
      </div>

      {filtersOpen && (
        <div className="filtersPanel" id="map-filters">
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

          <div className="filtersPanel__title filtersPanel__title--offset">
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
                {key === 'near'
                  ? 'Рядом'
                  : key === 'open'
                    ? 'Открыто сейчас'
                    : key === 'budget'
                      ? 'Бюджет'
                      : '1–2 часа'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="screen__body screen__body--map">
        <div className="mapStage">
          <MapContainer
            center={center}
            zoom={13}
            className="mapStage__canvas"
            zoomControl={false}
          >
            <MapRecenter center={center} tick={recenterTick} />
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {location.status === 'ready' && (
              <CircleMarker
                center={[location.lat, location.lng]}
                radius={8}
                pathOptions={{
                  color: '#6ea8ff',
                  weight: 2,
                  fillColor: '#6ea8ff',
                  fillOpacity: 0.25,
                }}
              />
            )}
            {places.map((p) => (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={10}
                pathOptions={{
                  color: savedIds.has(p.id) ? '#40d47e' : '#6ea8ff',
                  weight: 2,
                  fillColor: savedIds.has(p.id) ? '#40d47e' : '#6ea8ff',
                  fillOpacity: 0.22,
                }}
                eventHandlers={{ click: () => setSelected(p) }}
              />
            ))}
          </MapContainer>

          <button
            className="filter mapStage__recenter"
            onClick={() => setRecenterTick((v) => v + 1)}
            disabled={location.status !== 'ready'}
          >
            Вокруг
          </button>
        </div>
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

function MapRecenter({ center, tick }: { center: [number, number]; tick: number }) {
  const map = useMap()
  useEffect(() => {
    if (tick === 0) return
    map.setView(center, map.getZoom(), { animate: true })
  }, [center, map, tick])
  return null
}
