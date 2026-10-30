// Interactive CV: click a skill to see the work that used it. Empty CV sections are hidden (no made-up data, D4).
import { useState } from 'preact/hooks'
import { projects, site, type CvEntry } from '../lib/content'
import { L, t } from '../lib/i18n'
import { Btn, Chip, Socials, openApp } from './ui'

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9#+.]+/g, ' ').trim()
const key = (s: string) => norm(s).split(' ')[0]
/** Projects whose tags share the skill's first word ("Unity 6 (URP)" ↔ "Unity 6"). */
export const projectsUsing = (skill: string) => projects.filter((p) => p.tags.some((tag) => key(tag) === key(skill)))

function Entry({ e }: { e: CvEntry }) {
  return (
    <li class="tl-item">
      <span class="tl-when">{e.start} – {e.end ?? t('present')}</span>
      <strong>{L(e.title)}</strong>
      <span class="tl-org">{e.org}{e.place ? ` · ${e.place}` : ''}</span>
      {e.text && <p>{L(e.text)}</p>}
      {e.tags && <div class="chips">{e.tags.map((x) => <Chip key={x}>{x}</Chip>)}</div>}
    </li>
  )
}

export function Cv() {
  const [skill, setSkill] = useState<string | null>(null)
  const cv = site.cv
  const used = skill ? projectsUsing(skill) : []
  return (
    <div class="app cv" id="cv-print">
      <header class="cv-head">
        <div>
          <h1>{site.name}</h1>
          <p class="role">{cv?.headline ? L(cv.headline) : L(site.role)}</p>
          {cv?.location && <p class="muted">{L(cv.location)}</p>}
        </div>
        <div class="row no-print">
          <Btn primary onClick={() => window.print()}>{t('print')}</Btn>
          <Btn onClick={() => openApp('contact')}>{t('contact')}</Btn>
        </div>
      </header>

      <p class="lead">{L(site.intro)}</p>
      {cv?.looking && <p class="banner">{L(cv.looking)}</p>}

      <section>
        <h2>{t('skills')}</h2>
        {site.skills.map((g) => (
          <div class="skill-group" key={g.group.en}>
            <h3>{L(g.group)}</h3>
            <div class="chips">
              {g.items.map((s) => (
                <button key={s} class={`chip as-btn${skill === s ? ' on' : ''}`} onClick={() => setSkill(skill === s ? null : s)}>{s}</button>
              ))}
            </div>
          </div>
        ))}
        {skill && (
          <div class="skill-used">
            <b>{skill}</b> →{' '}
            {used.length ? used.map((p) => <button key={p.slug} class="link" onClick={() => openApp('project', p.slug)}>{p.title}</button>) : <span class="muted">—</span>}
          </div>
        )}
      </section>

      {cv && cv.experience.length > 0 && (
        <section>
          <h2>{t('experience')}</h2>
          <ol class="timeline">{cv.experience.map((e) => <Entry key={e.org + e.start} e={e} />)}</ol>
        </section>
      )}

      <section>
        <h2>{t('projects')}</h2>
        <ul class="cv-projects">
          {projects.map((p) => (
            <li key={p.slug}>
              <button class="link" onClick={() => openApp('project', p.slug)}>{p.title}</button>
              <span>{L(p.tagline)}</span>
              <small>{p.year} · {L(p.status)}</small>
            </li>
          ))}
        </ul>
      </section>

      {cv && cv.education.length > 0 && (
        <section>
          <h2>{t('education')}</h2>
          <ol class="timeline">{cv.education.map((e) => <Entry key={e.org + e.start} e={e} />)}</ol>
        </section>
      )}

      {cv && cv.languages.length > 0 && (
        <section>
          <h2>{t('languages')}</h2>
          <ul class="langs">{cv.languages.map((l) => <li key={l.name.en}><b>{L(l.name)}</b> {L(l.level)}</li>)}</ul>
        </section>
      )}

      <section>
        <h2>{t('socials')}</h2>
        <Socials compact />
      </section>
    </div>
  )
}
