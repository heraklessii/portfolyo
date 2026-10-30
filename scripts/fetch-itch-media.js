#!/usr/bin/env node
/*
 * itch.io sayfasından kapak + ekran görüntülerini indirip WebP'ye çevirir.
 *
 *   node scripts/fetch-itch-media.js <slug> <itch-sayfa-url> [--max 6]
 *
 * Çıktı: public/media/<slug>/cover.webp, cover-sm.webp, shot-1.webp ...
 * Yeni bir itch projesi eklerken görselleri elle toplamak zorunda kalma diye var.
 * Görseller kendi sunucumuzdan servis edilir (CSP img-src dar kalır, itch CDN'ine
 * her ziyaretçide istek gitmez).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [slug, url, ...rest] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+$/.test(slug) || !url || !/^https:\/\/[a-z0-9-]+\.itch\.io\//.test(url)) {
  console.error('Kullanım: node scripts/fetch-itch-media.js <slug> <https://kullanici.itch.io/oyun> [--max 6]');
  process.exit(1);
}
const maxIdx = rest.indexOf('--max');
const MAX = maxIdx >= 0 ? Number(rest[maxIdx + 1]) || 6 : 6;
const outDir = path.resolve('public/media', slug);

async function get(u) {
  const r = await fetch(u, { headers: { 'user-agent': 'portfolio-media-fetch' } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return r;
}

async function save(buf, name, width, quality = 78) {
  const animated = (await sharp(buf).metadata()).pages > 1;
  await sharp(buf, { animated })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(path.join(outDir, name));
}

const html = await (await get(url)).text();
const cover = (html.match(/property="og:image"\s+content="([^"]+)"|content="([^"]+)"\s+property="og:image"/) || []).slice(1).find(Boolean);
// Ekran görüntüleri: "original" boyutlu bağlantılar (screenshot_list içindeki <a href>).
const shots = [...new Set([...html.matchAll(/href="(https:\/\/img\.itch\.zone\/[^"]+\/original\/[^"]+)"/g)].map((m) => m[1]))]
  .filter((u) => u !== cover)
  .slice(0, MAX);

await fs.mkdir(outDir, { recursive: true });
if (cover) {
  const buf = Buffer.from(await (await get(cover)).arrayBuffer());
  await save(buf, 'cover.webp', 1280);
  await save(buf, 'cover-sm.webp', 512, 72);
  console.log('✓ cover');
}
let i = 0;
for (const s of shots) {
  i += 1;
  const buf = Buffer.from(await (await get(s)).arrayBuffer());
  await save(buf, `shot-${i}.webp`, 1600);
  console.log(`✓ shot-${i}`);
}
console.log(`\n${outDir} → ${i} ekran görüntüsü. Proje JSON'unda "gallery" listesine ekle.`);
