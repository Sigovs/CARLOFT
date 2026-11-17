/**
 * Which page is running. index.html = V1; index_v2.html sets
 * <html data-version="v2"> (V2: client feedback 2026-10-29). Data files pick
 * their V2 set from src/data/v2/, and src/styles/v2.css scopes its overrides
 * to :root[data-version='v2'].
 */
export const V2 = typeof document !== 'undefined' && document.documentElement.dataset.version === 'v2'

/**
 * V2.2 — index_v2_2.html (Alex, 2026-11-09). A layer ON TOP of V2: the page also
 * sets data-version="v2", so everything V2 does still applies. Changes for V2.2
 * branch on this flag (JS) or live in src/styles/v2_2.css, scoped to
 * :root[data-variant='v2_2'] — so index_v2.html, the client's mockup, never moves.
 */
export const V2_2 = V2 && document.documentElement.dataset.variant === 'v2_2'

/**
 * V2.3 — index_v2_3.html (Alex, 2026-11-12: "take the live V2.2 and make a new
 * version"). A layer ON TOP of V2.2: the page also sets data-variant="v2_2", so
 * everything V2.2 does still applies; V2.3's changes branch on this flag or live in
 * src/styles/v2_3.css, scoped to :root[data-round='v2_3']. V2.2 stays as published.
 */
export const V2_3 = V2_2 && document.documentElement.dataset.round === 'v2_3'

/**
 * V5 — index_v5.html (Alex, 2026-11-16: "make the next one, v5"). A layer ON TOP of
 * V2.3 (the page also sets data-round="v2_3"): the client liked V2.2's colour, so V5
 * brings back the V2.2 Miami Blue (#14f3ff, the gradient logo) and adds the 16 Nov
 * header round. Rules live in src/styles/v5.css, scoped to :root[data-release='v5'].
 */
export const V5 = V2_3 && document.documentElement.dataset.release === 'v5'

/**
 * V6 — index_v6.html, inventory_v6.html, vehicle_v6.html (Alex, 2026-11-17: the client
 * round on the SRP + VDP — "делай в 6 для всего"). A layer ON TOP of V5 (the pages also
 * set data-release="v5"); V6 changes branch on this flag, live in src/components/v6/ or in
 * src/styles/v6.css, scoped to :root[data-edition='v6']. The _v5 pages never move.
 */
export const V6 = V5 && document.documentElement.dataset.edition === 'v6'

/**
 * Which V5 page: 'home' (index_v5.html), 'srp' (inventory_v5.html) or 'vdp'
 * (vehicle_v5.html) — <html data-page>. The header and footer link back to the home
 * page's sections from the inner pages, and the bar is solid there from the start.
 */
export const PAGE = (typeof document !== 'undefined' && document.documentElement.dataset.page) || 'home'
