# BRIEF — Dealership Homepage

The concept gate. **No markup exists before this file does (`DNA1`).**
Resolved from `/Users/alex/Desktop/WORK/design_dna/TASTE.md` (canonical Mac copy).
Authority: `docs/CLIENT-BRIEF.md` (Message 2 over Message 1) → `reference/reff1.png` (`DNA3`) → this file.
Art-director, 2026-09-30. The designer builds the static page from this file; `MOTION.md` owns the temporal layer. Assets: `docs/ASSETS.md`.

---

## 0. Delivery mode

`Delivery: BUILD` — the direction is approved (`reference/reff1.png`). No alternatives.

## 1. Design Read

```
Reading this as a dealership homepage for local buyers and sellers (daily-driver to Porsche to classic muscle), leaning light retail-editorial showroom.
Mandate: REBRAND (constrained) — no prior identity exists and name/logo are pending, but the approved reference fixes palette family, type character, composition, section order and the single dark section; invention is limited to execution and motion.
Dialect: brief-derived / no stored dialect — the reference (white ground, one grotesque, muted-blue actions, crisp 2px edges) is incompatible with auction-editorial's dark-first base, didone display and mono labels; auction-editorial is NOT in use.
Dimensionality: SUPPORT — scroll-linked 2D photographic framing (two sequences) reinforces a page that reads completely without it; no 3D, no canvas.
```

**Carried from the reference, untouched:** white / light-grey grounds · charcoal type · one sans family, bold tight headlines · spaced uppercase eyebrows · muted-blue filled primary + outlined secondary · 2px radius, hairlines, no shadows · hero with text left and cars right · search band directly under hero · 3-column featured grid · split image/text chapters · ONE dark section (Classics) · reviews as two quiet grey panels · Instagram as text + 3 tiles · the required section order.

**Named deviations from the reference (`DNA3`), each with its reason:**
1. **Hero is a full-screen photographic slider** (lead decision 2026-09-30, client: "FULL SCREEN HERO"; replaces the earlier hard split). Three slides, 100svh (min 640px), edge to edge from y=0 **under a transparent header**; type sits **directly on the photograph**, tone per slide (charcoal on the pale fog frame, near-white on the two darker frames). Readability comes from frame choice, crop and placement, plus a localised gradient only where glyph-pixel measurement required one (§10). Opens on the bright fog frame so the first read is light, like the reference.
2. Eyebrows 14px, not ~12px — `typography I7` floor.
3. Meta grey raised from measured `#838286` (3.7:1) to `#6A6D73` (5.19:1) — `color I1`.
4. Form borders `#8E9197` (3.16:1) — `color I1` 3:1 for UI boundaries.
5. Dataset holds 7 illustrative vehicles; 3 show by default (reference count), all 7 are searchable.
6. Service list: hairline-ruled numbered rows, no line icons — `DNA33`.
7. Sell / Finance images: hard crop edge, no feathered fade — the page's edge language is crisp.
8. Reference claims ("competitive offer", "trusted lenders", "experienced technicians", "concourse", "Verified Customer") removed or softened — `CP6`.
9. Header states: **transparent over the hero** (type tone follows the active slide: charcoal on the fog frame at load, near-white on the darker frames), **solid white** once the hero's bottom is within header height + 120px of the top (so the hero's controls plate never passes under a transparent header), **graphite over Classics**.

## 2. The concept

**A bright, open showroom walked in one pass — every door (buy, sell, consign, service, finance) labelled and usable — with one room kept dark for the cars that earned it.**

(It is wrong if the dark room reads as a separate website, or if any door is a label with nothing behind it.)

## 3. The feeling curve (`DNA29`)

| # | Feeling | Caused by |
|---|---|---|
| 1 | Welcome, ease | A 992 alone on an open desert road beside a plain four-word headline on white |
| 2 | Control | Four selects that re-deal the listings in place with a live count |
| 3 | Reassurance | A 992's rear holds still while three offers take turns beside it |
| 4 | Desire (**peak**) | The page's photographs have all been plates; this one grows into the room and the header goes dark with it |
| 5 | Trust | Daylight returns on a car up on a lift with two technicians under it |
| 6 | Calm | A cognac interior, one sentence, one action |
| 7 | Belonging | An aerial coast road, a personal paragraph |
| 8 | Company | Two quiet review panels (placeholder) and three everyday shop squares |
| 9 | Arrival | A practical footer — where, when, how to reach — then stop |

Acts 6 and 7 are both quiet; they differ in object (instrument vs. landscape) and in what they hand over (a question vs. a visit). Kept.

## 4. The peak (`DNA28`)

**Classics.** *"Then the whole page goes dark and there's this black '69 Camaro sitting in the shop."*
It gets: the largest type (72px), the only graphite ground, the longest footprint (100vh stage + 100vh pin), the header's only state change of colour, and the signature move. Silence in front of it: the pin opens (progress 0 → 0.14) on the room and the car with no type at all (`MOTION.md` §4.2).
**Asset caveat:** `classics-camaro-studio.webp` is likely AI-generated (`docs/ASSETS.md`) — a named `GI3` violation. Its alt text says so ("Illustrative generated image…") and the footer legal line covers it; the in-stage caption was removed by the lead. It must be replaced by a real photograph before launch.

## 5. Page grammar (`DNA36`)

**Chaptered editorial — plates and one room.** Every photograph on the page is a plate with a crisp edge, bleeding to one viewport edge only; image masses alternate sides (hero R · Sell R · Classics FULL · Service L · Finance R · About R-inset); text always opposite the image; one tonal inversion near the middle of the page.
**How it differs from the last build (296 GT Modificata):** that was a single-car dark filmic study; this is a light retail page with its drama concentrated in one room and every other chapter doing practical work.

## 6. The signature move (`DNA37`) — decided, reconciled with `MOTION.md`

