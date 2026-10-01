# MOTION — Dealership Homepage

Motion architecture, written before implementation. Owner: motion-designer #1.
Resolved from `/Users/alex/Desktop/WORK/design_dna/TASTE.md` (canonical Mac path) +
`.claude/rules/design-dna.md`; skills loaded: `motion-judgment`, `motion-taste`,
`gsap-implementation`, `gsap-skills:gsap-scrolltrigger`, `genjutsu:cast` (thesis only).

Composition, section heights, palette and type are `BRIEF.md` (art-director). Where this
file needs a height it states the **motion minimum**; BRIEF wins on everything static.
APIs below were verified against `node_modules/gsap` **3.15.0** (see §6.8).

**Stack yield, recorded:** no Lenis, no ScrollSmoother (`DNA90` yielded by explicit client
direction, per project `CLAUDE.md`). Native scroll; weight comes from `scrub` and easing.

---

## 1. Motion Read / Plan

```
Subject          Cars for sale, a consignment/sell service, classic muscle, a workshop. Not
                 temporal; presented at a heightened register only in two chapters.
Journey          Arrive → see cars + both primary routes → search/browse → learn you can sell
                 or consign → the Classics chapter → service → finance → trust → follow.
Static verdict   Yes. reff1 is the static page and stands alone (MJ5). Every motion state
                 below resolves to that composition; no-JS and reduced-motion ARE reff1.
Time adds        (1) Sell/Consign: one image, three successive offers — sequence is meaning.
                 (2) Classics: the white page gives way to a dark room — contrast as event.
                 (3) Hero: switching between vehicles (state change with direction).
Register         Heightened in Sell + Classics only — cause: the brief makes them the two
                 editorial chapters of a practical dealer page. Ordinary everywhere else.
Primary idea     Per viewport, one: hero = slide wipe; Sell = the active group swap over a
                 still-anchored image; Classics = stage opening then type rising; Service =
                 upward image wipe. Nothing else in those viewports competes.
Stable           Header height and position, search bar, form controls, prices/specs text,
                 footer, all nav. No element moves while being read (DM9).
Roles            Heading line-mask → hierarchy · support-text follow → hierarchy ·
                 image clip reveals → narrative progression · Sell sequence → narrative
                 progression · Classics sequence → subject expression · header states →
                 orientation · hero slider → state change · hover → feedback.
Transport        The reader. Scroll is native; nothing snaps; slider is manual.
Learning         Nothing. Sell phases are named by an always-visible index (01/02/03) that is
                 also a skip control; Classics CTAs reachable by keyboard at any progress.
Mobile           Re-authored: no pin, no sticky, stacked sections, shorter reveals.
Reduced motion   Authored still = reff1: everything visible, final framings, no scrub/pin.
Cost             ~180vh of Sell scroll and +100vh Classics pin; clip-path repaint on 1 image
                 at a time; one SplitText pass per heading; ~1.1s hero entrance.
Cut              Lenis/ScrollSmoother (client) · hero exit parallax (generic, competes with
                 header state) · Ken Burns on hero (brief) · autoplay slider · Classics
                 release drift (would compete with Service wipe in the same viewport) ·
                 Flip on inventory filtering (a 0.2s crossfade says enough) · search-bar
                 entrance (a primary control must never be hidden) · footer reveal (the
                 ending stops, DNA30) · CustomEase (the stock family covers every beat) ·
                 char/word splits (lines only; text is a material, not confetti) · snap.
```

**Interaction thesis (genjutsu stage 4, not implemented here):** *A bright, practical page
whose headings rise through clean line masks and whose photographs open through
direction-aware clip reveals, gathering into two authored scroll chapters — a sticky Sell
stage where one image holds while three offers take turns, and a pinned Classics stage where
the white page opens into a dark room and the type arrives — with every stoppable frame
readable and the reduced-motion still identical to the approved reference.*

**Signature candidate (art-director owns `DNA37`):** the Classics door — a dark framed
picture sitting *inside* the white page opens to full-bleed as it arrives, and the header
joins the room (goes graphite with it) rather than cutting across it. On release, the next
photograph wipes upward out of the dark edge.

**Intensity curve** (0 = still, 5 = peak). Two adjacent equal values are allowed only where
the device differs.

| header | hero | search | inventory | sell | classics | service | finance | about | reviews | insta | footer |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 0 | 1 | 4 | **5** | 3 | 2 | 2 | 1 | 1 | 0 |

Rests on purpose: search (0) before inventory, finance/about (2) after the two chapters,
reviews/insta (1) and a still footer — the page lands quietly (`DNA30`).

---

## 2. Motion tokens — `src/motion/tokens.js` (the only source of numbers, `G4`)

