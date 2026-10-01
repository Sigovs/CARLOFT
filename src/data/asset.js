/**
 * asset(path) — a public/ file's URL under the site's base path.
 * Local dev / root hosting: "/". GitHub Pages: "/CARLOFT/" (vite.config.js,
 * `--mode pages`). Every image path in src/data goes through this.
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
