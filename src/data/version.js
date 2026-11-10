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
