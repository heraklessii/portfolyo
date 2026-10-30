// Easter egg. The old 3D floating-island portfolio really does live on in git (tag `ucan-ada`).
import { useState } from 'preact/hooks'
import { lang, t } from '../lib/i18n'

const FILES = [
  { name: 'ucan-ada-portfolyo-3d.zip', tr: 'Eski portfolyom: uçan bir adada gezilen 3D site. Emekli oldu, git etiketinde huzur içinde yatıyor.', en: 'My old portfolio: a 3D floating island you could walk around. Retired; resting in peace in a git tag.' },
  { name: 'sonsuz-todo.txt', tr: '- bir oyun daha başlatma\n- bir oyun daha başlatma\n- ...bir oyun daha başlat', en: "- don't start another game\n- don't start another game\n- ...start another game" },
  { name: 'piksel-editoru.lnk', tr: 'İlham için teşekkürler — sonra kendi piksel editörümü yazdım (Loomlight).', en: 'Thanks for the inspiration — then I wrote my own pixel editor (Loomlight).' }
]

export function Trash() {
  const [sel, setSel] = useState(0)
  const f = FILES[sel]
  return (
    <div class="app trash">
      <p class="muted">{t('emptyTrash')}</p>
      <ul class="files">
        {FILES.map((x, i) => <li key={x.name}><button class={i === sel ? 'on' : ''} onClick={() => setSel(i)}>{x.name}</button></li>)}
      </ul>
      <pre class="file-view">{lang.value === 'tr' ? f.tr : f.en}</pre>
    </div>
  )
}
