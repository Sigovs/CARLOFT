import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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

export default defineConfig({
  plugins: [brandMeta(), react()],
})
