import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import AppV3 from './AppV3.jsx'
import './v3.css'

/**
 * index_v3.html — V3 (Kirsten, 2026-10-29: the client still says V2 "doesn't
 * follow the Clutch design" — follow clutchmotorsco.com's site LAYOUT).
 * A separate app tree on purpose: V3's structure differs from V1/V2, so it is
 * built, not overridden. It reuses the data (brand, inventory, reviews) and the
 * V2 photography; V1 (index.html) and V2 (index_v2.html) are untouched.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppV3 />
  </StrictMode>,
)
