export type CategoryField = {
  id: string
  label: string
  type: 'single' | 'multiple'
  options: string[]
  helper?: string
}

export type CategorySection = {
  id: string
  title: string
  description: string
  categoryType: 'preferences' | 'dealbreakers' | 'facts'
  fields: CategoryField[]
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: 'food',
    title: 'Еда (preferences)',
    description: 'Что нравится есть и как предпочитаешь это получать',
    categoryType: 'preferences',
    fields: [
      {
        id: 'diet',
        label: 'Питание',
        type: 'single',
        options: [
          'Обычное',
          'Вегетарианство',
          'Веган',
          'Пескетарианство',
          'Кето',
          'Халяль',
          'Кошер',
          'Без глютена',
          'Без лактозы',
        ],
      },
      {
        id: 'cuisines',
        label: 'Любимые кухни',
        type: 'multiple',
        helper: 'Можно выбрать несколько',
        options: [
          'Итальянская',
          'Японская',
          'Грузинская',
          'Корейская',
          'Мексиканская',
          'Русская',
          'Индийская',
          'Тайская',
          'Ближневосточная',
          'Французская',
        ],
      },
      {
        id: 'foodFormat',
        label: 'Формат',
        type: 'multiple',
        helper: 'Что тебе ближе',
        options: [
          'Кафе',
          'Рестораны',
          'Готовлю дома',
          'Доставку люблю',
          'Фастфуд иногда',
          '“Еда — топ-хобби”',
        ],
      },
    ],
  },
  {
    id: 'communication',
    title: 'Характер / стиль общения',
    description: 'Как ты взаимодействуешь с другими',
    categoryType: 'preferences',
    fields: [
      { id: 'humor', label: 'Юмор', type: 'single', options: ['Сухой', 'Сарказм', 'Добрый', 'Мемный'] },
      { id: 'communicationStyle', label: 'Общение', type: 'single', options: ['Прямолинейный', 'Дипломатичный', 'Мягкий', 'Говорю как есть'] },
      { id: 'sociality', label: 'Социальность', type: 'single', options: ['Люблю новые знакомства', 'Норм узкий круг'] },
      { id: 'tempo', label: 'Темп', type: 'single', options: ['Спокойный', 'Энергичный'] },
    ],
  },
  {
    id: 'dating',
    title: 'Свидания и отношения',
    description: 'Ориентиры, которые важны на старте и в развитии',
    categoryType: 'preferences',
    fields: [
      {
        id: 'datingGoal',
        label: 'Цель',
        type: 'single',
        options: ['Общение', 'Свидания', 'Отношения', 'Посмотрим'],
      },
      {
        id: 'closenessTempo',
        label: 'Темп сближения',
        type: 'single',
        options: ['Медленно', 'Нормально', 'Быстро'],
      },
      { id: 'touchPreference', label: 'Про прикосновения', type: 'single', options: ['Люблю', 'Нейтрально', 'Не люблю'] },
      {
        id: 'messagingImportance',
        label: 'Важность переписки',
        type: 'single',
        options: ['Низкая', 'Средняя', 'Высокая'],
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Лайфстайл',
    description: 'Факты, которые влияют на совместимость',
    categoryType: 'facts',
    fields: [
      { id: 'smoking', label: 'Курение', type: 'single', options: ['Нет', 'Иногда', 'Да'] },
      { id: 'alcohol', label: 'Алкоголь', type: 'single', options: ['Нет', 'Иногда', 'Да'] },
      { id: 'sport', label: 'Спорт', type: 'single', options: ['Нет', 'Иногда', 'Регулярно'] },
      {
        id: 'children',
        label: 'Дети',
        type: 'single',
        options: ['Есть', 'Нет', 'Хочу', 'Не хочу', 'Не уверен'],
      },
      { id: 'pets', label: 'Питомцы', type: 'single', options: ['Есть', 'Люблю', 'Не хочу'] },
      { id: 'sleep', label: 'Сон', type: 'single', options: ['Жаворонок', 'Сова', 'Плавающий'] },
    ],
  },
  {
    id: 'interests',
    title: 'Интересы',
    description: 'Темы, которые можно использовать для рекомендаций и разговоров',
    categoryType: 'preferences',
    fields: [
      {
        id: 'interests',
        label: 'Интересы',
        type: 'multiple',
        helper: 'Отметьте всё, что откликается',
        options: ['Музыка', 'Кино', 'Игры', 'Книги', 'Путешествия', 'Природа', 'Вечеринки', 'Творчество', 'Спорт', 'Бизнес', 'IT', 'Кофе', 'Фотки', 'Настолки'],
      },
    ],
  },
]

export type CategoryAnswers = Record<string, string | string[]>

export function createDefaultCategoryAnswers(): CategoryAnswers {
  return CATEGORY_SECTIONS.reduce((acc, section) => {
    section.fields.forEach((field) => {
      acc[field.id] = field.type === 'multiple' ? [] : ''
    })
    return acc
  }, {} as CategoryAnswers)
}
