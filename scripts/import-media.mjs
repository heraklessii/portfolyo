#!/usr/bin/env node
// Brings project images from the sibling project folders into public/media/<slug>/ as WebP
// (cover.webp 1260×1000, cover-sm.webp 630×500, shot-N.webp ≤1600 wide). Projects without art get a
// generated cover: their app icon on their brand colour.
//
//   node scripts/import-media.mjs [slug…]
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const D = path.resolve(root, '..')            // Desktop: the project folders live next to this one
const H = path.join(D, 'HeraSosyal/assets/games')

const SOURCES = {
  'mirelas-cauldron': { cover: `${D}/AlchemyLab/StoreAssets/itch/cover_630x500.png`, shots: [`${H}/mirela/shot.png`, `${H}/mirela/shot2.png`] },
  loomlight: { cover: `${D}/Loomlight/marketing/itch/out/cover-630x500.png`, shots: [1, 3, 4, 2, 5].map((n) => `${D}/Loomlight/marketing/itch/out/screens/0${n}-${['', 'editor', 'export', 'indexed-shading', 'tiled', 'light'][n]}.png`) },
  muivly: { cover: `${D}/Mui/Muivly/site/social-preview.png` },
  muiren: { icon: `${D}/Mui/Muiren/site/ikon.svg`, color: '#3fd6c6' },
  muiply: { icon: `${D}/Mui/MuiLabs/public/icons/muiply.svg`, color: '#ff6f91' },
  muiget: { icon: `${D}/Mui/MuiLabs/public/icons/muiget.svg`, color: '#7cc8ff', shots: [`${D}/Mui/Muiget/docs/ekran-goruntusu.png`] },
  muifly: { icon: `${D}/Mui/MuiLabs/public/icons/muifly.svg`, color: '#ffcf6b' },
  'muiren-bot': { text: '♪', color: '#9b84ff' },
  'ved-tr': { text: 'TR', color: '#b98cff' }
}

async function generated({ icon, text, color }) {
  const W = 1260, H = 1000
  const dots = Array.from({ length: 140 }, (_, i) => `<rect x="${(i * 97) % W}" y="${(i * 53) % H}" width="6" height="6" fill="#fff" opacity="${0.04 + (i % 5) * 0.02}"/>`).join('')
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><radialGradient id="g" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="${color}" stop-opacity=".55"/><stop offset="1" stop-color="#0c0a16"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="#0c0a16"/><rect width="${W}" height="${H}" fill="url(#g)"/>${dots}
    ${text ? `<text x="50%" y="56%" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="800" font-size="300" fill="#fff">${text}</text>` : ''}
  </svg>`)
  const layers = []
  if (icon) layers.push({ input: await sharp(icon, { density: 600 }).resize(420, 420, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), gravity: 'centre' })
  return sharp(bg).composite(layers).png().toBuffer()
}

const pick = process.argv.slice(2)
for (const [slug, src] of Object.entries(SOURCES)) {
  if (pick.length && !pick.includes(slug)) continue
  const dir = path.join(root, 'public/media', slug)
  fs.mkdirSync(dir, { recursive: true })
  const cover = src.cover ? await sharp(src.cover).png().toBuffer() : await generated(src)
  await sharp(cover).resize(1260, 1000, { fit: 'cover', kernel: 'nearest' }).webp({ quality: 86 }).toFile(path.join(dir, 'cover.webp'))
  await sharp(cover).resize(630, 500, { fit: 'cover' }).webp({ quality: 82 }).toFile(path.join(dir, 'cover-sm.webp'))
  let n = 0
  for (const s of src.shots ?? []) {
    if (!fs.existsSync(s)) { console.warn(`  ! yok: ${s}`); continue }
    await sharp(s).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(dir, `shot-${++n}.webp`))
  }
  console.log(`✓ ${slug}: cover${n ? ` + ${n} görsel` : ''}`)
}
