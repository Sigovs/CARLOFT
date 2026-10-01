/**
 * Scroll layer — Lenis (client, 2026-09-30: "add Lenis on scroll").
 *
 * Contract (design_dna DNA90):
 * - One loop: Lenis runs on gsap.ticker with autoRaf:false and feeds
 *   ScrollTrigger.update; lag smoothing off.
 * - Not constructed under prefers-reduced-motion: reduce (native scroll there).
 * - Touch stays native (syncTouch off). Nested scrollers carry data-lenis-prevent.
 * - The visitor keeps the transport: every in-page link and every programmatic
 *   scroll goes through scrollToEl / scrollToY below, so anchors, the hash routes
 *   (#contact?topic=…, which Lenis' own anchor handler cannot parse) and the
 *   motion layer's focus jumps all land on the same, header-aware position.
 */
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from './gsap.js'

let lenis = null

export const getLenis = () => lenis

/** Header-aware target: an element's own scroll-margin-top (the sticky header). */
const marginTop = (el) => parseFloat(getComputedStyle(el).scrollMarginTop) || 0

export function scrollToY(y, { immediate = false } = {}) {
  if (lenis) lenis.scrollTo(y, { immediate, force: true })
  else window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' })
}

export function scrollToEl(el, { immediate = false } = {}) {
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -marginTop(el), immediate, force: true })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' })
}

/** Stop / resume smooth scrolling (open dialog, open mobile menu). */
export const lockScroll = () => lenis?.stop()
export const unlockScroll = () => lenis?.start()

/**
 * Starts Lenis unless reduced motion is requested, and follows that preference
 * live. Also delegates in-page link clicks to scrollToEl. Returns a teardown.
 */
export function initScroll() {
  const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
  const tick = (time) => lenis?.raf(time * 1000)

  const start = () => {
    if (lenis || reduceMq.matches) return
    lenis = new Lenis({ autoRaf: false, anchors: false, syncTouch: false })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  }
  const stop = () => {
    if (!lenis) return
    gsap.ticker.remove(tick)
    gsap.ticker.lagSmoothing(500, 33)
    lenis.destroy()
    lenis = null
  }
  const onPref = () => (reduceMq.matches ? stop() : start())

  // In-page links: smooth, header-aware, and still a real navigation (history +
  // hashchange, so the hash routes and the footer's "You asked about" keep working).
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const href = a.getAttribute('href')
    const id = href.slice(1).split('?')[0]
    const el = id && document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const changed = window.location.hash !== href
    if (changed) history.pushState(null, '', href)
    scrollToEl(el, { immediate: !lenis && reduceMq.matches })
    if (changed) window.dispatchEvent(new HashChangeEvent('hashchange'))
    // Move keyboard / screen-reader focus with the reader.
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  start()
  reduceMq.addEventListener('change', onPref)
  document.addEventListener('click', onClick)
  return () => {
    reduceMq.removeEventListener('change', onPref)
    document.removeEventListener('click', onClick)
    stop()
  }
}
