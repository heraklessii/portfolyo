import { useState } from 'preact/hooks'
import { open, windows, isMobile } from './store'
import { iconFor } from './icons'
import type { ComponentChildren } from 'preact'
import type { AppDef } from './types'
import { Window } from './Window'
import { t } from '../lib/i18n'

/** Desktop icons (double-click on desktop, single tap on phones) + every open window. */
export function Desktop({ apps, note }: { apps: AppDef[]; note?: ComponentChildren }) {
  const [sel, setSel] = useState<string | null>(null)
  const byId = Object.fromEntries(apps.map((a) => [a.id, a]))
  const icons = apps.filter((a) => a.desktop !== undefined).sort((a, b) => a.desktop! - b.desktop!)

  const launch = (a: AppDef) => {
    const l = a.launch ?? { app: a.id }
    open(l.app, l.arg, { maximized: l.maximized || isMobile.value })
  }

  return (
    <main class="desktop" onPointerDown={(e) => e.target === e.currentTarget && setSel(null)}>
      <nav class="icons" aria-label={t('desktopHint')}>
        {icons.map((a) => (
          <button
            key={a.id}
            class={`icon${sel === a.id ? ' sel' : ''}`}
            onClick={() => (isMobile.value ? launch(a) : setSel(a.id))}
            onDblClick={() => launch(a)}
            onKeyDown={(e) => e.key === 'Enter' && launch(a)}
          >
            <img class="pix" src={iconFor(a.icon)} alt="" width={48} height={48} />
            <span>{a.title()}</span>
          </button>
        ))}
      </nav>
      {note}
      {windows.value.map((w) => byId[w.app] && <Window key={w.id} win={w} app={byId[w.app]} />)}
    </main>
  )
}
