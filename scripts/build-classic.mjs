#!/usr/bin/env node
// Classic CV page (D1): dist/cv/index.html (+ dist/en/cv/) — plain HTML from the same content, no JavaScript.
// For recruiters who want a page, search engines, screen readers and printing.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))
const site = read('content/site.json')
const projects = fs.readdirSync(path.join(root, 'content/projects')).filter((f) => f.endsWith('.json'))
  .map((f) => read(`content/projects/${f}`)).sort((a, b) => b.order - a.order)
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function page(lang) {
  const L = (v) => esc(v?.[lang] ?? v?.tr ?? '')
  const T = (tr, en) => (lang === 'tr' ? tr : en)
  const cv = site.cv ?? { education: [], experience: [], languages: [] }
  const entry = (e) => `<li><span class="when">${esc(e.start)} – ${esc(e.end ?? T('bugün', 'present'))}</span><b>${L(e.title)}</b> · ${esc(e.org)}${e.place ? ' · ' + esc(e.place) : ''}${e.text ? `<p>${L(e.text)}</p>` : ''}</li>`
  const other = lang === 'tr' ? '../en/cv/' : '../../cv/'
  const home = lang === 'tr' ? '../' : '../../'
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.name)} — CV</title>
<meta name="description" content="${L(site.intro)}">
<style>
body{font:16px/1.6 system-ui,sans-serif;max-width:860px;margin:0 auto;padding:32px 20px;color:#16131f;background:#fff}
h1{margin:0;font-size:34px}h2{margin:32px 0 10px;font-size:20px;border-bottom:2px solid #16131f}
.role{color:#4b3fb0;font-weight:600;margin:4px 0 14px}.when{display:block;color:#666;font-size:13px}
ul{padding-left:18px}li{margin:8px 0}a{color:#4b3fb0}.top{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:14px}
.chips span{display:inline-block;margin:2px 6px 2px 0;padding:1px 8px;border:1px solid #bbb;border-radius:99px;font-size:13px}
</style></head><body>
<p class="top"><a href="${home}">← HERA OS</a><a href="${other}">${T('English', 'Türkçe')}</a></p>
<h1>${esc(site.name)}</h1>
<p class="role">${cv.headline ? L(cv.headline) : L(site.role)}${cv.location ? ' · ' + L(cv.location) : ''}</p>
<p>${L(site.intro)}</p>
${cv.looking ? `<p><b>${L(cv.looking)}</b></p>` : ''}
${site.contact.email ? `<p>E-mail: <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></p>` : ''}
<h2>${T('Yetenekler', 'Skills')}</h2>
${site.skills.map((g) => `<p><b>${L(g.group)}:</b> ${g.items.map(esc).join(', ')}</p>`).join('\n')}
${cv.experience.length ? `<h2>${T('Deneyim', 'Experience')}</h2><ul>${cv.experience.map(entry).join('')}</ul>` : ''}
<h2>${T('Projeler', 'Projects')}</h2>
<ul>${projects.map((p) => `<li><b>${esc(p.title)}</b> (${esc(p.year)}, ${L(p.status)}) — ${L(p.tagline)}<div class="chips">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>${p.links[0] ? `<a href="${esc(p.links[0].url)}">${L(p.links[0].label)}</a>` : ''}</li>`).join('')}</ul>
${cv.education.length ? `<h2>${T('Eğitim', 'Education')}</h2><ul>${cv.education.map(entry).join('')}</ul>` : ''}
${cv.languages.length ? `<h2>${T('Diller', 'Languages')}</h2><ul>${cv.languages.map((l) => `<li><b>${L(l.name)}</b> — ${L(l.level)}</li>`).join('')}</ul>` : ''}
<h2>${T('Bağlantılar', 'Links')}</h2>
<ul>${site.socials.map((s) => `<li><a href="${esc(s.url)}">${esc(s.label)}</a>${s.note ? ' — ' + L(s.note) : ''}</li>`).join('')}</ul>
</body></html>
`
}

const dist = path.join(root, 'dist')
for (const [lang, dir] of [['tr', 'cv'], ['en', 'en/cv']]) {
  fs.mkdirSync(path.join(dist, dir), { recursive: true })
  fs.writeFileSync(path.join(dist, dir, 'index.html'), page(lang))
}
console.log('✓ klasik CV: dist/cv/ + dist/en/cv/')
