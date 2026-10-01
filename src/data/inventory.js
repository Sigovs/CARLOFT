/**
 * inventory.js — ILLUSTRATIVE mock dataset (BRIEF §14.4, claims ledger §15).
 *
 * None of these vehicles is current stock. Make / model / trim match the car
 * each photograph actually shows (CP7: the photograph governs the row). Years
 * come from the source filenames; mileage, transmission and prices are
 * invented round figures that exist only so the search can be exercised.
 * Every price is rendered as "Sample price".
 *
 * `featured: true` = one of the three cards shown when no filter is active.
 * Default trio mirrors the reference's price spread (Porsche / Lexus / an
 * everyday SUV) — critique #8. Featured rows come first so "Show all" only
 * appends cards and never reorders the three already on screen.
 */

import { asset } from './asset.js'

const img = (file) => asset(`assets/${file}.webp`)

export const vehicles = [
  {
    id: 'p911',
    make: 'Porsche',
    model: '911',
    trim: 'Carrera S',
    body: 'Coupe',
    year: 2016,
    mileage: 31000,
    transmission: 'Automatic',
    price: 86000,
    image: img('inv-porsche-911'),
    width: 1200,
    height: 796,
    objectPosition: '50% 50%',
    featured: true,
    illustrative: true,
  },
  {
    id: 'es300h',
    make: 'Lexus',
    model: 'ES 300h',
    trim: null,
    body: 'Sedan',
    year: 2016,
    mileage: 64000,
    transmission: 'Automatic (hybrid)',
    price: 19000,
    image: img('inv-lexus-es'),
    width: 1000,
    height: 750,
    objectPosition: '50% 70%',
    featured: true,
    illustrative: true,
  },
  {
    id: 'crv',
    make: 'Honda',
    model: 'CR-V',
    trim: 'EX AWD',
    body: 'SUV',
    year: 2015,
    mileage: 78000,
    transmission: 'Automatic',
    price: 16000,
    image: img('inv-honda-crv'),
    width: 960,
    height: 720,
    objectPosition: '50% 60%',
    featured: true,
    illustrative: true,
  },
  {
    id: 'amg-gtr',
    make: 'Mercedes-Benz',
    model: 'AMG GT R',
    trim: null,
    body: 'Coupe',
    year: null, // unknown from the source photograph — shown without a year
    mileage: 12000,
    transmission: 'Automatic',
    price: 148000,
    image: img('inv-mercedes-amg-gt'),
    width: 1200,
    height: 800,
    objectPosition: '50% 55%',
    featured: false,
    illustrative: true,
  },
  {
    id: 'gr-corolla',
    make: 'Toyota',
    model: 'GR Corolla',
    trim: null,
    body: 'Hatchback',
    year: 2023,
    mileage: 6000,
    transmission: 'Manual',
    price: 44000,
    image: img('inv-toyota-gr-corolla'),
    width: 1000,
    height: 750,
    objectPosition: '50% 55%',
    featured: false,
    illustrative: true,
  },
  {
    id: 'e300',
    make: 'Mercedes-Benz',
    model: 'E 300',
    trim: '4MATIC',
    body: 'Sedan',
    year: 2018,
    mileage: 41000,
    transmission: 'Automatic',
    price: 29000,
    image: img('inv-mercedes-e300'),
    width: 960,
    height: 640,
    objectPosition: '50% 50%',
    featured: false,
    illustrative: true,
  },
  {
    id: '4runner',
    make: 'Toyota',
    model: '4Runner',
    trim: null,
    body: 'SUV',
    year: 2007,
    mileage: 142000,
    transmission: 'Automatic',
    price: 12000,
    image: img('inv-toyota-4runner'),
    width: 960,
    height: 960,
    objectPosition: '50% 62%',
    featured: false,
    illustrative: true,
  },
]

/* ---- search options, derived from the dataset (BRIEF §14.3) ---- */

export const makes = [...new Set(vehicles.map((v) => v.make))].sort()

export const modelsFor = (make) =>
  [...new Set(vehicles.filter((v) => !make || v.make === make).map((v) => v.model))].sort()

export const bodyTypes = ['Coupe', 'Sedan', 'Hatchback', 'SUV']

/** Price-max options (derived from the sample prices; illustrative). */
export const priceOptions = [20000, 40000, 75000, 100000]

export const EMPTY_FILTERS = { make: '', model: '', price: '', body: '' }

export const hasActiveFilters = (f) => Boolean(f.make || f.model || f.price || f.body)

export const filterVehicles = (f) =>
  vehicles.filter(
    (v) =>
      (!f.make || v.make === f.make) &&
      (!f.model || v.model === f.model) &&
      (!f.price || v.price <= Number(f.price)) &&
      (!f.body || v.body === f.body),
  )

/* ---- formatting ---- */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const num = new Intl.NumberFormat('en-US')

export const formatPrice = (n) => usd.format(n)
export const formatMiles = (n) => `${num.format(n)} mi`
export const vehicleTitle = (v) => `${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`
export const vehicleMeta = (v) =>
  [v.year, formatMiles(v.mileage), v.transmission].filter(Boolean)
