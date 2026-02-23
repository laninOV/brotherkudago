import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAppState } from '../state/AppState'
import { usePlacesState } from '../state/PlacesState'
import {
  DEFAULT_PROFILE_INFO,
  HOBBY_OPTIONS,
  MOOD_OPTIONS,
  type GenderOption,
  type Hobby,
  type MoodTrait,
} from '../model/profile'
import { SURVEY_QUESTIONS } from '../data/surveyQuestions'
import { CATEGORY_SECTIONS, type CategorySection } from '../data/categoryFields'

const CATEGORY_TYPE_LABELS: Record<CategorySection['categoryType'], string> = {
  preferences: 'Предпочтения',
  dealbreakers: 'Что не подходит',
  facts: 'Факты',
}

const SLIDER_STEP = 100 / 6

const toIntValue = (value: number) => Math.round((value - 50) / SLIDER_STEP)

const hintForValue = (value: number) => {
  const intValue = toIntValue(value)
  if (intValue >= 2) return 'Скорее справа'
  if (intValue === 1) return 'Чуть справа'
  if (intValue === 0) return 'Примерно одинаково'
  if (intValue === -1) return 'Чуть слева'
  return 'Скорее слева'
}

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  })

export function ProfileTab() {
  const { places } = usePlacesState()
  const { history, profileInfo, setProfileInfo } = useAppState()
  const safeProfileInfo = profileInfo ?? DEFAULT_PROFILE_INFO

  const [editingProfile, setEditingProfile] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [surveyActive, setSurveyActive] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

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

  const toggleMood = (trait: MoodTrait) => {
    const hasTrait = safeProfileInfo.moodTraits.includes(trait)
    setProfileInfo({
      moodTraits: hasTrait
        ? safeProfileInfo.moodTraits.filter((item) => item !== trait)
        : [...safeProfileInfo.moodTraits, trait],
    })
  }

  const toggleHobby = (hobby: Hobby) => {
    const hasHobby = safeProfileInfo.hobbies.includes(hobby)
    setProfileInfo({
      hobbies: hasHobby
        ? safeProfileInfo.hobbies.filter((item) => item !== hobby)
        : [...safeProfileInfo.hobbies, hobby],
    })
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileInfo({ photo: reader.result })
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleGalleryChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const existing = safeProfileInfo.galleryPhotos ?? []
    const available = 5 - existing.length
    if (available <= 0) return

    const toAdd = Array.from(files).slice(0, available)
    const loaded = await Promise.all(toAdd.map((file) => readFileAsDataURL(file)))

    setProfileInfo({
      galleryPhotos: [...existing, ...loaded.filter(Boolean)],
    })
    event.target.value = ''
  }

  const removeGalleryPhoto = (index: number) => {
    if (!editingProfile) return
    setProfileInfo({
      galleryPhotos: safeProfileInfo.galleryPhotos.filter((_, i) => i !== index),
    })
  }

  const updateSurveyResponse = (id: string, value: number) => {
    setProfileInfo({
      surveyResponses: {
        ...safeProfileInfo.surveyResponses,
        [id]: value,
      },
    })
  }

  const handleCategoryChange = (id: string, value: string) => {
    setProfileInfo({
      categoryAnswers: {
        ...safeProfileInfo.categoryAnswers,
        [id]: value,
      },
    })
  }

  const toggleCategoryOption = (id: string, option: string) => {
    const current = Array.isArray(safeProfileInfo.categoryAnswers[id])
      ? (safeProfileInfo.categoryAnswers[id] as string[])
      : []

    const next = current.includes(option)
      ? current.filter((value) => value !== option)
      : [...current, option]

    setProfileInfo({
      categoryAnswers: {
        ...safeProfileInfo.categoryAnswers,
        [id]: next,
      },
    })
  }

  const handleAgeChange = (value: string) => {
    setProfileInfo({ age: value === '' ? undefined : Number(value) })
  }

  const handlePreferredMinAgeChange = (value: string) => {
    setProfileInfo({ preferredMinAge: value === '' ? undefined : Number(value) })
  }

  const handlePreferredMaxAgeChange = (value: string) => {
    setProfileInfo({ preferredMaxAge: value === '' ? undefined : Number(value) })
  }

  const startSurvey = () => {
    setTestCompleted(false)
    setSurveyActive(true)
    setCurrentQuestionIndex(0)
  }

  const finishSurvey = () => {
    setTestCompleted(true)
    setSurveyActive(false)
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= SURVEY_QUESTIONS.length - 1) {
      finishSurvey()
      return
    }
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex]
  const currentValue = safeProfileInfo.surveyResponses[currentQuestion.id] ?? 50

  return (
    <div className="screen">
      <div className="screen__header">
        <div>
          <div className="screen__title">Профиль</div>
          <div className="screen__subtitle">
            Настрой и дополни профиль — это повлияет на то, как тебя поймут.
          </div>
        </div>
        <button
          type="button"
          className={`iosButton iosButton--small ${editingProfile ? 'iosButton--inverse' : 'iosButton--ghost'}`}
          onClick={() => setEditingProfile((prev) => !prev)}
        >
          {editingProfile ? 'Готово' : 'Редактировать'}
        </button>
      </div>

      <div className="screen__body">
        <div className="profileFlow">
          <section className="iosCard">
            <div className="profileCard__header">
              <div>
                <div className="profileCard__title">Основная анкета</div>
                <p className="profileCard__subtitle">
                  Фото, описание и статус помогают быстрее подобрать подходящую компанию.
                </p>
              </div>
            </div>

            <div className="profileCard__body">
              <div className="photoRow">
                <div className="photoRow__avatar">
                  <div
                    className="photoRow__preview"
                    style={{
                      backgroundImage: safeProfileInfo.photo ? `url(${safeProfileInfo.photo})` : undefined,
                    }}
                  >
                    {!safeProfileInfo.photo ? 'Твоё фото' : ''}
                  </div>

                  {editingProfile && (
                    <div className="photoRow__actions">
                      <label htmlFor="profile-photo" className="iosButton iosButton--tiny iosButton--ghost">
                        {safeProfileInfo.photo ? 'Заменить' : 'Добавить'}
                      </label>
                      <input
                        id="profile-photo"
                        className="photoRow__input"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                      {safeProfileInfo.photo && (
                        <button
                          type="button"
                          className="iosButton iosButton--tiny iosButton--ghost"
                          onClick={() => setProfileInfo({ photo: undefined })}
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="photoRow__gallery">
                  {safeProfileInfo.galleryPhotos.map((src, index) => (
                    <div key={`${src}-${index}`} className="photoGallery__item">
                      <img src={src} alt={`Фото ${index + 1}`} />
                      {editingProfile && (
                        <button
                          type="button"
                          className="photoGallery__remove"
                          aria-label="Удалить фото"
                          onClick={() => removeGalleryPhoto(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {editingProfile && safeProfileInfo.galleryPhotos.length < 5 && (
                    <label className="photoGallery__add">
                      + Фото
                      <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
                    </label>
                  )}
                </div>
              </div>

              <label className="profileField">
                <span className="profileField__label">Статус</span>
                <input
                  className="profileInput"
                  value={safeProfileInfo.status}
                  placeholder="Например, «люблю вечерние прогулки»"
                  onChange={(event) => setProfileInfo({ status: event.target.value })}
                  disabled={!editingProfile}
                />
              </label>

              <label className="profileField">
                <span className="profileField__label">О себе</span>
                <textarea
                  className="profileTextarea"
                  value={safeProfileInfo.about}
                  placeholder="Расскажи, какие места тебе нравятся и с кем ты любишь ходить."
                  onChange={(event) => setProfileInfo({ about: event.target.value })}
                  disabled={!editingProfile}
                />
              </label>
            </div>
          </section>

          <section className="iosCard moodCard">
            <div className="panelTitle">Настроение</div>
            <p className="panelSubtitle">
              Отметь, каким ты видишь себя — это помогает точнее подобрать компаньона.
            </p>
            <div className="chipRow chipRow--wrap">
              {MOOD_OPTIONS.map((trait) => {
                const active = safeProfileInfo.moodTraits.includes(trait)
                return (
                  <button
                    key={trait}
                    className={`pill ${active ? 'pill--active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleMood(trait)}
                    disabled={!editingProfile}
                  >
                    {trait}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="iosCard hobbyCard">
            <div className="panelTitle">Хобби и активности</div>
            <p className="panelSubtitle">
              Выбирай всё, что нравится: от спорта до творческих вечеров.
            </p>
            <div className="chipRow chipRow--wrap">
              {HOBBY_OPTIONS.map((hobby) => {
                const active = safeProfileInfo.hobbies.includes(hobby)
                return (
                  <button
                    key={hobby}
                    className={`pill ${active ? 'pill--active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleHobby(hobby)}
                    disabled={!editingProfile}
                  >
                    {hobby}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="iosCard parametersCard">
            <div className="panelTitle">Основные параметры</div>
            <div className="profileCard__body">
              <label className="profileField">
                <span className="profileField__label">Пол</span>
                <select
                  className="profileInput"
                  value={safeProfileInfo.gender}
                  onChange={(event) => setProfileInfo({ gender: event.target.value as GenderOption })}
                  disabled={!editingProfile}
                >
                  <option value="">Выберите</option>
                  <option value="female">Женский</option>
                  <option value="male">Мужской</option>
                </select>
              </label>

              <label className="profileField">
                <span className="profileField__label">Возраст</span>
                <input
                  className="profileInput"
                  type="number"
                  min={18}
                  max={120}
                  placeholder="Например, 25"
                  value={safeProfileInfo.age ?? ''}
                  onChange={(event) => handleAgeChange(event.target.value)}
                  disabled={!editingProfile}
                />
              </label>

              <label className="profileField">
                <span className="profileField__label">Предпочитаемый пол</span>
                <select
                  className="profileInput"
                  value={safeProfileInfo.preferredGender}
                  onChange={(event) => setProfileInfo({ preferredGender: event.target.value })}
                  disabled={!editingProfile}
                >
                  <option value="">Любой</option>
                  <option value="female">Женщины</option>
                  <option value="male">Мужчины</option>
                </select>
              </label>

              <div className="profileField">
                <span className="profileField__label">Возраст компаньона</span>
                <div className="registerRange">
                  <input
                    className="profileInput"
                    type="number"
                    min={18}
                    max={120}
                    placeholder="от"
                    value={safeProfileInfo.preferredMinAge ?? ''}
                    onChange={(event) => handlePreferredMinAgeChange(event.target.value)}
                    disabled={!editingProfile}
                  />
                  <input
                    className="profileInput"
                    type="number"
                    min={18}
                    max={120}
                    placeholder="до"
                    value={safeProfileInfo.preferredMaxAge ?? ''}
                    onChange={(event) => handlePreferredMaxAgeChange(event.target.value)}
                    disabled={!editingProfile}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={`iosCard testPanel ${!testCompleted ? 'testPanel--attention' : 'testPanel--complete'}`}>
            <div className="testPanel__header">
              <div>
                <div className="testPanel__title">Тест предпочтений</div>
                <p className="testPanel__subtitle">
                  Отвечай на шкалы: чем точнее ответы, тем лучше совпадения и рекомендации.
                </p>
              </div>
              <span className="testPanel__badge">{testCompleted ? 'Готово' : 'Ожидает'}</span>
            </div>

            <div className="testPanel__body">
              <button className="iosButton iosButton--primary" onClick={startSurvey}>
                {testCompleted ? 'Обновить тест' : 'Начать тест'}
              </button>
              <div className="testPanel__hint">
                {testCompleted ? 'Результаты уже сформированы' : 'Тест ещё не пройден'}
              </div>
            </div>

            {surveyActive && (
              <div className="surveyInline">
                <div className="surveyInline__header">
                  <div className="surveyInline__question">{currentQuestion.left}</div>
                  <button
                    type="button"
                    className="surveyInline__close"
                    onClick={() => setSurveyActive(false)}
                    aria-label="Закрыть тест"
                  >
                    ×
                  </button>
                </div>

                <div className="surveyInline__question--right">{currentQuestion.right}</div>

                <div className="surveyInline__slider">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={currentValue}
                    onChange={(event) => updateSurveyResponse(currentQuestion.id, Number(event.target.value))}
                  />
                </div>

                <div className="surveyInline__values">
                  <span>-3</span>
                  <span>
                    {hintForValue(currentValue)} ({toIntValue(currentValue)})
                  </span>
                  <span>+3</span>
                </div>

                <div className="surveyInline__footer">
                  <button
                    className="iosButton iosButton--ghost iosButton--small"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Назад
                  </button>
                  <span className="surveyInline__progress">
                    {currentQuestionIndex + 1} / {SURVEY_QUESTIONS.length}
                  </span>
                  <button className="iosButton iosButton--primary iosButton--small" onClick={handleNextQuestion}>
                    {currentQuestionIndex === SURVEY_QUESTIONS.length - 1 ? 'Завершить' : 'Далее'}
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="iosCard">
            <div className="panelTitle">Категории</div>
            <div className="categoryGrid">
              {CATEGORY_SECTIONS.map((section) => (
                <div key={section.id} className="categoryCard">
                  <div className="categoryCard__header">
                    <div>
                      <strong>{section.title}</strong>
                      <p>{section.description}</p>
                    </div>
                    <span className="categoryCard__badge">{CATEGORY_TYPE_LABELS[section.categoryType]}</span>
                  </div>

                  <div className="categoryFields">
                    {section.fields.map((field) => (
                      <label key={field.id} className="categoryField">
                        <span>{field.label}</span>

                        {field.type === 'single' ? (
                          <select
                            value={(safeProfileInfo.categoryAnswers[field.id] as string) || ''}
                            onChange={(event) => handleCategoryChange(field.id, event.target.value)}
                            disabled={!editingProfile}
                          >
                            <option value="">Не указано</option>
                            {field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="categoryChips">
                            {field.options.map((option) => {
                              const selected = Array.isArray(safeProfileInfo.categoryAnswers[field.id])
                                ? (safeProfileInfo.categoryAnswers[field.id] as string[]).includes(option)
                                : false

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  className={`categoryChip ${selected ? 'is-active' : ''}`}
                                  onClick={() => toggleCategoryOption(field.id, option)}
                                  disabled={!editingProfile}
                                >
                                  {option}
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {field.helper && <small className="categoryHelper">{field.helper}</small>}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
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
