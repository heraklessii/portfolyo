import { site, asset, AVATAR } from '../lib/content'
import { L, LL, t } from '../lib/i18n'
import { Btn, Socials, openApp } from './ui'

export function About() {
  return (
    <div class="app about">
      <header class="about-head">
        <img class="avatar" src={asset(AVATAR)} alt="HERA" width={96} height={96} />
        <div>
          <p class="kicker">{site.handle} · {site.studio}</p>
          <h1>{site.name}</h1>
          <p class="role">{L(site.role)}</p>
        </div>
      </header>
      <p class="lead">{L(site.intro)}</p>
      <div class="stats">
        {site.stats.map((s) => (
          <div key={s.value + s.label.en}><b>{s.value}</b><span>{L(s.label)}</span></div>
        ))}
      </div>
      {LL(site.about).map((para, i) => <p key={i}>{para}</p>)}
      <div class="row">
        <Btn primary onClick={() => openApp('cv', undefined, true)}>{t('cv')}</Btn>
        <Btn onClick={() => openApp('projects', 'all')}>{t('allWork')}</Btn>
        <Btn onClick={() => openApp('videos')}>{t('videos')}</Btn>
        <Btn onClick={() => openApp('contact')}>{t('contact')}</Btn>
      </div>
      <h3>{t('socials')}</h3>
      <Socials />
    </div>
  )
}
