/**
 * photos.js — one place to swap the section photographs (see PHOTO-MAP.md).
 *
 * To replace a photo: drop the new files in public/assets/, then edit the entry
 * below — `file` (base name, no extension), `variants` (the widths you exported,
 * largest last), `width`/`height` (pixel size of the largest file), `alt`, and
 * `focus` (CSS object-position per breakpoint: which part of the photo stays in
 * view when the frame crops it). Nothing else needs to change.
 *
 * Hero slides live in hero.js, inventory photos in inventory.js, Instagram tiles
 * in instagram.js — same idea, same folder.
 *
 * Focus keys: `mobile` (<768px) · `tablet` (768–1023px, Sell only) · `desktop`
 * (≥1024px for Sell and Classics; ≥768px for Service, Finance and About).
 * A missing key falls back to the stylesheet's own value.
 */

import { asset } from './asset.js'

export const photos = {
  sell: {
    file: 'sell-porsche-992-rear',
    variants: [1000, 1800], // largest = the base file name without a suffix
    width: 1800,
    height: 2250,
    alt: 'The rear of a dark grey Porsche 911 with its full-width light bar lit, in a concrete parking structure.',
    sizes: '(min-width: 1024px) calc(50vw + 64px), (min-width: 768px) calc(100vw + 64px), 100vw',
    focus: { mobile: '50% 55%', tablet: '50% 54%', desktop: '50% 58%' },
  },
  classics: {
    // Client-supplied (reference/muscle.jpg, updated 2026-09-30): the wider frame —
    // dark blue 1969 Camaro, two technicians, dim industrial workshop. Near-black
    // wall on the left (luminance ≤ 0.05 between 25% and 50% of the height).
    file: 'classics-camaro-blue',
    variants: [960, 1600, 1884],
    width: 1884,
    height: 1114,
    alt: 'Two technicians working on a dark blue 1969 Chevrolet Camaro in a dim industrial workshop.',
    sizes: 'calc(100vw + 64px)',
    focus: { mobile: '68% 60%', desktop: '100% 100%' },
  },
  service: {
    // Client-supplied (reference/service.png, 2026-09-30): bright workshop, silver
    // Mercedes on a two-post lift, technician underneath. 1448×1086 (4:3).
    file: 'service-workshop',
    variants: [960, 1448],
    width: 1448,
    height: 1086,
    alt: 'A technician inspecting the underside of a silver Mercedes-Benz raised on a two-post lift in a bright workshop.',
    sizes: '(min-width: 768px) 54vw, 100vw',
    focus: { mobile: '50% 50%', desktop: '56% 50%' },
  },
  finance: {
    // Client-supplied (reference/finance.png, 2026-09-30): Mercedes E-Class cabin,
    // cream leather, sea view through the windscreen. 1448×1086 (4:3).
    file: 'finance-mercedes-interior',
    variants: [960, 1448],
    width: 1448,
    height: 1086,
    alt: 'The cream leather interior and steering wheel of a Mercedes-Benz, with a coastal view through the windscreen.',
    sizes: '(min-width: 768px) 54vw, 100vw', // same plate as Service (merged chapter)
    focus: { mobile: '45% 50%', desktop: '40% 45%' },
  },
  about: {
    // Client-supplied (reference/About.png, 2026-09-30): mountain road at golden
    // hour, one car low-left — clear of the white panel (bottom-right). 1990×1107.
    file: 'about-mountain-road',
    variants: [1200, 1990],
    width: 1990,
    height: 1107,
    alt: 'A car on a winding mountain road through golden hills at sunset.',
    sizes: '100vw',
    focus: { mobile: '28% 70%', desktop: '30% 60%' },
  },
  footer: {
    // Decorative background behind the dark footer (alt stays empty).
    file: 'footer-night-street',
    variants: [1200, 2400],
    suffixLargest: true, // files: footer-night-street-1200 / -2400
    width: 2400,
    height: 1600,
    alt: '',
    sizes: '100vw',
    focus: { mobile: '50% 70%', desktop: '50% 62%' },
  },
}

const url = (p, w) =>
  w === p.variants[p.variants.length - 1] && !p.suffixLargest ? asset(`assets/${p.file}.webp`) : asset(`assets/${p.file}-${w}.webp`)

/** Props for an <img>: src, srcSet, sizes, width, height, alt, and focus vars. */
export const photoProps = (p) => ({
  src: url(p, p.variants[p.variants.length - 1]),
  srcSet: p.variants.map((w) => `${url(p, w)} ${w}w`).join(', '),
  sizes: p.sizes,
  width: p.width,
  height: p.height,
  alt: p.alt,
  style: {
    ...(p.focus.mobile && { '--focus-m': p.focus.mobile }),
    ...(p.focus.tablet && { '--focus-t': p.focus.tablet }),
    ...(p.focus.desktop && { '--focus-d': p.focus.desktop }),
  },
})
