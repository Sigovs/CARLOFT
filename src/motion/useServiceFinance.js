import { gsap, ScrollTrigger, useGSAP } from './gsap.js'
import { MQ } from './media.js'
import { DUR, EASE, SCRUB, STAIR } from './tokens.js'
import { fontsReady } from './lines.js'
import { bindSection } from './reveals.js'
import { scrollToY } from './scroll.js'

/**
 * Service + Finance — one chapter that changes on scroll. Contract: ServiceFinance.jsx.
 *
 * Desktop: CSS sticky (.is-staged, 200vh) + ScrollTrigger only READS progress —
 *   · entry (section top enters → reaches the top): the workshop photo climbs
 *     inside its frame, flush under the Classics stage as it lifts away;
 *   · one scrubbed timeline over the sticky travel: the finance photo wipes UP over
 *     the workshop (clip), settles from 1.05, the text ground turns white → grey,
 *     the index fill runs;
 *   · one non-scrubbed phase trigger with hysteresis swaps the text: the outgoing
 *     group leaves left, the incoming one steps in as a staircase. One active group.
 * Mobile: stacked; each story reveals with the page's staircase text + a clip on its photo.
 * Reduced motion: nothing runs — the stacked static layout is the still.
 */
const SPLIT = 0.5 // phase boundary on the sticky travel
const HYST = 0.04

