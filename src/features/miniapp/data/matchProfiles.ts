import type { Hobby, MoodTrait } from '../model/profile'

export type MatchProfile = {
  id: string
  name: string
  age: number
  photo: string
  summary: string
  vibe: 'quiet' | 'any' | 'loud'
  transport: 'walk' | 'car'
  cuisines: string[]
  availability: string
  likes: string[]
  moodTraits: MoodTrait[]
  hobbies: Hobby[]
}

export const MATCH_PROFILES: MatchProfile[] = [
  {
    id: 'yana',
    name: 'Яна, 28',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    summary: 'Любит вечерние прогулки, вино и кино на крыше.',
    vibe: 'loud',
    transport: 'walk',
    cuisines: ['итальянская', 'кофе'],
    availability: 'вечер недели',
    likes: ['wine-bar', 'art-center', 'coffee-lab'],
    moodTraits: ['весёлый', 'энергичный'],
    hobbies: ['кино', 'тусовки', 'музыка'],
  },
  {
    id: 'max',
    name: 'Макс, 31',
    age: 31,
    photo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    summary: 'Фотограф, обожает парки и выставки, ищет компанию на выходные.',
    vibe: 'any',
    transport: 'walk',
    cuisines: ['азиатская', 'веган'],
    availability: 'утренние и дневные часы',
    likes: ['patriarshie', 'gorky-park', 'art-center'],
    moodTraits: ['спокойный', 'добрый'],
    hobbies: ['природа', 'активный отдых'],
  },
  {
    id: 'lena',
    name: 'Лена, 26',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=400&q=80',
    summary: 'Гончарная студия, рукоделие и уютные кафе — идеальные планы.',
    vibe: 'quiet',
    transport: 'car',
    cuisines: ['веган', 'кофе'],
    availability: 'в выходные',
    likes: ['goncharnaya', 'coffee-lab', 'art-center'],
    moodTraits: ['добрый', 'спокойный'],
    hobbies: ['готовка', 'творчество'],
  },
  {
    id: 'misha',
    name: 'Миша, 33',
    age: 33,
    photo: 'https://images.unsplash.com/photo-1544723795-43253735b7d1?auto=format&fit=crop&w=400&q=80',
    summary: 'Поклонник активностей на свежем воздухе и уютных бесед.',
    vibe: 'any',
    transport: 'car',
    cuisines: ['грузинская', 'азиатская'],
    availability: 'вечер и выходные',
    likes: ['gorky-park', 'patriarshie', 'goncharnaya'],
    moodTraits: ['энергичный', 'весёлый'],
    hobbies: ['спорт', 'активный отдых'],
  },
]
