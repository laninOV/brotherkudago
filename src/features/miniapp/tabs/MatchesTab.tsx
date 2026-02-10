import { useMemo, useState } from 'react'
import { MATCH_PROFILES } from '../data/matchProfiles'
import { useAppState } from '../state/AppState'
import { usePlacesState } from '../state/PlacesState'
import { DEFAULT_PROFILE_INFO } from '../model/profile'

export function MatchesTab() {
  const { places } = usePlacesState()
  const { favorites, history, preferences, profileInfo } = useAppState()
  const safeProfileInfo = profileInfo ?? DEFAULT_PROFILE_INFO
  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place.title])), [places])
  const collections = Object.keys(favorites)
  const [activeCollection, setActiveCollection] = useState(collections[0] ?? 'Хочу посетить')

  const savedItems = useMemo(() => {
    const ids = new Set(favorites[activeCollection] ?? [])
    return places.filter((place) => ids.has(place.id))
  }, [activeCollection, favorites, places])

  const likedPlaceIds = useMemo(() => {
    const likedPlaces = history.filter((event) => event.action === 'like')
    return new Set(likedPlaces.map((event) => event.placeId))
  }, [history])

  const matchScores = useMemo(() => {
    return MATCH_PROFILES.map((profile) => {
      const sharedPlaces = profile.likes.filter((id) => likedPlaceIds.has(id))
      const sharedPlaceNames = sharedPlaces
        .map((id) => placesById.get(id))
        .filter((name): name is string => Boolean(name))
      const vibeMatch = profile.vibe === preferences.vibe
      const transportMatch = profile.transport === preferences.transport
      const cuisineOverlap = profile.cuisines.filter((cuisine) =>
        preferences.cuisines.includes(cuisine),
      )
      const moodOverlap = profile.moodTraits.filter((trait) =>
        safeProfileInfo.moodTraits.includes(trait),
      )
      const hobbyOverlap = profile.hobbies.filter((hobby) =>
        safeProfileInfo.hobbies.includes(hobby),
      )
      const rawScore =
        sharedPlaces.length * 28 +
        (vibeMatch ? 18 : 0) +
        (transportMatch ? 12 : 0) +
        cuisineOverlap.length * 5 +
        moodOverlap.length * 8 +
        hobbyOverlap.length * 6
      const score = Math.min(100, Math.round(rawScore))
      return {
        profile,
        score,
        sharedPlaceNames,
        vibeMatch,
        transportMatch,
        cuisineOverlap: cuisineOverlap.length,
        moodOverlap,
        hobbyOverlap,
      }
    }).sort((a, b) => b.score - a.score)
  }, [likedPlaceIds, placesById, preferences, safeProfileInfo])

  return (
    <div className="screen">
      <div className="screen__header">
        <div>
          <div className="screen__title">Компаньон</div>
          <div className="screen__subtitle">
            Подбираем собеседника, который гуляет по тем же местам и любит похожую атмосферу.
          </div>
        </div>
      </div>

      <div className="screen__body">
        <div className="contentPanel">
          <div className="sectionTitle">Топ совпадений</div>
          {matchScores.length === 0 ? (
            <div className="listItem">
              <div className="thumb" />
              <div>
                <div className="listItem__title">Пока пусто</div>
                <div className="listItem__sub">Лайкай места, чтобы мы могли найти компаньона</div>
              </div>
            </div>
          ) : (
            <div className="list" aria-label="Список совпадений">
              {matchScores.map(
                ({
                  profile,
                  score,
                  sharedPlaceNames,
                  transportMatch,
                  moodOverlap,
                  hobbyOverlap,
                }) => (
                <div key={profile.id} className="listItem">
                  <div
                    className="thumb"
                    style={{
                      backgroundImage: `url(${profile.photo})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="listItem__title">{profile.name}</div>
                    <div className="listItem__sub">{profile.summary}</div>
                    <div className="matchScoreBar">
                      <div className="matchScoreBar__fill" style={{ width: `${score}%` }} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      <span className="badge">{score}% совпадение</span>
                      <span className="badge">
                        {sharedPlaceNames.length > 0
                          ? `Общие места: ${sharedPlaceNames.join(', ')}`
                          : 'Пока нет общих мест'}
                      </span>
                      <span className="badge">
                        {moodOverlap.length > 0
                          ? `Настроения: ${moodOverlap.join(', ')}`
                          : `Вибе: ${profile.vibe}`}
                      </span>
                      <span className="badge">
                        {transportMatch ? 'Передвигаемся одинаково' : `Транспорт: ${profile.transport}`}
                      </span>
                      <span className="badge">
                        {hobbyOverlap.length > 0
                          ? `Хобби: ${hobbyOverlap.join(', ')}`
                          : 'Новые активности'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="sectionTitle">Коллекции и сохранённое</div>
          <div className="pillRow" aria-label="Коллекции">
            {collections.map((name) => (
              <button
                key={name}
                className="pill"
                aria-pressed={activeCollection === name}
                onClick={() => setActiveCollection(name)}
              >
                {name}
              </button>
            ))}
          </div>
          {savedItems.length === 0 ? (
            <div className="list">
              <div className="listItem">
                <div className="thumb" />
                <div>
                  <div className="listItem__title">Пока пусто</div>
                  <div className="listItem__sub">
                    Сохрани несколько мест из ленты — они попадут в коллекцию.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="list" aria-label="Списки сохранённого">
              {savedItems.map((place) => (
                <div key={place.id} className="listItem">
                  <div
                    className="thumb"
                    style={{
                      backgroundImage: place.image ? `url(${place.image})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="listItem__title">{place.title}</div>
                    <div className="listItem__sub">{place.address}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
