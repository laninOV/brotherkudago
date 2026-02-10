import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const dragStartYRef = useRef<number | null>(null)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  useEffect(() => {
    if (!open) return
    queueMicrotask(() => {
      setDragY(0)
      setDragging(false)
    })
    dragStartYRef.current = null
  }, [open])

  if (!open) return null

  const onGrabberPointerDown = (e: React.PointerEvent) => {
    dragStartYRef.current = e.clientY
    setDragging(true)
    setDragY(0)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onGrabberPointerMove = (e: React.PointerEvent) => {
    const startY = dragStartYRef.current
    if (startY == null) return
    const dy = Math.max(0, e.clientY - startY)
    setDragY(Math.min(dy, 280))
  }

  const finishDrag = () => {
    const dy = dragY
    dragStartYRef.current = null
    setDragging(false)
    if (dy > 120) onClose()
    else setDragY(0)
  }

  return (
    <div className="sheet" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        ref={panelRef}
        className="sheet__panel"
        style={{
          transform: dragY ? `translate3d(0, ${dragY}px, 0)` : undefined,
          transition: dragging ? 'none' : 'transform 220ms cubic-bezier(.2,.9,.2,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sheet__grabber"
          onPointerDown={onGrabberPointerDown}
          onPointerMove={onGrabberPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        />
        {children}
      </div>
    </div>
  )
}
