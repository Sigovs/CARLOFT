import { useEffect, useState } from 'react'
import { scrollToEl } from '../motion/scroll.js'

/**
 * Hash routes of the form `#contact?topic=sell&id=p911`.
 *
 * The browser cannot resolve that hash to an element (it looks for an id
 * literally named "contact?topic=sell"), so this hook:
 *   1. parses the hash into { target, params },
 *   2. scrolls to the target element on every hash change (and on first load),
 *      honouring scroll-margin-top (the sticky header),
 *   3. moves focus to the target for keyboard and screen-reader users.
 *
 * Plain `#section` hashes are left to the browser.
 */
export function parseHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, '')
  const [target, query = ''] = raw.split('?')
  return { target, params: new URLSearchParams(query) }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash())

  useEffect(() => {
    const go = (isInitial) => {
      const next = parseHash()
      setRoute(next)
      if (!next.params.toString() || !next.target) return
      const el = document.getElementById(next.target)
      if (!el) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      scrollToEl(el, { immediate: isInitial || reduce })
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
    const onHash = () => go(false)
    // After first paint, so layout (fonts, fixed image boxes) is settled.
    const raf = requestAnimationFrame(() => go(true))
    window.addEventListener('hashchange', onHash)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  return route
}
