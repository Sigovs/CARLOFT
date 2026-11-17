import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/archivo/wdth.css'
import Srp from '../components/v6/Srp.jsx'
import '../styles/index.css'
import '../styles/motion.css'

/* V6 inner page — inventory_v6.html (SRP, the V6 filters). Same styles as the home page; src/styles/stock.css is in index.css. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Srp />
  </StrictMode>,
)