**"The plate becomes the room."** The Classics photograph arrives like every other photograph on the page — a framed plate inside the white page (`inset(7% 2.5%)`) — and opens to full-bleed exactly as it reaches the top, while the header turns graphite and joins it: the visitor walks into the room rather than past a picture of it. Bespoke because it only works on a page whose grammar is "plates" and whose one dark section is a room; it is used once. The car layer then settles `x +48 → 0`, `scale 1.03 → 1.00`, and never rotates, skews or separates.
My earlier "shop door" (bottom-up aperture) is **retired**: Service already owns the upward wipe, and a second bottom-up reveal two sections apart would be one device used twice.

## 7. Shot list (`DNA27`, `DNA50`) — desktop 1440×900

Shot before device. Durations, eases and triggers are `MOTION.md`'s.

| Act | Section | Shot | Device | Scroll footprint |
|---|---|---|---|---|
| 1 | Hero | **Reveal** (establishing) | Image visible at first paint; headline line-mask rise, then copy + actions; manual slider, directional horizontal wipe | 720px (0.80vh) |
| 2 | Search + Featured | **Interruption** (utility beat) | Search band static; cards group reveal; filter crossfade | 104 + ~700px (0.90vh) |
| 3 | Sell / Consign | **Dolly** (lateral hold) | CSS sticky stage 100vh inside **180vh**; image anchored right, frame pans −28 → −56px; one active group; 01/02/03 index | 1.80vh |
| 4 | Classics — PEAK | **Push-in**, then **hold** | Approach: plate opens to full-bleed + header goes graphite; pin +100vh: two heading lines, car layer settles, copy + CTAs, 20% hold | 2.00vh |
| 5 | Service | **Release** (back to light) | Upward clip wipe out of the dark edge; lines; 3 rows as one group; image y-parallax ≤40px | 760px (0.84vh) |
| 6 | Finance | **Macro** | Calm `inset(0 0 0 8%)` + opacity; heading + copy | 560px (0.62vh) |
| 7 | About | **Reveal** (wide landscape) | Slow typographic entrance; image wipes down | 600px (0.67vh) |
| 8 | Reviews + Instagram | **Release** (quiet) | Group reveals; tile hover scale 1.025 + arrow | 440 + 420px (0.96vh) |
| 9 | Footer | **Release** (stop) | Nothing moves | 400px (0.44vh) |

**The two sticky/pinned sequences:** (a) Sell/Consign — CSS sticky, section **180vh**, stage `calc(100vh − 72px)`; (b) Classics — stage 100vh, ScrollTrigger pin +100vh. Desktop ≥1024 with motion allowed only; removed under reduced motion and on mobile.

## 8. Mobile shot list (`DNA67`, `MJ8`) — 390×844

No pins, no sticky. Stacked sections, image-first after the hero.

| Act | Mobile treatment | Approx. height |
|---|---|---|
| Hero | Text on white (headline 42px, lead, 2 buttons full-width stacked), then image 4:3 (390×292), controls under image | ~800px |
| Search | 2×2 selects + full-width button | ~300px |
| Featured | 1 column, 3 cards + "Show all 7 listings" | ~1,300px |
| Sell / Consign | Image 4:5 (390×488), headline, lead, Sell block, hairline, Consignment block — all visible | ~1,250px |
| Classics | Graphite; image 4:3 full-bleed; text below | ~950px |
| Service / Finance / About | Image first (4:3 / 4:3 / 3:2), then text | ~900 / 700 / 760px |
| Reviews / Instagram | Stacked panels; 3 square tiles in one row (114px each, gap 12) | ~560 / 420px |

## 9. Budget (`DNA38`, `DNA72`, `DM3`)

- **Total page height** — ≈ 8,300px at 1440×900 (≈ 9.2 viewport-heights incl. the pin); mobile ≈ 10,000px.
- **Total payload** — ≤ 3.5 MB desktop full scroll (all 23 assets sum ≈ 3.4 MB; only 19 are used); ≤ 700 KB before first scroll.
- **JS** — ≤ 130 KB gz (React + GSAP core + ScrollTrigger + SplitText + Observer).
- **Fonts** — Inter Tight variable, latin subset, one file ≤ 60 KB, preloaded; line masks built after `document.fonts.ready` (`MOTION.md` §6.3).
- **Largest single asset** — `hero-mercedes-w111.webp` 460 KB (slide 3, `loading="lazy"`, not LCP). LCP asset `hero-porsche-992-desert.webp` 359 KB — request a 1600w variant (≤ 180 KB) for ≤1024 via `srcset`.
- **Frame budget** — 60 fps desktop; transform / opacity / clip-path only; one clip-path animating per viewport.
- **LCP target** — ≤ 2.0 s desktop, ≤ 2.5 s mobile 4G. LCP = slide-1 image, eager, `fetchpriority="high"`; hero headline is HTML at final size.
- **CLS** — 0: header height fixed, every image in a fixed `aspect-ratio` box.

---

## 10. Hero declaration (TASTE §2)

**Replaced 2026-09-30 (lead: full-screen hero), revised after critic #3.** Data and crops: `src/data/hero.js`; layout: `src/styles/hero.css`.

| | |
|---|---|
| viewport ownership | 100svh (min 640px), edge to edge, starting at y=0 under the 72px transparent header; the search band follows immediately below |
| scene treatment | Full-screen scene: the photograph is the field; copy in the left column (`--edge` → 42vw) over the frame's quiet region; slider controls on a small white plate under the actions |
| object scale | Set by the source framing, never enlarged to fill (C22) — except the portrait overscale below, which only lifts the car out of the actions band |
| text safe zone | Landscape: left column, header + 8vh down. Portrait: eyebrow/headline/lead at the top of the frame, actions at its foot, 16px above the controls — the same on every slide |
| crops | Keyed to the viewport's shape: landscape `pos`, wide (≥1.85) `posWide`, 4:3 (≤3:2) `posNarrow`, portrait (≤1:1) `posPortrait` + `zoomPortrait` (bottom-anchored overscale) |
| image selection | `sizes` from each frame's own geometry (`heroSizes()`): under `cover` a viewport narrower than the image renders it at aspect × viewport height, so portrait/4:3 request the 2560w file (was 960w at `100vw` — 3.2× upscale on phones) |

