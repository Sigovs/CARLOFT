/**
 * V2 logo (index_v2.html) — LOGO/CarLoft-business-Logo.pdf (client-supplied).
 * The PDF holds a 1050×600 JPEG (light mark on a dark card, no vector); the
 * asset is that image trimmed, with alpha taken from its luminance, coloured
 * --c-on-dark. Used only on dark grounds (the header tab, the footer).
 * Replace with a vector (SVG) master when the client has one.
 */

import { asset } from '../asset.js'

export const logoLight = {
  src: asset('assets/carloft-logo-light.webp'),
  width: 612,
  height: 466,
}
