// "Explorer" window: projects grouped by kind, with a sidebar filter.
import { useState } from 'preact/hooks'
import { projects, type ProjectKind } from '../lib/content'
import { t, type UiKey } from '../lib/i18n'
import { icon } from '../os/icons'
import { ProjectCard } from './ui'

type Filter = 'all' | ProjectKind
const FILTERS: { id: Filter; label: UiKey; icon: string }[] = [
  { id: 'all', label: 'allWork', icon: 'folder' },
  { id: 'game', label: 'games', icon: 'games' },
  { id: 'tool', label: 'tools', icon: 'tools' },
  { id: 'web', label: 'web', icon: 'web' }
]
const fromArg = (arg?: string): Filter => (arg === 'games' ? 'game' : arg === 'tools' ? 'tool' : arg === 'web' ? 'web' : 'all')

export const projectsTitle = (arg?: string) => t(FILTERS.find((f) => f.id === fromArg(arg))!.label)

export function Projects({ arg }: { arg?: string }) {
  const [filter, setFilter] = useState<Filter>(fromArg(arg))
  const list = filter === 'all' ? projects : projects.filter((p) => p.kind === filter)
  return (
    <div class="app explorer">
      <aside class="explorer-side">
        {FILTERS.map((f) => (
          <button key={f.id} class={filter === f.id ? 'on' : ''} onClick={() => setFilter(f.id)}>
            <img class="pix" src={icon(f.icon)} alt="" width={24} height={24} />
            <span>{t(f.label)}</span>
            <small>{f.id === 'all' ? projects.length : projects.filter((p) => p.kind === f.id).length}</small>
          </button>
        ))}
      </aside>
      <div class="explorer-main">
        <p class="path">{'C:\\HERA\\'}{t(FILTERS.find((f) => f.id === filter)!.label)} — {list.length} {t('items')}</p>
        <div class="pgrid">{list.map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
      </div>
    </div>
  )
}
