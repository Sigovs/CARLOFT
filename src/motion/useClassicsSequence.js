import { gsap, ScrollTrigger, useGSAP } from './gsap.js'
import { MQ } from './media.js'
import { CLASSICS_M, CLIP, DIST, DUR, EASE, P, PIN, SCRUB, STAGGER, START } from './tokens.js'
import { scrollToY } from './scroll.js'

/**
 * Classics — the peak, "the plate becomes the room" (MOTION.md §4.2, BRIEF §6).
 *
 * Desktop: two ScrollTriggers, one owner per property (G6)
 *   approach  section top→bottom … top→top, scrub: stage clip-path (framed plate
 *             inside the white page → full bleed) + eyebrow
 *   pin       .classics__pin for +100%, scrub: image layer x/scale (one layer,
 *             never zoom-only), heading lines, body, CTAs, then a 20% hold
 * Mobile: no pin — image block clip + layer settle, lines, then copy + CTAs.
 * Header: dark while the section is under it — outside matchMedia (orientation, not motion).
 *
 * Heading lines are AUTHORED (.line-mask > .line) — a decided break, and a
 * re-split must never rebuild a pinned, scrubbed timeline mid-scroll.
 */
export function useClassicsSequence(rootRef, headerRef) {
  useGSAP(
    () => {
      const root = rootRef.current
      const mm = gsap.matchMedia()

      mm.add(MQ, (context) => {
        const { isDesktop, isMobile } = context.conditions
        const q = gsap.utils.selector(root)
        const pinEl = q('.classics__pin')[0]
        const stage = q('.classics__stage')[0]
        const mediaEl = q('.classics__media')[0]
        const layer = q('.classics__layer')[0]
        const eyebrow = q('.classics__eyebrow')[0]
        const [line1, line2] = q('.classics__heading .line')
        // Authored lines persist across StrictMode remounts and breakpoint rebuilds;
        // after a revert GSAP can re-parse a still-applied yPercent from the
        // computed matrix as a px \`y\` (measured: y 84.96px = 118% of 72px, which
        // left the lines hidden inside their masks). Every line tween therefore
        // pins y: 0 and owns yPercent only.
        const body = q('.classics__body')[0]
        const actions = q('.classics__actions')[0]
        let cleanupFocus = null

        if (isDesktop) {
          // Outside the framed plate the page stays WHITE (motion-only class, motion.css).
          root.classList.add('is-framed')

          gsap
            .timeline({
              defaults: { ease: EASE.scrub },
              scrollTrigger: { id: 'classics:approach', trigger: root, start: 'top bottom', end: 'top top', scrub: SCRUB.reveal },
            })
            .fromTo(stage, { clipPath: CLIP.classics }, { clipPath: CLIP.classicsOpen, duration: 1 }, 0)
            .fromTo(eyebrow, { opacity: 0, y: DIST.classicsEyebrow }, { opacity: 1, y: 0, duration: P.eyebrow[1] }, P.eyebrow[0])
            // Line 1 rises while the plate opens, so the pin's first frame is composed.
            .fromTo(line1, { y: 0, yPercent: DIST.line }, { y: 0, yPercent: 0, duration: P.line1[1], ease: EASE.settle }, P.line1[0])

          gsap.set(actions, { pointerEvents: 'none' })
          const tl = gsap
            .timeline({
              defaults: { ease: EASE.scrub },
              scrollTrigger: {
                id: 'classics:pin',
                trigger: root,
                pin: pinEl,
                start: 'top top',
                end: PIN.classics,
                scrub: SCRUB.stage,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                refreshPriority: 1,
                onUpdate: (self) => {
                  actions.style.pointerEvents = self.progress >= P.ctaLive ? '' : 'none'
                },
                onToggle: (self) => gsap.set(layer, { willChange: self.isActive ? 'transform' : 'auto' }),
              },
            })
            .fromTo(layer, { x: DIST.classicsX, scale: DIST.classicsScale }, { x: 0, scale: 1, duration: P.layer[1], ease: EASE.reframe }, P.layer[0])
            .fromTo(line2, { y: 0, yPercent: DIST.line }, { y: 0, yPercent: 0, duration: P.line2[1], ease: EASE.settle }, P.line2[0])
            .fromTo(body, { opacity: 0, y: DIST.classicsBody }, { opacity: 1, y: 0, duration: P.body[1] }, P.body[0])
            .fromTo(actions, { opacity: 0, y: DIST.classicsCta }, { opacity: 1, y: 0, duration: P.cta[1] }, P.cta[0])
            .to({}, { duration: 1 - P.layer[1] }, P.layer[1]) // the hold: nothing moves for the last 20%

          // Keyboard: a CTA focused before the type has settled jumps the pin to the
          // settled frame and finishes the scrub catch-up, so focus is never on a ghost.
          const st = tl.scrollTrigger
          const onFocus = (e) => {
            if (!e.target.closest('.classics__actions')) return
            if (st.progress >= P.ctaSettled && st.isActive) return
            if (window.scrollY > st.end) return // already released: frame is final
            scrollToY(st.start + P.focusJump * (st.end - st.start), { immediate: true })
            ScrollTrigger.update()
            st.getTween()?.progress(1)
            actions.style.pointerEvents = ''
          }
          root.addEventListener('focusin', onFocus)
          cleanupFocus = () => root.removeEventListener('focusin', onFocus)
        } else if (isMobile) {
          gsap
            .timeline({
              defaults: { ease: EASE.scrub },
              scrollTrigger: { trigger: mediaEl, start: 'top 90%', end: 'top 45%', scrub: SCRUB.reveal },
            })
            .fromTo(mediaEl, { clipPath: CLIP.classicsMobile }, { clipPath: CLIP.classicsMobileOpen }, 0)
            .fromTo(layer, { x: DIST.classicsMobileX }, { x: 0 }, 0)
          // One entrance for the copy block: eyebrow → the two lines → body → CTAs.
          gsap
            .timeline({
              defaults: { duration: DUR.m, ease: EASE.out },
              scrollTrigger: { trigger: q('.classics__copy')[0], start: START.group, once: true },
            })
            .from(eyebrow, { opacity: 0, y: DIST.supportMobile }, 0)
            .fromTo([line1, line2], { y: 0, yPercent: DIST.line }, { y: 0, yPercent: 0, duration: DUR.l, ease: EASE.expo, stagger: STAGGER.linesMobile }, CLASSICS_M.linesAt)
            .from(body, { opacity: 0, y: DIST.supportMobile }, CLASSICS_M.bodyAt)
            .from(actions, { opacity: 0, y: DIST.cta }, CLASSICS_M.ctaAt)
        }

        return () => {
          cleanupFocus?.()
          root.classList.remove('is-framed')
        }
      })

      // Header joins the room — OUTSIDE the matchMedia split: it is orientation,
      // not motion, so it runs under reduced motion and on mobile too (lead, static
      // critique). Created after mm.add, i.e. after the pin, so it measures the
      // spaced layout. Side effect that matters: because this trigger survives a
      // breakpoint change, ScrollTrigger keeps its scroll memory — when EVERY
      // trigger on a scroller dies in a matchMedia revert, it zeroes the recorded
      // position and the page jumps to the top (measured: 1200→900 landed at y=0).
      const header = headerRef?.current
      if (header) {
        const H = () => header.offsetHeight
        ScrollTrigger.create({
          id: 'classics:header',
          trigger: root,
          start: () => `top top+=${H()}`,
          end: () => `bottom top+=${H()}`,
          onToggle: (self) => {
            // Leaving the room either way lands far below the hero → "scrolled".
            header.dataset.header = self.isActive ? 'dark' : 'scrolled'
          },
        })
      }
      return () => {
        if (header && header.dataset.header === 'dark') header.dataset.header = 'scrolled'
      }
    },
    { scope: rootRef },
  )
}
