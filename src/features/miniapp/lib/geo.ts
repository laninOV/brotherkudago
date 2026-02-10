export type LatLng = { lat: number; lng: number }

export function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371
  const dLat = deg2rad(b.lat - a.lat)
  const dLng = deg2rad(b.lng - a.lng)
  const sa = Math.sin(dLat / 2)
  const sb = Math.sin(dLng / 2)
  const h =
    sa * sa +
    Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) * (sb * sb)
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

function deg2rad(value: number) {
  return (value * Math.PI) / 180
}

