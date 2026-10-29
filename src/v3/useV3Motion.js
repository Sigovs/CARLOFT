import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap.js'
import { MQ } from '../motion/media.js'
import { DIST, DUR, EASE, HERO, SCRUB, STAGGER } from '../motion/tokens.js'
import { bindSection } from '../motion/reveals.js'
import { fontsReady, splitLines } from '../motion/lines.js'

/**
 * V3 motion — the V2 vocabulary (Alex, 2026-10-29: "bring our V2 motion back").
 * The ordinary sections go through the same role binder as V1/V2
 * (bindSection: staircase text, heading lines rising through masks, the
 * inventory card batch, the downward plate reveal), keyed by the data-motion
 * roles in AppV3's markup. Two V3-only pieces: the hero load entrance and the
 * scrubbed photographs (Classics settles in, the closing row rises).
 * Reduced motion: nothing binds — the static page is the authored still.
 */
export function useV3Motion(pageRef) {
  useGSAP(
    () => {
      const page = pageRef.current
      const onLayout = () => ScrollTrigger.refresh()
      window.addEventListener('layout:change', onLayout)

      const mm = gsap.matchMedia()
      mm.add(MQ, (context) => {
        const { isDesktop, reduce } = context.conditions
        if (reduce) return
        let live = true

        // --- hero: a load entrance, not a scroll one ---------------------------
        const hero = page.querySelector('[data-motion-root="hero"]')
        const heroImg = hero.querySelector('.v3-hero__img')
        const heroRest = hero.querySelectorAll('.v3-hero__lead, .v3-hero__alt, .v3-hero__ctrl, .v3-search')
        gsap.set(heroRest, { opacity: 0, y: DIST.support })
        gsap.fromTo(heroImg, { scale: 1.06 }, { scale: 1, duration: DUR.xl * 1.6, ease: EASE.out })
        fontsReady(HERO.fontCap).then(() => {
          if (!live) return
          context.add(() => {
            splitLines(hero.querySelector('h1'), (self) =>
              gsap.from(self.lines, { yPercent: DIST.line, duration: DUR.l, ease: EASE.expo, stagger: STAGGER.linesHero, delay: HERO.loadDelay }),
            )
            gsap.to(heroRest, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out, stagger: STAGGER.group, delay: HERO.loadLead })
          })
        })

        // --- scrubbed photographs ----------------------------------------------
        const classicsImg = page.querySelector('.v3-band-photo__img')
        gsap.fromTo(
          classicsImg,
          { scale: 1.12, transformOrigin: '70% 55%' },
          { scale: 1, ease: EASE.scrub, scrollTrigger: { trigger: classicsImg, start: 'top bottom', end: 'center center', scrub: SCRUB.reveal } },
        )
        const closingImg = page.querySelector('.v3-closing__img')
        gsap.fromTo(
          closingImg,
          { yPercent: 14, opacity: 0.4 },
          { yPercent: 0, opacity: 1, ease: EASE.scrub, scrollTrigger: { trigger: closingImg, start: 'top bottom', end: 'bottom bottom', scrub: SCRUB.reveal } },
        )

        // --- ordinary sections, by role ----------------------------------------
        fontsReady().then(() => {
          if (!live) return
          context.add(() => {
            page.querySelectorAll('[data-motion-root]:not([data-motion-root="hero"])').forEach((root) => bindSection(root, { isDesktop }))
          })
        })

        return () => {
          live = false
        }
      })

      return () => window.removeEventListener('layout:change', onLayout)
    },
    { scope: pageRef },
  )
}