export function useServiceFinance(rootRef) {
  useGSAP(
    () => {
      const root = rootRef.current
      const mm = gsap.matchMedia()

      mm.add(MQ, (context, contextSafe) => {
        const { isDesktop, reduce } = context.conditions
        if (reduce) return

        const q = gsap.utils.selector(root)
        const frames = q('.svcfin__frame')
        const layers = q('.svcfin__layer')
        const groups = q('.svcfin__group')
        let live = true

        // ------------------------------------------------------------ mobile
        if (!isDesktop) {
          fontsReady().then(() => {
            if (!live) return
            context.add(() => {
              groups.forEach((g) => bindSection(g, { isDesktop: false }))
              // Service rows draw in left → right as the list enters (rule + text).
              gsap.fromTo(
                q('.service__item'),
                { clipPath: 'inset(0% 100% 0% 0%)' },
                {
                  clipPath: 'inset(0% 0% 0% 0%)',
                  duration: DUR.l,
                  ease: EASE.out,
                  stagger: 0.12,
                  scrollTrigger: { trigger: q('.service__list')[0], start: 'top 85%', once: true },
                },
              )
              frames.forEach((f) =>
                gsap.fromTo(
                  f,
                  { clipPath: 'inset(0% 0% 100% 0%)' },
                  { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.l, ease: EASE.out, scrollTrigger: { trigger: f, start: 'top 90%', once: true } },
                ),
              )
            })
          })
          return () => {
            live = false
          }
        }

        // ----------------------------------------------------------- desktop
        root.classList.add('is-staged')
        const fill = q('.svcfin__fill')[0]
        const buttons = q('.svcfin__index-btn')
        const imgs = layers.map((l) => l.querySelector('img'))
        const rows = q('.service__item')
        const spare = () => layers[0].offsetHeight - frames[0].offsetHeight

        // Entry: the workshop photo climbs as the section arrives (never uncovers its frame).
        gsap.fromTo(
          layers[0],
          { y: 0, scale: 1.04, transformOrigin: '50% 0%' },
          {
            y: () => -spare(),
            scale: 1,
            ease: EASE.scrub,
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: SCRUB.stage, invalidateOnRefresh: true },
          },
        )

        // The change: finance photo wipes up, ground greys, index fills.
        gsap.set(frames[1], { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(layers[1], { y: () => -spare() })
        gsap
          .timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: SCRUB.stage, invalidateOnRefresh: true },
          })
          .to(frames[1], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3, ease: EASE.wipe }, 0.35)
          .fromTo(layers[1], { scale: 1.05, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.45 }, 0.35)
          .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          // Camera: a slow push on the workshop while Service is read (towards the
          // technicians), then the workshop is pushed up as the finance photo rises
          // over it — both photos travel one way, so the change reads as physical.
          // (The <img>s own these transforms; the layers belong to the entry drift.)
          .fromTo(imgs[0], { scale: 1, yPercent: 0, transformOrigin: '30% 55%' }, { scale: 1.05, duration: 0.4 }, 0)
          .to(imgs[0], { yPercent: -6, duration: 0.3, ease: EASE.in }, 0.35)
          // Finance: the interior keeps settling after the wipe, then holds.
          .fromTo(imgs[1], { scale: 1.06, transformOrigin: '40% 60%' }, { scale: 1, duration: 0.5, ease: EASE.settle }, 0.4)

        // The service list draws itself, one row at a time (rule + text left → right),
        // while the Service phase is on screen — the three services read as a sequence.
        gsap.fromTo(
          rows,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: EASE.settle,
            stagger: 0.35,
            scrollTrigger: { trigger: root, start: 'top 55%', end: 'top -35%', scrub: SCRUB.stage },
          },
        )

        // Text: one active group, event swap with hysteresis.
        let active = -1
        const setActive = (i) => {
          groups.forEach((g, k) => {
            if (k === i) g.setAttribute('data-active', '')
            else g.removeAttribute('data-active')
          })
          buttons.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')))
          root.dataset.phase = String(i) // the index recolours on the dark Finance ground
        }
        const steps = (g) => [...g.children].flatMap((c) => (c.matches('[data-motion="group"]') ? [...c.children] : [c]))
        const swap = contextSafe((next, instant) => {
          if (next === active) return
          const prev = active
          active = next
          setActive(next)
          const inG = groups[next]
          const outG = prev >= 0 ? groups[prev] : null
          gsap.killTweensOf([...groups, ...groups.flatMap(steps)], 'opacity,x') // the swap owns only these; the row draw (clipPath) is untouched
          if (instant) {
            groups.forEach((g, k) => gsap.set(g, { opacity: k === next ? 1 : 0, x: 0 }))
            gsap.set(steps(inG), { opacity: 1, x: 0 })
            return
          }
          if (outG) gsap.to(outG, { opacity: 0, x: -STAIR.xMobile, duration: DUR.xs, ease: EASE.in })
          gsap.set(inG, { opacity: 1, x: 0 })
          gsap.fromTo(
            steps(inG),
            { opacity: 0, x: -STAIR.x },
            { opacity: 1, x: 0, duration: 0.55, ease: EASE.out, stagger: 0.07, delay: outG ? 0.16 : 0 },
          )
        })

        gsap.set(groups, { opacity: 0 })
        const phaseAt = (p) => (p >= SPLIT + HYST ? 1 : p <= SPLIT - HYST ? 0 : active < 0 ? 0 : active)
        const st = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => swap(phaseAt(self.progress), false),
          onRefresh: (self) => swap(phaseAt(self.progress), true),
        })
        swap(phaseAt(st.progress), true)

        // Index buttons: go to each phase's middle. Focus inside an inactive group → switch.
        const target = (i) => st.start + (i === 0 ? 0.2 : 0.8) * (st.end - st.start)
        const onIndex = (e) => {
          const b = e.target.closest('.svcfin__index-btn')
          if (b) scrollToY(target(Number(b.dataset.phaseTarget)))
        }
        const onFocus = (e) => {
          const g = e.target.closest('.svcfin__group')
          const i = g ? groups.indexOf(g) : -1
          if (i >= 0 && i !== active) {
            scrollToY(target(i), { immediate: true })
            swap(i, true)
          }
        }
        root.addEventListener('click', onIndex)
        root.addEventListener('focusin', onFocus)

        return () => {
          live = false
          root.removeEventListener('click', onIndex)
          root.removeEventListener('focusin', onFocus)
          groups.forEach((g) => {
            g.removeAttribute('data-active')
          })
          buttons.forEach((b) => b.removeAttribute('aria-current'))
          root.classList.remove('is-staged')
          root.style.removeProperty('--svcfin-ground')
          delete root.dataset.phase
        }
      })
    },
    { scope: rootRef },
  )
}
