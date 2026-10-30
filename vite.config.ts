import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// base './': works on a GitHub Pages project site (/portfolyo/) and on a custom domain alike (D3).
export default defineConfig({
  base: './',
  plugins: [preact()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
  server: { port: 5180 }
})
