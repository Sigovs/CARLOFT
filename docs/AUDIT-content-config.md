# Audit — content, provenance, links, assets, config

Date: 2026-09-30 (~12:55). Read-only audit; no file under `src/`, `public/`, `index.html` or
`package.json` was edited. Other agents were editing `src/` during the audit, so line numbers
are as of this snapshot. Content-provenance rules applied: CP1–CP7.

## Summary

- **Branding:** clean. Zero "CAR LOFT"/"carloft" strings in shipped code (only the prohibition
  line in `CLAUDE.md`, and the folder name itself). All business info reads from
  `src/data/brand.js`; no name/phone/address/email is hardcoded in any component. One leak:
  `index.html` `<title>`/description hardcode "Dealership".
- **Provenance:** ledger exists (BRIEF §15, CP1 satisfied). Vehicles, prices, reviews, contact
  details are visibly marked. **None** of the reference's invented facts (address, phone, hours,
  "Carrera S | 2019 | 28,450 mi", "RX 350 F Sport 2021 36,220 mi", "4Runner TRD Off Road 2020
  42,660 mi") were copied. No testimonial, rating, star, credential or "Apply for financing" was
  invented. Remaining gaps are three unconfirmed promises and one tone claim rendered unmarked.
- **Links/controls:** every in-page anchor target exists; every `#contact?topic=` key has a
  label; no `href="#"`/empty hrefs; icon-only buttons are labelled.
- **Section order:** matches the brief exactly (App.jsx:39–52).
- **Assets:** all 19 referenced files exist; declared width/height match the real pixel sizes;
  no `/Users/` path anywhere at runtime; 5 unused files (~315 KB) ship in `dist`.
- **Config/build:** builds clean in 162 ms, no warnings. JS 254.4 kB (77.9 kB gz), CSS 32.7 kB
  (7.2 kB gz). **GSAP/ScrollTrigger is declared but not imported anywhere in `src/` at audit
  time** — the motion layer does not exist yet.

## Findings

