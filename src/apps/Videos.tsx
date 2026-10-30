import { useState } from 'preact/hooks'
import { videos } from '../lib/content'
import { L, t } from '../lib/i18n'
import { Ext, Socials, YouTube } from './ui'

export function Videos() {
  const [cat, setCat] = useState(videos.categories[0]?.id)
  const c = videos.categories.find((x) => x.id === cat) ?? videos.categories[0]
  return (
    <div class="app videos">
      <div class="tabs" role="tablist">
        {videos.categories.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === cat} class={x.id === cat ? 'on' : ''} onClick={() => setCat(x.id)}>
            {L(x.title)} <small>{x.videos.length}</small>
          </button>
        ))}
      </div>
      <div class={`vgrid${c.format === 'short' ? ' shorts' : ''}`}>
        {c.videos.map((v) => <YouTube key={v.id} id={v.id} title={v.title} short={c.format === 'short'} />)}
      </div>
      <div class="row">
        <Ext primary href={videos.channel}>{t('channel')}</Ext>
      </div>
      <Socials compact />
    </div>
  )
}
