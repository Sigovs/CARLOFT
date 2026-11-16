/**
 * V5 stock — the SIMULATED inventory behind the SRP (inventory_v5.html) and the VDP
 * (vehicle_v5.html). Alex, 2026-11-16: "делаем SRP, VDP, симулируем машины".
 *
 * NOT CAR LOFT STOCK. Photographs: one white-studio listing set in WORK (DU PONT
 * REGESTRY/…/assets/source) — only frames without a number plate, never the branded
 * cover (scratchpad make_stock.py). Year / make / model come from the listing folder
 * and match the car in the frame; colour is what the photograph shows; drivetrain is
 * the model's layout. Mileage, transmission, price and stock number are INVENTED round
 * placeholders that exist only to exercise the search — rendered as "Sample …" and the
 * page carries a "Sample listings" notice.
 */

import { asset } from '../asset.js'

const N = {
  'porsche-918-spyder-2015': 3, 'porsche-911-gt2rs-2018': 4, 'porsche-911-sport-classic-2023': 4,
  'porsche-911-speedster-2019': 3, 'porsche-911-gt3-2024': 4, 'mercedes-maybach-s580-2024': 4,
  'cadillac-ct5-2024': 4, 'chevrolet-corvette-zr1-2027': 3, 'ford-gt-2006': 4, 'nissan-skyline-gtr-2000': 4,
}
const SMALL = new Set(['porsche-911-gt3-2024', 'mercedes-maybach-s580-2024', 'cadillac-ct5-2024']) // 1024px sources

/** gallery frames: { src, srcSet } */
const frames = (id, n) =>
  Array.from({ length: n }, (_, i) => {
    const base = `assets/stock/${id}-${i + 1}`
    return {
      src: asset(`${base}-960.webp`),
      srcSet: SMALL.has(id)
        ? `${asset(`${base}-960.webp`)} 960w`
        : `${asset(`${base}-960.webp`)} 960w, ${asset(`${base}-1600.webp`)} 1600w`,
    }
  })

const car = (id, o) => ({ id, ...o, photos: frames(id, N[id] ?? (id === 'mercedes-amg-g63-2025' ? 1 : 2)) })

