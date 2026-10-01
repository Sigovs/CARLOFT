# Functional and responsive verification

Date: 2026-09-30 · Dev server `http://localhost:5190` · Playwright (Chromium, headed, classic 15px scrollbar, so layout width = viewport − 15). Native scroll, motion ON (`reducedMotion: 'no-preference'`) except item 8. No source files were edited.

Viewports: 1440×900, 1024×768, 768×1024, 390×844, 360×740.

## Results

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Console clean; no horizontal overflow | **PASS** | 0 errors/warnings (page listener + MCP log) on load, on a full scroll down and back at every size, after a resize cycle 1440→360→1440 without a reload, and during every test below. `scrollWidth == clientWidth` at every scroll step at all five sizes; no element sticks out past the viewport. The only console output is React's DevTools info line. (Older `RangeError: Maximum call stack … Context.getTweens` entries in the MCP log come from an earlier session with a different dependency hash, `v=828a9313`. They did not reproduce.) |
| 2a | Header: sticky, constant height | **PASS** | Top stays at 0 and height stays 72px at 1440 and 1024 at every scroll position. At ≤1023 the height is 64px and constant (a mobile token, not a change during scroll). |
| 2b | Header state sequence | **PASS** | 1440: `top`@0 → `scrolled`@750 (after the hero) → `dark`@3150 (Classics under the header) → `scrolled`@4950 (Service). Same order at 1024, 768 and 390. It returns to `top` after scrolling back. |
| 2c | Nav links land their headings | **PASS** | 1440/1024/768/390, for #inventory, #sell, #classics, #service, #finance and #about: every h2 is fully visible below the header (1440 h2 tops: 165, 285, 120, 196, 266, 238). #classics lands at the pin start with the header dark and the h2 at 120. At 390 the Sell h2 sits at 620, because the image comes first; it is visible but low. |
| 2d | Mobile menu | **PASS** | The button toggles aria-expanded and the Menu/Close label. Focus moves to the first link. Tab is trapped (links → Close → links). Escape closes the menu and returns focus to the button. Body scroll is locked while open. A link click closes the menu and navigates. Resizing to ≥1024 while open closes it (focus then falls to `<body>`, see P3-4). |
| 3a | Hero next/prev, counter | **PASS** | There are 2 slides. The counter reads `01 / 02` ↔ `02 / 02` and matches `data-active`. |
| 3b | Arrow keys | **PASS** | With focus in the hero, ArrowRight and ArrowLeft change the slide. |
| 3c | Inactive slide inert | **PASS** | The inactive copy is `inert`, `aria-hidden` and `visibility:hidden`. 0 of 2 of its links can take focus. |
| 3d | Rapid clicks settle | **PASS** | 9 clicks 40ms apart, then 7 alternating clicks 90ms apart. Each run settles to exactly one `.is-active` copy and one media, with 0 `.is-leaving` and no inline clip-path on any slide after 2s. Some clicks are coalesced by design (queue of one). |
| 3e | Touch swipe at 390 | **FAIL** | A real touch swipe (CDP `Input.dispatchTouchEvent`, touch emulation) does not change the slide: Chrome fires `pointercancel` after the first move because `.hero__plate` has `touch-action: auto`. A mouse drag also fails: the `<img>` starts a native drag and no `pointerup` arrives. Synthetic PointerEvents do switch the slide, so the Observer logic works and the fault is CSS/DOM. → P2-1 |
| 4a | Selects filter; Make→Model | **PASS** | Toyota gives 2 results and limits Model to 4Runner and GR Corolla. Toyota + GR Corolla gives 1. Switching the make to Porsche clears the invalid model. ≤$20k gives 3; ≤$20k + SUV gives 2; ≤$20k + Coupe gives 0. |
| 4b | Count text (aria-live) | **PASS** | `p.featured__count[aria-live=polite]` updates on every change: "Showing N of 7 illustrative listings", and in the empty case "…0 of 7 — no match for these filters". |
| 4c | Empty state + reset | **PASS** | The empty state renders with a Clear Filters button. Clearing resets all 4 selects, the query string and the default 3 cards. |
| 4d | Show all | **PASS** | Toggles 3 ↔ 7 cards, with aria-expanded true/false and the label switching to "Show Fewer". |
| 4e | Vehicle dialog | **PASS** | Enter on the card button opens a modal `<dialog>` with focus on Close. Escape, the Close button and a backdrop click each close it, with focus returning to the originating card button. Clicking the card image also opens it (the stretched `::after` covers the card). "Ask About This Car" closes the dialog and routes to `#contact?topic=car&id=p911`, which shows "You asked about: Porsche 911 Carrera S". Background page scroll is not locked while the dialog is open (P3-3). |
| 4f | Card keyboard access | **PASS** | One tab stop per card (`button.card__open`), `:focus-visible` true, and the card shows its focus-within outline. |
| 4g | URL query sync | **PASS** | `?make=Toyota&model=GR+Corolla` etc. are written with replaceState. Reloading `?body=Sedan&make=Mercedes-Benz` restores the selects and results. An invalid `?make=Toyota&model=911` drops the model. |
| 4h | Search scrolls results under the header | **PASS** | "Search Vehicles" scrolls to #inventory (section top 72, the grid fully inside the 900 viewport) and focuses the count. |
| 5a | Sell 1440: one active group | **PASS** | Stepping 60px through the whole staged range (−400 … +1620), exactly one `.sell__group[data-active]` at every step, with the phases in order 0 → 1 → 2. 0 violations. |
| 5b | Only the active CTA is clickable | **PASS** | At every step, `elementFromPoint` on each CTA centre hits the CTA only when its group is active (sampled `-- / H- / -H`). |
| 5c | Index buttons jump phases | **PASS** | 03 → y2167 (phase 2), 02 → y1882 (phase 1), 01 → y1613 (phase 0), each with the matching `aria-current="step"`. |
| 5d | Keyboard through Sell | **PASS** | Tab from the inventory cards goes to Sell Your Vehicle (scrolled to phase 1, group opacity 1, hit-testable), then Learn About Consignment (phase 2, same), then the index 01/02/03, then out to Classics. Shift+Tab reverses correctly. |
| 5e | Sell at 390 / 768 | **PASS** | Not staged, stage `position: static`, all 3 groups at opacity 1 and visible, the index hidden. |
| 6a | Classics pin | **PASS** | 1440: one `.pin-spacer`, 1800px tall (2 × 900). 1024: 1536px (2 × 768). |
| 6b | CTAs during the pin | **PASS** | Both CTAs are always in the DOM. Opacity by progress: 0.20 → 0.24 (not hit), 0.22 → 0.37 (hit), 0.25 → 0.56 (hit), 0.30 → 0.87, and 1.0 from 0.40 on. Clickable from about 0.22. Same at 1024. |
| 6c | Keyboard focus on a Classics CTA | **PASS** | Focusing Ask About Classics from before the pin scrolls to y3562. The CTA row, heading and body are all at opacity 1 and the CTA hit-tests. |
| 6d | Classics at 390 | **PASS** | No pin-spacer; the image block sits above the text. |
| 7a | No dead links or buttons | **PASS** | 31 `<a>`: none use `href="#"` or an empty href; every in-page target exists. 11 `<button>`: every one has a React onClick, is `type=submit`, or is a Sell index button with a delegated listener. |
| 7b | `#contact?topic=…` | **PASS** | sell, consign, classics, service, finance, visit and car each scroll to #contact, focus it, and show `.footer__topic[role=status]` "You asked about: <label>". A direct load of `/#contact?topic=finance` works too. |
| 8 | Reduced motion | **PASS** | 0 `.pin-spacer`, 0 `.is-staged`. No text, heading, image, link or button in main or footer has effective opacity < 0.99 or `visibility:hidden` (excluding the inert hero slide). No inline transform, opacity or clip-path on any heading or element. Hero next is an instant swap with no `.is-leaving`. Screenshot: `docs/screens/reduced-1440.png` (1425×6597, all content visible). |
| 9a | Tap targets ≥ 44 at 390 | **PASS with exceptions** | `button.card__open` is 171×23, but it is a stretched button whose `::after` covers the whole 335×347 card, so the target passes. The footer link "Sell" is **23×44**, narrower than 44 (P3-1). Everything else is ≥ 44×44. |
| 9b | Text ≥ 14px at 390 | **PASS** | No visible text node below 14px. |
| 10 | Resize robustness | **PASS** | At 1440, scrolled to the middle of Sell (y1978, progress 0.55, phase 1). At 390: still in #sell, unstaged, all groups opacity 1, 0 pins. Back at 1440: y1978, still #sell, progress 0.55, restaged with phase 1 active, `.pin-spacer` count = 1 (1800px). 0 console messages. After scrolling through the page at each size, no `.line-mask` has a clipped or escaped line (18 masks at 1440, 17 at 390). The one reported case is the inactive "Sell Your Vehicle" title parked above its mask by design. |
| 11 | Performance sanity | **PASS (note)** | LCP is the hero slide-1 `<img>` (`hero-porsche-992-desert-1600.webp`, fetchpriority high, eager) at about 176ms on localhost with cache disabled. Initial image transfer is 951 KB across 6 images: hero-1600 143 KB, **hero-mercedes-w111 342 KB (slide 2, hidden)**, 3 inventory cards 84, 104 and 106 KB, sell 173 KB. Total transfer is 6.1 MB, mostly unbundled Vite dev modules; this is not representative of production. All 12 below-fold images are `loading="lazy"`. Classics, service, finance, about and IG are not fetched at load. |

