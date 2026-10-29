/**
 * V2 section photographs (index_v2.html). Same shape as photos.js — every car lit
 * and dominant, no blue-cast grounds (client, 2026-10-29). Temporary WORK images.
 */

export const photosV2 = {
  sell: {
    // V2 round 4 — AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), composed for this frame:
    // yellow Toyota GR Supra, whole, with air on every side, neutral graphite studio.
    file: 'sell-gen-supra',
    variants: [1000, 2048],
    width: 2048,
    height: 2048,
    alt: 'A yellow Toyota GR Supra lit in a dark graphite studio (generated placeholder image).',
    sizes: '(min-width: 1024px) calc(50vw + 64px), (min-width: 768px) calc(100vw + 64px), 100vw',
    focus: { mobile: '42% 55%', tablet: '42% 55%', desktop: '42% 55%' },
  },
  // Sell & Consign, one photograph per step — they swap with the scroll phase
  // (01 Overview = `sell` above · 02 Sell · 03 Consign). AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), same graphite studio.
  sellPhases: [
    null, // phase 0 uses `sell`
    {
      file: 'sell-gen-key-cayenne',
      variants: [1000, 2048],
      width: 2048,
      height: 2048,
      alt: 'A hand holding out a car key in front of a white Porsche Cayenne in a dark studio (generated placeholder image).',
      sizes: '(min-width: 1024px) calc(50vw + 64px), (min-width: 768px) calc(100vw + 64px), 100vw',
      focus: { mobile: '50% 55%', tablet: '50% 55%', desktop: '50% 55%' },
    },
    {
      file: 'sell-gen-consign-shoot',
      variants: [1000, 2048],
      width: 2048,
      height: 2048,
      alt: 'A red Mercedes-AMG GT on a turntable being photographed in a dark studio (generated placeholder image).',
      sizes: '(min-width: 1024px) calc(50vw + 64px), (min-width: 768px) calc(100vw + 64px), 100vw',
      focus: { mobile: '58% 55%', tablet: '58% 55%', desktop: '58% 55%' },
    },
  ],
  classics: {
    // V2 round 4 — AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), composed for this frame:
    // 1969 Camaro SS, whole and front-lit, right of centre; calm wall above (heading),
    // open floor below-left (body + actions). Neutral concrete, no brown, no blue.
    file: 'classics-gen-camaro',
    variants: [960, 1600, 2752],
    width: 2752,
    height: 1290, // ceiling strip cropped off
    alt: 'An orange 1969 Chevrolet Camaro SS in a minimal concrete garage (generated placeholder image).',
    sizes: 'calc(100vw + 64px)',
    focus: { mobile: '62% 60%', desktop: '50% 50%' },
  },
  service: {
    // V2 round 7 — AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), same graphite studio as Sell:
    // silver Mercedes-Benz E-Class on a graphite two-post lift, dark minimal workshop.
    file: 'service-gen-lift-dark',
    variants: [1000, 2048],
    width: 2048,
    height: 2048,
    alt: 'A silver Mercedes-Benz sedan on a lift in a dark, minimal workshop (generated placeholder image).',
    sizes: '(min-width: 768px) 54vw, 100vw',
    focus: { mobile: '45% 55%', desktop: '45% 55%' },
  },
  finance: {
    // V2 round 7 — AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), same graphite studio as Sell:
    // black leather cockpit seen from the open door, neutral softbox light (no tan / cream).
    file: 'finance-gen-cockpit',
    variants: [1000, 2048],
    width: 2048,
    height: 2048,
    alt: 'The black leather cockpit of a sports car seen through the open door (generated placeholder image).',
    sizes: '(min-width: 768px) 54vw, 100vw', // same plate as Service (merged chapter)
    focus: { mobile: '58% 55%', desktop: '58% 55%' },
  },
  about: {
    // V2 round 4 — AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), composed for this frame:
    // white Toyota Land Cruiser in the left third, plain concrete architecture on the
    // right under the panel; overcast neutral light.
    file: 'about-gen-landcruiser',
    variants: [1200, 2752],
    width: 2752,
    height: 1536,
    alt: 'A white Toyota Land Cruiser parked beside a minimal concrete building (generated placeholder image).',
    sizes: '100vw',
    focus: { mobile: '20% 55%', desktop: '0% 55%' },
  },
  footer: {
    // V2 round 4 — AI-GENERATED placeholder (fal-ai/nano-banana-pro, 2026-10-29), composed for this frame:
    // a dark collector showroom, five cars in a row across the band. Decorative (alt empty).
    file: 'footer-gen-showroom',
    variants: [1200, 3168],
    suffixLargest: true, // files: footer-gen-showroom-1200 / -3168
    width: 3168,
    height: 1050, // dark wall continued 14% each side
    alt: '',
    sizes: '100vw',
    focus: { mobile: '50% 100%', desktop: '50% 100%' }, // the car row rides up, clear of the link columns
  },

}