export const stock = [
  car('porsche-911-sport-classic-2023', { year: 2023, make: 'Porsche', model: '911', trim: 'Sport Classic', body: 'Coupe', color: 'Green', drive: 'Rear-wheel drive', transmission: 'Manual', mileage: 1200, price: 489000, stockNo: 'CL-1023', added: 21 }),
  car('porsche-918-spyder-2015', { year: 2015, make: 'Porsche', model: '918', trim: 'Spyder', body: 'Convertible', color: 'Yellow', drive: 'All-wheel drive', transmission: 'Automatic', mileage: 2900, price: 1650000, stockNo: 'CL-1015', added: 20 }),
  car('porsche-911-gt2rs-2018', { year: 2018, make: 'Porsche', model: '911', trim: 'GT2 RS', body: 'Coupe', color: 'Yellow', drive: 'Rear-wheel drive', transmission: 'Automatic', mileage: 4100, price: 395000, stockNo: 'CL-1018', added: 19 }),
  car('porsche-911-speedster-2019', { year: 2019, make: 'Porsche', model: '911', trim: 'Speedster', body: 'Convertible', color: 'Silver', drive: 'Rear-wheel drive', transmission: 'Manual', mileage: 1800, price: 345000, stockNo: 'CL-1019', added: 18 }),
  car('mercedes-maybach-s580-2024', { year: 2024, make: 'Mercedes-Benz', model: 'Maybach S 580', trim: null, body: 'Sedan', color: 'Silver', drive: 'All-wheel drive', transmission: 'Automatic', mileage: 6000, price: 189000, stockNo: 'CL-1024', added: 17 }),
  car('porsche-911-gt3-2024', { year: 2024, make: 'Porsche', model: '911', trim: 'GT3', body: 'Coupe', color: 'Silver', drive: 'Rear-wheel drive', transmission: 'Manual', mileage: 2500, price: 249000, stockNo: 'CL-1124', added: 16 }),
  car('chevrolet-corvette-zr1-2027', { year: 2027, make: 'Chevrolet', model: 'Corvette', trim: 'ZR1', body: 'Coupe', color: 'White', drive: 'Rear-wheel drive', transmission: 'Automatic', mileage: 300, price: 219000, stockNo: 'CL-1027', added: 15 }),
  car('ford-gt-2006', { year: 2006, make: 'Ford', model: 'GT', trim: null, body: 'Coupe', color: 'Red', drive: 'Rear-wheel drive', transmission: 'Manual', mileage: 7800, price: 495000, stockNo: 'CL-1006', added: 14 }),
  car('nissan-skyline-gtr-2000', { year: 2000, make: 'Nissan', model: 'Skyline', trim: 'GT-R', body: 'Coupe', color: 'White', drive: 'All-wheel drive', transmission: 'Manual', mileage: 38000, price: 189000, stockNo: 'CL-1000', added: 13 }),
  car('cadillac-ct5-2024', { year: 2024, make: 'Cadillac', model: 'CT5', trim: null, body: 'Sedan', color: 'White', drive: 'Rear-wheel drive', transmission: 'Automatic', mileage: 5200, price: 98000, stockNo: 'CL-1224', added: 12 }),
  car('porsche-911-targa-4s-2022', { year: 2022, make: 'Porsche', model: '911', trim: 'Targa 4S', body: 'Convertible', color: 'Silver', drive: 'All-wheel drive', transmission: 'Automatic', mileage: 14000, price: 168000, stockNo: 'CL-1122', added: 11 }),
  car('mazda-mx5-2016', { year: 2016, make: 'Mazda', model: 'MX-5 Miata', trim: null, body: 'Convertible', color: 'Red', drive: 'Rear-wheel drive', transmission: 'Manual', mileage: 42000, price: 17000, stockNo: 'CL-1016', added: 10 }),
  car('porsche-macan-gts-2022', { year: 2022, make: 'Porsche', model: 'Macan', trim: 'GTS', body: 'SUV', color: 'White', drive: 'All-wheel drive', transmission: 'Automatic', mileage: 21000, price: 72000, stockNo: 'CL-1222', added: 9 }),
  car('ford-mustang-gt350-2020', { year: 2020, make: 'Ford', model: 'Mustang', trim: 'Shelby GT350', body: 'Coupe', color: 'Silver', drive: 'Rear-wheel drive', transmission: 'Manual', mileage: 9000, price: 64000, stockNo: 'CL-1020', added: 8 }),
  car('porsche-718-cayman-gts-2022', { year: 2022, make: 'Porsche', model: '718 Cayman', trim: 'GTS', body: 'Coupe', color: 'White', drive: 'Rear-wheel drive', transmission: 'Automatic', mileage: 11000, price: 94000, stockNo: 'CL-1322', added: 7 }),
  car('land-rover-range-rover-2024', { year: 2024, make: 'Land Rover', model: 'Range Rover', trim: null, body: 'SUV', color: 'White', drive: 'All-wheel drive', transmission: 'Automatic', mileage: 8000, price: 139000, stockNo: 'CL-1324', added: 6 }),
  car('mercedes-amg-g63-2025', { year: 2025, make: 'Mercedes-Benz', model: 'AMG G 63', trim: null, body: 'SUV', color: 'Grey', drive: 'All-wheel drive', transmission: 'Automatic', mileage: 3000, price: 219000, stockNo: 'CL-1025', added: 5 }),
  car('porsche-cayenne-turbo-2024', { year: 2024, make: 'Porsche', model: 'Cayenne', trim: 'Turbo', body: 'SUV', color: 'Black', drive: 'All-wheel drive', transmission: 'Automatic', mileage: 9500, price: 129000, stockNo: 'CL-1424', added: 4 }),
  car('porsche-911-carrera-gts-2017', { year: 2017, make: 'Porsche', model: '911', trim: 'Carrera GTS', body: 'Coupe', color: 'Black', drive: 'Rear-wheel drive', transmission: 'Manual', mileage: 24000, price: 109000, stockNo: 'CL-1017', added: 3 }),
  car('ford-mustang-gt500-2021', { year: 2021, make: 'Ford', model: 'Mustang', trim: 'Shelby GT500', body: 'Coupe', color: 'Orange', drive: 'Rear-wheel drive', transmission: 'Automatic', mileage: 6500, price: 89000, stockNo: 'CL-1021', added: 2 }),
  car('chevrolet-corvette-z06-2026', { year: 2026, make: 'Chevrolet', model: 'Corvette', trim: 'Z06', body: 'Convertible', color: 'Blue', drive: 'Rear-wheel drive', transmission: 'Automatic', mileage: 500, price: 139000, stockNo: 'CL-1026', added: 1 }),
]