## Defects

**P1:** none.

**P2-1: Hero swipe does not work on real touch, or with a mouse drag.** Files: `src/styles/hero.css` (`.hero__plate`) and `src/components/Hero.jsx` (plate `<img>`). With `touch-action: auto`, Chrome claims the gesture and cancels the pointer stream (`pointercancel` after one `pointermove`), so the GSAP Observer `onRelease` in `src/motion/useHeroMotion.js` never sees a 40px dx. Fix: add `touch-action: pan-y` on `.hero__plate`. For mouse drags, add `draggable={false}` on the slide `<img>` (or `-webkit-user-drag: none; user-select: none` on the plate). Verified with CDP touch emulation. Synthetic pointer events do switch the slide, so the Observer logic is fine.

**P3-1: Footer link "Sell" tap target is 23×44 at 390** (`src/styles/tail.css`, footer links). Give `.footer__link` a `min-width: 44px` or inline padding.

**P3-2: Hidden slide-2 hero image loads eagerly, 342 KB, with no small variant** (`src/data/hero.js`, `src/components/Hero.jsx`). It is `loading="lazy"`, but it shares the viewport box so the browser fetches it at once, and it has no `imageSmall` srcset entry (slide 1 has a 1600w variant). Add a 1600w variant, and optionally defer its `src` until first interaction or idle.