**Slides — order, copy and measured contrast** (worst glyph pixel, text-on vs text-hidden render; 1440, 1920, 2560, 1024, 768, 390@2x):

| # | Frame | Tone | Copy (eyebrow · headline · actions) | Scrim | Worst glyph pixel |
|---|---|---|---|---|---|
| 1 | Two GT3 RS, coastal fog (`hero-porsche-gt3rs-coast`, LCP, preloaded) | charcoal | Independent dealer · "Good cars. / Real people." · Explore Inventory, Sell Your Vehicle | none | 7.56:1 |
| 2 | GT2 RS, charcoal brick (`hero-porsche-gt2rs`) | near-white | Porsche to Toyota · "Everyday cars. / Weekend cars." · Explore Inventory, Ask About Financing | soft header band (every crop, 0.62) | 4.41:1 (1024 eyebrow, one window-frame pixel; 98% ≥ 6.24) |
| 3 | Aston Vantage, cypress drive (`hero-aston-vantage`) | near-white | Service & restoration · "Serviced here. / Road ready." · Our Repair Shop, Classic Cars | strong header band; left band on 4:3; tall top band in portrait (the bright sky gap between the cypresses) | 5.41:1 |

Each slide points at a different pathway (inventory + sell · inventory + finance · service + classics); "Sell Your Vehicle" appears once in the first two screens besides the nav. Secondary actions over the photograph are solid white (ink label, 17.6:1), except the fog frame at landscape (outlined charcoal, 7.6–9.3:1); in portrait every secondary is solid white. Phone clearance car → actions (390×844): fog ≈47px, GT2 RS ≈34px, Aston ≈13px (the Aston fills its portrait band; cover leaves no vertical slack).

**Governing event:** *A visitor arrives on a bright coastal frame with a plain promise, two actions and the lot's search directly below.*

| Component | Declared as |
|---|---|
| primary subject | the car(s) in the active frame |
| identity / headline mass | `.slide__copy` eyebrow + h2 + lead (the page h1 is visually hidden) |
| supporting interface mass | `.search-band` |
| CTA cluster | `.slide__actions` |
| active field | the photograph's quiet region under the copy column |
| excluded | header (persistent chrome), slider controls (subordinate plate) |

## 11. Composition Read (full page)

```
COMPOSITION READ
1.  Context:        independent dealer, Honda to Porsche + classic muscle; visitors browse, sell, consign, service; content and several photos are placeholders; native scroll mandated.
2.  Artistic image: a daylight showroom with one dark room near its centre — open, practical, unhurried, with one moment of want.
3.  Format forces:  1440×900 landscape; first screen must show hero + search; scroll is sequence; a 72px header on every screen.
4.  Major masses:   (a) white text field against a right photographic plate; (b) thin grey interface band; (c) a short row of three repeated light units;
                    (d) tall split mass, plate right, held still for ~1.8 screens; (e) one full-width dark mass, the heaviest tone on the page;
                    (f) three alternating light split masses of falling weight; (g) a low quiet tail of small repeated units and a thin close.
5.  Centres:        semantic = the cars; optical = the dark mass (e) at ~50% of page length; action = (b)+(c). Optical governs the page; action governs the first screen.
6.  Dominance:      dominant = Classics; subordinate = hero plate, Sell plate; support = service/finance/about; bridge = search band; counterweight to (e) = the white hero field.
7.  Balance:        centre of gravity near mid-page (the dark mass), held by bright masses above and below — stable.
8.  Direction:      hero 992 faces left into the headline (slides 2–3 face right: declared cost); Sell rear faces the viewer; Classics car faces left toward its type; Service car on lift, open to the text on the right; exit downward.
9.  Rhythm:         field|plate · band · 3-row · text|plate(held) · ROOM · plate|text · text|plate · text|inset · pair · triplet · close — departure at the room; tempo slows after it.
10. Negative space:  hero field above the headline; Sell column below the index; Classics left third of dark smoke (type room); About's air under the paragraph; bottom paddings deeper than top.
11. Tension:        Sell's held stage compresses progress; the room releases it; Service's daylight resolves it.
12. Spatial depth:  flat page planes; depth only inside photographs; the header is the one overlaid plane.
13. Edges:          plates bleed to one viewport edge only; crisp 2px corners where a plate is inset; no feathering anywhere.
14. Unity:          one family, one blue, one radius, one hairline weight, one eyebrow style, one line-mask grammar, one "plate" logic for every photograph.
15. Typography:     headlines are compact two-line dark blocks, always opposite the image; the Classics headline is the one light block and the largest.
16. Imagery:        daylight everywhere except the room; lot-quality inventory photos are normalised by one frame aspect and one car scale, never by colour grading.
17. Responsive:     side-by-side alternation does not exist at 390 → image-first stacks; the room keeps dominance by tone and full-bleed, not width.
18. Functional:     tasks = find a car, sell/consign one, service, ask about finance, contact; each has a live control within one screen of its heading.
19. Diagnosis:      the held Sell stage and the Classics pin sit adjacent and could read as one long stall — answered by lateral pan on white vs. opening-into-the-room on graphite, and by the header changing state only at the room.
```

## 12. Composition Plan

- **Mass scheme:** bright top (a+b+c ≈ 1.8vh) → held split (d, 1.8vh) → dark room (e, 2vh) → three falling light chapters (f, ≈ 2.1vh) → quiet tail (g, ≈ 1.4vh).
- **Primary centre:** the Classics car — only tonal inversion + largest type + longest dwell.
- **Hierarchy mechanism:** tone first (one dark mass), scale second (72 > 64 > 44 > 32), dwell third.
- **Eye path per chapter:** eyebrow → headline → image → action; image always opposite text so the eye crosses and returns.
- **Density:** dense at (b)(c); open elsewhere; the tail deliberately sparse.
- **Rhythm & intervals:** bottom padding ≥ top (1:1.33); plates alternate sides.
- **Image ↔ type:** plates ≥ 50% of width in every chapter; text column ≤ 5 of 12 cols; no type over a busy region.
- **Culmination/release:** culmination at the Classics hold; release through Service; stop at the footer.
- **Edge strategy:** plates bleed to one edge; plate height = section height (About excepted: inset 3:2).
- **Responsive:** <768 image-first stacks; 768–1023 keeps 50/50 splits for Service/Finance/About, stacks hero, Sell and Classics.
- **Functional realisation:** search filters in-page; every CTA maps to a real anchor (§14, §17).
- **Measurable commitments:** first screen = header + hero + full search band at 1440×900; full-bleed plates = 5 (hero, Sell, Classics, Service, Finance); ground changes = 7; display/body ratio 72/17 = 4.2; dark sections = 1; type over photography = Classics only.

