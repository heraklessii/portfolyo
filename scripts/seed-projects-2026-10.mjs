#!/usr/bin/env node
// One-off (2026-10-31): adds the projects missing from the old portfolio and syncs prices/order with
// ~/.claude/yayin/katalog.md. Kept as a record of where these texts came from (catalog + GitHub repos).
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(import.meta.dirname, '../content/projects')
const write = (p) => fs.writeFileSync(path.join(dir, p.slug + '.json'), JSON.stringify(p, null, 2) + '\n')
const media = (slug, shots = 0) => ({ cover: `/media/${slug}/cover.webp`, thumb: `/media/${slug}/cover-sm.webp`, gallery: Array.from({ length: shots }, (_, i) => `/media/${slug}/shot-${i + 1}.webp`) })
const gh = (repo) => ({ type: 'source', label: { tr: 'Kaynak kod (GitHub)', en: 'Source code (GitHub)' }, url: `https://github.com/heraklessii/${repo}` })
const itch = (slug, tr, en) => ({ type: 'primary', label: { tr, en }, url: `https://heraklessi.itch.io/${slug}` })

write({
  slug: 'mirelas-cauldron', title: "Mirela's Cauldron", kind: 'game', order: 95, featured: true, color: '#b98cff',
  status: { tr: 'Ücretsiz · tarayıcıda oyna', en: 'Free · play in browser' }, year: '2026',
  tagline: { tr: 'Gizemli, rahatlatıcı bir iksir dükkânı: iksir demle, kasabalılara servis et, Mirela\'ya ne olduğunu çöz.', en: 'Brew potions, serve the townsfolk and uncover what happened to Mirela in this cozy pixel-art idle game.' },
  description: {
    tr: 'Yaşlı Orin sana kayıp simyacı Mirela\'nın atölyesinin anahtarını veriyor. Kazanı karıştır, malzemelerden iksir demle, müşterilerin sabrı tükenmeden servis et ve geride bıraktığı ipuçlarını takip et. Mobil için tasarlandı; web sürümü itch.io\'da reklamsız ve ücretsiz.',
    en: 'Old Orin hands you the keys to the workshop of Mirela, a vanished alchemist. Stir the cauldron, brew potions from ingredients, serve customers before they lose patience and follow the clues she left behind. Designed for phones; the web version on itch.io is free and ad-free.'
  },
  highlights: {
    tr: ['Altı gizli tarif, üç bölümlük hikâye', 'Üç kat serbestçe döşenen dükkân, bahçe, familiar\'lar', 'Gece/gündüz ve haftalık etkinlikler', 'Tarayıcıda kalıcı kayıt (IndexedDB), Türkçe ve İngilizce'],
    en: ['Six hidden recipes, a story in three chapters', 'Three freely decorated floors, a garden, familiars', 'Day/night and weekly events', 'Persistent saves in the browser (IndexedDB), English and Turkish']
  },
  tags: ['Unity 6', 'C#', 'WebGL', 'Idle', 'Pixel art'], platforms: ['Web', 'Android (yakında / soon)'],
  ...media('mirelas-cauldron', 2), links: [itch('mirelas-cauldron', 'Tarayıcıda oyna (itch.io)', 'Play in browser (itch.io)')]
})

write({
  slug: 'loomlight', title: 'Loomlight', kind: 'tool', order: 70, featured: true, color: '#ffb547',
  status: { tr: 'Ücretsiz · açık kaynak', en: 'Free · open source' }, year: '2026',
  tagline: { tr: 'Ücretsiz, açık kaynak piksel art editörü ve sprite animasyon aracı.', en: 'A free, open-source pixel art editor and sprite animator.' },
  description: {
    tr: 'Piksel piksel çiz, katmanlarla çalış, karelerle animasyon yap; PNG, sprite sheet ya da GIF olarak tam çizdiğin piksellerle dışa aktar. Çevrimdışı, hesap yok. Gölgeleme mürekkebi, dither, indeksli renk, döşeme modu ve .aseprite içe aktarma.',
    en: 'Draw pixel by pixel, work in layers, animate across frames and export PNG, sprite sheets or GIFs — exactly the pixels you drew. Offline, no account. Shading ink, dithering, indexed colour, tiled mode and .aseprite import.'
  },
  highlights: {
    tr: ['Katmanlar × kareler tek zaman çizelgesinde, onion skin', 'Seçim, dönüştürme, diğer uygulamalarla kopyala-yapıştır', 'İndeksli renk + canlı palet değişimi, .gpl/.hex/.pal/PNG palet', 'Özelleştirilebilir kısayollar, komut paleti, TR/EN'],
    en: ['Layers × frames in one timeline, onion skin', 'Selections, transforms, copy & paste with other apps', 'Indexed colour with live palette swaps, .gpl/.hex/.pal/PNG palettes', 'Custom shortcuts, command palette, EN/TR']
  },
  tags: ['Electron', 'React', 'TypeScript', 'GPL-3.0'], platforms: ['Windows'],
  ...media('loomlight', 5), links: [itch('loomlight', 'İndir (itch.io)', 'Download (itch.io)'), gh('Loomlight')]
})