| Token | Value | Used for |
|---|---|---|
| `DUR.xs` | 0.2s | colour/border hover, reduced-motion crossfades |
| `DUR.s` | 0.35s | exits, hover transforms, header state, Sell outgoing group |
| `DUR.m` | 0.6s | support text, cards, CTAs, Sell incoming body |
| `DUR.l` | 0.9s | heading line rises, hero mobile wipe |
| `DUR.xl` | 1.2s | image clip reveals, hero desktop wipe |
| `EASE.out` | `power3.out` | support text, cards, CTAs (CSS: `cubic-bezier(.215,.61,.355,1)`) |
| `EASE.expo` | `expo.out` | heading lines only — fast start, long settle (CSS: `cubic-bezier(.16,1,.3,1)`) |
| `EASE.in` | `power2.in` | exits (motion-taste I3: exits a step faster, accelerating) |
| `EASE.wipe` | `power3.inOut` | rest-to-rest movements: slide wipe, event image reveals |
| `EASE.scrub` | `none` | every scrubbed tween (scroll is the easing, `G4`) |
| `EASE.settle` | `power2.out` | the only exception inside scrubs: Classics heading lines (weight on landing) |
| `STAGGER.lines` | 0.10 (hero 0.12, about 0.16, mobile 0.08) | line masks |
| `STAGGER.group` | 0.08 | cards, service items, Sell body→CTA |
| `STAGGER.tiles` | 0.06 | instagram, reviews |
| `DIST.line` | `yPercent: 100` (exit `-100`) | line masks |
| `DIST.support` | 20px desktop / 14px mobile | paragraphs, eyebrows |
| `DIST.cta` | 12px | buttons, links |
| `DIST.card` | 24px | inventory cards |
| `DIST.frame` | 24–56px, scale ≤ 1.04 | internal image translation (never beyond oversize) |
| `SCRUB.stage` | 0.8 | Sell framing, Classics pin |
| `SCRUB.reveal` | 0.6 | approach reveals, Service parallax |
| `START.heading` | `"top 90%"` | line masks (mobile `"top 92%"`) — at 80% an eyebrow sat over an absent headline |
| `START.group` | `"top 92%"` | groups, cards |
| `START.image` | `"top 95%"` | Finance / About plate reveals (0.9s `EASE.out`, front-loaded) |
| `START.sellHeading` | `"top 88%"` | Sell H2 (was 70%: heading absent as Sell arrived) |
| `DIST.line` / `DIST.lineExit` | 118 / 130 yPercent | line rise / line exit (130 clears the mask pad — no descender sliver) |
| `PIN.classics` | `"+=85%"` | Classics pin length (client: ~one extra viewport, never below 80%) |

Clip-path inset vocabulary (each section uses a different one — that is the variation):
Sell `inset(0 0 0 22%)` → from the right edge inward · Classics `inset(7% 2.5% round 2px)` →
symmetric opening · Service: no clip — the dark stage's bottom edge is its mask, the photograph rises inside its plate · Finance `inset(0 0 0 8%)` +
opacity (calm) · About `inset(0 0 100% 0)` → downward · Hero slides `inset(0 0 0 100%)` /
`inset(0 100% 0 0)` by direction. Final state always `inset(0% 0% 0% 0%)` (units match for tweening).

Descender safety: SplitText gives masks the class `line-mask` with inline `overflow: clip`.
CSS: `.line-mask { padding-block: .12em; margin-block: -.12em; }` so `g y p ,` never clip.

---

## 3. Section by section

Desktop = `isDesktop` (≥1024, no-preference). "Mobile" = `isMobile` (≤1023; 768–1023 tablets
share the mobile motion branch, CSS handles their layout). Reduced = `reduce` at any width.
All entrances `once: true` (no replay on scroll-up → no flicker when scrolling back).

