import { gsap, ScrollTrigger, useGSAP } from './gsap.js'
import { MQ } from './media.js'
import { CLIP, DIST, DUR, EASE, P, SCRUB, STAGGER, START, SWAP } from './tokens.js'
import { fontsReady, headerHeight, lineReveal, splitLines } from './lines.js'
import { scrollToY } from './scroll.js'

/**
 * Sell / Consign — sticky editorial stage (MOTION.md §4.1). Contract: SellConsign.jsx.
 *
 * Method: CSS sticky (the .is-staged layout) + ScrollTrigger used only to READ
 * progress — one scrubbed timeline for the image framing and index fill, one
 * non-scrubbed trigger that picks the active phase with hysteresis and fires an
 * event swap. No pin-spacer, so the Classics pin below never depends on it.
 *
 * Ownership (G6): .sell__media clip → approach tween · .sell__frame x/scale +
 * .sell__fill scaleX → framing timeline · .sell__group opacity/y and its
 * children → the swap · data-active / aria-current → setActive().
 */
export function useSellSequence(rootRef) {
  useGSAP(
    () => {
      const root = rootRef.current
      const mm = gsap.matchMedia()

      // The matchMedia context's own contextSafe: wrapping with useGSAP's would nest
      // the outer context inside the inner one (a cycle) when called during a refresh.
      mm.add(MQ, (context, contextSafe) => {
        const { isDesktop, reduce } = context.conditions
        if (reduce) return // reff1 still: static layout, all groups visible

        const q = gsap.utils.selector(root)
        const media = q('.sell__media')[0]
        const frame = q('.sell__frame')[0]
        const heading = q('.sell__heading')[0]
        const groups = q('.sell__group')
        const intro = q('.sell__group--intro .lead')[0]
        let live = true

        // ---------------------------------------------------------------- mobile
        if (!isDesktop) {
          gsap
            .timeline({ defaults: { duration: DUR.xl, ease: EASE.wipe }, scrollTrigger: { trigger: media, start: START.group, once: true } })
            .fromTo(media, { clipPath: CLIP.sell }, { clipPath: CLIP.open }, 0)
            .fromTo(frame, { x: DIST.sellFrameMobile }, { x: 0 }, 0)
          fontsReady().then(() => {
            if (!live) return
            context.add(() => {
              lineReveal(heading, { start: START.headingMobile, duration: DUR.l, ease: EASE.expo, stagger: STAGGER.linesMobile })
              gsap.from(intro, { opacity: 0, y: DIST.supportMobile, duration: DUR.m, ease: EASE.out, scrollTrigger: { trigger: heading, start: START.headingMobile, once: true } })
              groups.slice(1).forEach((g) => {
                gsap.from(g.children, { opacity: 0, y: DIST.supportMobile, duration: DUR.m, ease: EASE.out, stagger: STAGGER.group, scrollTrigger: { trigger: g, start: START.group, once: true } })
              })
            })
          })
          return () => {
            live = false
          }
        }

        // --------------------------------------------------------------- desktop
        const btns = q('.sell__index-btn')
        const fill = q('.sell__fill')[0]
        const index = q('.sell__index')[0]
        root.classList.add('is-staged') // exists only while this branch does
        const start = () => `top top+=${headerHeight(root)}`

        let current = 0
        let swap = null
        const setActive = (phase) => {
          groups.forEach((g, i) => (i === phase ? g.setAttribute('data-active', '') : g.removeAttribute('data-active')))
          btns.forEach((b) => (Number(b.dataset.phaseTarget) === phase ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')))
        }
        gsap.set(groups, { opacity: (i) => (i === 0 ? 1 : 0) })
        setActive(0)

        const titleLines = (g) => g.querySelectorAll('.sell__path-title .line')
        const body = (g) => g.querySelectorAll('.sell__path-text, .lead')
        const cta = (g) => g.querySelectorAll('.sell__path-actions')

        const goTo = contextSafe((target, quick = false) => {
          if (target === current) return
          if (swap) swap.progress(1) // settle, then go to the LATEST target (one swap, not two)
          const dir = target > current ? 1 : -1
          const out = groups[current]
          const inn = groups[target]
          current = target
          setActive(target) // pointer-events + aria at the START of the incoming group

          if (quick) {
            // Keyboard: the focused control must be visible now, not after a choreography.
            gsap.set(out, { opacity: 0, y: 0 })
            gsap.set(inn, { opacity: 1, y: 0 })
            const settled = [...titleLines(inn)]
            if (settled.length) gsap.set(settled, { yPercent: 0 })
            gsap.set([...body(inn), ...cta(inn)], { opacity: 1, y: 0 })
            swap = null
            return
          }
          // The intro group has no title and no CTA: empty sets are skipped, not tweened.
          const outT = titleLines(out)
          const inT = titleLines(inn)
          const inB = body(inn)
          const inC = cta(inn)
          swap = gsap.timeline({ onComplete: () => (swap = null) })
          // The outgoing group is effectively gone as the incoming title starts
          // (SWAP: out 0.14s; titles roll from 0.06s; body after 0.15s). Measured at the old 0.35s exit: the incoming
          // "Consignment" rose over the still-legible "Tell us about your car…" and
          // the pale Sell CTA for ~0.15s (all groups share one grid cell).
          if (outT.length) swap.to(outT, { yPercent: -DIST.lineExit * dir, duration: SWAP.outDur, ease: EASE.in }, 0)
          swap.to(out, { opacity: 0, y: -DIST.exitGroup * dir, duration: SWAP.outDur, ease: EASE.in }, 0)
          swap.set(inn, { opacity: 1, y: 0 }, SWAP.inAt)
          if (inT.length) swap.fromTo(inT, { yPercent: DIST.line * dir }, { yPercent: 0, duration: DUR.l, ease: EASE.expo, stagger: STAGGER.lines }, SWAP.inAt)
          if (inB.length) swap.fromTo(inB, { opacity: 0, y: DIST.support * dir }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out }, SWAP.bodyAt)
          if (inC.length) swap.fromTo(inC, { opacity: 0, y: DIST.cta * dir }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out }, SWAP.ctaAt)
        })

        // Hysteresis: forward 0.30 / 0.66, backward 0.26 / 0.62 — no flicker at a boundary.
        const phaseFor = (p) => {
          const [f1, f2] = P.sellForward
          const [b1, b2] = P.sellBackward
          if (current === 0) return p >= f2 ? 2 : p >= f1 ? 1 : 0
          if (current === 1) return p >= f2 ? 2 : p < b1 ? 0 : 1
          return p < b1 ? 0 : p < b2 ? 1 : 2
        }

        // Approach: the plate opens from its right edge as the section arrives.
        gsap.fromTo(
          media,
          { clipPath: CLIP.sell },
          { clipPath: CLIP.open, ease: EASE.scrub, scrollTrigger: { trigger: root, start: 'top bottom', end: start, scrub: SCRUB.reveal } },
        )

        // Framing + index fill — one clock: the stage's scroll range.
        gsap
          .timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: root,
              start,
              end: 'bottom bottom',
              scrub: SCRUB.stage,
              onToggle: (self) => gsap.set(frame, { willChange: self.isActive ? 'transform' : 'auto' }),
            },
          })
          .fromTo(frame, { x: 0, scale: DIST.sellScaleHold }, { x: DIST.sellFrame1, scale: DIST.sellScale1, duration: P.sellShift1[1] }, P.sellShift1[0])
          .to(frame, { x: DIST.sellFrame2, scale: 1, duration: P.sellShift2[1] }, P.sellShift2[0])
          .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

        // Phase controller (reads progress; the swap is an event, not a scrub).
        const phaseST = ScrollTrigger.create({
          trigger: root,
          start,
          end: 'bottom bottom',
          onUpdate: (self) => goTo(phaseFor(self.progress)),
          onRefresh: (self) => goTo(phaseFor(self.progress), true), // landing mid-page / resize
        })

        const midpoint = (phase) => phaseST.start + P.sellMid[phase] * (phaseST.end - phaseST.start)

        // Index = skip control: scroll to the phase's midpoint (native smooth scroll).
        const onIndex = (e) => {
          const b = e.target.closest('.sell__index-btn')
          if (!b) return
          const smooth = !window.matchMedia(MQ.reduce).matches
          scrollToY(midpoint(Number(b.dataset.phaseTarget)), { immediate: !smooth })
        }
        // Keyboard: focus inside an inactive group brings its phase, instantly.
        const onFocus = (e) => {
          const g = e.target.closest('.sell__group')
          if (!g) return
          const phase = Number(g.dataset.phase)
          if (phase === current) return
          scrollToY(midpoint(phase), { immediate: true })
          goTo(phase, true)
        }
        index.addEventListener('click', onIndex)
        root.addEventListener('focusin', onFocus)

        // Approach entrance (after fonts: lines are measured).
        fontsReady().then(() => {
          if (!live) return
          context.add(() => {
            lineReveal(heading, { start: START.sellHeading, duration: DUR.l, ease: EASE.expo, stagger: STAGGER.lines })
            groups.slice(1).forEach((g) => splitLines(g.querySelector('.sell__path-title')))
            gsap
              .timeline({ defaults: { duration: DUR.m, ease: EASE.out }, scrollTrigger: { trigger: root, start: START.sellHeading, once: true } })
              .from(intro, { opacity: 0, y: DIST.support }, 0.3)
              .from(index, { opacity: 0, duration: DUR.s }, 0.45)
          })
        })

        return () => {
          live = false
          index.removeEventListener('click', onIndex)
          root.removeEventListener('focusin', onFocus)
          root.classList.remove('is-staged')
          groups.forEach((g) => g.removeAttribute('data-active'))
          btns.forEach((b) => b.removeAttribute('aria-current'))
        }
      })
    },
    { scope: rootRef },
  )
}
