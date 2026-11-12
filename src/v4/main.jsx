import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/newsreader/opsz.css'
import AppV4 from './AppV4.jsx'
import './v4.css'

/**
 * index_v4.html — V4 (Alex, 2026-11-12: "make V4 from V3"). A copy of the V3
 * app tree (src/v3/) to iterate on; V3 (index_v3.html) stays frozen. Reuses the
 * shared data (brand, inventory, reviews) and photography like V3 does.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppV4 />
  </StrictMode>,
)
