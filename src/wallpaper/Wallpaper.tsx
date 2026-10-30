// The desktop: HERA's pixel night world at a whole-number pixel scale (D5), with twinkling stars and
// falling petals drawn on a second canvas. Reduced motion: stars only twinkle (no movement); paused when hidden.
import { useEffect, useRef } from 'preact/hooks'
import { drawPanorama, drawStarfield } from './scene.js'

const PANO_W = 324, PANO_H = 135, TREE_X = 176

function rng(seed: number) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000)
}

export function Wallpaper() {
  const still = useRef<HTMLCanvasElement>(null)
  const live = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let raf = 0, last = 0, stopped = false
    let px = 4, lw = 0, lh = 0, offX = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    type Star = { x: number; y: number; ph: number; sp: number; c: string }
    type Petal = { x: number; y: number; vx: number; vy: number; c: string; big: boolean }
    let twinkles: Star[] = [], petals: Petal[] = []

    const build = () => {
      const vw = window.innerWidth, vh = window.innerHeight
      // big enough to cover the width, chunky enough on phones (crop around the blossom tree)
      px = Math.max(2, Math.ceil(vw / PANO_W), Math.floor(vh / 190))
      lw = Math.ceil(vw / px); lh = Math.ceil(vh / px)
      offX = Math.round(Math.min(0, Math.max(lw - PANO_W, lw / 2 - TREE_X)))
      const pano = document.createElement('canvas'); pano.width = PANO_W; pano.height = PANO_H
      drawPanorama(pano.getContext('2d')!)
      for (const c of [still.current!, live.current!]) {
        c.width = lw; c.height = lh
        c.style.width = lw * px + 'px'; c.style.height = lh * px + 'px'
      }
      const ctx = still.current!.getContext('2d')!
      drawStarfield(ctx, lw, lh, 5, false)
      ctx.drawImage(pano, offX, lh - PANO_H)
      const r = rng(11)
      const skyH = Math.max(20, lh - PANO_H + 70)
      twinkles = Array.from({ length: Math.round((lw * skyH) / 220) }, () => ({
        x: Math.floor(r() * lw), y: Math.floor(r() * skyH), ph: r() * 6.28, sp: 0.6 + r() * 1.6,
        c: r() < 0.25 ? '#7fe8dc' : r() < 0.5 ? '#ffffff' : '#c9c3ff'
      }))
      petals = Array.from({ length: Math.round(lw / 9) }, () => ({
        x: r() * lw, y: r() * lh, vx: -(2 + r() * 4), vy: 4 + r() * 6,
        c: ['#ffb3cc', '#ff9fbf', '#ffd6e2', '#e2648f'][Math.floor(r() * 4)], big: r() < 0.3
      }))
    }

    const frame = (now: number) => {
      if (stopped) return
      raf = requestAnimationFrame(frame)
      if (now - last < (reduce ? 200 : 50)) return // ~20 fps is plenty for pixels; twinkle-only at 5 fps
      const dt = Math.min(0.1, (now - last) / 1000); last = now
      const ctx = live.current!.getContext('2d')!
      ctx.clearRect(0, 0, lw, lh)
      const t = now / 1000
      for (const s of twinkles) {
        const a = Math.max(0, Math.sin(t * s.sp + s.ph))
        if (a < 0.55) continue
        ctx.globalAlpha = a; ctx.fillStyle = s.c; ctx.fillRect(s.x, s.y, 1, 1)
      }
      ctx.globalAlpha = 1
      if (reduce) return
      for (const p of petals) {
        p.x += p.vx * dt + Math.sin(t * 1.3 + p.y) * 0.05; p.y += p.vy * dt
        if (p.y > lh) { p.y = -2; p.x = Math.random() * lw + 20 }
        if (p.x < -2) p.x = lw + 1
        ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.big ? 2 : 1, 1)
      }
    }

    build()
    raf = requestAnimationFrame(frame)
    const onResize = () => build()
    const onVis = () => {
      if (document.hidden) { stopped = true; cancelAnimationFrame(raf) } else { stopped = false; raf = requestAnimationFrame(frame) }
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)
    return () => { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  return (
    <div class="wallpaper" aria-hidden="true">
      <canvas ref={still} />
      <canvas ref={live} />
    </div>
  )
}
