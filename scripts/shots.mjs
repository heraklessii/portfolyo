#!/usr/bin/env node
// `npm run shots [name…]` → TestResults/shots/*.png from dist/ (run `npm run build` first).
// Uses an existing Electron (no new dependency): ELECTRON env var, else the one in ../Loomlight.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const electron = process.env.ELECTRON || path.resolve(root, '../Loomlight/node_modules/electron/dist/electron.exe')
if (!fs.existsSync(electron)) { console.error('Electron bulunamadı: ELECTRON=<electron.exe> ile ver'); process.exit(1) }

const booted = "sessionStorage.setItem('hera-booted','1'); location.reload()"
const ALL = [
  { name: 'boot', w: 1440, h: 900, wait: 900 },
  { name: 'boot-reduced', w: 1440, h: 900, wait: 400, reduced: true },
  { name: 'desktop', w: 1440, h: 900, js: booted, wait: 1500 },
  { name: 'about', w: 1440, h: 900, path: '#/about' },
  { name: 'games', w: 1440, h: 900, path: '#/projects/games' },
  { name: 'all', w: 1440, h: 900, path: '#/projects/all', js: "document.querySelector('.win').classList.add('max')" },
  { name: 'project', w: 1440, h: 900, path: '#/project/petalfall' },
  { name: 'cv', w: 1440, h: 900, path: '#/cv' },
  { name: 'quick', w: 1440, h: 900, path: '#/quick' },
  { name: 'videos', w: 1440, h: 900, path: '#/videos' },
  { name: 'terminal', w: 1440, h: 900, path: '#/terminal', js: "(() => { const i = document.querySelector('.term-in input'); const f = (c) => { i.value = c; i.dispatchEvent(new Event('input', { bubbles: true })); i.form.requestSubmit() }; f('neofetch'); setTimeout(() => f('ls games'), 150) })()" },
  { name: 'mobile', w: 390, h: 844, js: booted, wait: 1500 },
  { name: 'mobile-project', w: 390, h: 844, path: '#/project/petalfall' },
  { name: 'classic-cv', w: 1000, h: 1200, path: 'cv/' }
]
const pick = process.argv.slice(2)
const views = pick.length ? ALL.filter((v) => pick.includes(v.name)) : ALL
const out = path.join(root, 'TestResults/shots')
const r = spawnSync(electron, [path.join(root, 'scripts/shots-electron.cjs'), path.join(root, 'dist'), out, JSON.stringify(views)], { stdio: 'inherit' })
process.exit(r.status ?? 1)
