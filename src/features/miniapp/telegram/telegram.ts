type TelegramWebApp = {
  ready: () => void
  expand?: () => void
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
  HapticFeedback?: {
    impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred?: (type: 'error' | 'success' | 'warning') => void
    selectionChanged?: () => void
  }
  openLink?: (url: string) => void
  themeParams?: Record<string, string>
}

export function getTelegramWebApp(): TelegramWebApp | null {
  const w = window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }
  return w.Telegram?.WebApp ?? null
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light') {
  const tg = getTelegramWebApp()
  tg?.HapticFeedback?.impactOccurred?.(style)
  if (!tg && 'vibrate' in navigator) navigator.vibrate?.(10)
}

export function tgOpenLink(url: string) {
  const tg = getTelegramWebApp()
  if (tg?.openLink) return tg.openLink(url)
  window.open(url, '_blank', 'noopener,noreferrer')
}

