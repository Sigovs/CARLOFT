import { gsap, ScrollTrigger } from './gsap.js'
import { CLIP, DIST, DUR, EASE, P, SCRUB, STAGGER, STAIR, START } from './tokens.js'
import { splitLines } from './lines.js'

/**
 * Role binder (MJ11): ordinary sections are bound by the roles their markup
 * declares — data-motion="heading|support|cta|group|cards|image" and
 * data-reveal="up|down|calm" — never by id. Sections differ by TEMPO (the
 * section's register, keyed by data-motion-root) and by the image variant the
 * markup names, so the choreography varies without a bespoke hook per section.
 */

const TEMPO = {
  default: { lineDur: DUR.l, stagger: STAGGER.lines, supportAt: 0.25, groupAt: 0.35, ctaAt: 0.45 },
  // quick, restrained — the page's working section
  inventory: { lineDur: DUR.l, stagger: STAGGER.lines, supportAt: 0.15, groupAt: 0.2, ctaAt: 0.15 },
  // substantial: lines, lead, the three services as one group, CTA last
  service: { lineDur: DUR.l, stagger: STAGGER.lines, supportAt: 0.3, groupAt: 0.4, ctaAt: 0.62, groupStagger: STAGGER.group },
  // calmer: a single line, text follows late and softly
  finance: { lineDur: DUR.xl, stagger: STAGGER.lines, supportAt: 0.4, groupAt: 0.5, ctaAt: 0.6 },
  // deliberate type entrance: slow lines, wide stagger — deliberate, never late
  about: { lineDur: DUR.xl, stagger: STAGGER.linesAbout, supportAt: 0.4, groupAt: 0.45, ctaAt: 0.6 },
  // quiet
  // quiet: the one heading on the page that does NOT rise through a mask —
  // a short fade with a small lift, then the cards (the tail's lower register)
  reviews: { headingFade: true, stagger: STAGGER.lines, supportAt: 0.2, groupAt: 0.15, ctaAt: 0.3, groupStagger: STAGGER.reviews, groupY: DIST.review },
  instagram: { lineDur: DUR.l, stagger: STAGGER.lines, supportAt: 0.2, groupAt: 0.25, ctaAt: 0.3, groupStagger: STAGGER.tiles, groupY: DIST.tile },
}

export function bindSection(root, { isDesktop }) {
  const name = root.dataset.motionRoot
  const T = { ...TEMPO.default, ...(TEMPO[name] || {}) }
  const q = gsap.utils.selector(root)
  const heading = q('[data-motion="heading"]')[0]
  const trigger = heading || root
  const start = isDesktop ? START.heading : START.headingMobile
  const supportY = isDesktop ? DIST.support : DIST.supportMobile

  // Staircase text (client, 2026-09-30: "text slides in like a staircase, on
  // scroll"): eyebrow → each heading line → lead → group items → CTA slide in
  // from the left one step after another, scrubbed to scroll, so mid-way their
  // left edges form a descending staircase. Heading lines also rise through
  // their masks inside the same timeline. Built in SplitText's onSplit, so a
  // re-split (resize, font load) reverts and rebuilds it cleanly.
  const eyebrows = q('.eyebrow').filter((e) => !heading || e.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).slice(0, 1)
  const supports = q('[data-motion="support"]')
  const groupItems = q('[data-motion="group"]').flatMap((g) => [...g.children])
  const ctas = q('[data-motion="cta"]')
  const step = isDesktop ? STAIR.x : STAIR.xMobile

  const build = (masks, lines) => {
    const items = [...eyebrows, ...(masks || (heading ? [heading] : [])), ...supports, ...groupItems, ...ctas]
    if (!items.length) return null
    const tl = gsap.timeline({
      defaults: { ease: EASE.stair, duration: STAIR.dur },
      // A staged section (About's sticky stage) can pin the staircase to its own
      // travel via data-stair-start / data-stair-end on the root.
      scrollTrigger: root.dataset.stairStart
        ? { trigger: root, start: root.dataset.stairStart, end: root.dataset.stairEnd, scrub: STAIR.scrub }
        : { trigger, start: STAIR.start, end: isDesktop ? STAIR.end : STAIR.endMobile, scrub: STAIR.scrub },
    })
    tl.from(items, { x: -step, opacity: 0, stagger: STAIR.stagger }, 0)
    if (lines) tl.from(lines, { yPercent: DIST.line, stagger: STAIR.stagger }, eyebrows.length * STAIR.stagger)
    return tl
  }

  if (heading && !T.headingFade) splitLines(heading, (self) => build(self.masks, self.lines))
  else build(null, null)

  const cards = q('[data-motion="cards"]')[0]
  if (cards) batchCards(cards, isDesktop)

  const image = q('[data-motion="image"]')[0]
  if (image) revealImage(image, image.dataset.reveal, isDesktop)
}

