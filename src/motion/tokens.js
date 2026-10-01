/**
 * Motion tokens — MOTION.md §2. The ONLY source of numbers in src/motion (G4).
 * Event tweens take DUR/EASE; scrubbed tweens are mapped to their scroll range
 * and run on EASE.scrub (the scroll is the easing). Scrubbed timelines are
 * authored in normalised progress (total duration 1), so P.* are fractions of
 * the scroll range, not seconds.
 */

export const DUR = {
  xs: 0.2, // colour/border, reduced crossfades, keyboard fast-swap
  s: 0.35, // exits, outgoing Sell group
  m: 0.6, // support text, cards, CTAs
  l: 0.9, // heading line rises, mobile hero wipe
  xl: 1.2, // image clip reveals, desktop hero wipe
}

export const EASE = {
  stair: 'power2.out',
  out: 'power3.out', // support, cards, CTAs
  expo: 'expo.out', // heading lines only
  in: 'power2.in', // exits (a step faster, accelerating)
  wipe: 'power3.inOut', // rest-to-rest: slide wipe, event image reveals
  scrub: 'none', // every scrubbed tween
  settle: 'power2.out', // exceptions inside a scrub: Classics lines, Service lift-off
  reframe: 'sine.inOut', // Classics photograph: fastest through the pin's middle, where it carries alone
  lift: 'power1.in', // Service drift after the lift-off: starts from rest, no velocity kink
}

export const STAGGER = {
  lines: 0.1,
  linesHero: 0.12,
  linesAbout: 0.16,
  linesMobile: 0.08,
  group: 0.08,
  tiles: 0.06,
  tilesMobile: 0.04,
  reviews: 0.1,
}

export const DIST = {
  // yPercent. Not 100: the mask is padded 0.12em top/bottom for descenders, so a
  // line moved exactly one line box still shows its ascenders/i-dots inside the
  // pad (seen held in the Classics approach). 118 clears the pad at lh 1.0–1.12.
  line: 118,
  // Exits go further: at −118 the outgoing line's descenders still showed in
  // the mask's bottom pad for the rest of the hero wipe (critic #2).
  lineExit: 130,
  support: 20,
  supportMobile: 14,
  cta: 12,
  headingFade: 10, // Reviews heading: fade + small lift, no mask
  card: 24,
  cardMobile: 16,
  review: 16,
  tile: 20,
  exit: 8, // hero outgoing text
  exitGroup: 12, // Sell outgoing group
  sellFrame1: -28, // Sell framing, phase 1
  sellFrame2: -56, // Sell framing, phase 2 (inside the 64px oversize)
  sellFrameMobile: -24,
  sellScaleHold: 1.04,
  sellScale1: 1.02,
  classicsX: 56, // Classics layer start x (client 30–60px) — inside the 64px oversize incl. the 1.03 scale
  classicsScale: 1.03, // ≤1.03, never zoom-only
  classicsMobileX: 24,
  classicsEyebrow: 12,
  classicsBody: 20,
  classicsCta: 16,
  heroIn: 6, // xPercent, incoming image layer
  heroOut: -4, // xPercent, outgoing counter-translate
  heroLead: 16,
  heroLeadLoad: 20,
  serviceRise: 0.7, // desktop: share of the layer's spare room (12% oversize) climbed during the release
  serviceLiftScale: 1.04, // desktop: settles to 1 from its top edge as it rises (bottom climbs ~4%)
  serviceRiseMobile: 1.08, // mobile: scale settle from the top edge (the phone plate has ~34px spare)
  financeX: 24, // Finance layer (32px spare room)
  aboutScale: 1.05, // About inner settle during the downward wipe
}

export const PIN = {
  classics: '+=85%', // client: ~one extra viewport; never below +=80%. 100% left ~450px of near-still after the type (critic #2)
}

export const SCRUB = {
  stage: 0.8,
  reveal: 0.6,
}

/** Staircase text entrance (ordinary sections) — scrubbed to scroll. */
export const STAIR = {
  x: 72, // desktop step-in distance (px)
  xMobile: 32,
  stagger: 0.14, // one "stair" per element
  dur: 0.6,
  start: 'top 92%',
  end: 'top 42%', // fully set by the time the heading is a little above centre
  endMobile: 'top 55%',
  scrub: 0.8,
}

