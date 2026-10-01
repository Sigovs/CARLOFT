/**
 * hero.js — full-screen photographic slider (lead decision, 2026-09-30:
 * "FULL SCREEN HERO"). Type sits directly on the photograph; readability comes
 * from frame choice, crop and placement, and a localised gradient only where
 * measurement needed one (see `scrim`).
 *
 * Per slide:
 *   tone          'light' = near-white type (dark frame) · 'dark' = charcoal type (pale frame).
 *                 Drives the slide's own copy, and — via .hero[data-tone] — the
 *                 transparent header over the hero.
 *   pos           object-position, landscape (aspect > 1:1 and < 1.85:1)
 *   posWide       object-position, wide (aspect >= 1.85:1)
 *   posNarrow     object-position, narrow landscape (1:1 < aspect <= 3:2 — 4:3 screens); optional
 *   posPortrait   object-position, portrait (aspect <= 1:1 — phones, portrait tablets)
 *   placePortrait 'top' — the eyebrow/headline/lead sit at the top in portrait;
 *                 the actions always sit at the foot of the frame, just above
 *                 the slider controls, on every slide (critic #3).
 *   leadMax       optional landscape lead measure (e.g. '24ch') when the car sits close
 *   (landscape layout, every slide: words top-left; controls bottom-left and the
 *   actions bottom-right on one row — hero.css "landscape distribution")
 *   zoomPortrait  optional portrait overscale, bottom-anchored (default 1). Lifts
 *                 the car out of the actions band on phones without cropping it.
 *   scrim         localised gradients, only where glyph-pixel measurement needed one:
 *                   top: 'landscape' — soft header band (every crop; the name is historical)
 *                   top: 'strong'    — stronger header band, every crop (a bright sky gap under the nav)
 *   image         base path; files exist at -960 / -1600 / -2560 .webp
 *
 * Order (critic #3): open on the bright fog frame, so the page's first read is
 * light like the rest of the page; then the GT2 RS, then the Aston. Each slide
 * points at a different pathway: inventory + sell · inventory + finance ·
 * service + classics ("Sell Your Vehicle" appears once in the first screens).
 *
 * Photographs are temporary (docs/ASSETS.md): replace with the dealer's own.
 */

import { asset } from './asset.js'

export const heroSlides = [
  {
    // Client-supplied hero frame (reference/new hero d.jpg, 2026-09-30):
    // silver Porsche 911 + white Lexus ES on a coastal overlook, clear blue sky.
    // Charcoal type over the sky: headline 6.9:1, lead 10.8:1 (measured on the source).
    id: 'porsche-lexus-coast',
    image: asset('assets/hero-porsche-lexus-coast'),
    widths: [960, 1600, 1920], // source is 1920 wide — never upscaled
    width: 1920,
    height: 1080,
    alt: 'A silver Porsche 911 and a white Lexus ES parked on a coastal overlook under a clear blue sky.',
    tone: 'dark',
    pos: '50% 50%',
    posWide: '50% 50%',
    posPortrait: '20% 50%',
    placePortrait: 'top',
    // Portrait: the Porsche sits between the lead and the bottom actions
    // (measured at 500×900: 17px under the lead, 10px above the actions).
    zoomPortrait: 1.42,
    // Updated frame (17:35): charcoal nav over the sky measures 5.1:1 — no band needed.
    eyebrow: 'Independent dealer',
    lines: ['Good cars.', 'Real people.'],
    lead: 'Used cars across every price range, classic muscle and our own repair shop.',
    actions: [
      { label: 'Explore Inventory', href: '#inventory', variant: 'primary' },
      { label: 'Sell Your Vehicle', href: '#sell', variant: 'secondary' },
    ],
  },
  {
    id: 'gt2rs',
    image: asset('assets/hero-porsche-gt2rs'),
    width: 2560,
    height: 1420,
    alt: 'A silver Porsche 911 GT2 RS parked in front of a dark charcoal brick wall.',
    tone: 'light',
    pos: '60% 50%',
    posWide: '55% 55%',
    posPortrait: '72% 50%',
    placePortrait: 'top',
    // Portrait: the car (y .44–.71) sits between the lead and the actions.
    zoomPortrait: 1.1,
    // Measured: wordmark 3.62:1 (1920) / 3.66:1 (1024) over the pale building, top-left;
    // eyebrow 4.31:1 (390) / 4.41:1 (1024) over window frames → band also in portrait, 0.62.
    scrim: { top: 'landscape' },
    eyebrow: 'Porsche to Toyota',
    lines: ['Everyday cars.', 'Weekend cars.'],
    lead: 'Porsche and Mercedes to Lexus, Honda and Toyota — browse the listings below.',
    actions: [
      { label: 'Explore Inventory', href: '#inventory', variant: 'primary' },
      { label: 'Ask About Financing', href: '#finance', variant: 'secondary' },
    ],
  },
  {
    id: 'aston-vantage',
    image: asset('assets/hero-aston-vantage'),
    width: 2560,
    height: 1440,
    alt: 'A grey Aston Martin Vantage on a tree-lined private drive.',
    tone: 'light',
    // Right-weighted so the CTA row clears the car's rear quarter (1440x900: +64px).
    pos: '10% 50%',
    // Wide screens crop vertically: anchoring higher lowers the car, clear of the larger type.
    posWide: '50% 20%',
    // 4:3 screens: the car filled the text column (lead 3.32:1 at 1024x768) — push the frame right.
    posNarrow: '0% 50%',
    posPortrait: '40% 50%',
    // Portrait: copy over the dark foliage at the top, the car left whole below it.
    placePortrait: 'top',
    zoomPortrait: 1.04,
    // Measured: nav 1.24:1 over the sky gap between the cypresses (1440, 1024); menu 3.5:1 (390).
    // A soft band left 3.50:1 at 1024x768 (the narrow crop puts the gap under the nav) → 'strong'.
    // 'strong' also carries a left band on 4:3 screens and a tall top band in portrait
    // (hero.css): the copy there sits over the same gap.
    scrim: { top: 'strong' },
    eyebrow: 'Service & restoration',
    // Line 2 stays shorter than line 1: past ~x 0.45 it meets the bright sky gap between the cypresses.
    lines: ['Serviced here.', 'Road ready.'],
    lead: 'Repairs, paint and body work, and restoration for daily drivers and classics.',
    actions: [
      { label: 'Our Repair Shop', href: '#service', variant: 'primary' },
      { label: 'Classic Cars', href: '#classics', variant: 'secondary' },
    ],
  },
]

export const heroSrcSet = (s) => (s.widths || [960, 1600, 2560]).map((w) => `${s.image}-${w}.webp ${w}w`).join(', ')
export const heroSrc = (s) => `${s.image}-1600.webp`

/**
 * `sizes` from the frame's own geometry (critic #3 P1): under `cover`, a
 * viewport narrower than the image's aspect renders the image at
 * aspect × viewport HEIGHT, not at 100vw. Portrait adds the per-slide overscale.
 * (A flat `100vw` picked the 960w file for a 1500px-wide render on phones.)
 */
export const heroSizes = (s) => {
  const a = s.width / s.height
  const vh = (k) => `${Math.ceil(a * k * 100)}vh`
  const zp = s.zoomPortrait || 1
  return `(max-aspect-ratio: 1/1) ${vh(zp)}, (max-aspect-ratio: ${s.width}/${s.height}) ${vh(1)}, 100vw`
}
