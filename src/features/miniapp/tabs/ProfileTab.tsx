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

  const placeById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places])
  const historyView = useMemo(
    () => history.slice(0, 20).map((h) => ({ h, place: placeById.get(h.placeId) })),
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
        ? safeProfileInfo.moodTraits.filter((t) => t !== trait)
        : [...safeProfileInfo.moodTraits, trait],
    })
  }

  const toggleHobby = (hobby: Hobby) => {
    const hasHobby = safeProfileInfo.hobbies.includes(hobby)
    setProfileInfo({
      hobbies: hasHobby
        ? safeProfileInfo.hobbies.filter((h) => h !== hobby)
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
    setProfileInfo({ galleryPhotos: [...existing, ...loaded.filter(Boolean)] })
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
    const next = current.includes(option) ? current.filter((value) => value !== option) : [...current, option]
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
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-5">
        <div>
          <div className="text-[20px] font-semibold tracking-tight">Профиль</div>
          <div className="mt-1 text-[13px] text-[var(--muted)]">
            Настрой и дополни профиль — это повлияет на то, как тебя поймут
          </div>
        </div>
        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold transition active:scale-[0.98] ${
            editingProfile
              ? 'bg-[#0d2b1d] text-[#E3EFD3] shadow-[0_10px_24px_rgba(13,43,29,0.45)]'
              : 'border border-[#E3EFD3]/20 bg-[#345635]/60 text-[var(--text)]'
          }`}
          onClick={() => setEditingProfile((prev) => !prev)}
        >
          {editingProfile ? 'Готово' : 'Редактировать'}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 pb-[calc(var(--tabbar-offset)+20px)] overscroll-contain">
        <div className="flex flex-col gap-5 pb-4">
          <section className="rounded-[28px] border border-[#E3EFD3]/20 bg-[var(--panel)] p-5 shadow-[var(--card-shadow)] backdrop-blur-2xl">
            <div className="flex flex-col gap-1">
              <div className="text-[20px] font-semibold">Профиль</div>
              <p className="text-[13px] text-[var(--muted)]">
                Загрузите фото, добавьте статус и опишите, с кем вы хотите ходить в уютные места.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex min-w-[120px] flex-col gap-2">
                  <div
                    className="flex h-[120px] w-[120px] items-center justify-center rounded-[24px] bg-[#345635]/60 text-[12px] text-[var(--muted)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)]"
                    style={{
                      backgroundImage: safeProfileInfo.photo ? `url(${safeProfileInfo.photo})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!safeProfileInfo.photo && 'Твоё фото'}
                  </div>
                  {editingProfile && (
                    <div className="flex flex-wrap gap-2">
                      <label
                        htmlFor="profile-photo"
                        className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#E3EFD3]/20 bg-[#345635]/60 px-3 py-1.5 text-[12px] font-semibold text-[var(--text)]"
                      >
                        {safeProfileInfo.photo ? 'Заменить' : 'Добавить'}
                      </label>
                      <input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                      {safeProfileInfo.photo && (
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-[#E3EFD3]/20 bg-[#345635]/60 px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
                          onClick={() => setProfileInfo({ photo: undefined })}
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-2">
                  {safeProfileInfo.galleryPhotos.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="relative h-[70px] w-[70px] overflow-hidden rounded-[14px] border border-[#E3EFD3]/20 bg-[#345635]/70 shadow-[inset_0_1px_0_rgba(227,239,211,0.25)]"
                    >
                      <img src={src} alt={`Фото ${index + 1}`} className="h-full w-full object-cover" />
                      {editingProfile && (
                        <button
                          type="button"
                          aria-label="Удалить фото"
                          className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0d2b1d]/80 text-[12px] font-bold text-[#E3EFD3]"
                          onClick={() => removeGalleryPhoto(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {editingProfile && safeProfileInfo.galleryPhotos.length < 5 && (
                    <label className="relative flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-[14px] border border-dashed border-[#E3EFD3]/25 text-[11px] text-[var(--muted)]">
                      <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0" onChange={handleGalleryChange} />
                      + Добавить фото
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Статус</div>
                <input
                  className="w-full rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-4 py-3 text-[14px] text-[var(--text)] placeholder:text-[var(--muted-2)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  value={safeProfileInfo.status}
                  placeholder="Например, «люблю вечерние прогулки»"
                  onChange={(event) => setProfileInfo({ status: event.target.value })}
                  disabled={!editingProfile}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">О себе</div>
                <textarea
                  className="min-h-[110px] w-full resize-y rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-4 py-3 text-[14px] text-[var(--text)] placeholder:text-[var(--muted-2)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  value={safeProfileInfo.about}
                  placeholder="Расскажи, какие места тебе нравятся и с кем ты любишь ходить."
                  onChange={(event) => setProfileInfo({ about: event.target.value })}
                  disabled={!editingProfile}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E3EFD3]/20 bg-[var(--panel)] p-5 shadow-[var(--card-shadow)] backdrop-blur-2xl">
            <div className="text-[16px] font-semibold">Настроение</div>
            <p className="mt-1 text-[12px] text-[var(--muted)]">
              Отметь, каким ты видишь себя: это помогает подобрать компаньона с близким вибе.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((trait) => {
                const active = safeProfileInfo.moodTraits.includes(trait)
                return (
                  <button
                    key={trait}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      active
                        ? 'border-[#6B8F71]/45 bg-[#6B8F71]/20 text-[#E3EFD3]'
                        : 'border-[#E3EFD3]/15 bg-[#345635]/70 text-[var(--text)]'
                    }`}
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

          <section className="rounded-[28px] border border-[#E3EFD3]/20 bg-[var(--panel)] p-5 shadow-[var(--card-shadow)] backdrop-blur-2xl">
            <div className="text-[16px] font-semibold">Хобби и активности</div>
            <p className="mt-1 text-[12px] text-[var(--muted)]">
              Выбирай всё, что нравится: от спорта до тихих вечеров — это влияет на то, о чем можно говорить.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {HOBBY_OPTIONS.map((hobby) => {
                const active = safeProfileInfo.hobbies.includes(hobby)
                return (
                  <button
                    key={hobby}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      active
                        ? 'border-[#6B8F71]/45 bg-[#6B8F71]/20 text-[#E3EFD3]'
                        : 'border-[#E3EFD3]/15 bg-[#345635]/70 text-[var(--text)]'
                    }`}
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

          <section className="rounded-[28px] border border-[#E3EFD3]/20 bg-[var(--panel)] p-5 shadow-[var(--card-shadow)] backdrop-blur-2xl">
            <div className="text-[16px] font-semibold">Основные параметры</div>
            <div className="mt-4 grid gap-3">
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Пол</span>
                <select
                  className="w-full rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-4 py-3 text-[14px] text-[var(--text)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  value={safeProfileInfo.gender}
                  onChange={(event) => setProfileInfo({ gender: event.target.value as GenderOption })}
                  disabled={!editingProfile}
                >
                  <option value="">Выберите</option>
                  <option value="female">Женский</option>
                  <option value="male">Мужской</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Возраст</span>
                <input
                  type="number"
                  min={18}
                  max={120}
                  placeholder="Например, 25"
                  className="w-full rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-4 py-3 text-[14px] text-[var(--text)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  value={safeProfileInfo.age ?? ''}
                  onChange={(event) => handleAgeChange(event.target.value)}
                  disabled={!editingProfile}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Предпочитаемый пол</span>
                <select
                  className="w-full rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-4 py-3 text-[14px] text-[var(--text)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  value={safeProfileInfo.preferredGender}
                  onChange={(event) => setProfileInfo({ preferredGender: event.target.value })}
                  disabled={!editingProfile}
                >
                  <option value="">Любой</option>
                  <option value="female">Женщины</option>
                  <option value="male">Мужчины</option>
                </select>
              </label>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Возраст компаньона</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={18}
                    max={120}
                    placeholder="от"
                    className="w-full rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-4 py-3 text-[14px] text-[var(--text)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
                    value={safeProfileInfo.preferredMinAge ?? ''}
                    onChange={(event) => handlePreferredMinAgeChange(event.target.value)}
                    disabled={!editingProfile}
                  />
                  <input
                    type="number"
                    min={18}
                    max={120}
                    placeholder="до"
                    className="w-full rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-4 py-3 text-[14px] text-[var(--text)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
                    value={safeProfileInfo.preferredMaxAge ?? ''}
                    onChange={(event) => handlePreferredMaxAgeChange(event.target.value)}
                    disabled={!editingProfile}
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            className={`rounded-[28px] border p-5 shadow-[var(--card-shadow)] backdrop-blur-2xl ${
              testCompleted
                ? 'border-[#E3EFD3]/20 bg-[var(--panel)]'
                : 'border-[#6B8F71]/45 bg-gradient-to-b from-[#345635]/90 to-[#6B8F71]/20'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[18px] font-semibold">Пройди тест</div>
                <p className="mt-1 text-[13px] text-[var(--muted)]">
                  Отвечай на шкалы, чтобы мы собрали вектор твоих предпочтений. Чем точнее — тем интереснее совпадения.
                </p>
              </div>
              <span className="rounded-full bg-[#345635]/60 px-3 py-1 text-[11px] font-semibold text-[var(--muted)]">
                {!testCompleted ? 'Ожидает' : 'Готово'}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#6B8F71] to-[#AEC3B0] px-4 py-2 text-[13px] font-semibold text-[#0d2b1d] shadow-[0_12px_30px_rgba(13,43,29,0.35)] transition active:scale-[0.98]"
                onClick={startSurvey}
              >
                {testCompleted ? 'Обновить тест' : 'Начать тест'}
              </button>
              <div className="text-[12px] text-[var(--muted)]">
                {!testCompleted ? 'Тест ещё не пройден' : 'Результаты уже сформированы'}
              </div>
            </div>

            {surveyActive && (
                <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/60 p-4 shadow-[inset_0_1px_0_rgba(227,239,211,0.25)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[15px] font-semibold">{currentQuestion.left}</div>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#345635]/60 text-[18px] text-[#E3EFD3]"
                      onClick={() => setSurveyActive(false)}
                      aria-label="Закрыть тест"
                    >
                    ×
                  </button>
                </div>
                <div className="text-[13px] text-[var(--muted)]">{currentQuestion.right}</div>
                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={currentValue}
                    onChange={(event) => updateSurveyResponse(currentQuestion.id, Number(event.target.value))}
                    className="w-full accent-[#6B8F71]"
                  />
                  <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
                    <span>-3</span>
                    <span>
                      {hintForValue(currentValue)} ({toIntValue(currentValue)})
                    </span>
                    <span>+3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-[#E3EFD3]/20 bg-[#345635]/60 px-3 py-1.5 text-[12px] font-semibold text-[var(--text)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Назад
                  </button>
                  <div className="text-[12px] text-[var(--muted)]">
                    {currentQuestionIndex + 1} / {SURVEY_QUESTIONS.length}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#6B8F71] to-[#AEC3B0] px-3 py-1.5 text-[12px] font-semibold text-[#0d2b1d] shadow-[0_10px_22px_rgba(13,43,29,0.35)] transition active:scale-[0.98]"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex === SURVEY_QUESTIONS.length - 1 ? 'Завершить' : 'Далее'}
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-[#E3EFD3]/20 bg-[var(--panel)] p-5 shadow-[var(--card-shadow)] backdrop-blur-2xl">
            <div className="text-[16px] font-semibold">Категории</div>
            <div className="mt-4 grid gap-4">
              {CATEGORY_SECTIONS.map((section) => (
                <div key={section.id} className="rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 p-4 shadow-[inset_0_1px_0_rgba(227,239,211,0.25)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-[14px]">{section.title}</strong>
                      <p className="mt-1 text-[12px] text-[var(--muted)]">{section.description}</p>
                    </div>
                    <span className="rounded-full bg-[#345635]/60 px-3 py-1 text-[11px] font-semibold text-[var(--muted)]">
                      {CATEGORY_TYPE_LABELS[section.categoryType]}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    {section.fields.map((field) => (
                      <label key={field.id} className="flex flex-col gap-2 text-[13px] text-[var(--text)]">
                        <span className="font-medium">{field.label}</span>
                        {field.type === 'single' ? (
                          <select
                            className="w-full rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 px-3 py-2 text-[13px] text-[var(--text)] shadow-[inset_0_1px_0_rgba(227,239,211,0.25)] focus:outline-none focus:ring-2 focus:ring-[#6B8F71]/35 disabled:cursor-not-allowed disabled:opacity-60"
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
                          <div className="flex flex-wrap gap-2">
                            {field.options.map((option) => {
                              const selected = Array.isArray(safeProfileInfo.categoryAnswers[field.id])
                                ? (safeProfileInfo.categoryAnswers[field.id] as string[]).includes(option)
                                : false
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  className={`rounded-full border px-3 py-1 text-[12px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    selected
                                      ? 'border-[#6B8F71]/45 bg-[#6B8F71]/20 text-[#E3EFD3]'
                                      : 'border-[#E3EFD3]/15 bg-[#345635]/70 text-[var(--text)]'
                                  }`}
                                  onClick={() => toggleCategoryOption(field.id, option)}
                                  disabled={!editingProfile}
                                >
                                  {option}
                                </button>
                              )}
                            )}
                          </div>
                        )}
                        {field.helper && <small className="text-[11px] text-[var(--muted)]">{field.helper}</small>}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E3EFD3]/20 bg-[var(--panel)] p-5 shadow-[var(--card-shadow)] backdrop-blur-2xl">
            <div className="text-[16px] font-semibold">История</div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 p-4">
                <div className="text-[12px] text-[var(--muted)]">Лайков</div>
                <div className="mt-1 text-[20px] font-semibold">{likeSummary.count}</div>
              </div>
              <div className="rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 p-4">
                <div className="text-[12px] text-[var(--muted)]">Последнее место</div>
                <div className="mt-1 text-[14px] font-semibold">{lastLikedName ?? 'Пока нет'}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3" aria-label="История действий">
              {historyView.length === 0 ? (
                <div className="flex items-center gap-3 rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 p-3">
                  <div className="h-12 w-12 rounded-[14px] border border-[#E3EFD3]/20 bg-gradient-to-br from-[#AEC3B0]/30 to-[#6B8F71]/25" />
                  <div>
                    <div className="text-[14px] font-semibold">Пока пусто</div>
                    <div className="mt-1 text-[12px] text-[var(--muted)]">Начни листать ленту, чтобы история ожила</div>
                  </div>
                </div>
              ) : (
                historyView.map(({ h, place }) => (
                  <div key={`${h.placeId}:${h.at}`} className="flex items-center gap-3 rounded-2xl border border-[#E3EFD3]/20 bg-[#345635]/70 p-3">
                    <div className="h-12 w-12 rounded-[14px] border border-[#E3EFD3]/20 bg-gradient-to-br from-[#AEC3B0]/30 to-[#6B8F71]/25" />
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold">
                        {place?.title ?? h.placeId} •{' '}
                        {h.action === 'like' ? 'лайк' : h.action === 'skip' ? 'скип' : 'просмотр'}
                      </div>
                      <div className="mt-1 text-[12px] text-[var(--muted)]">{new Date(h.at).toLocaleString()}</div>
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
