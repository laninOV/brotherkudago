export type PlaceCategory = 'place' | 'cafe' | 'walk' | 'event'

export type PriceLevel = '$' | '$$' | '$$$'

export type Place = {
  id: string
  title: string
  category: PlaceCategory
  tags: string[]
  address: string
  lat: number
  lng: number
  price?: PriceLevel
  openNow?: boolean
  durationMin?: number
  image?: string
  photos?: string[]
  description?: string
  url?: string
}
