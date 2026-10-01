/**
 * instagram.js — three temporary tiles (BRIEF §14.11, §16).
 * Photographs are placeholders from other WORK projects (docs/ASSETS.md) and
 * must be replaced by the dealer's own posts. Tiles link to
 * `brand.instagramUrl` only once it exists.
 */

import { asset } from './asset.js'

export const instagramTiles = [
  {
    id: 'ig-gt3rs',
    src: asset('assets/ig-gt3rs.webp'),
    alt: 'A silver Porsche 911 GT3 RS parked beside a concrete building.',
    caption: 'Arrival',
  },
  {
    id: 'ig-engine',
    src: asset('assets/ig-engine.webp'),
    alt: 'A detailed V8 engine bay with a chrome air cleaner.',
    caption: 'In the shop',
  },
  {
    id: 'ig-cutlass',
    src: asset('assets/ig-cutlass.webp'),
    alt: 'Front corner of a gold classic Oldsmobile Cutlass with quad headlights.',
    caption: 'Classic',
  },
]
