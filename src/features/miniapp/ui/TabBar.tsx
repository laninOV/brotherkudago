import type { CSSProperties } from 'react'
import { IconHome, IconMap, IconStar, IconUser } from './icons'

export type TabKey = 'home' | 'map' | 'matches' | 'profile'

export function TabBar({
  value,
  onChange,
}: {
  value: TabKey
  onChange: (next: TabKey) => void
}) {
  const activeIndex =
    value === 'home' ? 0 : value === 'map' ? 1 : value === 'matches' ? 2 : 3

  const itemWidth = 'calc((100% - 12px - 18px) / 4)'
  const activeLeft = [
    '6px',
    `calc(6px + ${itemWidth} + 6px)`,
    `calc(6px + ${itemWidth} + 6px + ${itemWidth} + 6px)`,
    `calc(6px + ${itemWidth} + 6px + ${itemWidth} + 6px + ${itemWidth} + 6px)`,
  ][activeIndex]

  return (
    <nav className="tabbar" aria-label="Навигация">
      <div
        className="tabbar__row"
        style={
          {
            ['--tabbar-active' as never]: activeIndex,
            ['--tabbar-active-left' as never]: activeLeft,
            ['--tabbar-active-width' as never]: itemWidth,
          } as CSSProperties
        }
      >
        <button
          className="tab"
          aria-current={value === 'home' ? 'page' : undefined}
          onClick={() => onChange('home')}
        >
          <IconHome />
          <span className="tab__label">Лента</span>
        </button>
        <button
          className="tab"
          aria-current={value === 'map' ? 'page' : undefined}
          onClick={() => onChange('map')}
        >
          <IconMap />
          <span className="tab__label">Карта</span>
        </button>
        <button
          className="tab"
          aria-current={value === 'matches' ? 'page' : undefined}
          onClick={() => onChange('matches')}
        >
          <IconStar />
          <span className="tab__label">Компаньон</span>
        </button>
        <button
          className="tab"
          aria-current={value === 'profile' ? 'page' : undefined}
          onClick={() => onChange('profile')}
        >
          <IconUser />
          <span className="tab__label">Профиль</span>
        </button>
      </div>
    </nav>
  )
}
