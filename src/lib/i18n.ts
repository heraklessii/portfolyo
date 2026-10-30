// Two languages (tr / en). UI strings live here; content strings come as { tr, en } from content/.
import { signal } from '@preact/signals'
import type { L10n, L10nList } from './content'

export type Lang = 'tr' | 'en'

const stored = (() => { try { return localStorage.getItem('hera-lang') } catch { return null } })()
export const lang = signal<Lang>(stored === 'tr' || stored === 'en' ? stored : navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en')

export function setLang(l: Lang) {
  lang.value = l
  document.documentElement.lang = l
  try { localStorage.setItem('hera-lang', l) } catch { /* private mode */ }
}

/** Content text in the current language. */
export const L = (v?: L10n) => (v ? v[lang.value] || v.tr : '')
export const LL = (v?: L10nList) => (v ? v[lang.value] || v.tr : [])

const UI = {
  start: { tr: 'Başlat', en: 'Start' },
  quickLook: { tr: 'Hızlı bakış', en: 'Quick look' },
  quickLookHint: { tr: 'CV ve öne çıkan işler tek ekranda', en: 'CV and highlights on one screen' },
  classic: { tr: 'Klasik CV sayfası', en: 'Classic CV page' },
  about: { tr: 'Hakkımda', en: 'About me' },
  games: { tr: 'Oyunlar', en: 'Games' },
  tools: { tr: 'Araçlar', en: 'Tools' },
  web: { tr: 'Web', en: 'Web' },
  allWork: { tr: 'Tüm işler', en: 'All work' },
  videos: { tr: 'Videolar', en: 'Videos' },
  cv: { tr: 'CV', en: 'CV' },
  terminal: { tr: 'Terminal', en: 'Terminal' },
  contact: { tr: 'İletişim', en: 'Contact' },
  trash: { tr: 'Çöp kutusu', en: 'Trash' },
  close: { tr: 'Kapat', en: 'Close' },
  minimize: { tr: 'Küçült', en: 'Minimize' },
  maximize: { tr: 'Büyüt', en: 'Maximize' },
  restore: { tr: 'Geri getir', en: 'Restore' },
  open: { tr: 'Aç', en: 'Open' },
  skipBoot: { tr: 'geçmek için tıkla', en: 'click to skip' },
  booting: { tr: 'açılıyor', en: 'starting' },
  language: { tr: 'English', en: 'Türkçe' },
  copy: { tr: 'Kopyala', en: 'Copy' },
  copied: { tr: 'Kopyalandı', en: 'Copied' },
  print: { tr: 'Yazdır / PDF', en: 'Print / PDF' },
  skills: { tr: 'Yetenekler', en: 'Skills' },
  experience: { tr: 'Deneyim', en: 'Experience' },
  education: { tr: 'Eğitim', en: 'Education' },
  languages: { tr: 'Diller', en: 'Languages' },
  projects: { tr: 'Projeler', en: 'Projects' },
  featured: { tr: 'Öne çıkanlar', en: 'Highlights' },
  socials: { tr: 'Sosyal', en: 'Social' },
  watchOn: { tr: "YouTube'da izle", en: 'Watch on YouTube' },
  channel: { tr: 'Kanala git', en: 'Visit channel' },
  play: { tr: 'Oynat', en: 'Play' },
  tech: { tr: 'Kullanılanlar', en: 'Built with' },
  platforms: { tr: 'Platformlar', en: 'Platforms' },
  present: { tr: 'bugün', en: 'present' },
  items: { tr: 'öğe', en: 'items' },
  emptyTrash: { tr: 'Çöp kutusu boş… neredeyse.', en: 'The trash is empty… almost.' },
  pending: { tr: 'Yakında', en: 'Coming soon' },
  desktopHint: { tr: 'Simgeye çift tıkla ya da Başlat menüsünü aç', en: 'Double-click an icon or open the Start menu' }
} satisfies Record<string, L10n>

export type UiKey = keyof typeof UI
export const t = (k: UiKey) => UI[k][lang.value]