const tools = [
  ['muivly', 'Muivly', 60, '#3fd6c6', 'Düşük sistemli bilgisayarlar için canlı duvar kağıdı motoru: GPU çözme, görünmezken sıfır iş.', 'A live wallpaper engine for low-end PCs: GPU decode, zero work when hidden.', ['Rust', 'Tauri', 'Direct3D 11', 'HLSL']],
  ['muiren', 'Muiren', 58, '#3fd6c6', 'Boştaki sekmeleri kaybetmeden uyutup RAM\'den tasarruf eden masaüstü tarayıcı.', 'A desktop browser that sleeps idle tabs to save RAM — without losing them.', ['Rust', 'Tauri', 'WebView2', 'React']],
  ['muiply', 'Muiply', 56, '#ff6f91', 'Kodek paketi istemeden MKV, HEVC, AV1, FLAC çalan yerel medya oynatıcı.', 'A local media player for MKV, HEVC, AV1 and FLAC without codec packs.', ['Rust', 'Tauri', 'libmpv', 'React']],
  ['muiget', 'Muiget', 54, '#7cc8ff', 'Segmentli indirme, devam ettirme ve Chrome eklentisiyle açık kaynak indirme yöneticisi.', 'An open-source download manager with segmented downloads, resume and a Chrome extension.', ['Rust', 'Tauri', 'Chrome extension']],
  ['muifly', 'Muifly', 52, '#ffcf6b', 'Windows için oyun performans aracı: her değişiklik tek tıkla geri alınabilir.', 'A game performance tool for Windows — every change undoable in one click.', ['Rust', 'Tauri', 'Windows']]
]
for (const [slug, title, order, color, tr, en, tags] of tools) {
  const repo = title
  write({
    slug, title, kind: 'tool', order, color,
    status: { tr: 'Ücretsiz · açık kaynak', en: 'Free · open source' }, year: '2026',
    tagline: { tr, en }, description: { tr, en }, tags, platforms: ['Windows'],
    ...media(slug, slug === 'muiget' ? 1 : 0),
    links: [gh(repo), ...(slug !== 'muiget' ? [{ type: 'secondary', label: { tr: 'Tanıtım sayfası', en: 'Project page' }, url: `https://heraklessii.github.io/${repo}/` }] : [])]
  })
}

write({
  slug: 'muiren-bot', title: 'Muiren Bot', kind: 'tool', order: 40, color: '#9b84ff',
  status: { tr: 'Açık kaynak', en: 'Open source' }, year: '2025',
  tagline: { tr: 'Modern, açık kaynak Discord müzik botu.', en: 'A modern, open-source Discord music bot.' },
  description: { tr: 'discord.js v14 ve discord-player ile yazılmış, sunucuna eklenebilen müzik botu.', en: 'A music bot for your server, built with discord.js v14 and discord-player.' },
  tags: ['Node.js', 'discord.js', 'Discord'], ...media('muiren-bot'), links: [gh('Muiren-bot')]
})

write({
  slug: 'ved-tr', title: 'Ved: Recure TR', kind: 'other', order: 30, color: '#b98cff',
  status: { tr: 'Gayriresmî Türkçe yama', en: 'Unofficial Turkish patch' }, year: '2026',
  tagline: { tr: 'Ved: Recure için gayriresmî Türkçe çeviri yaması.', en: 'An unofficial Turkish translation patch for Ved: Recure.' },
  description: { tr: 'Oyunun metinlerini Türkçeye çeviren, Unity tabanlı oyuna uygulanan hayran yaması.', en: 'A fan patch that translates the game into Turkish, applied to the Unity-based game.' },
  tags: ['Unity', 'Çeviri / Localization'], ...media('ved-tr'), links: [gh('ved-recure-turkce-yama')]
})

// existing projects: order + catalog prices (katalog.md, 2026-10-31)
const patch = (slug, fn) => { const f = path.join(dir, slug + '.json'); const p = JSON.parse(fs.readFileSync(f, 'utf8')); fn(p); write(p) }
patch('petalfall', (p) => { p.order = 100 })
patch('muitown', (p) => { p.order = 90; p.status = { tr: 'Erken erişim · 4,99 $ · ücretsiz demo', en: 'Early access · $4.99 · free demo' } })
patch('fogwardens', (p) => { p.order = 80; p.featured = false; p.status = { tr: "RTS'e dönüşüyor · demo", en: 'Becoming an RTS · demo' } })
patch('muitoon', (p) => { p.order = 75 })
patch('muita', (p) => { p.order = 68; p.status = { tr: 'Satışta · 9,99 $', en: 'On sale · $9.99' } })
console.log('ok')