### Grid (named only after the Plan)

| Width | Columns | Container | Side gutter | Column gap |
|---|---|---|---|---|
| 1440 | 12 | 1296px max | 72px | 24px |
| 1024 | 12 | fluid | 48px | 24px |
| 768 | 8 | fluid | 40px | 20px |
| 390 | 4 | fluid | 20px | 16px |

`--gutter: clamp(20px, 5vw, 72px)`; container `min(1296px, 100vw − 2·gutter)`. Plates break out to the viewport edge on their side only.

### Section heights — reference measured vs. target (1440 wide)

Reference boundaries in original px (737 wide) × 1.954.

| # | Section | Ref px | Ref @1440 | **Target @1440** | Notes |
|---|---|---|---|---|---|
| 1 | Header | 0–35 | 68 | **72**, solid white, above the hero | hairline after hero; graphite over Classics |
| 2 | Hero | 35–323 | 563 | **720** (`clamp(600px, 80svh, 760px)`) | "spacious and strong" |
| 3 | Search band | 324–374 | 100 | **104** | |
| 4 | Featured | 375–597 | 434 | **~700** default (3 cards); grows by rows when filtered/expanded | |
| 5 | Sell / Consign | 598–914 | 618 | **180vh** staged; **720** static/reduced | |
| 6 | Classics | 916–1210 | 575 | **100vh** stage + **100vh** pin; **900** static | peak |
| 7 | Service | 1211–1497 | 559 | **760** | |
| 8 | Finance | 1498–1686 | 367 | **560** | |
| 9 | About | 1687–~1880 | ~377 | **600** | |
| 10 | Reviews | ~1880–2010 | ~254 | **440** | |
| 11 | Instagram | ~2015–2114 | ~195 | **420** | |
| 12 | Footer | 2115+ (cut) | — | **400** | |

---

## 13. Design tokens

### Type — one family: **Inter Tight** (`@fontsource-variable/inter-tight`)

Why: the reference's type is a neo-grotesque with closed apertures, compact width and tight bold headlines. Inter Tight matches that silhouette with display-tuned spacing, has true tabular figures (`typography I5`), and one variable file covers 400–700. Rejected: Manrope (geometric-rounded, softer), Instrument Sans (quirky humanist details), Geist (product/tech register), Hanken Grotesk (wider, looser at display). One voice; roles differ by size/weight/case (`I8`). Verify "4Runner", "$148,000", "01 / 03" at 14–17px and both headlines at 64/72px in the render before locking (`I10`).

| Role | 1440 | 390 | Wt | LH | Tracking | Use |
|---|---|---|---|---|---|---|
| `display-peak` | 72 | 44 | 700 | 1.00 | −0.03em | Classics h2 only |
| `display` | 64 | 42 | 700 | 1.02 | −0.03em | Hero h1, Sell h2 |
| `h2` | 44 | 32 | 700 | 1.06 | −0.025em | Service, Finance, About |
| `h3` | 32 | 26 | 700 | 1.12 | −0.02em | Featured, Reviews, Instagram heads |
| `title` | 20 | 18 | 600 | 1.25 | −0.01em | Card titles, Sell/Consign titles, service rows |
| `lead` | 19 | 17 | 400 | 1.5 | 0 | Hero + chapter leads (max 44ch) |
| `body` | 17 | 16 | 400 | 1.6 | 0 | Paragraphs (max 62ch) |
| `small` | 15 | 15 | 400 | 1.5 | 0 | Card meta, row descriptions, footer |
| `eyebrow` | 14 | 14 | 600 | 1.2 | 0.16em UPPER | Section labels, ≤ 4 words |
| `nav` | 15 | 16 | 500 | 1 | 0 | Header links |
| `button` | 15 | 15 | 600 | 1 | 0 | Title Case + → |
| `price` | 17 | 16 | 600 | 1.3 | 0, tabular | Sample prices |

Fluid via `clamp()` between 390 and 1440. Headlines `text-wrap: balance` plus the authored breaks written as "/" in this file. Wordmark "DEALERSHIP" 16px / 700 / 0.22em, from `src/data/brand.js`.

### Colour — sampled from `reference/reff1.png`

Accent derivation (`color I5`): measured from the approved reference's buttons (`#286894`, `#2A6A95`, avg ≈ `#2A6793`). Judged in place: it sits in a free territory — none of the chosen photographs is dominated by this blue except two skies, which never touch a button.