| Section | What moves | Trigger | Type | Duration / distance | Handoff into next | Mobile | Reduced |
|---|---|---|---|---|---|---|---|
| **Header** | bg/border/colour only (CSS transitions, `DUR.s`); JS toggles `data-header="top\|scrolled\|dark"` | `scrolled`: hero `bottom top+=H` (H = header height). `dark`: owned by Classics hook, section `top top+=H` → `bottom top+=H` | toggle | 0.35s | Becomes the Classics room (§4.3) | same | same states, 0s |
| **Hero** | load: headline lines → copy → actions → controls; slider (§5) | load (after fonts, ≤300ms cap) | entrance + state change | ≤1.2s total | none on scroll — the header gaining its hairline marks leaving | same; wipe 0.9s; swipe | instant swap; all visible |
| **Search** | nothing | — | static | — | the still bar is the rest before inventory | — | — |
| **Inventory** | H2 line mask; "View all" link y 12; cards y 24 + opacity, stagger 0.08; results change = 0.2s opacity crossfade + `ScrollTrigger.refresh()` | H2 `top 80%`; cards `ScrollTrigger.batch` `top 85%` | entrance | lines 0.9 expo; cards 0.6 out | Sell image begins expanding while cards are still in view (next row) | cards stagger 0.06, y 16 | visible |
| **Hover (all cards)** | image `scale 1.025` (0.6, CSS), arrow `x 4px` (0.35), border colour (0.2). `:focus-visible` gets the arrow + border | pointer / focus | feedback | — | — | no scale on touch (`@media (hover:hover)`) | colour only |
| **Sell / Consign** | see §4.1 | section `top bottom` → `bottom bottom` | sticky (CSS) + scrubbed image + event swaps | 180vh section, 80vh of phase travel | Sticky stage leaves with section end while the dark Classics frame rises under it | stacked, all groups visible | reff1 still |
| **Classics** | see §4.2 | approach `top bottom`→`top top`; pin `top top`→`+=85%` | scrubbed + pinned | 100vh approach + 85vh pin | Service photo rises to meet the dark edge at release (see §4.2 handoff) | no pin: image clip + line reveal | final frame |
| **Service** | **No clip at any width** — Service sits flush under Classics (0px, measured 390–2560) and its plate is section-tall, so any vertical clip whose edge sits below the seam leaves an empty strip under the dark stage (a part-open `inset(22%…)` wipe measured ≤110px; the client rejected it). The dark stage's bottom edge is the mask, lifting at scroll speed; the photograph RISES inside its plate: one timeline on the inner layer (112% tall, top-anchored) — release (first 34%): `y 0 → −0.7·spare`, `scale 1.04→1` from its top edge (`EASE.settle`), so its lower part climbs faster than the page while its top stays flush; then `y → −spare` (`EASE.lift`). The layer never uncovers its plate at any progress. H2 lines; paragraph y 20; 3 items stagger 0.08; CTA y 12 | layer scrub `top bottom`→`bottom top` (`SCRUB.reveal`, function values, `invalidateOnRefresh`); text `top 90%` | scroll-linked reveal + entrance | release ≈ first 34% of the plate's passage | the drift carries the photo out as Finance arrives | same passage, `scale 1.08→1` (≈34px spare on a phone); no event clip — its from-state blanked the plate under the dark copy block until it fired | visible, static |
| **Finance** | image `inset(0 0 0 8%)`+opacity 0→1, inner `x 24→0`; H2 lines; copy y 20; CTA y 12 | text `top 90%`; image `top 95%` | entrance (event) | image 0.9s `EASE.out` (visually open by image-top ≈60% at a brisk 700px/s); text 0.9/0.6 | calm — the first rest after two chapters | same, y 14 | visible |
| **About** | H2 lines slow (stagger 0.16, 1.2s expo); paragraph y 20 at +0.4s; link y 12 at +0.6s; image `inset(0 0 100% 0)`→0 + inner scale 1.05→1 | text `top 90%`; image `top 95%` | entrance | text ~1.4s total; image 0.9s `EASE.out` | whitespace carries into Reviews | stagger 0.1, 0.9s | visible |
| **Reviews** | H2 as the page's one mask-free heading: opacity 0→1, y 10→0 (0.6s out) — the tail's quieter register; two review blocks y 16 + opacity, stagger 0.1 | `top 90%` | entrance (quiet) | 0.6s | — | same | visible |
| **Instagram** | H2 lines; copy y 14; tiles y 20, stagger 0.06; hover image scale 1.03 + arrow x 4 | `top 85%` | entrance + feedback | 0.6s | into still footer | tiles stagger 0.04 | visible |
| **Footer** | nothing | — | static | — | the page stops | — | — |

---

## 4. Signature sequences

### 4.1 SELL / CONSIGN — sticky editorial stage (desktop)

**Method: CSS `position: sticky`, not a ScrollTrigger pin.** Justification: (a) no pin-spacer
wrapped around a React-owned node; (b) the section's height is plain CSS, so the Classics pin
below never has to be refreshed "after" it — refresh order is a non-issue; (c) the
compositor holds the stage, no JS on the critical path, zero jitter on native scroll;
(d) sticky fails safe — if JS dies, the stage is just a tall section. ScrollTrigger is used
only to *read* progress (`scrub` for the image, `onUpdate` for the active phase).
Requirement: no ancestor with `overflow: hidden|auto` — use `overflow-x: clip` for the page.

**Structure (hooks only; layout is designer's):**
```
section.sell[data-motion-root="sell"]         height: auto (static) | 180vh (.is-staged)
  div.sell__stage   sticky; top: var(--header-h); height: calc(100vh - var(--header-h))
    div.sell__media   (right, bleeds to edge)  ← clip-path owner
      div.sell__frame (inner, width: calc(100% + 64px), left 0) ← x / scale owner
        img
    div.sell__copy (left column)
      h2 "Make room / for what's next."        ← persistent anchor, never exits
      ol.sell__index  01 Overview · 02 Sell · 03 Consign  (buttons) + hairline track
      div.sell__slot  (CSS grid; all three groups share grid-area 1/1)
        div.group[data-phase=0]  intro paragraph
        div.group[data-phase=1]  h3 Sell Your Vehicle · body · CTA
        div.group[data-phase=2]  h3 Consignment · body · CTA
```
`.is-staged` is added by the desktop matchMedia branch and removed in its cleanup — so the
staged layout exists only while the code that manages it exists. Static/reduced/mobile CSS
= reff1 (intro above two side-by-side pathway columns; index `display:none`).

**Decision (composition): the H2 persists.** It is the section's headline and the anchor
the page reads; one *group slot* beneath it changes. This keeps reff1's hierarchy (large
headline, pathways below) while satisfying "one active group". "Make room for what's next."
is still the first thing revealed and the first phase.