export const stockTitle = (v) => `${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`
export const stockById = (id) => stock.find((v) => v.id === id) || null

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-US')
export const fmtPrice = (n) => usd.format(n)
export const fmtMiles = (n) => `${num.format(n)} mi`

/* ---- search ---- */
const uniq = (a) => [...new Set(a)]
export const MAKES = uniq(stock.map((v) => v.make)).sort()
export const BODIES = uniq(stock.map((v) => v.body)).sort()
export const TRANSMISSIONS = ['Automatic', 'Manual']
export const PRICE_STEPS = [50000, 100000, 200000, 500000]
export const YEAR_STEPS = [2000, 2015, 2020, 2024]

export const EMPTY = { make: [], body: [], transmission: '', maxPrice: '', minYear: '', sort: 'newest' }

export const SORTS = [
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'miles-asc', label: 'Mileage: lowest first' },
  { value: 'year-desc', label: 'Year: newest first' },
]

export function searchStock(f) {
  const list = stock.filter(
    (v) =>
      (!f.make.length || f.make.includes(v.make)) &&
      (!f.body.length || f.body.includes(v.body)) &&
      (!f.transmission || v.transmission === f.transmission) &&
      (!f.maxPrice || v.price <= Number(f.maxPrice)) &&
      (!f.minYear || v.year >= Number(f.minYear)),
  )
  const by = {
    newest: (a, b) => b.added - a.added,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'miles-asc': (a, b) => a.mileage - b.mileage,
    'year-desc': (a, b) => b.year - a.year,
  }[f.sort] || ((a, b) => b.added - a.added)
  return list.sort(by)
}

export const activeCount = (f) =>
  f.make.length + f.body.length + (f.transmission ? 1 : 0) + (f.maxPrice ? 1 : 0) + (f.minYear ? 1 : 0)

/** Similar listings for the VDP: same body first, then same make, never itself. */
export function similarTo(v, n = 3) {
  const score = (x) => (x.body === v.body ? 2 : 0) + (x.make === v.make ? 1 : 0)
  return stock
    .filter((x) => x.id !== v.id)
    .sort((a, b) => score(b) - score(a) || Math.abs(a.price - v.price) - Math.abs(b.price - v.price))
    .slice(0, n)
}

/* ---- pages ---- */
/** The home page's seven listings are the same cars: their VDPs. */
export const HOME_TO_STOCK = {
  'p911-targa': 'porsche-911-targa-4s-2022', mx5: 'mazda-mx5-2016', macan: 'porsche-macan-gts-2022',
  gt350: 'ford-mustang-gt350-2020', cayman: 'porsche-718-cayman-gts-2022',
  'range-rover': 'land-rover-range-rover-2024', g63: 'mercedes-amg-g63-2025',
}
export const SRP_URL = 'inventory_v5.html'
export const HOME_URL = 'index_v5.html'
export const vdpUrl = (id) => `vehicle_v5.html?id=${encodeURIComponent(id)}`

/** A header / footer link from an inner page: the home page's section, or the SRP. */
export function pageHref(href, page) {
  if (href === '#inventory') return SRP_URL
  // #contact… stays on the page: every page ends in the same footer (#contact).
  if (page !== 'home' && href.startsWith('#') && !href.startsWith('#contact')) return `${HOME_URL}${href}`
  return href
}
