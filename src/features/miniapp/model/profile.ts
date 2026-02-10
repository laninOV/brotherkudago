import { createDefaultCategoryAnswers, type CategoryAnswers } from '../data/categoryFields'
import { createDefaultSurveyResponses, type SurveyResponses } from '../data/surveyQuestions'

export const MOOD_OPTIONS = ['добрый', 'резкий', 'весёлый', 'спокойный', 'энергичный'] as const
export type MoodTrait = (typeof MOOD_OPTIONS)[number]

export const HOBBY_OPTIONS = [
  'спорт',
  'готовка',
  'активный отдых',
  'чтение',
  'рыбалка',
  'тусовки',
  'путешествия',
  'музыка',
  'творчество',
  'кино',
  'настолки',
  'медитация',
  'природа',
  'фотографии',
  'творческие вечера',
] as const
export type Hobby = (typeof HOBBY_OPTIONS)[number]

export type GenderOption = '' | 'female' | 'male'

export type ProfileInfo = {
  photo?: string
  status: string
  about: string
  moodTraits: MoodTrait[]
  hobbies: Hobby[]
  gender: GenderOption
  age?: number
  preferredGender: string
  preferredMinAge?: number
  preferredMaxAge?: number
  surveyResponses: SurveyResponses
  categoryAnswers: CategoryAnswers
  galleryPhotos: string[]
}

export const DEFAULT_PROFILE_INFO: ProfileInfo = {
  status: 'Открыта к новым историям',
  about:
    'Я ищу людей, с которыми можно совместить прогулки, кафе и выставки. Люблю интересные беседы и уютные места.',
  moodTraits: ['добрый', 'весёлый'],
  hobbies: ['спорт', 'музыка'],
  gender: '',
  age: undefined,
  preferredGender: '',
  preferredMinAge: undefined,
  preferredMaxAge: undefined,
  surveyResponses: createDefaultSurveyResponses(),
  categoryAnswers: createDefaultCategoryAnswers(),
  galleryPhotos: [],
}
