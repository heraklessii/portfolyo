// "Quick look" for recruiters (D1): who, what, best work, how to reach — one screen, no exploring needed.
import { projects, site, asset, AVATAR } from '../lib/content'
import { L, t } from '../lib/i18n'
import { Btn, ProjectCard, Socials, openApp } from './ui'

export function Quick() {
  const featured = projects.filter((p) => p.featured).slice(0, 6)
  return (
    <div class="app quick">
      <header class="quick-head">
        <img class="avatar sm" src={asset(AVATAR)} alt="HERA" width={64} height={64} />
        <div>
          <h1>{site.name}</h1>
          <p class="role">{L(site.role)}</p>
          <p class="muted">{L(site.contact.availability)}</p>
        </div>
        <div class="row">
          <Btn primary onClick={() => openApp('cv', undefined, true)}>{t('cv')}</Btn>
          <Btn onClick={() => openApp('contact')}>{t('contact')}</Btn>
          <a class="btn" href="./cv/">{t('classic')} ↗</a>
        </div>
      </header>
      <p class="lead">{L(site.intro)}</p>
      <div class="stats">
        {site.stats.map((s) => <div key={s.label.en}><b>{s.value}</b><span>{L(s.label)}</span></div>)}
      </div>
      <h2>{t('featured')}</h2>
      <div class="pgrid">{featured.map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
      <h2>{t('skills')}</h2>
      <div class="quick-skills">
        {site.skills.map((g) => <p key={g.group.en}><b>{L(g.group)}</b> {g.items.join(' · ')}</p>)}
      </div>
      <Socials compact />
    </div>
  )
}
