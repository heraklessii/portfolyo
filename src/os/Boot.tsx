import { useEffect, useState } from 'preact/hooks'
import { t } from '../lib/i18n'

/** HERA boot card, the same move as the game intro: H E R A rise one by one, the colour rule draws.
 *  Once per browser session; skipped for deep links and reduced motion; any click/key skips. */
export function Boot({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const end = () => { setLeaving(true); setTimeout(onDone, 380) }
    const id = setTimeout(end, 2100)
    const skip = () => { clearTimeout(id); end() }
    window.addEventListener('pointerdown', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })
    return () => { clearTimeout(id); window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip) }
  }, [])
  return (
    <div class={`boot${leaving ? ' leaving' : ''}`} role="status" aria-label="HERA OS">
      <div class="boot-word" aria-hidden="true">
        {'HERA'.split('').map((l, i) => <span style={{ animationDelay: `${0.25 + i * 0.16}s` }}>{l}</span>)}
      </div>
      <i class="rule boot-rule" />
      <p class="boot-os">OS · {t('booting')}…</p>
      <p class="boot-skip">{t('skipBoot')}</p>
    </div>
  )
}
