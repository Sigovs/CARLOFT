/**
 * V2 logo (index_v2.html) — LOGO/CarLoft-business-Logo.pdf (client-supplied).
 * The PDF holds a 1050×600 JPEG (light mark on a dark card, no vector); the
 * asset is that image trimmed, with alpha taken from its luminance, coloured
 * --c-on-dark. Used only on dark grounds (the header tab, the footer).
 * Replace with a vector (SVG) master when the client has one.
 */

import { asset } from '../asset.js'

/**
 * V2.2 (index_v2_2.html, client ticket 2026-11-09: "logo larger, with a shine,
 * the car beside the name"). Alex's vector masters from LOGO/ (2026-11-09):
 * the vertical lock-up (car over name) large before the scroll and in the footer,
 * the horizontal one in the scrolled bar (Alex, 2026-11-09); the name alone only
 * where the horizontal one cannot sit beside the full menu (1024–1279). Used as CSS luminance masks, so the fill
 * is ours (the chrome + the light sweep in v2_2.css) and the black detail lines
 * stay open. Light marks for dark grounds only.
 */
export const logoV22 = {
  horizontal: { src: asset('assets/carloft-logo-horizontal.svg'), width: 1220, height: 255 }, // name left, car right (LOGO/, 2026-11-09 22:00)
  name: { src: asset('assets/carloft-logo-name.svg'), width: 865, height: 255 },
  vertical: { src: asset('assets/carloft-logo-vertical.svg'), width: 600, height: 454 },
}

export const logoLight = {
  src: asset('assets/carloft-logo-light.webp'),
  width: 612,
  height: 466,
}
