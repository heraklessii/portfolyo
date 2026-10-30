// Typed access to content/*.json (D4). The UI and the classic CV page read the same files.
import siteJson from '../../content/site.json'
import videosJson from '../../content/videos.json'

export type L10n = { tr: string; en: string }
export type L10nList = { tr: string[]; en: string[] }

export type ProjectKind = 'game' | 'tool' | 'web' | 'other'
export type Link = { type: 'primary' | 'secondary' | 'source'; label: L10n; url: string }

export type Project = {
  slug: string
  title: string
  kind: ProjectKind
  order: number
  featured?: boolean
  color: string
  status: L10n
  year: string
  tagline: L10n
  description: L10n
  highlights?: L10nList
  tags: string[]
  platforms?: string[]
  cover?: string
  thumb?: string
  gallery?: string[]
  links: Link[]
  /** YouTube id of a trailer / gameplay video, if any */
  video?: string
}

export type CvEntry = { title: L10n; org: string; place?: string; start: string; end?: string; text?: L10n; tags?: string[] }
export type Cv = {
  headline?: L10n
  location?: L10n
  education: CvEntry[]
  experience: CvEntry[]
  languages: { name: L10n; level: L10n }[]
  looking?: L10n
}

export type Site = {
  name: string
  handle: string
  studio: string
  role: L10n
  intro: L10n
  about: L10nList
  skills: { group: L10n; items: string[] }[]
  stats: { value: string; label: L10n }[]
  contact: { email: string; availability: L10n }
  socials: { id: string; label: string; url: string; note?: L10n }[]
  cv?: Cv
}

export type Video = { id: string; title: string }
export type VideoCategory = { id: string; title: L10n; format: 'short' | 'wide'; videos: Video[] }
export type Videos = { channel: string; categories: VideoCategory[] }

export const site = siteJson as unknown as Site
export const videos = videosJson as unknown as Videos

const modules = import.meta.glob<Project>('../../content/projects/*.json', { eager: true, import: 'default' })
export const projects: Project[] = Object.values(modules).sort((a, b) => b.order - a.order)

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
export const projectsOf = (kind: ProjectKind) => projects.filter((p) => p.kind === kind)

/** The HERA avatar (same as the Instagram profile picture). */
export const AVATAR = '/media/hera/avatar.webp'

/** Resolves a content path ("/media/x.webp") against the site base, so it works under /portfolyo/ too. */
export const asset = (path?: string) => (path ? import.meta.env.BASE_URL + path.replace(/^\//, '') : '')