**Timeline — progress over `start: () => "top top+=" + headerH` → `end: "bottom bottom"`**
(80vh of travel at 180vh; thresholds are in progress so they survive 170–190vh):

| Progress | Text (event swaps, not scrubbed) | Image frame (scrubbed, `SCRUB.stage`, ease none) | Index |
|---|---|---|---|
| approach (`top bottom`→ stick) | H2 lines rise at `top 88%` (0.9 expo, 0.1); group 0 body y 20 at +0.3; index opacity at +0.45 | media clip `inset(0 0 0 22%)`→0 (`SCRUB.reveal`); frame at x 0, scale 1.04 | — |
| 0.00–0.28 | **Phase 0** intro paragraph active | hold: x 0, scale 1.04 | 01 active |
| 0.22–0.36 | swap 0→1 fires at **0.30** | shift: → x −28px, scale 1.02 | fill tracks progress |
| 0.28–0.64 | **Phase 1** Sell active (CTA live) | hold 0.36–0.58 | 02 active |
| 0.58–0.72 | swap 1→2 fires at **0.66** | shift: → x −56px, scale 1.00 | |
| 0.64–1.00 | **Phase 2** Consign active (CTA live) | hold 0.72–1.00 | 03 active |
| exit | stage releases with section; nothing animates out | — | — |

Hysteresis: forward thresholds 0.30 / 0.66, backward 0.26 / 0.62 — no flicker at a boundary.
Frame direction: image anchored right; moving the frame left reveals more of the rear/tail.
The oversize (+64px) guarantees no edge ever shows at x −56.

**Swap (`goTo(target, dir)`, one timeline, `DUR` tokens):**
- Outgoing (`SWAP.outDur` 0.14s, `power2.in`): h3 lines `yPercent 0 → −130·dir`; the whole
  group `opacity 1→0, y 0 → −12·dir`. `data-active` / `pointer-events` move at its start.
- Incoming: h3 lines `yPercent 118·dir → 0` (0.9, expo) at **0.06**; body `y 20·dir→0, opacity`
  at **0.15** (0.6, out); CTA `y 12·dir→0` at **0.21**.
- *Revised 2026-09-30 (measured at 25fps, 1440, 600px/s):* the original 0.35s exit / +0.2 entry
  let the incoming "Consignment" rise over the still-legible "Tell us about your car…" and the
  pale Sell CTA (all groups share one grid cell); a first fix (0.2 / 0.2) left one frame of an
  empty slot. Now the titles roll through the same line box (outgoing leaving up and fading,
  incoming invisible below its mask for its first ~2 frames) and the incoming body starts only
  after the outgoing group is fully gone — no frame shows two bodies, none shows an empty slot.
  **No ghost layers:** every inactive group sits at `opacity: 0`, `pointer-events: none`.
- **Interruption:** if a swap is running, `tl.progress(1)` then start from the settled state
  to the *latest* target (fast scroll across both boundaries = one swap 0→2, not two).
  Direction `dir` = sign of target − current (backward scroll mirrors all y).

**Why inactive groups are opacity-hidden but NOT `visibility:hidden`/`inert`:** screen readers
and the Tab key must reach all three groups in DOM order (the means of the task survive —
both pathways are always reachable). Keyboard rule: a `focusin` on anything inside an
inactive group → (1) `goTo(phase)` with `DUR.xs` instead of the full swap, (2) scroll to that
phase's midpoint (`start + mid·(end−start)`, `behavior: "smooth"`). So Tab from the Sell CTA
lands on the Consign CTA and the stage moves to Consign; Shift+Tab mirrors it. The focus
ring is never on an invisible element for more than 0.2s.

**Index (earns its place):** it names both pathways from the first frame of the sequence
(Message 1: "never hide both pathways behind a long sequence") and doubles as the skip
control. Buttons (`aria-controls` the group, `aria-current="step"` on active) scroll to the
phase midpoint. Fill: a 1px track with a 2px blue segment, `scaleX` = section progress
(scrubbed, `transform-origin: left`). Label colours swap in `DUR.xs`; inactive labels stay ≥
AA (they are controls, 14px floor).

**Mobile (≤1023):** no sticky, section height auto. H2 lines (`top 88%`), intro body y 14;
image full-width clip `inset(0 0 0 22%)`→0 as an event (1.2s, `top 85%`) with frame x −24→0;
Sell and Consign each enter as a group (title lines, body, CTA, stagger 0.08) at `top 85%`.
All three visible, no index. **Reduced:** reff1 still — image at final framing (x 0,
scale 1.0), all groups visible, no index.

### 4.2 CLASSICS — pinned cinematic stage (desktop, the peak)

