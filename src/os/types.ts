import type { ComponentChildren } from 'preact'

/** One app of HERA OS. The OS renders `render(arg)` inside a window and never looks inside. */
export type AppDef = {
  id: string
  icon: string | ((arg?: string) => string)   // icons.ts name or an image URL
  title: (arg?: string) => string
  size: { w: number; h: number }
  render: (arg?: string) => ComponentChildren
  desktop?: number                  // order on the desktop; omitted = not on the desktop
  start?: number                    // order in the Start menu; omitted = not listed
  hint?: () => string               // one line in the Start menu
  /** open: which window an icon opens (e.g. the "games" icon opens projects:games) */
  launch?: { app: string; arg?: string; maximized?: boolean }
}