| # | Sev | File:line | Issue | Recommended fix |
|---|---|---|---|---|
| 1 | P1 | `src/` (whole tree); `package.json` deps | `gsap` / `@gsap/react` are dependencies but no file in `src/` imports them; the built bundle has 0 `ScrollTrigger` references. The brief's core requirement (line masks, clip reveals, two pinned/sticky sequences, `gsap.matchMedia`) is absent in this snapshot. It may be in progress with another agent. | Confirm the motion module lands before handoff. If it still isn't there at handoff, this is a delivery blocker. |
| 2 | P2 | `src/components/SellConsign.jsx:44` | "There's no obligation to accept." is an unsourced promise (CP6). BRIEF §15 lists it as "client must confirm", but the page shows it as plain copy with no marking. The footer legal line covers listings, prices, reviews and photos, not promises. | Get client confirmation, or remove the sentence ("Tell us about your car and we'll come back with an offer."), or mark it visibly. |
| 3 | P2 | `src/components/SellConsign.jsx:50` | "you keep ownership until it sells" is a contractual consignment term with no source (CP6), and it is unmarked. | Same as #2. The neutral wording "we present and market the car for you" carries no promise. |
| 4 | P2 | `src/components/Finance.jsx:41–42` | "We'll explain the terms plainly before you commit." is a service promise, and it is unmarked. The brief bans invented financing promises. | Remove it until the client confirms, or keep only "Ask us about financing options when you find the right car." |
| 5 | P2 | `src/components/FeaturedInventory.jsx:55` | The headline "Handpicked. Honestly priced." sits directly over invented sample prices. "Honestly priced" is a claim about how the business prices cars (CP6). The ledger marks it "tone placeholder, footer note", but the footer note doesn't mention it. | Use a neutral headline (e.g. "Featured inventory." / "Across price ranges."), or get the client to approve it. |
| 6 | P2 | `index.html:6–10` | `<title>Dealership — Quality cars, classics and service</title>` and the meta description hardcode the business name outside `brand.js`, which breaks the centralisation requirement. "Quality cars" is also an unsourced claim. | Set `document.title` from `brand.js`, or inject both through a small Vite `transformIndexHtml` plugin that reads `brand.js`. Drop "Quality". |
| 7 | P2 | `src/components/Instagram.jsx:27, 41–64`; `src/data/instagram.js` | The tiles are other dealers' photos (PRESTIGE "Marques We Service", SIERRA, NFI; rights not established per ASSETS.md). They sit under "Arrivals, behind the scenes and work in the shop" as if they were this dealer's feed. No tile says "illustrative", which reassigns other businesses' shop life (CP7). The `caption` field in the data is never rendered. | Add a visible "Illustrative images" note under the tiles (like the Classics caption), or render `caption` as "Illustrative". Replace the photos before launch. |
| 8 | P2 | `src/components/Classics.jsx:36–44`; `docs/ASSETS.md` | The Classics image is probably AI-generated and shows a real product (a 1969 Camaro) and synthetic people. That is a named GI3 violation. The caption says "Illustrative image", which doesn't disclose that it's synthetic. The alt text states it as fact ("a mechanic at a tool chest"). | Replace it with a real photograph before any client-facing share. Until then, caption it "Illustrative image (generated)" or similar. |
| 9 | P2 | `docs/ASSETS.md` (all rows) | Every photo comes from another dealer's or shop's shoot (Geneva, iNetwork, Banyan, Prestige, etc.), and usage rights are not established. Service shows iNetwork's workshop as "Keep it running. Bring it back." | Replace or license the photos before launch. The footer legal line ("some photographs … illustrative") is only a stopgap. |
| 10 | P3 | `src/components/SellConsign.jsx:116–122` | The three `.sell__index-btn` buttons have no `onClick`. They are `display:none` except in `.is-staged` (sell.css:111). Their behaviour belongs to the motion layer, which doesn't exist yet (see #1). | When the staged layout ships, wire the click-to-phase handler in the same change. Otherwise they become dead controls. |
| 11 | P3 | `src/hooks/useHashRoute.js:36–39` | Clicking the same `#contact?topic=…` link twice fires no `hashchange`, so the second click does nothing if the user has scrolled away. | Also handle clicks on `a[href^="#contact?"]` (or clear the hash after routing). |
| 12 | P3 | `src/data/brand.js:28` | The Instagram handle renders as "@handle pending" with no `Placeholder` tag, unlike the contact rows. | Render the same `.tag` Placeholder as in the footer. |
| 13 | P3 | `src/components/About.jsx:24–25` | "handled by people you can talk to" is soft tone and is ledgered as a placeholder. Acceptable. | Client to approve. |
| 14 | P3 | `public/assets/` | Unused files ship to `dist`: `ig-911-hillside` 33 KB, `ig-door-card` 79 KB, `service-body` 61 KB, `service-paint` 37 KB, `service-restoration` 105 KB (~315 KB total, all in the BRIEF §16 "Cut" list). | Move them out of `public/` (e.g. `assets-src/`) so they don't deploy. |
| 15 | P3 | `public/assets/hero-mercedes-w111.webp` | 448 KB at only 1440 w, the heaviest asset (it's lazy, but it loads on the first slider interaction). `hero-porsche-911-cabriolet` is 309 KB. | Re-encode at q≈72–75. Aim for ≤250 KB each. |
| 16 | P3 | `public/assets/classics-camaro-studio.webp` | 68 KB at 2752×1536, which suggests very heavy compression for a full-bleed 1440 × 100vh stage. It may show banding in the dark gradients. | Check it at 1440 / 2x. Re-encode at higher quality if banding shows (this is moot once it's replaced, see #8). |
| 17 | P3 | `index.html:13` | Favicon is `data:,` (none). There are no Open Graph tags. | Add a neutral placeholder favicon and basic `og:title`/`og:description` (from brand.js) once the name is final. |
| 18 | P3 | `package.json` | There are no `lint`/`test` scripts. That's acceptable for the scope. Otherwise the config is sensible: dev 5190 / preview 5191 strictPort; deps are react 19.3, react-dom, gsap 3.15, @gsap/react, @fontsource-variable/inter-tight; dev deps vite 8.3, @vitejs/plugin-react 6.1; no Lenis (a recorded DNA90 yield). `.gitignore` covers node_modules, dist, build, .env. | None required. |
| 19 | P3 | project root | The stray `reff1.png` (2.1 MB) duplicates `reference/reff1.png`. It isn't shipped. The project folder is named `____CAR LOFT`, but that's only a path and isn't in any shipped string. | Leave as is, or delete the duplicate if the client agrees (BRIEF §17.6). |

## 1. Branding

- `grep -riE "car ?loft|carloft"` (excluding node_modules, docs, reference) found **1 hit:
  CLAUDE.md:62**, which is the prohibition itself. There are 0 hits in `src/`, `index.html`, `public/` and
  `package.json`. The package name is `dealership-homepage`.
- `src/data/brand.js` holds the wordmark, name note, descriptor, contact (address, phone, email,
  hours, all `placeholder: true`), repairShopUrl, instagram handle/url, the legal line, nav and footer links,
  and topic labels. Header, Hero (visually-hidden h1 prefix) and Footer all read from it. No
  component contains a phone, email, address or the name. **The exception is `index.html`
  title/description (#6).**

## 2. Claim-shaped strings in the render

| String | Where | Visibly marked? | Verdict |
|---|---|---|---|
| 7 × make/model/trim (AMG GT R; 911 Carrera S; GR Corolla; E 300 4MATIC; ES 300h; CR-V EX AWD; 4Runner) | cards, dialog | "Illustrative listing" eyebrow per card and in the dialog, alt "illustrative photograph", section note "Illustrative listings with sample prices — not current stock.", dialog note | OK (CP4) |
| Years 2016/2023/2018/2016/2015/2007; AMG "Not stated" | card meta, dialog | same | OK. They come from other dealers' filenames, not the reference. |
| Mileage 6,000–142,000 mi, transmissions | card meta, dialog | same | OK (invented, marked) |
| Prices $12,000–$148,000 | card, dialog | "Sample price" label on every price | OK |
| Price filter "Up to $20,000 / $40,000 / $75,000 / $100,000" | search | Not marked on the control itself | Acceptable, since it's derived from the sample data |
| "Showing N of 7 illustrative listings" | inventory | yes | OK |
| "Handpicked. Honestly priced." | inventory H2 | no | **P2 #5** |
| "no obligation to accept" | Sell | no | **P2 #2** |
| "you keep ownership until it sells" | Consign | no | **P2 #3** |
| "We'll explain the terms plainly before you commit." | Finance | no | **P2 #4** |
| "Ask us about financing options" | Finance | — | OK: Finance is a brief pathway. No rates or approval promises. |
| "We buy, sell, consign and restore classic American muscle — from honest drivers to full restorations." | Classics | — | Sourced (brief M1) |
| Repairs / Paint & Body / Restoration | Service | — | Sourced (brief M1 service capabilities) |
| "Used cars across price ranges…", "Porsche and Mercedes to Lexus, Honda and Toyota" | Hero | — | Sourced |
| "Good cars. Real people." | Hero | — | Tone, ledgered as a placeholder. Low risk. |
| Reviews ×2 | Reviews | Text reads "Customer review placeholder…" and the source reads "Review source pending" | OK. No names, stars or ratings. |
| Address/Phone/Email/Hours "… pending" | Footer | `Placeholder` tag on each | OK |
| "@handle pending" | Instagram | text only | P3 #12 |
| "Quality cars" | `<title>` | no | P2 #6 |
| "Illustrative image" | Classics | yes | Doesn't disclose that it's synthetic (P2 #8) |

Banned or removed words (competitive, trusted, experienced, expert, best, guarantee, warranty,
rated, stars, verified, qualified, concourse, under one roof, same-day, free): **0 hits** in
`src/`. There are no hours, addresses or phone numbers anywhere in `src/`.

## 3. Links and controls

In-page targets that exist: `#main`, `#top`, `#inventory`, `#sell`, `#classics`, `#service`,
`#finance`, `#about`, `#contact` (plus `#reviews`, `#instagram`). Every nav and footer href
resolves. `[id]{scroll-margin-top: var(--header-h)}` (base.css:95) clears the sticky header.

`#contact?topic=` keys used: sell, consign, classics, service, finance, visit, car (with id). Every
key is in `topicLabels`, and `useHashRoute` scrolls to and focuses `#contact`. The footer then states
"You asked about: …" and says the contact details are placeholders. The hero, Sell, Classics, Service,
Finance and About CTAs all route there. The Service CTA becomes external once `brand.repairShopUrl` is set.
Instagram tiles and the handle are plain figures/text while the URL is null, so there are no dead links.

Buttons: the menu button has visible text and aria-expanded/controls; hero prev/next have
aria-label; the search submit and all 4 selects are functional with labels; Show All / Clear
Filters work; the card's stretched `card__open` button opens the native `<dialog>`; the dialog close
button has aria-label; the Sell index buttons have no handler (#10). No `href="#"` or empty
href exists.

## 4. Section order (App.jsx:39–52)

Header → Hero → InventorySearch → FeaturedInventory → SellConsign → Classics (the only `.on-dark`)
→ Service → Finance → About → Reviews → Instagram → Footer. **Matches the brief.**

## 5. Assets

| File | px | KB | Used |
|---|---|---|---|
| hero-porsche-992-desert | 2560×1402 | 350 | hero 1 (LCP, preloaded with matching srcset/sizes, fetchpriority high, eager) |
| hero-porsche-992-desert-1600 | 1600×876 | 142 | hero 1 srcset |
| hero-porsche-911-cabriolet | 1920×1280 | 309 | hero 2 (lazy) |
| hero-mercedes-w111 | 1440×1256 | 448 | hero 3 (lazy) |
| inv-mercedes-amg-gt | 1200×800 | 36 | card |
| inv-porsche-911 | 1200×796 | 83 | card |
| inv-toyota-gr-corolla | 1000×750 | 210 | card |
| inv-mercedes-e300 | 960×640 | 101 | card |
| inv-lexus-es | 1000×750 | 103 | card |
| inv-honda-crv | 960×720 | 105 | card |
| inv-toyota-4runner | 960×960 | 169 | card |
| sell-porsche-992-rear | 1800×2250 | 172 | Sell |
| classics-camaro-studio | 2752×1536 | 68 | Classics |
| service-lift | 2000×1334 | 268 | Service |
| finance-interior | 1500×1000 | 124 | Finance |
| about-coast-road | 2200×1238 | 261 | About |
| ig-gt3rs / ig-engine / ig-cutlass | 900² | 67 / 135 / 61 | Instagram |
| ig-911-hillside, ig-door-card, service-body, service-paint, service-restoration | — | 33/79/61/37/105 | **unused** (#14) |

- Every `<img>` has width/height attributes that match the file's real pixels, and CSS declares 17
  `aspect-ratio` rules.
- Everything below the fold is `loading="lazy" decoding="async"`. Hero 1 is eager with
  `fetchPriority="high"`. The VehicleDialog image mounts only when opened.
- No `/Users/` string exists in `src/`, `index.html` or `public/`. Every path is `/assets/…`, served from `public/`.
  The reference screenshot isn't used as an image anywhere (tokens.css only mentions it in a comment).
- `public/assets` totals 3.5 MB on disk.

## 6. Config and build

`npx vite build --outDir <scratchpad>/auditbuild --emptyOutDir` gave **✓ 38 modules, built in 162 ms,
no warnings**.

| Output | Size | gzip |
|---|---|---|
| index.html | 1.17 kB | 0.63 kB |
| index-*.js | 254.37 kB | 77.93 kB |
| index-*.css | 32.68 kB | 7.17 kB |
| Inter Tight woff2 ×7 subsets | 10–90 kB each (latin 44.9, latin-ext 89.8) | loaded by unicode-range, so only latin is fetched in practice |

The JS is React 19 alone. With GSAP + ScrollTrigger it will grow by about 45 kB gz.

## 7. Meta

- `lang="en"`: yes. `charset`: yes. `viewport` `width=device-width, initial-scale=1.0`: yes.
- `<title>` and meta description exist but are hardcoded and carry "Quality" (#6).
- `theme-color #ffffff`: yes. The favicon is `data:` (empty) (#17). There are no OG tags.
- The inline `js` class script only scopes hover and staged CSS (it doesn't hide content).
