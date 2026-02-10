import { useEffect, useState } from 'react'

export type UserLocationState =
  | { status: 'idle' }
  | { status: 'denied' }
  | { status: 'ready'; lat: number; lng: number }

export function useUserLocation(): UserLocationState {
  const [state, setState] = useState<UserLocationState>({ status: 'idle' })

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: 'ready', lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setState({ status: 'denied' }),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 },
    )
  }, [])

  return state
}

