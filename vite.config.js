import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { brand } from './src/data/brand.js'

/**
 * brand-meta — the document title and meta description come from
 * src/data/brand.js like every other brand string (audit P2 #6), so renaming
 * the business is a one-file change. index.html carries %BRAND_*% slots.
 */
const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function brandMeta() {
  const title = `${brand.wordmark} — ${brand.meta.title}`
  const slots = {
    '%BRAND_TITLE%': escapeHtml(title),
    '%BRAND_DESCRIPTION%': escapeHtml(brand.meta.description),
  }
  return {
    name: 'brand-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => Object.entries(slots).reduce((out, [k, v]) => out.replaceAll(k, v), html),
    },
  }
}

// `vite build --mode pages` → GitHub Pages project site (https://sigovs.github.io/CARLOFT/).
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/CARLOFT/' : '/',
  plugins: [brandMeta(), react()],
  // Two pages: index.html (V1) and index_v2.html (V2 — client feedback 2026-10-29).
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        v2: resolve(import.meta.dirname, 'index_v2.html'),
      },
    },
  },
}))
