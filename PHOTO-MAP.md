# PHOTO MAP — where every photograph lives and how to replace it

All photos are in `public/assets/` as `.webp`. **Paths, sizes, alt text and focal
points are centralised in four data files** — swapping a photo never needs a
component or CSS edit:

| Data file | Controls |
|---|---|
| `src/data/hero.js` | the 3 hero slides |
| `src/data/photos.js` | Sell, Classics, Service, Finance, About |
| `src/data/inventory.js` | the 7 inventory cards |
| `src/data/instagram.js` | the 3 Instagram tiles |

**Focal point** = CSS `object-position` (`"x% y%"`): the part of the photo kept in
view when the frame crops it. `0% 0%` = top-left, `50% 50%` = centre,
`100% 100%` = bottom-right. Each entry has per-breakpoint values.

## How to swap a photo
1. Export the new image as **WebP** (quality ~80) at the widths listed below.
2. Save it in `public/assets/` using the naming pattern in the table (e.g. `name-960.webp`, `name-1600.webp`, `name-2560.webp`).
3. In the data file, change the base name (`image` / `file`), `width`/`height` (the largest file's pixels), `alt`, and adjust the focal points.
4. Delete the old files from `public/assets/`.

---

## Hero slider — `src/data/hero.js`
Frame: **full screen** (100% width × 100% viewport height). Crop ranges from ~2:1 on
wide monitors to ~1:2 portrait on phones.
**Recommended replacement: landscape 16:9–3:2, at least 3200×1800 px** (2560 minimum).
Composition: car whole, **right of centre**; the **left ~42% calm and even**
(plain wall, sky, fog, foliage) for the headline — the text sits directly on the photo.
For phones, the car should also survive a centre crop (it ends up in the middle third).
Files: `name-960.webp`, `name-1600.webp`, `name-2560.webp`.

| Slide | Current file (`image`) | Current source size | Text tone | Focal points (`pos` / `posWide` / `posNarrow` / `posPortrait`) |
|---|---|---|---|---|
| 1 | `hero-porsche-lexus-coast` (widths 960/1600/1920 — source is 1920 wide) | 1920×1080 | dark (charcoal) + light header band | 50% 50% · 50% 50% · — · 20% 50% (+ `zoomPortrait` 1.42) · `compact: true` |
| 2 | `hero-porsche-gt2rs` | 2560×1420 | light (white) | 60% 50% · 55% 55% · — · 72% 50% (+ 1.1) |
| 3 | `hero-aston-vantage` | 2560×1440 | light (white) | 10% 50% · 50% 60% · 0% 50% · 40% 50% (+ 1.04) |

Per slide you also set `tone` (`'light'` = white text for dark photos, `'dark'` =
charcoal for pale photos — also recolours the header over the hero), optional
`scrim` (a soft localised band behind the header/text, only if the new photo needs
it), `placeActions: 'bottom'` (moves the buttons to the foot of the frame when the
car sits too far left) and `placePortrait` (`'top'`). The first slide is also
preloaded in `index.html` — update that `<link rel="preload">` if slide 1's file changes.

## Section photos — `src/data/photos.js`

| Section | Current file | Current size | Frame on page (1440 desktop) | **Recommended replacement** | Focal points now |
|---|---|---|---|---|---|
| Sell / Consign | `sell-porsche-992-rear` (+ `-1000`) | 1800×2250 (4:5) | sticky half-screen, ~1:1 (≈713×720); 4:5 on phones, 3:2 on tablets | **Portrait 4:5, 1800×2250** (min 1440×1800). Strong vehicle detail, subject centred with margin on all sides | mobile 50% 55% · tablet 50% 54% · desktop 50% 58% |
| Classics (dark section) | `classics-camaro-blue` (+ `-960`, `-1600`) | 1920×1080 (16:9), client-supplied | full-width, full-height dark stage; the copy sits on the left wall | **Landscape 16:9, ≥2400×1350.** Dark, low-key; classic muscle car **right of centre**, the **left ~40% near-black** (a plain wall) for white type; nothing bright in the upper-left third | mobile 72% 55% · desktop 0% 0% |
| Service (phase 1 of the merged Service + Finance chapter) | `service-workshop` (+ `-960`) | 1448×1086 (4:3), client-supplied | sticky left plate, 54% × (screen − header) ≈ 770×830 at 1440; 4:3 on phones; image 12% taller than its frame for the scroll drift | **3:2 or 4:3, ≥2400×1600.** Genuine workshop/lift/paint/body | mobile 50% 50% · desktop 56% 50% |
| Finance (phase 2 — wipes up over the Service photo on scroll) | `finance-mercedes-interior` (+ `-960`) | 1448×1086 (4:3), client-supplied | the SAME sticky left plate as Service (≈770×830 at 1440); 4:3 on phones | **3:2 or 4:3, ≥2400×1600.** Restrained interior/detail — no handshakes/cash/cards | mobile 45% 50% · desktop 40% 45% |
| About | `about-coast-road` (+ `-1200`) | 2200×1238 (16:9) | FULL SCREEN (100% × viewport height) with a white text panel bottom-right; phones: 72% of the screen, panel below | **Landscape 16:9, ≥2560×1440.** Subject on the LEFT half (the panel covers the lower right) | mobile 22% 50% · desktop 22% 50% |
| Footer (dark, background) | `footer-night-street` (`-1200`, `-2400`) | 2400×1600 (3:2) | full footer width × ~720px (desktop) / ~1060px (phones); a graphite scrim deepens towards the text | **Landscape 3:2 or 16:9, ≥2400 wide.** Dark / night / atmospheric; interest in the upper half (the text sits over the lower part); no readable signage or logos | mobile 50% 70% · desktop 50% 62% |

Files: base name = largest file (e.g. `sell-porsche-992-rear.webp`), smaller
variants suffixed with their width (`sell-porsche-992-rear-1000.webp`); list the
widths in `variants`.

## Inventory cards — `src/data/inventory.js`
Frame: **16:10** cards (3 across on desktop); the vehicle dialog uses **3:2**.
**Recommended replacement: 3:2 landscape, 1600×1067** (min 1200×800), consistent
3/4-front angle and a consistent, uncluttered background across all cars.
Per car: `image` (base name) and `objectPosition`.

| Card | Current file |
|---|---|
| Porsche 911 Carrera S | `inv-porsche-911.webp` |
| Lexus ES 300h | `inv-lexus-es.webp` |
| Honda CR-V | `inv-honda-crv.webp` |
| Mercedes-AMG GT R | `inv-mercedes-amg-gt.webp` |
| Toyota GR Corolla | `inv-toyota-gr-corolla.webp` |
| Mercedes-Benz E 300 | `inv-mercedes-e300.webp` |
| Toyota 4Runner | `inv-toyota-4runner.webp` |

## Instagram tiles — `src/data/instagram.js`
Frame: **square 1:1**. **Recommended replacement: 1080×1080** (min 900×900).

| Tile | Current file |
|---|---|
| 1 | `ig-gt3rs.webp` |
| 2 | `ig-engine.webp` |
| 3 | `ig-cutlass.webp` |

---
Provenance of every current photo (sources in WORK, processing, known issues) is in
`docs/ASSETS.md`. All current photos are temporary mockup images; the Classics photo
is likely AI-generated and is the first one to replace.
