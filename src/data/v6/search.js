/**
 * V6 SRP search (client round, 2026-11-17): every filter is a dropdown, and every
 * list is BUILT FROM THE STOCK — the dealer's feed can carry its own spellings
 * ("8-Speed Automatic", "PDK", "Obsidian Black Metallic"), so no list is fixed: a
 * dropdown shows whatever values the cars carry, each with how many cars it finds.
 * No price filter (the client: "remove price"; price stays in the sort).
 * The V5 search in ../v5/stock.js stays as published.
 */
import { stock, MILE_STOPS } from '../v5/stock.js'

/* model keys carry their make: "Porsche|911" — a model only means something under its make */
export const modelKey = (v) => `${v.make}|${v.model}`
export const keyMake = (k) => k.split('|')[0]
export const keyModel = (k) => k.split('|').slice(1).join('|')

export const LISTS = ['make', 'model', 'body', 'transmission', 'drive', 'color']
export const SCALARS = ['yearMin', 'yearMax', 'mileMax', 'sort']
export const fresh = (sort = 'newest') => ({
  make: [], model: [], body: [], transmission: [], drive: [], color: [],
  yearMin: '', yearMax: '', mileMax: '', sort,
})

const uniq = (a) => [...new Set(a)]
const byText = (a, b) => a.localeCompare(b, 'en')
export const MAKES = uniq(stock.map((v) => v.make)).sort(byText)
export const YEARS = uniq(stock.map((v) => v.year)).sort((a, b) => b - a)
export { MILE_STOPS }
const FIELD = { body: 'body', transmission: 'transmission', drive: 'drive', color: 'color' }
/** the values a field carries in the stock, as the feed spells them */
export const valuesOf = (field) => uniq(stock.map((v) => v[FIELD[field]]).filter(Boolean)).sort(byText)
/** every model, under its make */
export const MODELS = uniq(stock.map(modelKey)).sort(byText)

/**
 * Does car v pass filter state f? A model narrows only its own make: Porsche 911 +
 * Ford ticked = every 911 and every Ford.
 */
export function passes(v, f) {
  if (f.make.length && !f.make.includes(v.make)) return false
  const models = f.model.filter((k) => keyMake(k) === v.make)
  if (models.length && !models.includes(modelKey(v))) return false
  for (const k of ['body', 'transmission', 'drive', 'color']) if (f[k].length && !f[k].includes(v[FIELD[k]])) return false
  if (f.yearMin && v.year < Number(f.yearMin)) return false
  if (f.yearMax && v.year > Number(f.yearMax)) return false
  if (f.mileMax && v.mileage > Number(f.mileMax)) return false
  return true
}

const ORDER = {
  newest: (a, b) => b.added - a.added,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'miles-asc': (a, b) => a.mileage - b.mileage,
  'year-desc': (a, b) => b.year - a.year,
}
export const search = (f) => stock.filter((v) => passes(v, f)).sort(ORDER[f.sort] || ORDER.newest)

/** how many cars the search finds with this change — the number beside each option */
export const countWith = (f, patch) => stock.filter((v) => passes(v, { ...f, ...patch })).length

/** the make list changes: models of makes that are no longer ticked go with them */
export const withMakes = (f, make) => ({
  ...f,
  make,
  model: make.length ? f.model.filter((k) => make.includes(keyMake(k))) : [],
})

/** the model list changes: a ticked model ticks its make (the chips row says so too) */
export const withModels = (f, model) => ({ ...f, model, make: uniq([...f.make, ...model.map(keyMake)]) })

/** everything in the Filters panel (make and model too — they live there now) */
export const panelCount = (f) =>
  f.make.length + f.model.length + f.body.length + f.transmission.length + f.drive.length + f.color.length +
  (f.yearMin || f.yearMax ? 1 : 0) + (f.mileMax ? 1 : 0)

export const fmtMi = (n) => `${Number(n).toLocaleString('en-US')} mi`
