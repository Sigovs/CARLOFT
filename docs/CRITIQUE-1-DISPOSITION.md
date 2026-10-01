# Static critique #1 — disposition (lead)

Critic report: design-critic #1 (screens in scratchpad/critic1/). Audit: docs/AUDIT-content-config.md.

| # | Point | Disposition | Owner |
|---|---|---|---|
| 1 | Hero dead band / stranded controls | **accept** — slider controls group sits 56px (`--s-8`-ish token) under the actions, not bottom-anchored; copy group vertically centred in the field's free height | designer #2 (hero.css) |
| 2 | Hero car scale via `scale(1.15)` | **reject** — upscaling a 2560 source softens it at 2× DPR, and the air around the car is the declared scene (TASTE hero declaration: full-screen scene, not full-frame object). Allowed: object-position tweak only | — |
| 3 | Slide 2 cabriolet crop fails declaration | **accept** — fix via object-position; if the tail/nose still clips at 1440 and 1280, cut to 2 slides (992 + W111). Brief minimum is 2 | designer #2 (src/data/hero.js, hero.css) |
| 4 | Contrarian "horizon hero" | **reject** — it turns the hero into a thin text band + photo strip that rhymes with the search band below it, losing the reference's text-left / car-right read; the split keeps that read at AA with no scrim | — |
| 5 | Inventory not compact (797px) | **accept** — frame 3:2 → 16:10, target section ≈640px | designer #2 |
| 6 | Per-card "Illustrative listing" eyebrow | **accept** — remove per-card eyebrow; keep ONE section-level note + "Sample price" per card (CP4 still met) | designer #2 |
| 7 | Count/note 11px near-alignment | **accept** — baseline-align | designer #2 |
| 8 | Lime AMG as first card | **accept** — default trio 911 Carrera S, Lexus ES, Honda CR-V (mirrors reference: Porsche / Lexus / Toyota-class); AMG stays searchable | designer #2 (data) |
| 9 | Sell/Finance same formula | **accept (partial)** — Finance becomes a different formula (inset plate within the grid, shorter aspect, not a bleed). **About side flip rejected** — the reference places About's image right; the reference is the authority | designer #2 |
| 10 | Tail over-spaced | **accept** — Reviews 64/64, panels ≈170; Instagram bottom 96; footer single "Placeholder details" line instead of four boxed tags | designer #2 |
| 11 | Classics CTA widths 208/217 | **accept** — equal min-inline-size | designer #2 (classics.css) |
| 12 | Classics body 33px from figure | **accept** — max-width 320 | designer #2 (classics.css) |
| 13 | Header white over Classics under reduced motion | **accept** — header dark state must be driven by a scroll-state observer that also runs under reduce | motion (Header.jsx) |
| 14 | Hero CTA row jumps between slides | **accept** — `.slide__lead` min-block-size 3 lines | designer #2 |
| 15 | Straight apostrophes | **accept** | designer #2 |
| 16 | About measure 76ch | **accept** — ≤62ch | designer #2 |
| 17 | 390 Classics H2 tangent to gutter | **accept** — 40px at ≤420 | designer #2 |
| 18 | 768 first screen lacks search | **accept** — hero plate 16:9 at 768 | designer #2 |
| 19 | No Lenis | **reject** — the client's explicit instruction ("Use native scrolling … not scroll hijacking") outranks the standing default for this project; recorded yield of DNA90 in CLAUDE.md | — |
| 20 | Gates / motion unverified | **defer** — waiting on motion build + critic #2; the repo gate scripts are not wired into this project | lead |

## Audit P2 dispositions
| Item | Disposition |
|---|---|
| Sell "no obligation to accept", Consign "you keep ownership until it sells", Finance "explain the terms plainly" | **accept** — rewrite as non-promises (describe the process without guarantees) or tag visibly; prefer rewriting |
| "Handpicked. Honestly priced." over sample prices | **accept** — neutral headline, e.g. "Handpicked, across every budget." |
| index.html title/meta hardcode | **accept** — derive from brand.js via a tiny Vite `transformIndexHtml` plugin; drop "Quality" |
| Instagram shows other dealers' photos unlabelled | **accept** — visible "Illustrative images" note |
| Classics caption does not say generated | **accept** — caption "Illustrative image (generated) — to be replaced"; alt text neutral |
| Usage rights for all photos | **accept** — recorded in docs/ASSETS.md and the final report |
| Unused assets ship | **accept** — lead removes cut files from public/assets at the end |
