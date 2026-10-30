// @ts-nocheck — straight copy of HeraSosyal/brand/scene.js (the HERA night world, D5). Keep in sync with
// the brand source: same seeds draw the same world as the Instagram panorama and the game intro.
// HERA night world, drawn pixel by pixel. One panorama of 324×135 px (×10 =
// 3240×1350, the three pinned posts side by side): left a Fogwardens watchtower
// in the fog, middle a Petalfall blossom tree with a tiny samurai, right a lit
// Muitown street ending in Mirela's crooked potion shop.
// Same seed → same picture, so the three tiles always line up.

const C = {
  ink: '#0c0a16', night: '#141029', dusk: '#1f1840', violet: '#2e2358',
  ridge: '#3b2d6e', ridgeLit: '#5a46a0', hillFar: '#17213a',
  fog: '#1f4a55', fogLight: '#2f7a80', teal: '#3fd6c6',
  ground: '#0a0812', shape: '#08070f',
  star: '#ffffff', starDim: '#8a86b8', starTeal: '#7fe8dc',
  moon: '#e9e3ff', moonShade: '#b7a8f0',
  window: '#ffcf6b', windowDim: '#c8873a', lamp: '#fff1b8',
  bark: '#1a1226', blossom: '#e2648f', blossomLight: '#ff9fbf', blossomDark: '#9c3a66', petal: '#ffb3cc',
  potion: '#7dff9a', potionDark: '#2f9e5a', smoke: '#5a46a0'
}

function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000)
}

// 2×2 ordered dither: 25 / 50 / 75 % coverage
const DITHER = { 25: [[1, 0], [0, 0]], 50: [[1, 0], [0, 1]], 75: [[1, 1], [0, 1]] }
const allows = (d, x, y) => DITHER[d][y & 1][x & 1] === 1

function painter(ctx) {
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), 1, 1) }
  const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) }
  const dith = (x, y, d, c) => allows(d, Math.round(x), Math.round(y)) && px(x, y, c)
  const ellipse = (cx, cy, rx, ry, c, d) => {
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++)
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) d ? dith(cx + x, cy + y, d, c) : px(cx + x, cy + y, c)
  }
  return { px, rect, dith, ellipse }
}

function sky(p, w, h, horizon) {
  p.rect(0, 0, w, h, C.ink)
  const bands = [[0.35, C.night], [0.62, C.dusk], [0.84, C.violet]]
  for (const [f, c] of bands) {
    const from = Math.round(horizon * f)
    p.rect(0, from, w, h - from, c)
    for (let x = 0; x < w; x++) { p.dith(x, from - 2, 25, c); p.dith(x, from - 1, 50, c) }
  }
}

function stars(p, w, maxY, count, seed, avoid) {
  const r = rng(seed)
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * w), y = Math.floor(r() * maxY), k = r()
    if (avoid && avoid(x, y)) continue
    if (k < 0.08) { // a small cross star
      p.px(x, y, C.star); p.px(x - 1, y, C.starDim); p.px(x + 1, y, C.starDim); p.px(x, y - 1, C.starDim); p.px(x, y + 1, C.starDim)
    } else p.px(x, y, k < 0.3 ? C.star : k < 0.42 ? C.starTeal : C.starDim)
  }
}

function moon(p, cx, cy, r) {
  p.ellipse(cx, cy, r + 3, r + 3, C.violet, 25)
  p.ellipse(cx, cy, r, r, C.moon)
  p.ellipse(cx + 3, cy - 2, r - 1, r - 1, C.ink) // crescent bite
  p.px(cx - r + 2, cy + 2, C.moonShade); p.px(cx - r + 3, cy - 3, C.moonShade)
}

function hills(p, w, base) {
  for (let x = 0; x < w; x++) {
    const far = base - 12 + Math.round(Math.sin(x / 23) * 4 + Math.sin(x / 9 + 1) * 1.5)
    for (let y = far; y < base; y++) p.px(x, y, C.hillFar)
    const near = base - 5 + Math.round(Math.sin(x / 14 + 2) * 2.5)
    for (let y = near; y < base; y++) p.px(x, y, C.ridge)
    p.px(x, near, C.ridgeLit)
  }
}

