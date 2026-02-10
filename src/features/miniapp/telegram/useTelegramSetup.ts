import { useEffect } from 'react'
import { getTelegramWebApp } from './telegram'

function parseHexColor(input: string) {
  const hex = input.trim().replace(/^#/, '')
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return { r, g, b }
}

function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

function contrastRatio(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  const l1 = luminance(a)
  const l2 = luminance(b)
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

export function useTelegramSetup() {
  useEffect(() => {
    const tg = getTelegramWebApp()
    tg?.ready?.()
    tg?.expand?.()

    const root = document.documentElement
    const syncAppHeight = () => {
      const tgAny = tg as unknown as {
        viewportHeight?: number
        viewportStableHeight?: number
      }
      const h = tgAny?.viewportStableHeight ?? tgAny?.viewportHeight ?? window.innerHeight
      root.style.setProperty('--app-height', `${h}px`)
    }
    syncAppHeight()
    window.addEventListener('resize', syncAppHeight)

    const tgEvents = tg as unknown as {
      onEvent?: (name: string, cb: () => void) => void
      offEvent?: (name: string, cb: () => void) => void
    }
    tgEvents?.onEvent?.('viewportChanged', syncAppHeight)

    const theme = tg?.themeParams ?? {}
    const bg = theme.bg_color ?? '#0b0e14'
    const text = theme.text_color
    const hint = theme.hint_color

    tg?.setBackgroundColor?.(bg)
    tg?.setHeaderColor?.(bg)

    root.style.setProperty('--tg-bg', bg)
    const bgRgb = parseHexColor(bg)
    const textRgb = text ? parseHexColor(text) : null
    const hintRgb = hint ? parseHexColor(hint) : null

    if (bgRgb) {
      const isLight = luminance(bgRgb) > 0.6
      root.dataset.theme = isLight ? 'light' : 'dark'

      const fallbackText = isLight ? '#111827' : '#f8fafc'
      const fallbackHint = isLight ? 'rgba(17,24,39,0.62)' : 'rgba(248,250,252,0.68)'

      if (text && textRgb && contrastRatio(bgRgb, textRgb) >= 3) {
        root.style.setProperty('--tg-text', text)
      } else {
        root.style.setProperty('--tg-text', fallbackText)
      }

      if (hint && hintRgb && contrastRatio(bgRgb, hintRgb) >= 2.2) {
        root.style.setProperty('--tg-hint', hint)
      } else {
        root.style.setProperty('--tg-hint', fallbackHint)
      }
    } else {
      root.dataset.theme = ''
      if (text) root.style.setProperty('--tg-text', text)
      if (hint) root.style.setProperty('--tg-hint', hint)
    }

    if (theme.button_color) root.style.setProperty('--tg-button', theme.button_color)
    if (theme.secondary_bg_color)
      root.style.setProperty('--tg-secondary-bg', theme.secondary_bg_color)

    return () => {
      window.removeEventListener('resize', syncAppHeight)
      tgEvents?.offEvent?.('viewportChanged', syncAppHeight)
    }
  }, [])
}