**Two ScrollTriggers, one owner per property (`G6`):**
1. **Approach** (`classics:approach`): `trigger: section, start "top bottom", end "top top",
   scrub SCRUB.reveal`. Owns `stage.clipPath` only: `inset(7% 2.5% 7% 2.5% round 2px)` →
   `inset(0% 0% 0% 0% round 0px)`. The dark picture rises inside the white page as a framed
   plate and opens to full-bleed exactly as it reaches the top. Horizontal inset 2.5% (36px
   at 1440) stays outside the content column so no text is ever clipped by the frame.
   Eyebrow "CLASSIC CARS" `opacity 0→1, y 12→0` over approach 0.62–0.82; **line 1
   "American muscle." `yPercent 118→0` (`EASE.settle`) over approach 0.72–1.00** — it
   rises while the plate opens, so the pin's first frame is composed (a pin that opened on
   an empty dark stage with only the eyebrow read as a dead frame; lead review).
2. **Pin** (`classics:pin`): `trigger: section, pin: section inner (.classics__pin),
   start "top top", end PIN.classics ("+=85%"), scrub SCRUB.stage, pinSpacing true,
   anticipatePin 1, invalidateOnRefresh true, refreshPriority 1`. Owns image layer x/scale,
   line 2, body and CTAs. (100% left ~450px of near-still scrolling after the type; 85% is
   the shortest that still reads as "about one extra viewport".)

**Pin timeline (progress 0–1 over 85vh; ease `none` unless stated):**

| Progress | Beat |
|---|---|
| 0.00 | Frame: full-bleed dark room, eyebrow + "American muscle." already set, image layer `x +56px, scale 1.03` (car's rear cropped by the right edge). |
| 0.00–0.14 | "Timeless character." `yPercent 118→0` (`EASE.settle`) — resolves early; no long half-clipped stretch |
| 0.00–0.80 | Image layer `x +56→0, scale 1.03→1.00`, `EASE.reframe` (sine.inOut — fastest through the middle, where it moves alone). The whole photograph moves as one layer; never rotate, skew, split, or separate the car. 56px + the 1.03 scale stay inside the 64px left oversize. |
| 0.18–0.34 | Support copy `opacity 0→1, y 20→0` |
| 0.28–0.44 | CTA group `opacity 0→1, y 16→0` (primary blue, secondary outlined) |
| 0.44–0.80 | Only the photograph moves (≈24px of its travel); type is complete and still (MJ4: readable frame) |
| 0.80–1.00 | **Hold (20%).** Nothing moves. Then the pin releases and the section scrolls away naturally. |

Heading lines here are **authored lines** (`<span class="line-mask"><span class="line">`
per line in markup), not SplitText: the break "American muscle. / Timeless character." is a
decided break, and a re-split would rebuild a pinned scrubbed timeline mid-scroll. If a line
ever wraps (narrow desktop), the whole wrapped block rises in its one mask — still correct.

**CTAs, decided:** in the DOM, focusable and never disabled at every progress; visually
arrive at 0.28–0.44 and are clickable from progress ≥ 0.34 (`pointer-events` toggled in
`onUpdate`; below that they are faint and a click on a near-invisible target would be
an accident). Keyboard: `focusin` on either CTA while progress < 0.44 → scroll to pin
progress 0.50 (`st.start + 0.50·(st.end − st.start)`, `behavior: "instant"`) and
`st.getTween()?.progress(1)` to finish the scrub catch-up, so the focused button is fully
visible that frame. Verified: `self.getTween` exists in 3.15 (ScrollTrigger.js l.1200).

**Release into Service (handoff):** at pin end the section scrolls up at native speed with
its final frame intact (no exit animation — cut, see §1). Service's top edge is the dark
stage's bottom edge (flush, 0px); the Service photograph fills the plate from that edge
down at every frame and rises inside it (see §3 Service). **Zero-gap contract, measured:**
an rAF logger compared the stage's bottom edge with the photograph's painted top every
frame through the whole release range — slow 20px wheel steps forward and backward, and a
fast flick — at 1024×768, 1440×900, 1920×1080, 2560×1440 and 390×844: max gap 0px, 0
coverage failures, 0 overlaps; 47 pixel strips at the seam showed 0 near-white rows. Two
earlier versions were rejected: a full `inset(100% 0 0 0)` wipe (leading edge below the
fold for ~330px after release) and a part-open `inset(22%…)` wipe (≤110px strip). Header returns to `scrolled` at Classics `bottom top+=H`.
**Anchor landing:** `#classics` uses `scroll-margin-top: 0` at ≥1024 (motion.css) so the nav
link lands on the pin start with the header dark, not 72px short of it.

**Mobile:** no pin, no approach scrub-to-fullbleed. Image block (full-width) clip
`inset(8% 5% round 2px)`→0 + layer `x 24→0` scrubbed `top 90%`→`top 45%` (`SCRUB.reveal`);
heading lines entrance `top 80%`; copy + CTAs group entrance (0.6, stagger 0.08). CTAs are
never hidden past `top 85%`. **Reduced:** final frame — mask open, x 0, scale 1, all text.

### 4.3 Header over the dark section

Header stays **stable height and position**; only its skin changes (CSS transition
`background-color, color, border-color` `DUR.s`). Over Classics it **inverts to graphite =
the stage colour** (`--ink-900`, white wordmark/nav, border `rgb(255 255 255 / .12)`), so
it reads as part of the room, not an opaque white bar cutting the stage (anti-patterns:
opaque surface crossing live content). Toggle = Classics section `top top+=H` → `bottom
top+=H` (the moment the header *leaves the section*, not "the page moved"). At that moment
the approach mask is at ≥ 92% open, so the band under the header is already dark. Owned by
the Classics hook (created after the pin; see §6.5). Contrast: white nav on `--ink-900` and
charcoal nav on white both verified AA in the build.

---

## 5. Hero slider — full-screen (revised 2026-09-30, motion-designer #1)

The hero is now a **full-screen photographic slider** (100svh, min 640px, starting at y=0
under a *transparent* header). **3 slides**, each with its own **tone** (`light` = near-white
type on a dark frame, `dark` = charcoal type on a pale frame — slide 2, the fog coast) and its
own **eyebrow** (`Independent dealer` · `Porsche to Toyota` · `Sell or consign`). Contract:
`Hero.jsx` header comment. Code: `src/motion/useHeroMotion.js`.

- **Slides:** all mounted, stacked (`grid-area 1/1`). `.slide__media` (clip owner, and its own
  stacking context — `isolation: isolate`, motion.css) > `.slide__img` (x owner). `.slide__copy`
  = eyebrow · headline (two authored `.line-block`s, SplitText leaf) · lead · actions. Inactive
  slides: `inert` + `aria-hidden`, `visibility: hidden`; `.is-leaving` keeps the outgoing copy /
  media painted during a wipe.
- **Transition (`go(dir)`; `dir` = +1 next, −1 prev), one timeline, desktop 1.2s / mobile 0.9s:**
  - Commit first (`flushSync`): React owns `is-active` / `inert` / `aria` / the counter; the
    wipe animates the DOM React has just written.
  - Incoming media: `clipPath inset(0 0 0 100%)` (next) / `inset(0 100% 0 0)` (prev) → open,
    `EASE.wipe`. Incoming image layer `xPercent 6·dir → 0`; outgoing `0 → −4·dir`, opaque under
    the wipe (no dissolve). Proven and sampled: the outgoing layer's exposed strip (≤ 57px at
    1440) is always under the incoming mask — no empty plate shows.
  - Copy out: headline lines `yPercent → −130` (clears the mask pad), eyebrow + lead
    `opacity → 0, y → −8` (`DUR.s`, `EASE.in`); the outgoing copy stops painting at `DUR.s`.
  - **Forward-wipe copy delay (`HERO.copyAfterWipe` = 0.6):** the copy column is on the LEFT and
    a forward wipe opens right→left, so the column is the last region to change. Incoming copy
    waits until the front has crossed 60% of its travel (lines at max(0.45, 0.72s) on desktop);
    otherwise a charcoal headline rose over the previous dark frame. Backward wipes open
    left→right, so the copy enters at 0.45s with no wait.
  - Copy in: eyebrow `opacity` + headline lines `yPercent 118→0` (0.9 expo, stagger 0.12) at
    `linesAt + shift`; lead `y 16→0` at `leadAt + shift`; actions `y 12→0` at `actionsAt + shift`
    only when they differ (content, tone or position) — slides 1–2 share their row.