function ground(p, w, h, top) {
  p.rect(0, top, w, h - top, C.ground)
  for (let x = 0; x < w; x++) { p.dith(x, top - 1, 50, C.ground); if ((x * 7) % 11 === 0) p.px(x, top - 2, C.shape) }
}

function fog(p, x0, x1, y0, y1) {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const edge = Math.min(x - x0, x1 - x) // thins out at both ends
    const t = (y - y0) / (y1 - y0)
    const d = edge < 6 ? 25 : t < 0.35 ? 25 : t < 0.7 ? 50 : 75
    p.dith(x, y, d, (x + y) % 9 === 0 ? C.fogLight : C.fog)
  }
}

function watchtower(p, x, base) {
  p.rect(x - 5, base - 24, 10, 24, C.shape)       // stone body
  p.rect(x - 6, base - 3, 12, 3, C.shape)
  p.rect(x - 7, base - 27, 14, 3, C.shape)        // platform
  p.rect(x - 4, base - 33, 8, 6, C.shape)         // lamp room
  p.rect(x - 5, base - 35, 10, 2, C.shape)        // roof
  p.rect(x - 1, base - 38, 2, 3, C.shape)
  p.rect(x - 2, base - 32, 4, 4, C.teal)          // the lamp
  p.rect(x - 1, base - 31, 2, 2, '#b8fff5')
  for (let i = 1; i < 26; i++) {                  // beams into the fog
    for (let k = -Math.floor(i / 5); k <= Math.floor(i / 5); k++) {
      p.dith(x + 3 + i, base - 30 + k + Math.floor(i / 4), i < 12 ? 50 : 25, C.teal)
      p.dith(x - 3 - i, base - 30 + k + Math.floor(i / 4), i < 12 ? 50 : 25, C.teal)
    }
  }
  p.px(x - 2, base - 18, C.windowDim); p.px(x + 1, base - 11, C.windowDim)
}

function hexIsland(p, x, base) {
  for (let i = 0; i < 3; i++) {
    const cx = x + i * 9
    p.rect(cx - 4, base - 3, 8, 3, '#2a2f22'); p.rect(cx - 3, base - 4, 6, 1, '#3d5a2a')
  }
}

function blossomTree(p, x, base, seed) {
  const r = rng(seed)
  p.rect(x - 2, base - 19, 4, 19, C.bark)
  p.rect(x - 3, base - 3, 6, 3, C.bark)
  for (let i = 0; i < 7; i++) { p.px(x - 2 - i, base - 16 - Math.floor(i / 2), C.bark); p.px(x + 2 + i, base - 17 - Math.floor(i / 2), C.bark) }
  const blobs = [[0, -27, 18, 8], [-12, -22, 11, 6], [12, -23, 12, 6], [-5, -32, 10, 5], [7, -31, 9, 5]]
  for (const [dx, dy, rx, ry] of blobs) p.ellipse(x + dx, base + dy, rx, ry, C.blossomDark)
  for (const [dx, dy, rx, ry] of blobs) p.ellipse(x + dx, base + dy - 1, rx - 2, ry - 2, C.blossom)
  for (let i = 0; i < 70; i++) { // highlights
    const a = r() * Math.PI * 2, d = r()
    p.px(x + Math.cos(a) * 16 * d, base - 29 + Math.sin(a) * 6 * d - 2, C.blossomLight)
  }
}

function samurai(p, x, base) {
  p.rect(x - 1, base - 6, 3, 6, C.shape)          // body + legs
  p.rect(x - 2, base - 8, 5, 2, C.shape)          // shoulders
  p.rect(x - 3, base - 10, 7, 1, C.shape)         // straw hat brim
  p.rect(x - 1, base - 11, 3, 1, C.shape)
  for (let i = 0; i < 6; i++) p.px(x + 2 + i, base - 7 + Math.floor(i / 2), '#cfd3ff') // blade glint
}

function petals(p, x0, x1, y0, y1, n, seed) {
  const r = rng(seed)
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0)
    p.px(x, y, r() < 0.5 ? C.petal : C.blossomLight)
    if (r() < 0.4) p.px(x + 1, y, C.blossomDark)
  }
}

