/**
 * Which page is running. index.html = V1; index_v2.html sets
 * <html data-version="v2"> (V2: client feedback 2026-10-29). Data files pick
 * their V2 set from src/data/v2/, and src/styles/v2.css scopes its overrides
 * to :root[data-version='v2'].
 */
export const V2 = typeof document !== 'undefined' && document.documentElement.dataset.version === 'v2'
