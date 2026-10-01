import { gsap, useGSAP } from './gsap.js'
import { MQ } from './media.js'
import { EASE, SCRUB } from './tokens.js'

/**
 * About — sticky full-screen stage (client, 2026-09-30: "make About sticky").
 * Desktop only: adds .is-staged (190vh section, one sticky stage of photo + panel)
 * and scrubs the panel up from below the stage's foot over the first 55% of the
 * travel; it then holds, and photo and panel leave together. The photograph
 * settles from a 1.06 scale across the whole travel (one layer, no distortion).
 * Mobile / tablet / reduced motion: the static full-screen layout; nothing runs.
 * The entry clip, and the panel's staircase text, stay with the page role binder.
 */
export function useAboutSticky(rootRef) {
  useGSAP(
    () => {
      const root = rootRef.current
      const mm = gsap.matchMedia()
      mm.add(MQ, (context) => {
        if (!context.conditions.isDesktop) return
        root.classList.add('is-staged')
        // The panel's staircase text runs while the panel rises (page role binder reads these).
        root.dataset.stairStart = 'top top'
        root.dataset.stairEnd = 'top -45%'
        const panel = root.querySelector('.about__panel')
        const inner = root.querySelector('.about__inner')
        const img = root.querySelector('.about__layer img')

        gsap
          .timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: SCRUB.stage, invalidateOnRefresh: true },
          })
          .fromTo(panel, { y: () => inner.offsetHeight }, { y: 0, duration: 0.55, ease: EASE.settle }, 0)
          .fromTo(img, { scale: 1.06, transformOrigin: '30% 60%' }, { scale: 1, duration: 1 }, 0)

        return () => {
          root.classList.remove('is-staged')
          delete root.dataset.stairStart
          delete root.dataset.stairEnd
        }
      })

      // Mouse parallax: the photograph drifts gently against the cursor (pointer
      // devices, motion allowed). quickTo keeps it smooth and interruptible; the
      // wrapper is oversized so no edge ever shows. Leaving the section eases it home.
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const target = root.querySelector('.about__parallax')
        const xTo = gsap.quickTo(target, 'x', { duration: 0.9, ease: 'power3.out' })
        const yTo = gsap.quickTo(target, 'y', { duration: 0.9, ease: 'power3.out' })
        const onMove = (e) => {
          const r = root.getBoundingClientRect()
          const rx = (e.clientX - r.left) / r.width - 0.5
          const ry = (e.clientY - r.top) / r.height - 0.5
          xTo(-rx * 48) // ±24px
          yTo(-ry * 32) // ±16px
        }
        const onLeave = () => {
          xTo(0)
          yTo(0)
        }
        root.addEventListener('pointermove', onMove)
        root.addEventListener('pointerleave', onLeave)
        return () => {
          root.removeEventListener('pointermove', onMove)
          root.removeEventListener('pointerleave', onLeave)
          gsap.set(target, { clearProps: 'transform' })
        }
      })
    },
    { scope: rootRef },
  )
}
