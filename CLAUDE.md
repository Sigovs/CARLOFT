# Dealership Homepage

> Built to Alex's design system. The rules are **not vendored here** — they are
> resolved live, so this project never drifts from a stale copy.

# DESIGN DNA

**Read before producing anything visual** — a page, a component, a scene, CSS,
tokens, an image — and before any art direction, palette, type scale, spacing
ramp, motion or composition decision.

1. `/Users/alex/Desktop/WORK/design_dna/TASTE.md`
   — the manifest: operating rules, the two tiers, the Design Read, the dialect index.
2. `/Users/alex/Desktop/WORK/design_dna/.claude/rules/design-dna.md`
   — the build standard, `DNA1`–`DNA94`.
3. `/Users/alex/Desktop/WORK/design_dna/skills` — load the skills the task actually touches.
4. Fallback if this machine has no working copy: https://github.com/Sigovs/design_dna

**Say which path resolved, in one line, at the top of the report.**

## For scroll-driven or cinematic work

Load the **`scroll-site`** skill first. It carries the stack, the scaffold, the
concept gate and the definition of done.

## Stack

Vite + React 19 + GSAP 3.15 / ScrollTrigger (`@gsap/react` `useGSAP`).

**Lenis is the scroll layer (DNA90)** — added 2026-09-30 on Alex's direct request
("add Lenis on scroll"), superseding the earlier native-scroll yield. It lives in
`src/motion/scroll.js`: gsap.ticker loop (`autoRaf: false`), off under reduced
motion, native touch, `data-lenis-prevent` on the mobile menu and vehicle dialog.
Every in-page link and programmatic scroll goes through `scrollToEl` / `scrollToY`.

## The concept gate

**`BRIEF.md` is complete before the first line of markup (`DNA1`).** An empty
section in it is an unfinished gate, not a detail to fill in later.

## Order of authority

1. Truth and access — contrast, provenance, reduced motion, discoverability.
2. `TASTE.md` and the INVARIANT tier of the skills.
3. The build standard, `DNA1`–`DNA94`.
4. The selected dialect, and this project's own direction below.
5. Plugins — `frontend-design`, Scrollcraft, `threejs-webgl`,
   `gsap-scrolltrigger`. **Reference only. They bind nothing** and are never the
   reason for a design decision. Neither is a library name.

## Working style

Never ask yes/no or confirmation questions to resolve taste — make the senior
call and note it in the report. Questions about **facts** — scope, content,
constraints, contradictions, missing assets — are expected. Three at most.

## Project direction

Independent dealer homepage (Porsche, Mercedes, Lexus, Honda, Toyota; classic
American muscle; consignment; service/restoration/paint/body; finance).

- **Business name: CAR LOFT** (confirmed by Alex, 2026-09-30 — this supersedes the
  earlier "CAR LOFT is a different project" rule and the temporary "DEALERSHIP"
  wordmark). Domain carsloft.com. Logo pending (wordmark set in type). All brand
  and contact data is centralised in `src/data/brand.js`.
- **Primary visual authority:** `reference/reff1.png` (approved direction).
  Bright white/very light grey, charcoal type, restrained muted blue actions,
  crisp borders, minimal radius, ONE dark section (Classics).
- **Required section order:** header · hero slider · inventory search · featured
  inventory · sell + consignment · classics (dark) · service · finance · about ·
  reviews · instagram · footer.
- **Motion is a core requirement:** line-mask headings, clip-path image reveals,
  two desktop sticky/pinned sequences (Sell/Consign sticky ~160–190vh; Classics
  pin ~+100vh), `gsap.matchMedia()` for desktop/mobile/reduced motion.
- **Content provenance:** all business info, reviews, vehicles and prices are
  placeholders in `src/data/`, visibly marked. No invented claims.
- Photography copied from WORK into `public/assets/` (never runtime WORK paths).
- Do not publish or deploy.
