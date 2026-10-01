import { useCallback, useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import InventorySearch from './components/InventorySearch.jsx'
import FeaturedInventory from './components/FeaturedInventory.jsx'
import SellConsign from './components/SellConsign.jsx'
import Classics from './components/Classics.jsx'
import ServiceFinance from './components/ServiceFinance.jsx'
import About from './components/About.jsx'
import Reviews from './components/Reviews.jsx'
import Instagram from './components/Instagram.jsx'
import Footer from './components/Footer.jsx'
import { useInventoryFilters } from './hooks/useInventoryFilters.js'
import { useHashRoute } from './hooks/useHashRoute.js'
import { usePageMotion } from './motion/usePageMotion.js'
import { initScroll, scrollToEl } from './motion/scroll.js'

/**
 * Required section order (CLIENT-BRIEF M1): header · hero · search · featured ·
 * sell/consign · classics (the one dark section) · service · finance · about ·
 * reviews · instagram · footer.
 */
export default function App() {
  const { filters, setFilter, clear, results, active } = useInventoryFilters()
  const route = useHashRoute()
  const countRef = useRef(null)
  const pageRef = useRef(null)
  const headerRef = useRef(null)
  useEffect(() => initScroll(), [])
  usePageMotion(pageRef)

  const onSearch = useCallback(() => {
    const target = document.getElementById('inventory')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollToEl(target, { immediate: reduce })
    countRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="page" ref={pageRef}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header ref={headerRef} />
      <main id="main">
        <Hero />
        <InventorySearch filters={filters} setFilter={setFilter} onSearch={onSearch} />
        <FeaturedInventory results={results} active={active} clear={clear} countRef={countRef} filters={filters} setFilter={setFilter} />
        <SellConsign />
        <Classics headerRef={headerRef} />
        {/* Service + Finance merged into one scroll-driven chapter (client, 2026-09-30).
            Service.jsx / Finance.jsx are kept: render <Service /> <Finance /> here instead to restore. */}
        <ServiceFinance />
        <About />
        <Reviews />
        <Instagram />
      </main>
      <Footer route={route} />
    </div>
  )
}
