// Electron main for `npm run shots`: serves dist/ and captures views in an offscreen (invisible) page —
// no window appears and focus never changes (CLAUDE.md: no on-screen checks while the user works).
const { app, BrowserWindow } = require('electron')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const [dist, out, viewsJson] = process.argv.slice(-3)
const views = JSON.parse(viewsJson)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.jpg': 'image/jpeg' }

app.on('window-all-closed', () => {})
process.on('uncaughtException', (e) => { console.error(e); app.exit(1) })

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '')
  let file = path.join(dist, rel)
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
  if (!file.startsWith(path.resolve(dist)) || !fs.existsSync(file)) { res.writeHead(404); return res.end() }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})

app.whenReady().then(() => server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port
  fs.mkdirSync(out, { recursive: true })
  for (const v of views) {
    const win = new BrowserWindow({ show: false, width: v.w, height: v.h, webPreferences: { offscreen: true } })
    win.webContents.setFrameRate(20)
    const errors = []
    // default: motion allowed (this PC has Windows animations off); a view can ask for { reduced: true }
    await win.loadURL('about:blank')   // the debugger needs a live page before it accepts commands
    win.webContents.debugger.attach('1.3')
    await win.webContents.debugger.sendCommand('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: v.reduced ? 'reduce' : 'no-preference' }] })
    win.webContents.on('console-message', (e) => { if (e.level === 'error' || e.level === 3) errors.push(e.message) })
    await win.loadURL(`http://127.0.0.1:${port}/${v.path || ''}`)
    if (v.js) await win.webContents.executeJavaScript(v.js)
    await new Promise((r) => setTimeout(r, v.wait ?? 1200))
    const img = await win.webContents.capturePage()
    fs.writeFileSync(path.join(out, v.name + '.png'), img.toPNG())
    console.log(`wrote ${v.name}.png${errors.length ? '  ⚠ console: ' + errors.join(' | ').slice(0, 200) : ''}`)
    win.destroy()
  }
  server.close(); app.exit(0)
}))
