// One project, opened from the explorer, the terminal or a deep link (#/project/<slug>).
import { useState } from 'preact/hooks'
import { asset, projectBySlug, projects } from '../lib/content'
import { L, LL, t } from '../lib/i18n'
import { Chip, Ext, YouTube, openApp } from './ui'

export function Project({ slug }: { slug?: string }) {
  const p = slug ? projectBySlug(slug) : undefined
  const [shot, setShot] = useState<string | null>(null)
  if (!p) return <div class="app"><p>404 — {slug}</p></div>
  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]
  return (
    <article class="app project" style={{ '--tone': p.color }}>
      <header class="project-hero">
        {p.cover && <img src={asset(p.cover)} alt="" />}
        <div class="project-hero-text">
          <Chip tone={p.color}>{L(p.status)}</Chip>
          <h1>{p.title}</h1>
          <p>{L(p.tagline)}</p>
        </div>
      </header>
      <div class="row">
        {p.links.map((l) => <Ext key={l.url} href={l.url} primary={l.type === 'primary'}>{L(l.label)}</Ext>)}
      </div>
      <div class="project-cols">
        <div>
          <p class="lead">{L(p.description)}</p>
          {p.highlights && <ul class="ticks">{LL(p.highlights).map((h) => <li key={h}>{h}</li>)}</ul>}
        </div>
        <aside class="facts">
          <h3>{t('tech')}</h3>
          <div class="chips">{p.tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}</div>
          {p.platforms && <><h3>{t('platforms')}</h3><p>{p.platforms.join(' · ')}</p></>}
          <h3>{p.year}</h3>
        </aside>
      </div>
      {p.video && <YouTube id={p.video} title={p.title} />}
      {p.gallery && p.gallery.length > 0 && (
        <div class="gallery">
          {p.gallery.map((g) => (
            <button key={g} onClick={() => setShot(g)}><img src={asset(g)} alt="" loading="lazy" /></button>
          ))}
        </div>
      )}
      {shot && (
        <div class="lightbox" onClick={() => setShot(null)} role="dialog">
          <img src={asset(shot)} alt="" />
        </div>
      )}
      <footer class="project-next">
        <button class="btn" onClick={() => openApp('project', next.slug)}>{next.title} →</button>
      </footer>
    </article>
  )
}