/** Inventory cards: one quick restrained stagger per batch that enters. */
function batchCards(grid, isDesktop) {
  const items = [...grid.children]
  const y = isDesktop ? DIST.card : DIST.cardMobile
  gsap.set(items, { opacity: 0, y })
  ScrollTrigger.batch(items, {
    start: START.group,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: DUR.m,
        ease: EASE.out,
        stagger: isDesktop ? STAGGER.group : STAGGER.tiles,
        overwrite: true,
      }),
  })
}

/**
 * Image reveals. The clip owner is the [data-motion="image"] element; its first
 * child is the inner layer that carries the internal translation (G6: one
 * owner per property — clip on the outer, transforms on the inner).
 */
function revealImage(media, variant, isDesktop) {
  const layer = media.firstElementChild

  if (variant === 'up') {
    // Service — the photograph RISES out of the dark room's edge (all widths).
    //
    // Service sits flush under Classics (measured 0px at 390–2560), and its
    // plate is section-tall. Any vertical clip whose leading edge sits below
    // the seam leaves an empty strip between the dark stage and the photo (the
    // client rejected a ≤110px one); any clip whose edge IS the seam is fully
    // open. So the mask is the dark stage's own bottom edge — lifting away at
    // scroll speed — and the rise is the photograph's own: the inner layer is
    // never allowed to uncover its plate (top ≤ 0, bottom ≥ plate bottom at
    // every progress), so no background can ever show at the seam.
    const spare = () => Math.max(0, layer.offsetHeight - media.offsetHeight) // 12% oversize, px
    // One timeline, one owner of the layer's transform (G6), over the whole
    // passage of the plate. Release (first 34%): the photograph rises faster
    // than the page — y 0 → -70% of the spare room, scale → 1 from its top
    // edge, so its lower part climbs visibly while its top stays flush with
    // the lifting room. Then it keeps drifting up through the rest of the spare
    // room as Finance arrives. Mobile runs the same passage (no event clip: its
    // from-state blanked the plate under the dark copy block until it fired —
    // measured, a white band at the seam) with a larger settle, since the
    // phone plate has only ~34px of spare room.
    gsap.set(media, { clearProps: 'clipPath' })
    gsap
      .timeline({
        scrollTrigger: {
          trigger: media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: SCRUB.reveal,
          invalidateOnRefresh: true,
          onToggle: (self) => gsap.set(layer, { willChange: self.isActive ? 'transform' : 'auto' }),
        },
      })
      .fromTo(
        layer,
        { y: 0, yPercent: 0, scale: isDesktop ? DIST.serviceLiftScale : DIST.serviceRiseMobile, transformOrigin: '50% 0%' },
        { y: () => -spare() * DIST.serviceRise, scale: 1, duration: P.serviceLift, ease: EASE.settle },
        0,
      )
      .to(layer, { y: () => -spare(), duration: 1 - P.serviceLift, ease: EASE.lift }, P.serviceLift)
    return
  }

  if (variant === 'calm') {
    // Finance: a short edge opening with opacity; the layer eases home.
    gsap
      .timeline({ defaults: { duration: DUR.l, ease: EASE.out }, scrollTrigger: { trigger: media, start: START.image, once: true } })
      .fromTo(media, { clipPath: CLIP.calm, opacity: 0 }, { clipPath: CLIP.open, opacity: 1 }, 0)
      .fromTo(layer, { x: DIST.financeX }, { x: 0 }, 0)
    return
  }

  if (variant === 'down') {
    // About: the inset plate opens downward; the picture settles inside it.
    gsap
      .timeline({ defaults: { duration: DUR.l, ease: EASE.out }, scrollTrigger: { trigger: media, start: START.image, once: true } })
      .fromTo(media, { clipPath: CLIP.down }, { clipPath: CLIP.open }, 0)
      .fromTo(layer, { scale: DIST.aboutScale, transformOrigin: '50% 0%' }, { scale: 1 }, 0)
  }
}
