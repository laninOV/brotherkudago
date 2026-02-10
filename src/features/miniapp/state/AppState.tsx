import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Place } from '../model/place'
import type { ProfileInfo } from '../model/profile'
import { DEFAULT_PROFILE_INFO } from '../model/profile'
import { readJson, writeJson } from '../lib/storage'

type HistoryEvent = { placeId: string; at: number; action: 'like' | 'skip' | 'view' }

export type Preferences = {
  transport: 'walk' | 'car'
  vibe: 'quiet' | 'any' | 'loud'
  cuisines: string[]
}

type AppState = {
  favorites: Record<string, string[]>
  history: HistoryEvent[]
  preferences: Preferences
  profileInfo: ProfileInfo | null
  liked: (place: Place) => void
  skipped: (place: Place) => void
  viewed: (place: Place) => void
  toggleInCollection: (collection: string, placeId: string) => void
  setPreferences: (next: Preferences) => void
  setProfileInfo: (next: Partial<ProfileInfo>) => void
}

const STORAGE_KEY = 'pin.state.v1'
const DEFAULT_COLLECTIONS = ['Хочу посетить', 'Топ', 'На свидание'] as const

const AppStateContext = createContext<AppState | null>(null)

type Persisted = Pick<AppState, 'favorites' | 'history' | 'preferences'> & {
  profileInfo: ProfileInfo | null
}

function initialState(): Persisted {
  const persisted = readJson<Persisted>(STORAGE_KEY, {
    favorites: Object.fromEntries(DEFAULT_COLLECTIONS.map((name) => [name, []])),
    history: [],
    preferences: { transport: 'walk', vibe: 'any', cuisines: ['азиатская'] },
    profileInfo: null,
  })
  return persisted
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(() => initialState())

  useEffect(() => {
    writeJson(STORAGE_KEY, persisted)
  }, [persisted])

  const addHistory = useCallback((event: HistoryEvent) => {
    setPersisted((prev) => ({
      ...prev,
      history: [event, ...prev.history].slice(0, 200),
    }))
  }, [])

  const toggleInCollection = useCallback((collection: string, placeId: string) => {
    setPersisted((prev) => {
      const current = prev.favorites[collection] ?? []
      const exists = current.includes(placeId)
      const next = exists ? current.filter((id) => id !== placeId) : [placeId, ...current]
      return { ...prev, favorites: { ...prev.favorites, [collection]: next } }
    })
  }, [])

  const liked = useCallback(
    (place: Place) => {
      addHistory({ placeId: place.id, at: Date.now(), action: 'like' })
      toggleInCollection('Хочу посетить', place.id)
    },
    [addHistory, toggleInCollection],
  )

  const skipped = useCallback(
    (place: Place) => addHistory({ placeId: place.id, at: Date.now(), action: 'skip' }),
    [addHistory],
  )

  const viewed = useCallback(
    (place: Place) => addHistory({ placeId: place.id, at: Date.now(), action: 'view' }),
    [addHistory],
  )

  const setPreferences = useCallback((next: Preferences) => {
    setPersisted((prev) => ({ ...prev, preferences: next }))
  }, [])

  const setProfileInfo = useCallback((next: Partial<ProfileInfo>) => {
    setPersisted((prev) => {
      const base = prev.profileInfo ?? DEFAULT_PROFILE_INFO
      return {
        ...prev,
        profileInfo: { ...base, ...next },
      }
    })
  }, [])

  const value = useMemo<AppState>(
    () => ({
      favorites: persisted.favorites,
      history: persisted.history,
      preferences: persisted.preferences,
      profileInfo: persisted.profileInfo,
      liked,
      skipped,
      viewed,
      toggleInCollection,
      setPreferences,
      setProfileInfo,
    }),
    [
      liked,
      persisted.favorites,
      persisted.history,
      persisted.preferences,
      persisted.profileInfo,
      setPreferences,
      setProfileInfo,
      skipped,
      toggleInCollection,
      viewed,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const state = useContext(AppStateContext)
  if (!state) throw new Error('useAppState must be used inside AppProvider')
  return state
}
