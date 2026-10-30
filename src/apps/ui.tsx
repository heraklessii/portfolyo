// Small building blocks shared by the apps.
import { useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { open, isMobile } from '../os/store'
import { asset, site, type Project } from '../lib/content'
import { L, t } from '../lib/i18n'

export const Chip = ({ children, tone }: { children: ComponentChildren; tone?: string }) => (
  <span class="chip" style={tone ? { '--tone': tone } : undefined}>{children}</span>
)

export const Ext = ({ href, children, primary }: { href: string; children: ComponentChildren; primary?: boolean }) => (
  <a class={`btn${primary ? ' primary' : ''}`} href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>
)

export const Btn = ({ onClick, children, primary }: { onClick: () => void; children: ComponentChildren; primary?: boolean }) => (
  <button class={`btn${primary ? ' primary' : ''}`} onClick={onClick}>{children}</button>
)

/** Opens another window, maximized on phones. */
export const openApp = (app: string, arg?: string, maximized = false) => open(app, arg, { maximized: maximized || isMobile.value })

/** YouTube lite: a thumbnail until clicked, then the privacy-enhanced player. */
export function YouTube({ id, title, short }: { id: string; title: string; short?: boolean }) {
  const [on, setOn] = useState(false)
  return (
    <figure class={`yt${short ? ' short' : ''}`}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button class="yt-thumb" onClick={() => setOn(true)} aria-label={`${t('play')}: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span class="yt-play" aria-hidden="true">▶</span>
        </button>
      )}
      <figcaption>{title}</figcaption>
    </figure>
  )
}

export function Socials({ compact }: { compact?: boolean }) {
  return (
    <ul class={`socials${compact ? ' compact' : ''}`}>
      {site.socials.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            <b>{s.label}</b>
            {!compact && s.note && <small>{L(s.note)}</small>}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function ProjectCard({ p }: { p: Project }) {
  return (
    <button class="pcard" style={{ '--tone': p.color }} onClick={() => openApp('project', p.slug)}>
      <div class="pcard-img">{p.thumb || p.cover ? <img src={asset(p.thumb || p.cover)} alt="" loading="lazy" /> : <span>{p.title[0]}</span>}</div>
      <div class="pcard-text">
        <strong>{p.title}</strong>
        <small>{L(p.tagline)}</small>
        <Chip tone={p.color}>{L(p.status)}</Chip>
      </div>
    </button>
  )
}

