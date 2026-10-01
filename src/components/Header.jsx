import { useEffect, useRef, useState } from 'react'
import { brand, navLinks } from '../data/brand.js'
import Icon from './Icon.jsx'
import { lockScroll, unlockScroll } from '../motion/scroll.js'

/**
 * Header — sticky, fixed height (--header-h), skin-only states.
 *
 * MOTION CONTRACT
 *   header.header[data-header="top" | "scrolled" | "dark"]   (MOTION.md §3, §4.3)
 *     top      — white, no border (over nothing: the header sits ABOVE the hero)
 *     scrolled — white + 1px --c-line bottom border
 *     dark     — --c-graphite, --c-on-dark text, rgba(255,255,255,.12) border
 *   Height never changes in any state. Styles live in styles/header.css.
 *
 *   `top` <-> `scrolled` is set here by one IntersectionObserver on #top (the
 *   hero): it writes the attribute directly on the DOM node (no React state,
 *   so a motion write is never overwritten by a re-render) and never
 *   touches the attribute while it is "dark". The motion layer owns "dark"
 *   (Classics hook) and may replace this observer entirely: delete the
 *   useEffect marked HEADER-STATE below and toggle `data-header` itself.
 *
 *   headerRef is exposed through the `ref` prop for MotionContext.
 */
/** Distance (px) above the header's bottom edge at which it turns solid on exit. */
const HEADER_LEAD = 120

export default function Header({ ref }) {
  const headerRef = useRef(null)
  const menuButtonRef = useRef(null)
  const sheetRef = useRef(null)
  const [open, setOpen] = useState(false)

  const setRefs = (node) => {
    headerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  // HEADER-STATE: top <-> scrolled. The header turns solid while the hero's
  // bottom is still HEADER_LEAD px below it, so the hero's white controls plate
  // (bottom-left of the frame) never slides under a transparent header over the
  // wordmark on the way out, or back in (critic #3 P2).
  useEffect(() => {
    const header = headerRef.current
    const hero = document.getElementById('top')
    if (!header || !hero || !('IntersectionObserver' in window)) return
    const h = header.offsetHeight
    const io = new IntersectionObserver(
      ([entry]) => {
        if (header.dataset.header === 'dark') return
        header.dataset.header = entry.isIntersecting ? 'top' : 'scrolled'
      },
      { rootMargin: `-${h + HEADER_LEAD}px 0px 0px 0px`, threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  // WORDMARK TAB: compact once the page is scrolled at all (the tab's hanging
  // part retracts). A plain passive scroll listener — Lenis scrolls the window.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    let compact = null
    const update = () => {
      const next = window.scrollY > 8
      if (next === compact) return
      compact = next
      if (next) header.setAttribute('data-compact', '')
      else header.removeAttribute('data-compact')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Mobile sheet: Escape closes, focus moves in and returns, page scroll locked.
  useEffect(() => {
    if (!open) return
    const sheet = sheetRef.current
    const button = menuButtonRef.current
    document.body.classList.add('is-locked')
    lockScroll()
    sheet?.querySelector('a')?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button?.focus()
        return
      }
      if (e.key !== 'Tab' || !sheet) return
      // Keep Tab inside the sheet + its toggle while open.
      const focusables = [button, ...sheet.querySelectorAll('a')]
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    // Crossing into the desktop layout hides both the sheet and its toggle;
    // close the menu and hand focus to the first desktop nav link so it
    // never drops to <body> (QA P3-4).
    const onResize = () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) return
      const active = document.activeElement
      // The media query can hide the sheet (and blur its link) before this
      // event fires, so focus on <body> counts too: while the menu is open,
      // focus is trapped inside it, and body can only mean "was in the menu".
      const hadFocus =
        !active || active === document.body || active === button || Boolean(sheet?.contains(active))
      setOpen(false)
      if (hadFocus) headerRef.current?.querySelector('.header__link')?.focus()
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.classList.remove('is-locked')
      unlockScroll()
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className="header" data-header="top" ref={setRefs}>
      <div className="header__bar container">
        <a className="header__wordmark" href="#top" aria-label={`${brand.wordmark} — back to top`}>
          {brand.wordmark}
        </a>

        <nav className="header__nav" aria-label="Primary">
          <ul className="header__links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a className="header__link" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="pill pill--header header__phone" href={brand.contact.phone.href} aria-label={`Call ${brand.contact.phone.value}`}>
          <Icon name="phone" className="icon--static" />
          <span className="header__phone-num">{brand.contact.phone.value}</span>
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="header__menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? 'Close' : 'Menu'}</span>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={sheetRef}
        className={`header__sheet${open ? ' is-open' : ''}`}
        data-lenis-prevent
        hidden={!open}
      >
        <nav aria-label="Primary (mobile)">
          <ul className="header__sheet-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a className="header__sheet-link" href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                  <Icon name="arrow-right" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="header__sheet-note small">
          {brand.wordmark}
        </p>
      </div>
    </header>
  )
}