function house(p, x, base, w, h, roof, r) {
  p.rect(x, base - h, w, h, C.shape)
  for (let i = 0; i < roof; i++) p.rect(x - 1 + i, base - h - i - 1, w + 2 - 2 * i, 1, C.shape)
  for (let wy = base - h + 3; wy < base - 3; wy += 4)
    for (let wx = x + 2; wx < x + w - 2; wx += 3) {
      const k = r()
      if (k < 0.55) { p.px(wx, wy, C.window); if (k < 0.2) p.px(wx, wy + 1, C.windowDim) }
    }
}

function streetLamp(p, x, base) {
  p.rect(x, base - 9, 1, 9, C.shape)
  p.rect(x - 1, base - 10, 3, 1, C.shape)
  p.px(x, base - 9, C.lamp)
  p.ellipse(x, base - 8, 4, 3, C.window, 25)
}

function potionShop(p, x, base) {
  // crooked witch house: leaning walls, tall pointed roof, glowing round window
  for (let y = 0; y < 20; y++) p.rect(x + Math.floor(y / 9), base - y - 1, 18, 1, C.shape)
  for (let i = 0; i < 11; i++) p.rect(x + 2 + Math.floor(i / 2) + Math.floor(20 / 9), base - 21 - i, 18 - 2 * Math.floor(i / 1.4) > 1 ? 18 - 2 * Math.floor(i / 1.4) : 1, 1, C.shape)
  p.rect(x + 14, base - 31, 3, 7, C.shape)       // chimney
  for (let i = 0; i < 7; i++) p.dith(x + 15 + Math.round(Math.sin(i / 2) * 2), base - 33 - i * 2, i < 4 ? 50 : 25, C.smoke)
  p.ellipse(x + 9, base - 12, 4, 4, C.potionDark)
  p.ellipse(x + 9, base - 12, 3, 3, C.potion)
  p.px(x + 8, base - 13, '#e9ffe9')
  p.ellipse(x + 9, base - 12, 7, 6, C.potion, 25)  // glow
  p.rect(x + 4, base - 7, 4, 7, '#2b1c12')        // door
  p.px(x + 7, base - 4, C.window)
  // cauldron out front
  p.ellipse(x - 4, base - 2, 3, 2, C.shape)
  p.px(x - 5, base - 5, C.potion); p.px(x - 3, base - 6, C.potion); p.px(x - 4, base - 8, C.potionDark)
}

// Draws the full panorama into a 324×135 context.
export function drawPanorama(ctx) {
  const W = 324, H = 135, horizon = 122
  const p = painter(ctx)
  sky(p, W, H, horizon)
  // keep the text zones (y 22..78 in each tile's middle) a bit quieter
  const quiet = (x, y) => y > 16 && y < 74 && (x % 108) > 14 && (x % 108) < 94 && (x * 13 + y * 7) % 3 !== 0
  stars(p, W, 106, 560, 7, quiet)
  moon(p, 92, 16, 6)
  hills(p, W, horizon)
  fog(p, 0, 118, 108, 126)
  watchtower(p, 38, horizon + 2)
  blossomTree(p, 176, horizon + 2, 11)
  samurai(p, 150, horizon + 2)
  petals(p, 138, 250, 84, 124, 40, 5)
  const r = rng(3)
  const street = [[222, 9, 11, 3], [232, 7, 16, 2], [240, 10, 9, 3], [252, 8, 19, 2], [262, 11, 13, 3], [275, 8, 11, 2]]
  for (const [x, w, h, roof] of street) house(p, x, horizon + 1, w, h, roof, r)
  streetLamp(p, 230, horizon + 1); streetLamp(p, 271, horizon + 1)
  potionShop(p, 294, horizon + 1)
  ground(p, W, H, horizon + 2)
  petals(p, 100, 300, horizon + 4, H - 4, 26, 9) // petals resting on the ground
}

// Quiet star field for content slides (logical size, ×10 on screen).
export function drawStarfield(ctx, w, h, seed = 21, band = true) {
  const p = painter(ctx)
  p.rect(0, 0, w, h, C.ink)
  const from = band ? Math.round(h * 0.72) : h
  p.rect(0, from, w, h - from, C.night)
  if (band) for (let x = 0; x < w; x++) { p.dith(x, from - 2, 25, C.night); p.dith(x, from - 1, 50, C.night) }
  stars(p, w, h, Math.round(w * h * 0.0045), seed)
}
