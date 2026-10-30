import { useEffect, useState } from 'preact/hooks'
import { windows, focusedId, taskbarToggle, open, isMobile } from './store'
import { iconFor } from './icons'
import type { AppDef } from './types'
import { lang, setLang, t } from '../lib/i18n'
import { site, asset, AVATAR } from '../lib/content'

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(id) }, [])
  return <time class="clock">{now.toLocaleTimeString(lang.value === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</time>
}

export function Taskbar({ apps }: { apps: AppDef[] }) {
  const [menu, setMenu] = useState(false)
  const byId = Object.fromEntries(apps.map((a) => [a.id, a]))
  const list = apps.filter((a) => a.start !== undefined).sort((a, b) => a.start! - b.start!)

  useEffect(() => {
    const off = (e: PointerEvent) => !(e.target as HTMLElement).closest('.start-menu, .start-btn') && setMenu(false)
    window.addEventListener('pointerdown', off)
    return () => window.removeEventListener('pointerdown', off)
  }, [])

  const go = (a: AppDef) => {
    const l = a.launch ?? { app: a.id }
    open(l.app, l.arg, { maximized: l.maximized || isMobile.value })
    setMenu(false)
  }

  return (
    <>
      {menu && (
        <div class="start-menu" role="menu">
          <div class="start-user">
            <img class="avatar sm" src={asset(AVATAR)} alt="HERA" width={48} height={48} />
            <div>
              <strong>{site.name}</strong>
              <span>{site.role[lang.value]}</span>
            </div>
          </div>
          <div class="start-list">
            {list.map((a) => (
              <button key={a.id} role="menuitem" onClick={() => go(a)}>
                <img class="pix" src={iconFor(a.icon)} alt="" width={32} height={32} />
                <span><b>{a.title()}</b>{a.hint && <small>{a.hint()}</small>}</span>
              </button>
            ))}
          </div>
          <div class="start-foot">
            <a href="./cv/">{t('classic')} ↗</a>
            <button onClick={() => setLang(lang.value === 'tr' ? 'en' : 'tr')}>{t('language')}</button>
          </div>
        </div>
      )}
      <footer class="taskbar">
        <button class="start-btn" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          <span class="wordmark">HERA</span>
          <i class="rule" />
        </button>
        <div class="tasks">
          {windows.value.map((w) => {
            const a = byId[w.app]
            if (!a) return null
            const ic = iconFor(a.icon, w.arg)
            return (
              <button key={w.id} class={`task${focusedId.value === w.id ? ' on' : ''}${w.minimized ? ' off' : ''}`} onClick={() => taskbarToggle(w.id)} title={a.title(w.arg)}>
                <img class="pix" src={ic} alt="" width={20} height={20} />
                <span>{a.title(w.arg)}</span>
              </button>
            )
          })}
        </div>
        <button class="quick-btn" onClick={() => open('quick', undefined, { maximized: true })} title={t('quickLookHint')}>
          <img class="pix" src={iconFor('quick')} alt="" width={20} height={20} />
          <span>{t('quickLook')}</span>
        </button>
        <button class="lang-btn" onClick={() => setLang(lang.value === 'tr' ? 'en' : 'tr')} aria-label={t('language')}>
          {lang.value === 'tr' ? 'EN' : 'TR'}
        </button>
        <Clock />
      </footer>
    </>
  )
}
