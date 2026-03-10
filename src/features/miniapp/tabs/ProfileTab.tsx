import { useMemo } from 'react'
import { CATEGORY_SECTIONS } from '../data/categoryFields'
import { SURVEY_QUESTIONS } from '../data/surveyQuestions'
import { DEFAULT_PROFILE_INFO } from '../model/profile'
import { useAppState } from '../state/AppState'
import { usePlacesState } from '../state/PlacesState'

export function ProfileTab() {
  const { places } = usePlacesState()
  const { history, profileInfo } = useAppState()
  const safeProfileInfo = profileInfo ?? DEFAULT_PROFILE_INFO

  const placeById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places])
  const historyView = useMemo(
    () => history.slice(0, 20).map((entry) => ({ entry, place: placeById.get(entry.placeId) })),
    [history, placeById],
  )

  const likeSummary = useMemo(() => {
    const liked = history.filter((event) => event.action === 'like')
    return {
      count: liked.length,
      lastPlaceId: liked[0]?.placeId,
    }
  }, [history])

  const lastLikedName = likeSummary.lastPlaceId ? placeById.get(likeSummary.lastPlaceId)?.title : undefined

  const profileProgress = useMemo(() => {
    const checks = [
      safeProfileInfo.status.trim().length > 0,
      safeProfileInfo.about.trim().length > 0,
      safeProfileInfo.moodTraits.length > 0,
      safeProfileInfo.hobbies.length > 0,
      Boolean(safeProfileInfo.gender),
      typeof safeProfileInfo.age === 'number',
      Boolean(safeProfileInfo.photo),
      safeProfileInfo.galleryPhotos.length > 0,
      Boolean(safeProfileInfo.preferredGender) ||
        typeof safeProfileInfo.preferredMinAge === 'number' ||
        typeof safeProfileInfo.preferredMaxAge === 'number',
    ]
    const completed = checks.filter(Boolean).length
    return {
      completed,
      total: checks.length,
      percent: Math.round((completed / checks.length) * 100),
    }
  }, [
    safeProfileInfo.about,
    safeProfileInfo.age,
    safeProfileInfo.galleryPhotos.length,
    safeProfileInfo.gender,
    safeProfileInfo.hobbies.length,
    safeProfileInfo.moodTraits.length,
    safeProfileInfo.photo,
    safeProfileInfo.preferredGender,
    safeProfileInfo.preferredMaxAge,
    safeProfileInfo.preferredMinAge,
    safeProfileInfo.status,
  ])

  const surveyProgress = useMemo(() => {
    const answered = SURVEY_QUESTIONS.filter(
      (question) => (safeProfileInfo.surveyResponses[question.id] ?? 50) !== 50,
    ).length
    const total = SURVEY_QUESTIONS.length
    return {
      answered,
      total,
      percent: total > 0 ? Math.round((answered / total) * 100) : 0,
      state:
        answered === 0 ? 'Не начат' : answered >= total ? 'Завершён' : 'В процессе',
    }
  }, [safeProfileInfo.surveyResponses])

  const categoryProgress = useMemo(() => {
    const total = CATEGORY_SECTIONS.reduce((acc, section) => acc + section.fields.length, 0)
    const answered = CATEGORY_SECTIONS.reduce((acc, section) => {
      return (
        acc +
        section.fields.reduce((sectionTotal, field) => {
          const value = safeProfileInfo.categoryAnswers[field.id]
          if (Array.isArray(value)) return sectionTotal + (value.length > 0 ? 1 : 0)
          if (typeof value === 'string') return sectionTotal + (value.trim().length > 0 ? 1 : 0)
          return sectionTotal
        }, 0)
      )
    }, 0)

    return {
      answered,
      total,
      percent: total > 0 ? Math.round((answered / total) * 100) : 0,
    }
  }, [safeProfileInfo.categoryAnswers])

  const moodPreview = safeProfileInfo.moodTraits.slice(0, 3)
  const hobbiesPreview = safeProfileInfo.hobbies.slice(0, 3)

  return (
    <div className="screen">
      <div className="screen__header">
        <div>
          <div className="screen__title">Профиль</div>
          <div className="screen__subtitle">
            Сводка по анкете и активности. Редактирование анкеты доступно во вкладке «Обо мне».
          </div>
        </div>
      </div>

      <div className="screen__body">
        <div className="profileFlow">
          <section className="iosCard profileMainCard">
            <div className="panelTitle">Сводка заполненности</div>
            <p className="panelSubtitle">
              Здесь только обзор. Поля анкеты и теста редактируются во вкладке «Обо мне».
            </p>

            <div className="registerGrid">
              <div className="listItem">
                <div className="listItem__main">
                  <div className="listItem__title">Анкета</div>
                  <div className="listItem__sub">
                    {profileProgress.completed} / {profileProgress.total} блоков
                  </div>
                  <div className="matchScoreBar">
                    <div className="matchScoreBar__fill" style={{ width: `${profileProgress.percent}%` }} />
                  </div>
                </div>
                <span className="badge">{profileProgress.percent}%</span>
              </div>

              <div className="listItem">
                <div className="listItem__main">
                  <div className="listItem__title">Тест предпочтений</div>
                  <div className="listItem__sub">
                    {surveyProgress.answered} / {surveyProgress.total} вопросов • {surveyProgress.state}
                  </div>
                  <div className="matchScoreBar">
                    <div className="matchScoreBar__fill" style={{ width: `${surveyProgress.percent}%` }} />
                  </div>
                </div>
                <span className="badge">{surveyProgress.percent}%</span>
              </div>

              <div className="listItem">
                <div className="listItem__main">
                  <div className="listItem__title">Категории</div>
                  <div className="listItem__sub">
                    {categoryProgress.answered} / {categoryProgress.total} полей
                  </div>
                  <div className="matchScoreBar">
                    <div className="matchScoreBar__fill" style={{ width: `${categoryProgress.percent}%` }} />
                  </div>
                </div>
                <span className="badge">{categoryProgress.percent}%</span>
              </div>
            </div>

            <div className="listItem__badges">
              <span className="badge">Статус: {safeProfileInfo.status || 'не указан'}</span>
              <span className="badge">
                Настроение: {moodPreview.length > 0 ? moodPreview.join(', ') : 'не выбрано'}
              </span>
              <span className="badge">
                Хобби: {hobbiesPreview.length > 0 ? hobbiesPreview.join(', ') : 'не выбрано'}
              </span>
            </div>
          </section>

          <section className="iosCard historyCard">
            <div className="panelTitle">История</div>
            <div className="historySummary">
              <div>
                <div className="historySummary__label">Лайков</div>
                <div className="historySummary__value">{likeSummary.count}</div>
              </div>
              <div>
                <div className="historySummary__label">Последнее место</div>
                <div className="historySummary__value">{lastLikedName ?? 'Пока нет'}</div>
              </div>
            </div>

            <div className="list" aria-label="История действий">
              {historyView.length === 0 ? (
                <div className="listItem">
                  <div className="thumb" />
                  <div className="listItem__main">
                    <div className="listItem__title">Пока пусто</div>
                    <div className="listItem__sub">Начни листать ленту, чтобы история ожила</div>
                  </div>
                </div>
              ) : (
                historyView.map(({ entry, place }) => (
                  <div key={`${entry.placeId}:${entry.at}`} className="listItem">
                    <div className="thumb" />
                    <div className="listItem__main">
                      <div className="listItem__title">
                        {place?.title ?? entry.placeId} •{' '}
                        {entry.action === 'like'
                          ? 'лайк'
                          : entry.action === 'skip'
                            ? 'скип'
                            : 'просмотр'}
                      </div>
                      <div className="listItem__sub">{new Date(entry.at).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
