import { gsap, useGSAP } from './gsap.js'
import { MQ } from './media.js'
import { EASE, SCRUB } from './tokens.js'
import { headerHeight } from './lines.js'
import { scrollToY } from './scroll.js'

/**
 * Inventory rail (client, 2026-09-30: "a carousel on the right; horizontal
 * scroll on scroll"). Contract: FeaturedInventory.jsx.
 *
 * Desktop (motion on): the section pins under the header and vertical scroll
 * drives the card track leftwards until the last card is in view, then the page
 * continues. Distance = the track's overflow, read live (filters change it —
 * usePageMotion refreshes on "layout:change"; invalidateOnRefresh re-reads).
 * Mobile / reduced motion: nothing runs — the rail is a native horizontal
 * scroller with snap (CSS).
 * Keyboard: focusing a card that is off to the right scrolls the page to the
 * point where the rail shows it.
 */
export function useInventoryRail(rootRef) {
  useGSAP(
    () => {
      const root = rootRef.current
      const mm = gsap.matchMedia()
      mm.add(MQ, (context) => {
        if (!context.conditions.isDesktop) return
        root.classList.add('is-rail')
        const viewport = root.querySelector('.featured__viewport')
        const track = () => root.querySelector('.featured__track')
        const inner = () => {
          const cs = getComputedStyle(viewport)
          return viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
        }
        const distance = () => {
          const t = track()
          return t ? Math.max(0, t.scrollWidth - inner()) : 0
        }

        const tween = gsap.to(track(), {
          x: () => -distance(),
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: root,
            start: () => `top ${headerHeight(root)}`,
            end: () => `+=${distance()}`,
            pin: true,
            scrub: SCRUB.stage,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            // Upstream pin: must refresh BEFORE the Classics pin (priority 1) and every
            // trigger below it, or they measure the page without this pin's spacer.
            refreshPriority: 2,
          },
        })
        const st = tween.scrollTrigger

        const onFocus = (e) => {
          const card = e.target.closest('.featured__track > li')
          const d = distance()
          if (!card || !d) return
          const p = Math.min(1, Math.max(0, card.offsetLeft / d))
          scrollToY(st.start + p * (st.end - st.start), { immediate: true })
        }
        root.addEventListener('focusin', onFocus)

        return () => {
          root.removeEventListener('focusin', onFocus)
          root.classList.remove('is-rail')
        }
      })
    },
    { scope: rootRef },
  )
}

