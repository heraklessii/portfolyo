// 16×16 pixel icons drawn in code (no image files): rows of palette letters → cached PNG data URLs.
const PAL: Record<string, string> = {
  k: '#0c0a16', w: '#e6e1ff', W: '#ffffff', t: '#3fd6c6', T: '#2aa99c', v: '#9b84ff', V: '#6b55d6',
  p: '#ffb3cc', P: '#e2648f', a: '#ffcf6b', A: '#d99a3a', d: '#2e2358', g: '#7dff9a', r: '#ff6f91', R: '#c8405c'
}

const ART: Record<string, string[]> = {
  about: [
    '................', '......kkkk......', '.....kppppk.....', '....kppppppk....', '....kpkppkpk....', '....kppppppk....',
    '....kppkkppk....', '.....kppppk.....', '......kkkk......', '....kkttttkk....', '...kttttttttk...', '..kttttwwttttk..',
    '..kttttwwttttk..', '..kkkkkkkkkkkk..', '................', '................'
  ],
  games: [
    '................', '................', '................', '..kkkkkkkkkkkk..', '.kppppppppppppk.', 'kppkpppppppppvpk',
    'kpkkkpppppppvpvk', 'kppkpppppppppvpk', 'kppppppkkppppppk', 'kpppppkPPkpppppk', 'kppppkPkkPkppppk', '.kkkkk....kkkkk.',
    '................', '................', '................', '................'
  ],
  tools: [
    '................', '..........kkk...', '.........kttk...', '........kttk....', '...kk...ktk.....', '..ktk..kttk.....',
    '..kttkkttk......', '...kttttk.......', '....kttk........', '...kttk.........', '..kTTk..........', '.kTTk...........',
    '.kTk............', '..k.............', '................', '................'
  ],
  web: [
    '................', '.....kkkkkk.....', '...kkvvvvvvkk...', '..kvvvvkkvvvvk..', '..kvvvkvvkvvvk..', '.kvvvkvvvvkvvvk.',
    '.kkkkkkkkkkkkkk.', '.kvvvkvvvvkvvvk.', '.kvvvkvvvvkvvvk.', '.kkkkkkkkkkkkkk.', '..kvvvkvvkvvvk..', '..kvvvvkkvvvvk..',
    '...kkvvvvvvkk...', '.....kkkkkk.....', '................', '................'
  ],
  videos: [
    '................', '................', '..kkkkkkkkkkkk..', '.krrrrrrrrrrrrk.', '.krrrrWrrrrrrrk.', '.krrrrWWrrrrrrk.',
    '.krrrrWWWrrrrrk.', '.krrrrWWWWrrrrk.', '.krrrrWWWrrrrrk.', '.krrrrWWrrrrrrk.', '.krrrrWrrrrrrrk.', '.kRRRRRRRRRRRRk.',
    '..kkkkkkkkkkkk..', '................', '................', '................'
  ],
  cv: [
    '................', '..kkkkkkkkk.....', '..kwwwwwwwkk....', '..kwwwwwwwkwk...', '..kwttwwwwkkkk..', '..kwttwwwwwwwk..',
    '..kwwwwwwwwwwk..', '..kwkkkkkkkkwk..', '..kwwwwwwwwwwk..', '..kwkkkkkkkwwk..', '..kwwwwwwwwwwk..', '..kwvvvvvvvvwk..',
    '..kwwwwwwwwwwk..', '..kwkkkkkwwwwk..', '..kkkkkkkkkkkk..', '................'
  ],
  terminal: [
    '................', '.kkkkkkkkkkkkkk.', '.kvvvvvvvvvrargk', '.kkkkkkkkkkkkkk.', '.kddddddddddddk.', '.kdtddddddddddk.',
    '.kddtdddddddddk.', '.kdddtddddddddk.', '.kddtdddddddddk.', '.kdtddddttttddk.', '.kddddddddddddk.', '.kddddddddddddk.',
    '.kkkkkkkkkkkkkk.', '................', '................', '................'
  ],
  contact: [
    '................', '................', '................', '.kkkkkkkkkkkkkk.', '.kwkwwwwwwwwkwk.', '.kwwkwwwwwwkwwk.',
    '.kwwwkwwwwkwwwk.', '.kwwwwkwwkwwwwk.', '.kwwwwwkkwwwwwk.', '.kwwwwwwwwwwwwk.', '.kwwwwwwwwwwwwk.', '.kkkkkkkkkkkkkk.',
    '................', '................', '................', '................'
  ],
  trash: [
    '................', '......kkkk......', '..kkkkkkkkkkkk..', '..kwwwwwwwwwwk..', '..kkkkkkkkkkkk..', '...kvvkvvkvvk...',
    '...kvvkvvkvvk...', '...kvvkvvkvvk...', '...kvvkvvkvvk...', '...kvvkvvkvvk...', '...kvvkvvkvvk...', '...kVVkVVkVVk...',
    '....kkkkkkkk....', '................', '................', '................'
  ],
  quick: [
    '................', '....kkkkk.......', '...kwwwwwk......', '..kwttwwwwk.....', '..kwtwwwwwk.....', '..kwwwwwwwk.....',
    '..kwwwwwwwk.....', '...kwwwwwk......', '....kkkkkka.....', '........kaak....', '.........kaak...', '..........kaak..',
    '...........kaak.', '............kk..', '................', '................'
  ],
  hera: [
    '................', '................', '.kk..kk.kkkk.kk.', '.kk..kk.kk...kk.', '.kkkkkk.kkk..kk.', '.kk..kk.kk...kk.',
    '.kk..kk.kkkk.kkk', '................', '..tttttvvvvvppp.', '................', '................', '................',
    '................', '................', '................', '................'
  ],
  folder: [
    '................', '..kkkkk.........', '.kaaaaak........', '.kaaaaaakkkkkkk.', '.kaaaaaaaaaaaaak', '.kkkkkkkkkkkkkkk',
    '.kAAAAAAAAAAAAAk', '.kAAAAAAAAAAAAAk', '.kAAAAAAAAAAAAAk', '.kAAAAAAAAAAAAAk', '.kAAAAAAAAAAAAAk', '.kAAAAAAAAAAAAAk',
    '.kAAAAAAAAAAAAAk', '.kkkkkkkkkkkkkkk', '................', '................'
  ]
}

const cache = new Map<string, string>()

/** An app's icon as an image URL: pixel icon by name, or an image path/URL as is. */
export function iconFor(spec: string | ((arg?: string) => string), arg?: string): string {
  const s = typeof spec === 'function' ? spec(arg) : spec
  return /[/:]/.test(s) ? s : icon(s)
}

export function icon(name: keyof typeof ART | string): string {
  const hit = cache.get(name)
  if (hit) return hit
  const rows = ART[name] ?? ART.cv
  const c = document.createElement('canvas'); c.width = 16; c.height = 16
  const g = c.getContext('2d')!
  rows.forEach((row, y) => [...row.padEnd(16, '.').slice(0, 16)].forEach((ch, x) => {
    if (ch === '.') return
    g.fillStyle = PAL[ch] ?? '#ff00ff'; g.fillRect(x, y, 1, 1)
  }))
  const url = c.toDataURL()
  cache.set(name, url)
  return url
}
