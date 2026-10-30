import { useRef } from 'preact/hooks'
import type { WinState } from './store'
import { close, focus, minimize, toggleMax, move, resize, focusedId, isMobile } from './store'
import { t } from '../lib/i18n'
import { iconFor } from './icons'
import type { AppDef } from './types'

export function Window({ win, app }: { win: WinState; app: AppDef }) {
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const size = useRef<{ x: number; y: number; w: number; h: number } | null>(null)
  const max = win.maximized || isMobile.value
  const active = focusedId.value === win.id
  const ic = iconFor(app.icon, win.arg)

  const onTitleDown = (e: PointerEvent) => {
    focus(win.id)
    if (max || (e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onTitleMove = (e: PointerEvent) => {
    if (!drag.current) return
    const x = Math.min(window.innerWidth - 80, Math.max(-win.w + 120, e.clientX - drag.current.dx))
    const y = Math.min(window.innerHeight - 90, Math.max(0, e.clientY - drag.current.dy))
    move(win.id, x, y)
  }
  const onGripDown = (e: PointerEvent) => {
    e.stopPropagation()
    size.current = { x: e.clientX, y: e.clientY, w: win.w, h: win.h }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onGripMove = (e: PointerEvent) => {
    const s = size.current
    if (s) resize(win.id, s.w + e.clientX - s.x, s.h + e.clientY - s.y)
  }

  const style = max
    ? { zIndex: win.z }
    : { zIndex: win.z, left: win.x + 'px', top: win.y + 'px', width: win.w + 'px', height: win.h + 'px' }

  return (
    <section
      class={`win${active ? ' active' : ''}${max ? ' max' : ''}${win.minimized ? ' min' : ''}`}
      style={style}
      role="dialog"
      aria-label={app.title(win.arg)}
      onPointerDown={() => !active && focus(win.id)}
      onKeyDown={(e) => e.key === 'Escape' && close(win.id)}
    >
      <header
        class="win-title"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={() => (drag.current = null)}
        onDblClick={() => !isMobile.value && toggleMax(win.id)}
      >
        <img class="pix" src={ic} alt="" width={20} height={20} />
        <h2>{app.title(win.arg)}</h2>
        <div class="win-buttons">
          <button title={t('minimize')} aria-label={t('minimize')} onClick={() => minimize(win.id)}>_</button>
          {!isMobile.value && (
            <button title={max ? t('restore') : t('maximize')} aria-label={max ? t('restore') : t('maximize')} onClick={() => toggleMax(win.id)}>
              {max ? '❐' : '□'}
            </button>
          )}
          <button class="x" title={t('close')} aria-label={t('close')} onClick={() => close(win.id)}>×</button>
        </div>
      </header>
      <div class="win-body">{app.render(win.arg)}</div>
      {!max && <div class="win-grip" onPointerDown={onGripDown} onPointerMove={onGripMove} onPointerUp={() => (size.current = null)} />}
    </section>
  )
}
