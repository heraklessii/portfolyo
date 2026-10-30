import { useEffect, useState } from 'preact/hooks'
import { Wallpaper } from './wallpaper/Wallpaper'
import { Desktop } from './os/Desktop'
import { Taskbar } from './os/Taskbar'
import { Boot } from './os/Boot'
import { applyHash, open, isMobile } from './os/store'
import { apps } from './apps/registry'
import { site } from './lib/content'
import { L, lang, t } from './lib/i18n'

const known = (id: string) => apps.some((a) => a.id === id && a.size.w > 0)

/** Sticky note on the desktop: the shortest way in for someone who just wants the facts. */
function Note() {
  const tr = lang.value === 'tr'
  return (
    <aside class="note" aria-label="HERA OS">
      <p class="note-hi">{tr ? 'Merhaba, ben' : "Hi, I'm"} <b>{site.name.split(' ')[0]}</b>.</p>
      <p>{L(site.role)}</p>
      <ul>
        <li><button class="link" onClick={() => open('quick', undefined, { maximized: true })}>→ {t('quickLook')}</button> <small>{tr ? '(işverenler için)' : '(for recruiters)'}</small></li>
        <li><button class="link" onClick={() => open('cv', undefined, { maximized: isMobile.value })}>→ CV.exe</button></li>
        <li><button class="link" onClick={() => open('projects', 'games', { maximized: isMobile.value })}>→ {t('games')}</button></li>
        <li><button class="link" onClick={() => open('terminal', undefined, { maximized: isMobile.value })}>→ {t('terminal')}</button> <small>(help)</small></li>
      </ul>
    </aside>
  )
}

export function App() {
  const deep = known(location.hash.replace(/^#\//, '').split('/')[0])
  const seen = (() => { try { return sessionStorage.getItem('hera-booted') === '1' } catch { return false } })()
  // reduced motion still gets the card — CSS makes it a still frame (base.css)
  const [booting, setBooting] = useState(!deep && !seen)

  useEffect(() => {
    document.documentElement.lang = lang.value
    applyHash(known)
    const onHash = () => applyHash(known)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const done = () => {
    setBooting(false)
    try { sessionStorage.setItem('hera-booted', '1') } catch { /* private mode */ }
  }

  return (
    <>
      <Wallpaper />
      <Desktop apps={apps} note={<Note />} />
      <Taskbar apps={apps} />
      {booting && <Boot onDone={done} />}
    </>
  )
}