export const START = {
  // Entrances fire as soon as the element is properly in view: at 80% an eyebrow
  // sat above an absent headline for the bottom fifth of the screen (About, lead review).
  heading: 'top 90%',
  headingMobile: 'top 92%',
  group: 'top 92%',
  image: 'top 95%', // Finance / About plates: begin as they enter, finish while they are still low
  sellHeading: 'top 88%', // was 70%: the eyebrow sat over an absent heading as Sell arrived
}

/** Clip-path vocabulary — one per section (MOTION.md §2). Final is always CLIP.open. */
export const CLIP = {
  open: 'inset(0% 0% 0% 0%)',
  sell: 'inset(0% 0% 0% 22%)',
  classics: 'inset(7% 2.5% 7% 2.5% round 2px)',
  classicsOpen: 'inset(0% 0% 0% 0% round 0px)',
  classicsMobile: 'inset(8% 5% 8% 5% round 2px)',
  classicsMobileOpen: 'inset(0% 0% 0% 0% round 0px)',
  up: 'inset(100% 0% 0% 0%)',
  // (Service has no clip at any width: the dark block above is its mask — reveals.js.)
  calm: 'inset(0% 0% 0% 8%)',
  down: 'inset(0% 0% 100% 0%)',
  heroNext: 'inset(0% 0% 0% 100%)',
  heroPrev: 'inset(0% 100% 0% 0%)',
}

/** Progress map for the two scroll chapters (fractions of the scroll range). */
export const P = {
  // Sell (MOTION.md §4.1)
  sellShift1: [0.22, 0.14],
  sellShift2: [0.58, 0.14],
  serviceLift: 0.34, // fraction of Service's 'top bottom'→'bottom top' range that is the lift-off
  sellForward: [0.3, 0.66],
  sellBackward: [0.26, 0.62],
  sellMid: [0.13, 0.47, 0.83],
  // Classics. Line 1 rises in the APPROACH (the pin opens on a composed frame:
  // eyebrow + "American muscle."). Inside the pin the type resolves in three
  // spaced beats — line 2, then the body, then the CTAs — so the middle of the
  // pin is never "type done, nothing happening"; the photograph's reframing is
  // the continuous motion under all of it and alone carries 0.44–0.80.
  eyebrow: [0.62, 0.2], // of the approach
  line1: [0.72, 0.28], // of the approach
  layer: [0, 0.8],
  line2: [0, 0.14],
  body: [0.18, 0.16],
  cta: [0.28, 0.16],
  ctaLive: 0.34,
  ctaSettled: 0.44,
  focusJump: 0.5,
}

/** Hero transition offsets (seconds inside the slide timeline). */
export const HERO = {
  linesAt: 0.45,
  leadAt: 0.57,
  actionsAt: 0.65,
  loadLead: 0.35,
  loadActions: 0.5,
  loadControls: 0.6,
  loadDelay: 0.1,
  fontCap: 300, // ms — never hold the hero longer than this for fonts
  rushScale: 2.5, // an interrupted transition finishes at 2.5x
  swipe: 40, // px, touch/pointer swipe threshold
  dragMin: 10, // px before a press counts as a drag (clicks stay clicks)
  decodeCap: 800, // ms — the wipe waits at most this long for the incoming image to decode
  copyAfterWipe: 0.6, // forward wipes: incoming copy waits until the front has crossed 60% (the copy column is on the left)
}

/** Classics mobile entrance offsets (seconds). */
export const CLASSICS_M = {
  linesAt: 0.1,
  bodyAt: 0.4,
  ctaAt: 0.5,
}

/** Sell swap offsets (seconds). */
export const SWAP = {
  // Measured at 25fps (1440, 600px/s): with the incoming title at 0.12s one frame
  // showed an empty slot. The titles now roll through the same line box — the
  // outgoing one leaving up and fading, the incoming rising from below its mask
  // (invisible for its first ~2 frames) — and the incoming body starts only once
  // the outgoing group is fully gone (0.14s), so two bodies never overlap.
  outDur: 0.14,
  inAt: 0.06,
  bodyAt: 0.15,
  ctaAt: 0.21,
}

export const FONT_CAP = 1000 // ms — below-fold splits wait at most this long for fonts