| Token | Value | Sampled / role | Contrast |
|---|---|---|---|
| `--c-white` | `#FFFFFF` | page ground, hero field | — |
| `--c-ground` | `#F4F4F5` | search band, Finance, review panels (ref `#F4F4F4`/`#F0F0F0`) | — |
| `--c-ink` | `#17191C` | headlines, titles | 17.6 white · 16.0 ground |
| `--c-ink-2` | `#4E5157` | body, leads, eyebrows (ref `#505051`) | 7.96 · 7.24 |
| `--c-ink-3` | `#6A6D73` | meta, captions, "Sample price" | 5.19 · 4.72 |
| `--c-line` | `#E3E4E6` | decorative hairlines, card borders | decorative |
| `--c-line-strong` | `#8E9197` | select borders, slider buttons | 3.16 on white |
| `--c-blue` | `#2A6793` | primary fill, secondary border/text, active index | white on it 6.07 · on ground 5.52 · vs graphite 3.12 |
| `--c-blue-hover` | `#1E527A` | primary hover/pressed | white on it 8.26 |
| `--c-graphite` | `#0E1113` | Classics ground + header dark state (MOTION's `--ink-900`) | — |
| `--c-graphite-2` | `#1A1E21` | Classics mobile text block | — |
| `--c-on-dark` | `#F2F2F0` | Classics headline/body, dark header nav | 16.9 on graphite |
| `--c-on-dark-2` | `#B8BCC2` | Classics eyebrow, caption | 9.93 |
| `--c-on-dark-line` | `rgba(242,242,240,.72)` | outlined secondary on dark | ≥ 3 |
| focus ring | 2px `--c-ink` (light) / `--c-on-dark` (dark), 2px offset | never removed | ≥ 3 |

Blue budget: primary buttons, secondary outlines/labels, text links, active index/filters. Never headings, grounds or body. Type over photography only in Classics, `--c-on-dark` over the smoke field: measured 13.5–18.0:1 in x 72–396, ≥ 8.8:1 to x 500, at the declared crop (§16).

### Radius, borders, elevation
`--radius: 2px` everywhere · `1px solid var(--c-line)` · no shadows.

### Spacing — 4px base, the only source of values
`--s-1…--s-11` = `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160`.

| Relationship | Desktop | Mobile |
|---|---|---|
| eyebrow → headline | 16 | 12 |
| headline → lead | 24 | 16 |
| lead → next block | 32 | 24 |
| text → CTA row | 48 | 32 |
| button ↔ button | 12 | 12 |
| card body padding | 24 | 16 |
| chapter section (top / bottom) | 96 / 128 | 64 / 96 |
| utility section (featured, reviews) | 96 / 96 | 64 / 64 |

### Buttons & controls

| | Spec |
|---|---|
| Primary | h 48, padding-inline 24, `--c-blue`, white 15/600, → 16px with 12px gap, radius 2; hover `--c-blue-hover` + arrow +4px x |
| Secondary (light) | h 48, white, 1px `--c-blue`, `--c-blue` label; hover fill `--c-ground` + arrow +4px |
| Secondary (dark) | transparent, 1px `--c-on-dark-line`, `--c-on-dark` label; hover border `--c-on-dark` |
| Text link | 15/600 `--c-blue`, underline on hover/focus, arrow +4px |
| Select | h 48, 1px `--c-line-strong`, radius 2, visible label (14/500 `--c-ink-2`) above on mobile, `aria-label` + visible first option on desktop; chevron 16px |
| Slider prev/next | 44×44, 1px `--c-line-strong`, white, chevron; counter `01 / 03` 14px tabular `--c-ink-2` |
| Icons | Lucide, 1.5px stroke: arrows, chevrons, menu, quote mark only |

---

## 14. Section-by-section static spec

CTAs Title Case (control role); headings sentence case (voice). Data in `src/data/`. Static = reduced motion = no-JS.

### 1 · Header
72px, sticky, container width. Left: wordmark. Right: Inventory · Sell & Consign · Classics · Service · Finance · About (anchors). No header CTA. States (skin only, height fixed): `top` — transparent over the full-screen hero, type tone from the active slide (`.hero[data-tone]`) → `scrolled` — solid `--c-white` + 1px `--c-line`, set by an IntersectionObserver when the hero's bottom is within header height + 120px of the top (verified: 0 frames with the controls plate under a transparent header, forward and back, 1440/1920/390) → `dark` over Classics (`--c-graphite`, `--c-on-dark` text, `rgba(255,255,255,.12)` border). <1024: wordmark + "Menu" button (44×44) opening a full-height white sheet; resizing to ≥1024 with it open closes it and moves focus to the first nav link.

### 2 · Hero slider (3 slides, order, crops and contrast in §10)
- Full-screen photograph (100svh, min 640), edge to edge under the transparent header.
- Landscape: copy column at `--edge`: eyebrow → display h2 (64px at 1440 → 72px from 1600w, capped 8.5vh) → lead (36ch, 3 lines reserved so the CTA row never moves) → actions → controls plate (prev · `01 / 03` · next).
- Portrait (≤1:1, phones and portrait tablets): eyebrow / headline / lead at the top; actions pushed to the foot (`margin-top: auto`), 16px above the controls; stacked full-width below 768.
- Manual only. Keyboard ←/→ inside the region; live counter; swipe on touch (`MOTION.md` §5).

### 3 · Inventory search band
`--c-ground`, 104px. Row: `FIND YOUR NEXT CAR` (eyebrow) · Make · Model · Price max · Body type (equal) · Search Vehicles (primary). Options derived from `src/data/inventory.js`: Make {Any, Honda, Lexus, Mercedes-Benz, Porsche, Toyota}; Model filtered by Make; Price max {Any, $20,000, $40,000, $75,000, $100,000}; Body {Any, Coupe, Sedan, Hatchback, SUV}.
**Behaviour (no dead control):** changing a select filters the grid live; Search Vehicles scrolls to `#inventory` and moves focus to the result count. Count reads "Showing 2 of 7 illustrative listings · Clear filters". With any filter active, all matches show (grid adds rows). Zero results: "No illustrative listing matches these filters." + Clear Filters. State mirrored in the query string.

### 4 · Featured inventory (`#inventory`)
64/64. Head row: eyebrow `FEATURED INVENTORY` → h3 "Handpicked, across price ranges." left; right: result count + text link "Show All 7 Listings →" (expands the grid in place; becomes "Show Fewer"). Note under the heading (small, `--c-ink-3`): "Illustrative listings with sample prices — not current stock."
Default (no filters): 3 cards — **Porsche 911 Carrera S · Lexus ES 300h · Honda CR-V** (the reference's Porsche / Lexus / everyday-SUV spread); the AMG stays searchable.
Card: white, 1px `--c-line`, radius 2. Image frame **16:10**, `object-fit: cover`, per-car `object-position` (§16), no grading. Body 24px: title (provenance is carried once at section level — the note, "illustrative listings" in the count — plus "Sample price" and the illustrative alt on every card) → meta `Year · Mileage · Transmission` (small, tabular) → hairline → "Sample price $148,000" (label `--c-ink-3`, figure `price`) · → at right. The card opens an in-page dialog (facts + "Ask About This Car" → `#contact?topic=car&id=…`); no detail page exists.

| id | Make | Model / trim | Body | Year | Miles* | Trans.* | Sample price* | Photo |
|---|---|---|---|---|---|---|---|---|
| amg-gtr | Mercedes-Benz | AMG GT R | Coupe | illustrative | 12,000 | Automatic | $148,000 | inv-mercedes-amg-gt |
| p911 | Porsche | 911 Carrera S | Coupe | 2016 | 31,000 | Automatic | $86,000 | inv-porsche-911 |
| gr-corolla | Toyota | GR Corolla | Hatchback | 2023 | 6,000 | Manual | $44,000 | inv-toyota-gr-corolla |
| e300 | Mercedes-Benz | E 300 4MATIC | Sedan | 2018 | 41,000 | Automatic | $29,000 | inv-mercedes-e300 |
| es300h | Lexus | ES 300h | Sedan | 2016 | 64,000 | Automatic (hybrid) | $19,000 | inv-lexus-es |
| crv | Honda | CR-V EX AWD | SUV | 2015 | 78,000 | Automatic | $16,000 | inv-honda-crv |
| 4runner | Toyota | 4Runner | SUV | 2007 | 142,000 | Automatic | $12,000 | inv-toyota-4runner |

Years come from the source filenames (the photo's own car); AMG year unknown → show no year for that row. \*Mileage, transmission and prices are illustrative. **The photograph governs the row (`CP7`)**: a row never changes to a car its photo does not show.

### 5 · Sell / Consign (`#sell`)
Static (reduced, no-JS, <1024 stacked): plate right, 50vw, full height; text cols 1–5, padding 96/128: eyebrow `SELL OR CONSIGN` → display "Make room / for what's next." → lead "Selling your car? We can buy it outright, or consign it and handle the sale for you. Either way, it starts with a straightforward conversation." → two columns split by a 1px hairline:
- **Sell Your Vehicle** — "Tell us about your car and we’ll come back with an offer." → Sell Your Vehicle (primary → `#contact?topic=sell`).
- **Consignment** — "For special and collector cars: we present and market the car for you." → Learn About Consignment (secondary → `#contact?topic=consign`).
(Unsourced promises removed — audit P2.)

Staged (desktop): section 180vh, stage sticky; headline persistent; one slot swaps Overview → Sell → Consign; index `01 Overview · 02 Sell · 03 Consign` at the column foot names and jumps to every phase (`MOTION.md` §4.1). Plate framing across phases: Overview = light bar and tail detail, Sell = pan to the rear haunch, Consign = whole rear with floor (§16).

### 6 · Classics — the room (`#classics`)
Graphite, full-bleed stage 100vh, pinned (+85%). Subject bounds measured on the 2752×1536 source: stand x .298–.33 and tool chest .345–.495 (y .42–.60); mechanic x .389–.53 (head top y .332, feet .661); car x .454–.953 (roof .38, wheels .661).
**Composition (desktop ≥1024, every aspect):** the copy is anchored to the content column (`--edge`) and split around that group — eyebrow + display-peak "American muscle. / Timeless character." top-left, 48px under the header, **above** the mechanic's head; body (30rem, two lines) + both CTAs in one row bottom-left on the open floor, **below** the wheels. The `<img>` is overscaled vertically (1.12 on every desktop aspect) and top-anchored, which pushes the head and wheel line away from the heading: under `cover`, horizontal object-position has no slack once the stage is wider than the image (1.79:1), so the vertical axis is the one that works at every width. Peak size: 72px at 1440 → 80px from 1600w, capped 7vh (5.6vh on ≤31:20) — the page's largest type except on 4:3 screens, where clearance wins.
**Measured clearance, text → mechanic/car (rest / pin start framing, layer x +56 scale 1.03):** 1440×900 39/36 · 1920×1080 78/74 · 2560×1440 170/165 · 1280×960 83/80 · 1024×768 37/34 px. No scrim; glyph contrast ≥ 5.16:1 at every size measured.
- Body: "We buy, sell, consign and restore classic American muscle — from honest drivers to full restorations." → Ask About Classics (primary → `#contact?topic=classics`) · Restoration Services (dark secondary → `#service`).
- **No caption** in the stage (removed by the lead); the generated-image disclosure lives in the image's alt text and the footer's legal line.
<1024: image block full-bleed, text below on graphite. Reference's "Classic Inventory" relabelled — the dataset has no classic listing (§17).

### 7 · Service (`#service`)
White. Plate left, 54vw × 760, `service-lift.webp` at `object-position: 20% 60%`, image layer 112% tall for the parallax. Text cols 8–12, padding 96/128: eyebrow `SERVICE & RESTORATION` → h2 "Keep it running. / Bring it back." → lead "Repairs, paint, body work and restoration for daily drivers, modern performance cars and classics." → three rows, hairline-top, 20px padding: `01` (small, tabular, `--c-ink-3`) · title · line:
- Repairs — "Diagnostics, maintenance and mechanical repair."
- Paint & Body — "Collision repair, paintwork and refinishing."
- Restoration — "Partial and complete restorations."
→ Contact Our Repair Shop (primary → `#contact?topic=service`; becomes "Visit Our Repair Shop" + external URL when provided).
**Seam with Classics (motion):** Service sits flush under the dark stage; the mask is the dark stage's own bottom edge lifting away at scroll speed, and the photograph rises inside its plate (layer 112% tall; top never below 0, bottom never above the plate's bottom at any progress), so no background strip can show at the seam — one scrubbed timeline over the plate's passage, all widths (`src/motion/reveals.js`, variant `up`).
No secondary image: `service-restoration`/`-paint`/`-body` are cut — the lift already says "keep it running", the Classics room just said "bring it back", and a fourth image here would turn the release into a grid.

### 8 · Finance (`#finance`)
`--c-ground`, 560px band (min-height, text vertically centred). Plate bleeds to the right edge at section height: **58vw** from 1024 (50vw at 768–1023) — distinct from Sell (50vw, sticky) and Service (54%, left); stacked below 768. Text left at `--edge`, width = what the bleed leaves less 64px. eyebrow `FINANCING` → h2 "Find your way forward." → lead "Ask us about financing options when you find the right car." (the terms promise was removed — audit P2) → Ask About Financing (primary → `#contact?topic=finance`). Reference's "Apply for Financing" relabelled: no application exists.

### 9 · About (`#about`)
White, 96/128. Text cols 1–6; plate inset cols 7–12, 3:2 (636×424), radius 2. eyebrow `ABOUT` → h2 "A personal approach / to buying cars." → body "We're an independent dealership for people who like good cars — from modern performance to classic American muscle. Sales, consignment and restoration, handled by people you can talk to." → Plan a Visit (secondary → `#contact`).

### 10 · Reviews
White, 96/96. eyebrow `REVIEWS` → h3 "What our customers say." → two `--c-ground` panels (cols 1–6 / 7–12, 40px padding, radius 2): quote mark (32px, `--c-line-strong`) → "Customer review placeholder — a real review will appear here once provided." → `REVIEW SOURCE PENDING` (eyebrow, `--c-ink-3`). No names, stars or ratings.

### 11 · Instagram
White, 96/128. Text cols 1–4: eyebrow `INSTAGRAM` → h3 "Follow along." → small "Arrivals, behind the scenes and work in the shop." → "@handle pending". Tiles cols 5–12: three **1:1** squares, gap 24 — `ig-gt3rs` · `ig-engine` · `ig-cutlass` (modern arrival · work in the shop · a classic). Tiles link to `brand.instagramUrl`; while it is `null` they render as plain figures (no hover, no arrow) — never a dead link.

### 12 · Footer (`#contact`)
White, 1px `--c-line` top, 96/64. Wordmark + "Independent dealer — sales, consignment, classics, service." Columns: **Shop** (Inventory, Classics, Sell, Consign) · **Services** (Service & Restoration, Finance) · **Visit** (Address pending · Phone pending · Hours pending, `--c-ink-3`, each tagged `PLACEHOLDER`). A `?topic=` shows "You asked about: Selling" above Visit. Bottom hairline row: "© {year} DEALERSHIP (name pending). Listings, prices, reviews and some photographs on this page are illustrative placeholders."

---

## 15. Claims ledger (`CP1`)

| Claim string | Status | Source | Visible marking |
|---|---|---|---|
| Brands sold: Porsche, Mercedes, Lexus, Honda, Toyota | sourced | CLIENT-BRIEF M1 "Business and structure" | — |
| Buy / sell / consign / restore classic American muscle | sourced | CLIENT-BRIEF M1 | — |
| Repairs, paint, body work, restoration | sourced | CLIENT-BRIEF M1 service capabilities | — |
| "a repair shop that keeps them running" | sourced (separate shop) | CLIENT-BRIEF M1 item 7 | — |
| "Used cars across price ranges" | sourced | CLIENT-BRIEF M1 | — |
| "Good cars. Real people." · "Handpicked, across price ranges." · "Serviced here. Road ready." | PLACEHOLDER (tone) | reference headline / neutral rewrite (audit P2); client to approve | footer note |
| 7 × make / model / trim | PLACEHOLDER (matches each photo) | `docs/ASSETS.md` source filenames | "ILLUSTRATIVE LISTING" per card |
| 6 × year | PLACEHOLDER | source filenames of other dealers' listings | same tag + section note |
| 7 × mileage, transmission | PLACEHOLDER | invented | same |
| 7 × "Sample price $…" | PLACEHOLDER | invented round figures for the filter | "Sample price" inside every price string + section note |
| Price-max options | PLACEHOLDER | derived from sample prices | section note |
| "we'll come back with an offer. There's no obligation to accept." | PLACEHOLDER — promise | none | client must confirm (§17) |
| "you keep ownership until it sells" | PLACEHOLDER — promise | none | client must confirm |
| "We'll explain the terms plainly before you commit." | PLACEHOLDER — promise | none | client must confirm |
| "handled by people you can talk to" | PLACEHOLDER (tone) | none | footer note |
| Review panels | PLACEHOLDER | none | "placeholder" in text + "REVIEW SOURCE PENDING" |
| Address / phone / hours | PLACEHOLDER | none | "pending" + tag |
| Instagram handle, repair-shop URL | PLACEHOLDER | none | "pending"; links withheld |
| "DEALERSHIP" | PLACEHOLDER | CLIENT-BRIEF M1 (temporary) | "(name pending)" |
| Classics photograph | PLACEHOLDER, likely synthetic | `docs/ASSETS.md` (GI3) | alt text "Illustrative generated image…" + footer legal line (caption removed) |

Removed from the reference as unsourced (`CP6`): "competitive offer", "trusted lenders", "competitive financing", "qualified buyers", "experienced technicians", "expert service", "all under one roof", "concourse", "Verified Customer", "Apply for Financing".

## 16. Assets — selected files and crop intent

Source ledger: `docs/ASSETS.md` (all temporary; rights not established). Frame = CSS box; positions are `object-position` for `object-fit: cover`.

| Section | Must do | File | Desktop frame · position | Mobile frame · position |
|---|---|---|---|---|
| Hero 1 (LCP) | Contemporary car, faces the text, sky + road | `hero-porsche-992-desert.webp` 2560×1402 | 58vw × 720 (1.16) · `44% 50%` | 4:3 · `46% 55%` |
| Hero 2 | Bright second slide | `hero-porsche-911-cabriolet.webp` 1920×1280 | 1.16 · `72% 60%` (front whole; tail may crop ≤ 40px) | 4:3 · `52% 62%` |
| Hero 3 | Mercedes, pairs with the "selling" slide | `hero-mercedes-w111.webp` 1440×1256 | 1.16 · `50% 72%` | 4:3 · `50% 78%` |
| Featured ×7 | Exact car named, whole, uniform scale | `inv-mercedes-amg-gt` · `inv-porsche-911` · `inv-toyota-gr-corolla` · `inv-mercedes-e300` · `inv-lexus-es` · `inv-honda-crv` · `inv-toyota-4runner` | 3:2 · AMG `50% 55%` · 911 `50% 50%` · GR `50% 55%` · E300 `50% 50%` · ES `50% 70%` · CR-V `50% 60%` · 4Runner `50% 62%` | same 3:2 |
| Sell / Consign | Held detail that can pan | `sell-porsche-992-rear.webp` 1800×1384 (re-cropped by the lead to remove the licence plate; -1000 is 1000×769) | 50vw × (100vh − 72) ≈ 720×828 (0.87) · Overview `50% 52%` scale 1.04 (light bar) → Sell pan −28px → Consign `50% 58%` scale 1.00, whole rear + floor; frame oversized +64px per MOTION | 4:5 · `50% 55%` |
| Classics | Whole car, dark type field left | `classics-camaro-studio.webp` 2752×1536 (**likely AI**) | 1440 × 100vh · `100% 50%`; pin start layer `x +48, scale 1.03` (rear may touch right edge only during the pin) | 4:3 full-bleed · `100% 55%` |
| Service | Real workshop, action | `service-lift.webp` 2000×1334 | 54vw × 760 (≈1.02) · `20% 60%`, layer 112% tall | 4:3 · `35% 60%` |
| Finance | Calm interior detail | `finance-interior.webp` 1500×1000 | 50vw × 560 (1.29) · `30% 50%` | 4:3 · `30% 50%` |
| About | Landscape, belonging | `about-coast-road.webp` 2200×1238 | 3:2 inset 636×424 · `22% 50%` | 3:2 · `22% 50%` |
| Instagram ×3 | Shop life | `ig-gt3rs` · `ig-engine` · `ig-cutlass` (900² each) | 1:1 · `50% 50%` | 1:1 |
| Cut | — | `service-restoration`, `service-paint`, `service-body`, `ig-door-card` (repeats Finance's cognac), `ig-911-hillside` (Porsche already in 4 places) | — | — |

Loading: slide 1 eager + `fetchpriority="high"`; slides 2–3 lazy (preload on first slider interaction); everything below the fold `loading="lazy" decoding="async"`. Every frame has a fixed `aspect-ratio`.

## 17. Unresolved — needs the lead's / client's call

1. **Repair-shop URL** — until given, the Service CTA is "Contact Our Repair Shop" → `#contact?topic=service`.
2. **No classic listing exists**, so the Classics primary CTA is "Ask About Classics" → `#contact?topic=classics`. It becomes "Classic Inventory" only when a real classic listing with its own photo is added.
3. **Promises in Sell / Consign / Finance copy** (§15) need client confirmation before public use.
4. **Classics photo is likely AI-generated** (GI3) and several photos are other dealers' shoots — replacement required before launch; disclosed in the alt text and the footer legal line meanwhile.
5. **Hero slides 2–3 face right, out of the page** — the only available frames; replace with left-facing contemporary cars when the dealer's own photography arrives.
6. Root holds a stray `reff1.png` beside `reference/reff1.png` — untouched.

---

## 18. Motion Read — summary (`MOTION.md` owns the plan)

```
Subject          cars, a sell/consign service, classic muscle, a workshop — static subject; heightened register only at Sell and Classics (the brief's two chapters)
Static verdict   yes — §14 is complete and is the reduced-motion / no-JS page
Primary idea     hero wipe · Sell group swap · Classics "plate becomes the room" · Service upward wipe — one per viewport
Stable           header height, search band, grid geometry, prices/specs, settled CTAs, the Classics car's proportions
Transport        the reader — native scroll, no snap, no Lenis (recorded DNA90 yield)
Mobile           re-authored: no pin, no sticky, stacked reveals
Cost             +1.8vh (Sell) and +1.0vh (Classics) of advance; two scrub layers
Cut              hero autoplay · Ken Burns · marquee / auto carousels · Service icon row + second image · card tilt · header shrink · snapping · bottom-up "shop door" (duplicated Service's wipe)
```

## 19. Reference (`DNA3`)

`reference/reff1.png` (737×2134) is the primary visual authority. Measured boundaries (orig px): header 0–35 · hero 35–323 · search 324–374 · featured 375–597 · sell 598–914 · classics 916–1210 · service 1211–1497 · finance 1498–1686 · about 1687–~1880 · reviews ~1880–2010 · instagram ~2015–2114 · footer 2115+. Scale ×1.954. Reference text margin 40px orig → 79px @1440 → container 1296 / gutter 72. Sampled colours in §13. It never overrides contrast, the 14px floor or provenance — deviations in §1.

## Conflicts with MOTION.md

Read on completion (2026-09-30). Resolutions — BRIEF decides static, MOTION decides time:

1. **Sell height** — MOTION 180vh vs. my first draft 170vh. **Adopted 180vh** (inside the brief's 160–190).
2. **Sell index** — MOTION's `01 Overview · 02 Sell · 03 Consign` adopted over my two-item index; phase thresholds 0.30 / 0.66 are MOTION's.
3. **Signature** — MOTION's "dark plate opens into the room + header joins it" adopted as the `DNA37` move (§6); my bottom-up door is retired. MOTION's Service `inset(100% 0 0 0)` upward wipe stays the only bottom-up reveal.
4. **Header over hero** (MOTION §8.3) — resolved: the header is solid white above the hero, never over the image; the `top` state needs no contrast re-solve.
5. **"reff1 is the static page"** (MOTION §1) — true except the hero, whose static state is the full-screen photograph with type on it (§1 deviation 1).
6. **Classics CTAs** clickable from pin 0.50, always focusable — accepted. The primary is relabelled "Ask About Classics" (§17.2).
7. **Classics text column** — MOTION requires it inside the 2.5% inset; §14.6 anchors it at `--edge` (≥ 72px), so no clip. (The caption this item once required was removed by the lead.)
8. **Classics image** — MOTION's `x +48 → 0, scale 1.03 → 1` matches my ≤ 48px / ≤ 1.06 limits; at `object-position: 100% 50%` the front keeps ≥ 64px of air at rest.
9. **Instagram hover** — MOTION says scale 1.03, the client brief says "slight scale"; cards use 1.025. Unify both at **1.025** (one hover value on the page).
