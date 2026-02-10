export type SurveyQuestion = {
  id: string
  left: string
  right: string
  axis: string[]
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 'Q1', left: 'Люблю помолчать', right: 'Разговоры обо всём', axis: ['talkativeness'] },
  { id: 'Q2', left: 'Пишу редко и по делу', right: 'Могу переписываться часами', axis: ['talkativeness'] },
  { id: 'Q3', left: 'Предпочитаю один-на-один', right: 'Люблю компании/тусовки', axis: ['talkativeness'] },
  { id: 'Q4', left: 'Сначала думаю', right: 'Сначала говорю', axis: ['thinking'] },
  { id: 'Q5', left: 'Дом/уют', right: 'Движ/внешний мир', axis: ['lifestyle'] },
  { id: 'Q6', left: 'Спонтанность', right: 'Планирование', axis: ['spontaneity'] },
  { id: 'Q7', left: 'Ранний режим', right: 'Поздний режим', axis: ['lifestyle'] },
  { id: 'Q8', left: 'Медленный темп', right: 'Быстрый темп', axis: ['lifestyle', 'spontaneity'] },
  { id: 'Q9', left: 'Спокоен(на) под давлением', right: 'Легко тревожусь', axis: ['emotional'] },
  { id: 'Q10', left: 'Держу эмоции при себе', right: 'Открыто выражаю эмоции', axis: ['emotional'] },
  { id: 'Q11', left: 'После конфликта быстро отпускаю', right: 'Долго перевариваю', axis: ['emotional'] },
  { id: 'Q12', left: 'Мне важно личное пространство', right: 'Мне важна постоянная близость', axis: ['closeness'] },
  { id: 'Q13', left: 'Люблю нежность/тактильность', right: 'Не очень про тактильность', axis: ['closeness'] },
  { id: 'Q14', left: '“Сначала дружба”', right: '“Сразу романтика/искра”', axis: ['closeness'] },
  { id: 'Q15', left: 'Логика важнее', right: 'Чувства важнее', axis: ['thinking'] },
  { id: 'Q16', left: 'Правила/структура', right: 'Гибкость/импровизация', axis: ['spontaneity'] },
  { id: 'Q17', left: 'Стабильность', right: 'Риск/эксперименты', axis: ['spontaneity', 'novelty'] },
  { id: 'Q18', left: 'Компромисс', right: 'Принципиальность', axis: ['thinking'] },
  { id: 'Q19', left: 'Люблю знакомое', right: 'Люблю новое', axis: ['novelty'] },
  { id: 'Q20', left: 'Скорее интроверт', right: 'Скорее экстраверт', axis: ['talkativeness'] },
]

export type SurveyAxis = {
  key: string
  label: string
  questions: string[]
}

export const SURVEY_AXES: SurveyAxis[] = [
  { key: 'talkativeness', label: 'Общительность', questions: ['Q1', 'Q2', 'Q3', 'Q20'] },
  { key: 'spontaneity', label: 'Спонтанность', questions: ['Q6', 'Q8', 'Q16', 'Q17'] },
  { key: 'emotional', label: 'Эмоциональность', questions: ['Q9', 'Q10', 'Q11'] },
  { key: 'closeness', label: 'Близость-пространство', questions: ['Q12', 'Q13', 'Q14'] },
  { key: 'thinking', label: 'Логика — чувства', questions: ['Q4', 'Q15', 'Q18'] },
  { key: 'novelty', label: 'Новизна', questions: ['Q17', 'Q19'] },
  { key: 'lifestyle', label: 'Ритм жизни', questions: ['Q5', 'Q7', 'Q8'] },
]

export type SurveyResponses = Record<string, number>

export function createDefaultSurveyResponses(): SurveyResponses {
  return SURVEY_QUESTIONS.reduce((acc, question) => {
    acc[question.id] = 50
    return acc
  }, {} as SurveyResponses)
}
