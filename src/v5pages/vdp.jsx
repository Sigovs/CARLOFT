import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/archivo/wdth.css'
import Vdp from '../components/v5/Vdp.jsx'
import '../styles/index.css'
import '../styles/motion.css'

/* V5 inner page — vehicle_v5.html (VDP). Same styles as the home page; src/styles/stock.css is in index.css. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Vdp />
  </StrictMode>,
)
