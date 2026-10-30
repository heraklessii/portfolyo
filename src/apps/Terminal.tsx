// A small shell over the same content: `help`, `ls games`, `open petalfall`, `cv`, `neofetch`…
import { useEffect, useRef, useState } from 'preact/hooks'
import { projectBySlug, projects, site, type ProjectKind } from '../lib/content'
import { L, lang, setLang } from '../lib/i18n'
import { openApp } from './ui'

type Line = { kind: 'in' | 'out' | 'err'; text: string }
const KINDS: Record<string, ProjectKind> = { games: 'game', tools: 'tool', web: 'web' }
const APPS = ['about', 'cv', 'videos', 'contact', 'quick', 'trash']

const tr = () => lang.value === 'tr'

function run(cmd: string): Line[] | 'clear' {
  const [name, ...rest] = cmd.trim().split(/\s+/)
  const arg = rest.join(' ').toLowerCase()
  const out = (text: string): Line[] => [{ kind: 'out', text }]
  switch ((name || '').toLowerCase()) {
    case '': return []
    case 'help': return out(tr()
      ? 'komutlar: whoami · ls [games|tools|web] · open <proje|uygulama> · cv · contact · socials · neofetch · lang tr|en · date · clear'
      : 'commands: whoami · ls [games|tools|web] · open <project|app> · cv · contact · socials · neofetch · lang tr|en · date · clear')
    case 'whoami': return out(`${site.name} (${site.handle}) — ${L(site.role)}`)
    case 'ls': {
      const kind = KINDS[arg]
      const list = kind ? projects.filter((p) => p.kind === kind) : projects
      return out(list.map((p) => `${p.slug.padEnd(18)} ${p.kind.padEnd(5)} ${L(p.status)}`).join('\n'))
    }
    case 'open': case 'cd': {
      if (projectBySlug(arg)) { openApp('project', arg); return out(`→ ${projectBySlug(arg)!.title}`) }
      if (APPS.includes(arg)) { openApp(arg, undefined, arg === 'cv' || arg === 'quick'); return out(`→ ${arg}`) }
      if (KINDS[arg]) { openApp('projects', arg); return out(`→ ${arg}`) }
      return [{ kind: 'err', text: tr() ? `bulunamadı: ${arg} (ls ile listele)` : `not found: ${arg} (try ls)` }]
    }
    case 'cv': openApp('cv', undefined, true); return out('→ cv')
    case 'contact': openApp('contact'); return out('→ contact')
    case 'socials': return out(site.socials.map((s) => `${s.label.padEnd(20)} ${s.url}`).join('\n'))
    case 'lang': if (arg === 'tr' || arg === 'en') { setLang(arg); return out(`lang = ${arg}`) } return out('lang tr | lang en')
    case 'date': return out(new Date().toString())
    case 'clear': return 'clear'
    case 'neofetch': return out([
      '  ██  ██  ███  ██   ██     ' + `${site.handle}@hera-os`,
      '  ██████  ██   █████ ███   ' + 'OS:      HERA OS 2.0',
      '  ██  ██  ███  ██ █ █ █    ' + `Shell:   hera-sh`,
      '                           ' + `Games:   ${projects.filter((p) => p.kind === 'game').length}`,
      '  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀   ' + `Tools:   ${projects.filter((p) => p.kind === 'tool').length}`,
      '                           ' + `Uptime:  cozy`
    ].join('\n'))
    case 'sudo': return out(tr() ? 'İzin verildi. CV açılıyor… (iletişim penceresi de yanında)' : 'Permission granted. Opening the CV… (and the contact window)')
    case 'rm': return [{ kind: 'err', text: tr() ? 'hayır.' : 'no.' }]
    case 'echo': return out(rest.join(' '))
    default: return [{ kind: 'err', text: tr() ? `komut yok: ${name} — help yaz` : `command not found: ${name} — type help` }]
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: tr() ? 'HERA OS hera-sh — "help" yaz.' : 'HERA OS hera-sh — type "help".' }])
  const [value, setValue] = useState('')
  const hist = useRef<string[]>([]), hi = useRef(0)
  const input = useRef<HTMLInputElement>(null), end = useRef<HTMLDivElement>(null)

  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [lines])

  const submit = (e: Event) => {
    e.preventDefault()
    const cmd = value
    if (cmd.trim()) { hist.current.push(cmd); hi.current = hist.current.length }
    const res = run(cmd)
    if (cmd.trim().toLowerCase().startsWith('sudo')) { openApp('cv', undefined, true); openApp('contact') }
    setLines(res === 'clear' ? [] : [...lines, { kind: 'in', text: cmd }, ...res])
    setValue('')
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' && hi.current > 0) { hi.current--; setValue(hist.current[hi.current]) }
    if (e.key === 'ArrowDown') { hi.current = Math.min(hist.current.length, hi.current + 1); setValue(hist.current[hi.current] ?? '') }
  }

  return (
    <div class="app term" onClick={() => input.current?.focus()}>
      {lines.map((l, i) => <pre key={i} class={l.kind}>{l.kind === 'in' ? `${site.handle}@hera-os:~$ ${l.text}` : l.text}</pre>)}
      <form onSubmit={submit} class="term-in">
        <label>{site.handle}@hera-os:~$</label>
        <input ref={input} value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} onKeyDown={onKey}
          autoFocus spellcheck={false} autocomplete="off" aria-label="terminal" />
      </form>
      <div ref={end} />
    </div>
  )
}