**P3-3: Page scroll is not locked while the vehicle dialog is open** (`src/components/VehicleDialog.jsx`). Consider `html:has(dialog[open]) { overflow: hidden }` or toggling the existing `is-locked` class.

**P3-4: Resizing to ≥1024 with the mobile menu open drops focus to `<body>`** (`src/components/Header.jsx`, the onResize path). Return focus to the wordmark or the first desktop nav link.

**Note (not a defect):** the header is 64px below 1024 and 72px at 1024 and above. It is constant within each viewport. If the brief requires 72 everywhere, it is `--header-h` in `src/styles/tokens.css` / `header.css`.

## Screenshots (`docs/screens/`)
- `final-1440-full.png`: full page, motion on, after a slow scroll-through. As expected for a fullPage capture, the Classics pin renders in its scroll-0 state (copy not visible, a large empty band) and Sell shows phase 0, so viewport shots follow.
- `final-1440-hero.png`, `final-1440-sell-overview.png`, `final-1440-sell-sell.png`, `final-1440-sell-consign.png`, `final-1440-classics.png`: viewport shots of the key sections.
- `final-390-full.png`, `final-390-hero.png`, `final-390-classics.png`
- `reduced-1440.png`: full page with reduced motion.
- `verify-hero-1440-after-rapid.png`, `verify-resize-back-1440-sell.png`: evidence shots.

Browser state was restored at the end (`reducedMotion: 'no-preference'`, 1440×900). The tests ran in a separate tab (tab 1), because tab 0 of the Playwright browser was navigated to an unrelated Google search mid-session. Tab 0 was left untouched.
