// Every app of HERA OS. Add an app: a component in src/apps/ + one entry here.
import { h } from 'preact'
import type { AppDef } from '../os/types'
import { registerSize } from '../os/store'
import { projectBySlug, asset } from '../lib/content'
import { t } from '../lib/i18n'
import { About } from './About'
import { Projects, projectsTitle } from './Projects'
import { Project } from './Project'
import { Videos } from './Videos'
import { Cv } from './Cv'
import { Quick } from './Quick'
import { Terminal } from './Terminal'
import { Contact } from './Contact'
import { Trash } from './Trash'

export const apps: AppDef[] = [
  { id: 'about', icon: 'about', title: () => t('about'), size: { w: 640, h: 600 }, render: () => h(About, {}), desktop: 1, start: 1 },
  { id: 'games', icon: 'games', title: () => t('games'), size: { w: 0, h: 0 }, render: () => null, desktop: 2, start: 2, launch: { app: 'projects', arg: 'games' } },
  { id: 'tools', icon: 'tools', title: () => t('tools'), size: { w: 0, h: 0 }, render: () => null, desktop: 3, start: 3, launch: { app: 'projects', arg: 'tools' } },
  { id: 'web', icon: 'web', title: () => t('web'), size: { w: 0, h: 0 }, render: () => null, desktop: 4, start: 4, launch: { app: 'projects', arg: 'web' } },
  { id: 'videos', icon: 'videos', title: () => t('videos'), size: { w: 860, h: 620 }, render: () => h(Videos, {}), desktop: 5, start: 5 },
  { id: 'cv', icon: 'cv', title: () => 'CV.exe', size: { w: 860, h: 680 }, render: () => h(Cv, {}), desktop: 6, start: 6, hint: () => t('quickLookHint') },
  { id: 'terminal', icon: 'terminal', title: () => t('terminal'), size: { w: 640, h: 420 }, render: () => h(Terminal, {}), desktop: 7, start: 7 },
  { id: 'contact', icon: 'contact', title: () => t('contact'), size: { w: 520, h: 520 }, render: () => h(Contact, {}), desktop: 8, start: 8 },
  { id: 'trash', icon: 'trash', title: () => t('trash'), size: { w: 480, h: 360 }, render: () => h(Trash, {}), desktop: 99 },
  // windows opened by other apps
  { id: 'projects', icon: 'folder', title: (arg) => projectsTitle(arg), size: { w: 900, h: 620 }, render: (arg) => h(Projects, { arg }) },
  {
    id: 'project', size: { w: 900, h: 680 },
    icon: (slug) => asset(projectBySlug(slug ?? '')?.thumb) || 'games',
    title: (slug) => projectBySlug(slug ?? '')?.title ?? '?',
    render: (slug) => h(Project, { slug })
  },
  { id: 'quick', icon: 'quick', title: () => t('quickLook'), size: { w: 1000, h: 720 }, render: () => h(Quick, {}) }
]

for (const a of apps) if (a.size.w) registerSize(a.id, a.size)
