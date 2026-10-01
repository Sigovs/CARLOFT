import { gsap, ScrollTrigger, useGSAP } from './gsap.js'
import { MQ } from './media.js'
import { DUR } from './tokens.js'
import { bindSection } from './reveals.js'
import { fontsReady, headerHeight } from './lines.js'
import { scrollToY } from './scroll.js'

/** The ordinary sections, bound by role. Hero, Sell and Classics have their own hooks. */
const ORDINARY = ':scope [data-motion-root]:not([data-motion-root="hero"], [data-motion-root="sell"], [data-motion-root="classics"], [data-motion-root="svcfin"])'

/**
 * Page-level motion: refresh strategy (G8) + role binding for ordinary sections.
 * Runs in App's layout effect, i.e. AFTER every child hook (Sell's .is-staged,
 * the Classics pin) — so everything it measures already has its final geometry.
 */
export function usePageMotion(pageRef) {
  useGSAP(
    (_ctx, contextSafe) => {
      const page = pageRef.current

      // --- Refresh, declared (G8) --------------------------------------------
      // Fonts: once, and only if they were still loading when we measured.
      let alive = true
      if (document.fonts && document.fonts.status === 'loading') {
        document.fonts.ready.then(() => alive && ScrollTrigger.refresh())
      }
      // Inventory results changed height → re-measure, crossfade the new set.
      const onLayout = contextSafe(() => {
        const next = page.querySelector('#inventory .featured__grid, #inventory .featured__empty')
        if (next && !window.matchMedia(MQ.reduce).matches) {
          gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: DUR.xs, overwrite: 'auto', clearProps: 'opacity' }) // 'auto': only opacity — the rail's x tween on the same element must survive
        }
        ScrollTrigger.refresh()
      })
      window.addEventListener('layout:change', onLayout)

      // Breakpoint crossings (desktop ⇄ mobile ⇄ reduced) rebuild every branch,
      // and ScrollTrigger's scroll memory does not survive it: the new branch's
      // triggers refresh individually and zero it, so the page landed at y=0
      // (measured). Keep the reader where they were — by SECTION + fraction, not
      // by pixel, because the layouts differ in height (pin spacer, 180vh Sell).
      // The anchor is taken when the page is at rest (scrollEnd / after a refresh)
      // because by the time a media change fires, the width — and so the layout —
      // has already changed under the old scroll position.
      let anchor = null
      let pending = false
      const measure = () => {
        const H = headerHeight(page)
        for (const s of page.querySelectorAll('main > section')) {
          const r = s.getBoundingClientRect()
          if (r.bottom > H) return { s, w: window.innerWidth, frac: r.height ? gsap.utils.clamp(0, 1, (H - r.top) / r.height) : 0 }
        }
        return null
      }
      const onScrollEnd = () => {
        if (!pending && (!anchor || anchor.w === window.innerWidth)) anchor = measure()
      }
      // A resize INSIDE one branch (1440 → 1024, both desktop) fires no matchMedia
      // event, but the layout still reflows (pin spacer = 100vh, text wraps) and
      // the browser keeps the pixel scrollY — measured: Service −200 at 1440
      // landed on Finance at 1024. The anchor still holds the pre-resize reading
      // position (taken at rest), so the refresh that follows restores it.
      const onRefresh = () => {
        if (pending) return
        if (anchor && anchor.w !== window.innerWidth) restore()
        else anchor = measure()
      }
      const onMediaInit = () => {
        pending = true
      }
      const restore = () => {
        if (anchor) {
          const r = anchor.s.getBoundingClientRect()
          const y = window.scrollY + r.top + anchor.frac * r.height - headerHeight(page)
          scrollToY(Math.max(0, y), { immediate: true })
        }
        pending = false
        anchor = measure()
      }
      anchor = measure()
      ScrollTrigger.addEventListener('scrollEnd', onScrollEnd)
      ScrollTrigger.addEventListener('refresh', onRefresh)
      gsap.addEventListener('matchMediaInit', onMediaInit)
      ScrollTrigger.addEventListener('matchMedia', restore)

      // --- Ordinary sections -------------------------------------------------
      const mm = gsap.matchMedia()
      mm.add(MQ, (context) => {
        const { isDesktop, reduce } = context.conditions
        if (reduce) return // the static page is the authored still
        let live = true
        fontsReady().then(() => {
          if (!live) return
          context.add(() => {
            const roots = page.querySelectorAll(ORDINARY)
            roots.forEach((root) => bindSection(root, { isDesktop }))
            if (import.meta.env.DEV) {
              // MJ11: absence raises no alarm by itself — check that roles took hold.
              const bound = [...roots].map((r) => r.dataset.motionRoot)
              const missing = [...page.querySelectorAll('[data-motion]')].filter(
                (el) => !el.closest('[data-motion-root]'),
              )
              console.debug('[motion] bound roles:', bound.join(', '))
              if (missing.length) console.warn('[motion] data-motion outside any root:', missing)
            }
          })
        })
        return () => {
          live = false
        }
      })

      return () => {
        alive = false
        window.removeEventListener('layout:change', onLayout)
        ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd)
        ScrollTrigger.removeEventListener('refresh', onRefresh)
        gsap.removeEventListener('matchMediaInit', onMediaInit)
        ScrollTrigger.removeEventListener('matchMedia', restore)
      }
    },
    { scope: pageRef },
  )
}