- **Header tone follows the wipe front (replaces the single mid-wipe `applyTone`).** At the
  wipe's start `applyTone(to)` sets `.hero[data-tone]` (the header's default tone via `:has`),
  and every header item — wordmark, each nav link, the mobile Menu button — is held on the
  OUTGOING tone with `data-zone-tone` (motion.css), then flips on the frame the clip front
  passes its centre (`onUpdate` on the clip tween reads the eased ratio). Removed at the end /
  on revert. Measured before: with one switch at mid-wipe, white nav sat over the incoming pale
  fog for ~0.6s on 1→2, and a charcoal wordmark over the outgoing dark frame on 2→3.
- **Header band is a no-text zone** (every mode, incl. reduced motion — it is a scroll-state
  edge, not an animation): as the hero scrolls away, `.hero__field` is masked
  (`.hero.is-cut`, `--hero-cut` = header height + scroll into the hero) so its copy and the white
  controls plate fade out over the 20px above the header's bottom edge instead of sliding under
  the transparent bar's type. Measured before: the white wordmark vanished on the white
  controls plate 100px before the hero's end; the eyebrow crossed the wordmark after ~70px.
  Header goes `scrolled` (white + hairline) when the hero's bottom passes its bottom edge
  (designer's IntersectionObserver).
- **Decode gate:** the incoming `<img>` is `decode()`d before the wipe starts (capped 800ms), so
  the mask never opens on an empty plate. Non-initial slide images get their `src` on first
  interaction with the hero or at idle after `load`.
- **Swipe — section-wide:** the copy overlays the plate, so the Observer's target is the whole
  `section.hero` (`type: "touch,pointer"`, `lockAxis`, `dragMinimum: HERO.dragMin` so taps stay
  clicks, swipe threshold `HERO.swipe` 40px on release; horizontal only). `.hero` and
  `.hero__plate` have `touch-action: pan-y`: vertical page panning stays native. Verified: CDP
  touch swipes left/right change slide at 390; a vertical swipe scrolls the page.
- **Interruption:** queue of one. A click mid-wipe stores the latest target and runs the current
  timeline at `timeScale(2.5)`; further clicks replace the queued target. Verified: 3 clicks in
  240ms from slide 2 → one rushed wipe to 3, then one wipe to 1; no half states, no leftover
  `.is-leaving` / `data-zone-tone`.
- **Controls:** prev/next buttons + `01 / 03` counter (`aria-live="polite"`) on a small white
  plate (tone-independent). Arrow Left/Right inside the region. **Autoplay: none.**
- **Initial load:** the image is visible at first paint (LCP; no from-state on it). The active
  copy is held at opacity 0 by GSAP (never by CSS) until `Promise.race([fonts.ready, 300ms])`,
  then: eyebrow fade + headline lines `yPercent 118→0` (0.9 expo, stagger 0.12, delay 0.1) →
  lead at +0.35 → actions at +0.5 → controls at +0.6. Ends by ~1.2s.
- **Reduced motion:** no branch → Hero's instant swap; the tone follows the commit; everything
  visible at first render (measured: 0 held elements at 150ms).

---

## 6. Implementation architecture (React)

### 6.1 Files
```
src/motion/
  gsap.js          registerPlugin(ScrollTrigger, SplitText, Observer, useGSAP);
                   ScrollTrigger.config({ ignoreMobileResize: true }); export gsap et al.
  tokens.js        DUR, EASE, STAGGER, DIST, SCRUB, START (§2) — no number elsewhere
  media.js         export const MQ = {
                     isDesktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
                     isMobile:  "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
                     reduce:    "(prefers-reduced-motion: reduce)" }
  splitLines.js    lineReveal(el, opts) — SplitText line-mask entrance (§6.3)
  reveals.js       role-bound helpers: revealGroup, revealImage(variant), batchCards
  useRoleMotion.js the orchestrator: binds by data-motion role inside a root (MJ11)
  useHeroSlider.js · useSellSequence.js · useClassicsSequence.js · useHeaderState.js
  MotionContext.jsx  refs registry (headerRef etc.) — no cross-component document selectors
```

### 6.2 Binding — roles, not instances (`MJ11`)
Markup declares roles: `data-motion="heading" | "support" | "cta" | "group" | "cards" |
"image" data-reveal="up|down|right|calm"`. `useRoleMotion(sectionRef)` is called **inside
each ordinary section component** (Inventory, Service, Finance, About, Reviews, Instagram) and
wires whatever roles it finds under that root. Bespoke hooks exist only for the arrival (hero)
and the two chapters. After mount, dev-only check: every `[data-motion]` has a GSAP-set
style or a ScrollTrigger; log a warning otherwise (absence raises no alarm by itself).

### 6.3 Line masks — verified against gsap 3.15.0
`SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line", autoSplit: true,
aria: "auto", onSplit: self => gsap.from(self.lines, { yPercent: 100, duration: DUR.l, ease:
EASE.expo, stagger, scrollTrigger: { trigger: el, start, once: true } }) })`.
Verified in `node_modules/gsap/src/SplitText.js`: `mask` wraps each line in a clone with
class `line-mask` and inline `overflow: clip` (l.273–279); `autoSplit` re-splits on
width change via ResizeObserver (200ms debounce, l.193) and on `document.fonts`
`loadingdone` (l.283); **the tween returned from `onSplit` is reverted on re-split and the new
one is restored to the same `totalTime`** (l.284–285, 305–309); re-splits run inside the
creating `gsap.context` (l.201), so `useGSAP` cleanup reverts them. `aria: "auto"` puts the
full text on `aria-label` and hides line spans. Rule: split only leaf elements whose text
React never changes (hero slides are all mounted; slide changes touch attributes only).

### 6.4 One `useGSAP` per component, `matchMedia` inside
```js
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add(MQ, (ctx) => {
    const { isDesktop, isMobile, reduce } = ctx.conditions;
    if (reduce) return;                 // static CSS is the authored still
    /* build branch; add listeners via contextSafe; return () => remove listeners/classes */
  });
}, { scope: rootRef });                 // selectors scoped (G2); revert on unmount (G1)
```
StrictMode double-invoke: `useGSAP` reverts the context (SplitText, ScrollTriggers, pins,
Observer, matchMedia) on the simulated unmount; the second run rebuilds cleanly. Non-GSAP
listeners (`focusin`, `keydown`) are removed in the matchMedia cleanup return. The pinned
Classics component renders static children only (memoised) — nothing React re-renders lives
inside the pin-spacer.

### 6.5 Trigger order and refresh (`G8`, `DNA47`)
- Verified: ScrollTrigger sorts **higher `refreshPriority` first** (ScrollTrigger.js l.1751;
  the plugin skill's "lower first" note is wrong for 3.15).
- Component effects run in document order (Header, Hero, … Classics, Service …). The Sell
  stage is CSS sticky — no spacer, no ordering issue. Classics pin gets `refreshPriority: 1`
  so anything created before it but positioned after it (e.g. a header toggle) still
  measures against the spaced layout; the header-dark trigger is created *by the Classics
  hook after the pin* anyway. Triggers below Classics are created after it by effect order.
- Refresh: once after `document.fonts.ready` (only if `document.fonts.status` changed layout,
  i.e. called once), after inventory results change height, and automatically on resize /
  matchMedia change. **No refresh on image load:** every image box has a fixed
  `aspect-ratio`, so decoding changes no geometry. Above-the-fold and Classics/Sell images
  `decoding="async"` + `fetchpriority` set by designer; below-fold lazy.

### 6.6 Progressive enhancement (`G7`, `DNA39`)
- **No CSS ever hides content.** All from-states are applied by `gsap.set`/`gsap.from` inside
  the matchMedia branch, in `useGSAP`'s layout effect — before first paint, and never if the
  script fails. Reduced motion never enters a branch that hides anything.
- `index.html` sets `document.documentElement.classList.add("js")` synchronously in `<head>`;
  it is used only to scope hover-transform CSS and `.is-staged` layout — never `opacity: 0`.
- Layout switches that motion needs (`.is-staged` on Sell) are added and removed by the same
  branch that manages them. If the branch never runs, the page is reff1.

### 6.7 Performance
Only `transform`, `opacity`, `clip-path` animate; at most one clip-path animates per viewport.
`will-change: transform` only on the Sell frame and Classics image layer while their triggers
are active (`onToggle`). No `scroll` listeners — ScrollTrigger's single loop only.

### 6.8 API verification log (installed `gsap@3.15.0`)
`gsap/SplitText` exports `SplitText`; `Vars` includes `mask`, `autoSplit`, `onSplit`,
`onRevert`, `aria` (types/split-text.d.ts l.74–95). `ScrollTrigger#getTween` l.1200.
`anticipatePin` supported. `Observer` present. `ScrollSmoother` present and **unused**.

---

## 7. Verification plan (performed in the browser, not described)

**Eight stop positions (1440×900), each judged as a composed frame (`MJ4`, `DNA87`):**
1. Load at t = 0.4s (hero lines mid-rise) and t = 1.3s (settled).
2. Hero slider paused at 50% of a wipe (via `tl.pause(0.6)` in devtools).
3. Inventory → Sell seam: cards settled, Sell media at ~50% clip.
4. Sell at progress 0.15 (intro), 0.30 (mid-swap), 0.50 (Sell), 0.90 (Consign).
5. Classics approach at 50% (framed plate in white page, header still light).
6. Classics pin at 0.20, 0.50 (CTAs arriving), 0.90 (hold).
7. Classics → Service seam (dark bottom edge, Service wipe closing the gap to the seam).
8. About/Reviews mid and page end (footer still, nothing pending).

**Scroll behaviour:** slow wheel through every sequence; fast flick / `End` / `Home` (Sell
must land on one settled group, never two); backward through Sell (swaps mirror) and Classics
(scrub reverses, header re-lightens); stop mid-swap and wait (settles); land mid-page via
reload at a deep scroll position and via anchor links (states correct on arrival).
**Keyboard:** Tab through Sell (Consign CTA brings its phase), Tab into Classics CTAs at
pin 0.1 (jumps to settled frame), hero arrows + counter announced.
**Resize:** 1440 → 900 → 1440 while inside the Classics pin and inside Sell (matchMedia
reverts: no orphan pin-spacer, `.is-staged` removed, all groups visible; rebuild on return);
1200 ↔ 1100 widths inside desktop (line masks re-split, no clipped descenders, no text
jump). Check 390, 768, 1440 with `reduce` emulated and with JS disabled (both = reff1).
**Instruments:** console clean; Performance trace through Classics pin — no long tasks, no
layout in frames; `ScrollTrigger.getAll().length` stable across StrictMode remounts.

---

## 8. Open conflicts with the static composition (for art-director / Alex)

1. **Sell desktop ≠ reff1 frame.** reff1 shows intro + both pathways side by side at once; the
   required sequence shows one group at a time. Resolved as: reff1 is the static, reduced,
   no-JS and ≤1023 state; desktop keeps the H2 + image anchored and swaps one slot, with the
   01/02/03 index naming both pathways from the start.
2. **Classics CTAs "usable throughout" (Msg 1) vs "settle into final positions" (Msg 2).**
   Resolved as: always focusable and keyboard-reachable (focus jumps to the settled frame);
   visually present and clickable from pin progress 0.50.
3. **Header over hero.** reff1 shows a white header strip with the hero beneath it; motion
   only adds the hairline border after the hero and the graphite state over Classics. If
   BRIEF puts the header *over* the hero image, the `top` state must be re-solved for
   contrast on that image (not a motion decision).
4. **Section heights needed by motion:** Sell 180vh desktop (170–190 acceptable), Classics
   stage exactly 100vh (+85vh pin), Sell sticky stage `calc(100vh − header)`. The Classics
   content column must sit inside the 2.5% horizontal inset.
