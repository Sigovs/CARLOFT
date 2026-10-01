import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/archivo/wdth.css'
import App from './App.jsx'
import './styles/index.css'
import './styles/motion.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
