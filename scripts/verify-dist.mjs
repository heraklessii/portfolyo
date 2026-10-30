#!/usr/bin/env node
// Build output check: the files GitHub Pages will serve exist, use relative paths (works under /portfolyo/),
// and the JS bundle stays small (D2: revisit above 150 KB gzip).
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const dist = path.resolve(import.meta.dirname, '../dist')
const fail = (m) => { console.error('DIST HATASI: ' + m); process.exit(1) }
for (const f of ['index.html', 'cv/index.html', 'en/cv/index.html', 'favicon.svg']) if (!fs.existsSync(path.join(dist, f))) fail(`${f} yok`)
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (/(src|href)="\/(?!\/)/.test(html)) fail('index.html kökten (/) başlayan yol içeriyor — base ./ olmalı')
const js = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'))
const gz = js.reduce((n, f) => n + zlib.gzipSync(fs.readFileSync(path.join(dist, 'assets', f))).length, 0)
if (gz > 150 * 1024) fail(`JS ${Math.round(gz / 1024)} KB gzip > 150 KB`)
console.log(`✓ dist: ${js.length} JS dosyası, ${Math.round(gz / 1024)} KB gzip`)
