/**
 * V2 hero slides (index_v2.html, client feedback 2026-10-29: "too much blue and
 * grey ... we want to see all the cars well lit"). Same shape as hero.js.
 * Photographs are temporary WORK images — provenance in docs/ASSETS.md (V2).
 */

import { asset } from '../asset.js'

export const heroSlidesV2 = [
  {
    // V2 round 4 — AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), composed
    // for this frame: white Porsche 911 lit in a neutral graphite studio, right of the
    // centred headline; studio extended left/bottom, softbox painted out (docs/ASSETS.md).
    id: 'gen-911-white',
    image: asset('assets/hero-gen-911-white'),
    width: 2560,
    height: 1440,
    alt: 'A white Porsche 911 lit in a dark graphite studio (generated placeholder image).',
    tone: 'light',
    pos: '50% 50%',
    posWide: '50% 50%',
    posPortrait: '72% 50%',
    placePortrait: 'top',
    zoomPortrait: 1,
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
    // V2 round 4 — AI-GENERATED placeholder (fal-ai/nano-banana-pro): red Lexus LC 500
    // in a neutral graphite studio, right of the headline; studio extended left/bottom.
    id: 'gen-lexus-red',
    image: asset('assets/hero-gen-lexus-red'),
    width: 2560,
    height: 1440,
    alt: 'A red Lexus LC 500 lit in a dark graphite studio (generated placeholder image).',
    tone: 'light',
    pos: '50% 50%',
    posWide: '50% 50%',
    posPortrait: '72% 50%',
    placePortrait: 'top',
    zoomPortrait: 1,
    eyebrow: 'Service & restoration',
    lines: ['Serviced here.', 'Road ready.'],
    lead: 'Repairs, paint and body work, and restoration for daily drivers and classics.',
    actions: [
      { label: 'Our Repair Shop', href: '#service', variant: 'primary' },
      { label: 'Classic Cars', href: '#classics', variant: 'secondary' },
    ],
  },
]
