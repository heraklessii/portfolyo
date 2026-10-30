// Window manager state (D2). Apps never touch each other: they go through open/close/focus here.
// The URL hash mirrors the focused window ("#/cv", "#/project/petalfall") so any view can be linked.
import { signal, computed } from '@preact/signals'

export type WinState = {
  id: string            // unique: app id, or app id + ":" + arg ("project:petalfall")
  app: string
  arg?: string
  x: number; y: number; w: number; h: number
  z: number
  minimized: boolean
  maximized: boolean
}

export type AppSize = { w: number; h: number }

export const windows = signal<WinState[]>([])
let zTop = 10
let cascade = 0

export const focusedId = computed(() => {
  const open = windows.value.filter((w) => !w.minimized)
  return open.length ? open.reduce((a, b) => (a.z > b.z ? a : b)).id : null
})

export const isMobile = signal(window.matchMedia('(max-width: 720px)').matches)
window.matchMedia('(max-width: 720px)').addEventListener('change', (e) => (isMobile.value = e.matches))

const sizes: Record<string, AppSize> = {}
export const registerSize = (app: string, size: AppSize) => (sizes[app] = size)

function place(app: string): Pick<WinState, 'x' | 'y' | 'w' | 'h'> {
  const s = sizes[app] ?? { w: 720, h: 520 }
  const vw = window.innerWidth, vh = window.innerHeight - 52 // taskbar
  const w = Math.min(s.w, vw - 24), h = Math.min(s.h, vh - 24)
  const step = (cascade++ % 6) * 28
  return { w, h, x: Math.max(12, Math.round((vw - w) / 2) - 84 + step), y: Math.max(12, Math.round((vh - h) / 2) - 60 + step) }
}

export function open(app: string, arg?: string, opts: { maximized?: boolean } = {}) {
  const id = arg ? `${app}:${arg}` : app
  const existing = windows.value.find((w) => w.id === id)
  if (existing) { focus(id, true); return }
  const win: WinState = { id, app, arg, ...place(app), z: ++zTop, minimized: false, maximized: !!opts.maximized }
  windows.value = [...windows.value, win]
  syncHash()
}

export function close(id: string) {
  windows.value = windows.value.filter((w) => w.id !== id)
  syncHash()
}

export function focus(id: string, restore = false) {
  windows.value = windows.value.map((w) => (w.id === id ? { ...w, z: ++zTop, minimized: restore ? false : w.minimized } : w))
  syncHash()
}

export function minimize(id: string) {
  windows.value = windows.value.map((w) => (w.id === id ? { ...w, minimized: true } : w))
  syncHash()
}

export function toggleMax(id: string) {
  windows.value = windows.value.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
}

export function move(id: string, x: number, y: number) {
  windows.value = windows.value.map((w) => (w.id === id ? { ...w, x, y } : w))
}

export function resize(id: string, w: number, h: number) {
  windows.value = windows.value.map((v) => (v.id === id ? { ...v, w: Math.max(320, w), h: Math.max(220, h) } : v))
}

/** Taskbar button: focus a background window, minimize the focused one, restore a minimized one. */
export function taskbarToggle(id: string) {
  const w = windows.value.find((v) => v.id === id)
  if (!w) return
  if (w.minimized) focus(id, true)
  else if (focusedId.value === id) minimize(id)
  else focus(id)
}

// ---------- hash routing ----------

let applyingHash = false

function syncHash() {
  if (applyingHash) return
  const f = windows.value.find((w) => w.id === focusedId.value)
  const next = f ? `#/${f.app}${f.arg ? '/' + f.arg : ''}` : '#/'
  if (location.hash !== next) history.replaceState(null, '', next)
}

/** Opens the window named in the hash ("#/project/petalfall"). Unknown apps are ignored by the caller. */
export function applyHash(known: (app: string) => boolean) {
  const [, app, arg] = location.hash.replace(/^#/, '').split('/')
  if (!app || !known(app)) return false
  applyingHash = true
  open(app, arg ? decodeURIComponent(arg) : undefined, { maximized: isMobile.value })
  applyingHash = false
  syncHash()
  return true
}
