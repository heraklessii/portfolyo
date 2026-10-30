#!/usr/bin/env node
// Content schema check (D4): every project and the site file have what the UI and the classic CV page read.
// Fails the build on the first broken file with a readable message.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const errors = []
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))
const l10n = (v, where) => { if (!v || typeof v.tr !== 'string' || typeof v.en !== 'string' || !v.tr || !v.en) errors.push(`${where}: { tr, en } gerekli`) }
const media = (p, where) => { if (p && !fs.existsSync(path.join(root, 'public', p.replace(/^\//, '')))) errors.push(`${where}: dosya yok → public${p}`) }

const site = read('content/site.json')
for (const k of ['name', 'handle', 'studio']) if (!site[k]) errors.push(`site.json: ${k} boş`)
l10n(site.role, 'site.role'); l10n(site.intro, 'site.intro'); l10n(site.contact?.availability, 'site.contact.availability')
for (const s of site.socials ?? []) if (!/^https:\/\//.test(s.url)) errors.push(`site.socials.${s.id}: https adresi değil`)
for (const e of [...(site.cv?.education ?? []), ...(site.cv?.experience ?? [])]) { l10n(e.title, `cv: ${e.org}`); if (!e.org || !e.start) errors.push(`cv: org/start eksik (${JSON.stringify(e).slice(0, 60)})`) }

const KINDS = ['game', 'tool', 'web', 'other']
const dir = path.join(root, 'content/projects')
const slugs = new Set()
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const p = read(`content/projects/${f}`)
  const w = `projects/${f}`
  if (p.slug + '.json' !== f) errors.push(`${w}: slug dosya adıyla aynı olmalı`)
  if (slugs.has(p.slug)) errors.push(`${w}: slug tekrar`)
  slugs.add(p.slug)
  if (!KINDS.includes(p.kind)) errors.push(`${w}: kind ${KINDS.join('|')}`)
  if (!/^#[0-9a-f]{6}$/i.test(p.color ?? '')) errors.push(`${w}: color #rrggbb`)
  for (const k of ['status', 'tagline', 'description']) l10n(p[k], `${w}.${k}`)
  if (!Array.isArray(p.tags) || !p.tags.length) errors.push(`${w}: tags boş`)
  if (!Array.isArray(p.links)) errors.push(`${w}: links dizi olmalı`)
  for (const l of p.links ?? []) { l10n(l.label, `${w}.links`); if (!/^https:\/\//.test(l.url)) errors.push(`${w}: link https değil`) }
  media(p.cover, `${w}.cover`); media(p.thumb, `${w}.thumb`)
  for (const g of p.gallery ?? []) media(g, `${w}.gallery`)
}

const videos = read('content/videos.json')
for (const c of videos.categories) { l10n(c.title, `videos.${c.id}`); for (const v of c.videos) if (!/^[\w-]{11}$/.test(v.id)) errors.push(`videos.${c.id}: YouTube id hatalı ${v.id}`) }

if (errors.length) { console.error('İÇERİK HATASI\n- ' + errors.join('\n- ')); process.exit(1) }
console.log(`✓ içerik: ${slugs.size} proje, ${videos.categories.reduce((n, c) => n + c.videos.length, 0)} video, ${site.socials.length} sosyal`)
