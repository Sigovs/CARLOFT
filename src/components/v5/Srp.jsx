import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { brand } from '../../data/brand.js'
import { lockScroll, unlockScroll } from '../../motion/scroll.js'
import { StockPage, Crumbs, SampleNote, StockCard } from './StockPage.jsx'
import {
  BODIES,
  EMPTY,
  HOME_URL,
  MAKES,
  PRICE_STEPS,
  SORTS,
  TRANSMISSIONS,
  YEAR_STEPS,
  activeCount,
  fmtPrice,
  searchStock,
  stock,
} from '../../data/v5/stock.js'

/* ---- the filter state lives in the query string: a search can be shared or reloaded ---- */
const LIST = ['make', 'body']
function readQuery() {
  const q = new URLSearchParams(window.location.search)
  const f = { ...EMPTY, make: [], body: [] }
  LIST.forEach((k) => {
    const v = q.get(k)
    if (v) f[k] = v.split(',').filter(Boolean)
  })
  ;['transmission', 'maxPrice', 'minYear', 'sort'].forEach((k) => {
    if (q.get(k)) f[k] = q.get(k)
  })
  return f
}
function writeQuery(f) {
  const url = new URL(window.location.href)
  Object.keys(EMPTY).forEach((k) => {
    const v = LIST.includes(k) ? f[k].join(',') : f[k]
    if (v && !(k === 'sort' && v === 'newest')) url.searchParams.set(k, v)
    else url.searchParams.delete(k)
  })
  window.history.replaceState(window.history.state, '', url)
}

const countBy = (key, value) => stock.filter((v) => v[key] === value).length

/**
 * SRP — inventory_v5.html. Filters (make, body, transmission, max price, year from)
 * beside the results on desktop; behind a "Filters" toggle on tablet and phone.
 * Sort, a live count, removable chips for what is applied, an empty state.
 */
export default function Srp() {
  const [f, setF] = useState(readQuery)
  const [open, setOpen] = useState(false)
  const countRef = useRef(null)
  const results = useMemo(() => searchStock(f), [f])
  const n = activeCount(f)

  useEffect(() => writeQuery(f), [f])
  useEffect(() => {
    document.title = `Inventory — ${brand.wordmark}`
  }, [])

  // The sheet (below 1024): page scroll locked while open, Escape closes it, and it
  // closes itself when the window grows into the desktop layout.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(max-width: 1023px)')
    if (!mq.matches) return setOpen(false)
    document.body.classList.add('is-locked')
    lockScroll()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onMq = () => !mq.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      document.body.classList.remove('is-locked')
      unlockScroll()
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const toggle = (key, value) =>
    setF((p) => ({ ...p, [key]: p[key].includes(value) ? p[key].filter((x) => x !== value) : [...p[key], value] }))
  const set = (key, value) => setF((p) => ({ ...p, [key]: value }))
  const clear = () => setF((p) => ({ ...EMPTY, make: [], body: [], sort: p.sort }))

  const chips = [
    ...f.make.map((m) => ({ label: m, off: () => toggle('make', m) })),
    ...f.body.map((b) => ({ label: b, off: () => toggle('body', b) })),
    ...(f.transmission ? [{ label: f.transmission, off: () => set('transmission', '') }] : []),
    ...(f.maxPrice ? [{ label: `Up to ${fmtPrice(Number(f.maxPrice))}`, off: () => set('maxPrice', '') }] : []),
    ...(f.minYear ? [{ label: `${f.minYear} or newer`, off: () => set('minYear', '') }] : []),
  ]

  return (
    <StockPage>
      <section className="stock-head" aria-labelledby="srp-title">
        <div className="container">
          <Crumbs items={[{ label: 'Home', href: HOME_URL }, { label: 'Inventory' }]} />
          <div className="stock-head__row">
            <h1 id="srp-title" className="h2 stock-head__title">
              Inventory
            </h1>
            <SampleNote>
              Sample listings for the mockup — studio photographs; mileage, prices and stock numbers are placeholders.
            </SampleNote>
          </div>
        </div>
      </section>

      <div className="container srp">
        <aside id="srp-filters" className={`srp__filters${open ? ' is-open' : ''}`} aria-label="Filters" data-lenis-prevent>
          <div className="srp__filters-head">
            <h2 className="eyebrow">Filters</h2>
            {n > 0 ? (
              <button type="button" className="srp__clear small" onClick={clear}>
                Clear all
              </button>
            ) : null}
          </div>

          <Group title="Make">
            {MAKES.map((m) => (
              <Check key={m} label={m} count={countBy('make', m)} checked={f.make.includes(m)} onChange={() => toggle('make', m)} />
            ))}
          </Group>

          <Group title="Body type">
            {BODIES.map((b) => (
              <Check key={b} label={b} count={countBy('body', b)} checked={f.body.includes(b)} onChange={() => toggle('body', b)} />
            ))}
          </Group>

          <Group title="Transmission">
            <div className="srp__seg" role="group" aria-label="Transmission">
              {['', ...TRANSMISSIONS].map((t) => (
                <button
                  key={t || 'any'}
                  type="button"
                  className="pill pill--outline pill--toggle"
                  aria-pressed={f.transmission === t}
                  onClick={() => set('transmission', t)}
                >
                  {t || 'Any'}
                </button>
              ))}
            </div>
          </Group>

          <Group title="Price">
            <Select label="Max price" value={f.maxPrice} onChange={(v) => set('maxPrice', v)}>
              <option value="">Any price</option>
              {PRICE_STEPS.map((p) => (
                <option key={p} value={p}>
                  Up to {fmtPrice(p)}
                </option>
              ))}
            </Select>
          </Group>

          <Group title="Year">
            <Select label="Year from" value={f.minYear} onChange={(v) => set('minYear', v)}>
              <option value="">Any year</option>
              {YEAR_STEPS.map((y) => (
                <option key={y} value={y}>
                  {y} or newer
                </option>
              ))}
            </Select>
          </Group>

          <button type="button" className="btn srp__done" onClick={() => setOpen(false)}>
            Show {results.length} {results.length === 1 ? 'vehicle' : 'vehicles'}
          </button>
        </aside>

        <div className="srp__results">
          <div className="srp__bar">
            <p ref={countRef} className="srp__count title tabular" aria-live="polite" aria-atomic="true">
              {results.length} {results.length === 1 ? 'vehicle' : 'vehicles'}
              <span className="srp__of small"> of {stock.length}</span>
            </p>
            <div className="srp__tools">
              <button
                type="button"
                className="pill pill--outline srp__toggle"
                aria-expanded={open}
                aria-controls="srp-filters"
                onClick={() => setOpen((o) => !o)}
              >
                Filters{n ? ` (${n})` : ''}
                <Icon name={open ? 'close' : 'chevron-down'} className="icon--static" />
              </button>
              <Select label="Sort by" value={f.sort} onChange={(v) => set('sort', v)} inline>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {chips.length ? (
            <ul className="srp__chips" aria-label="Applied filters">
              {chips.map((c) => (
                <li key={c.label}>
                  <button type="button" className="pill pill--outline srp__chip" onClick={c.off} aria-label={`Remove ${c.label}`}>
                    {c.label}
                    <Icon name="close" className="icon--static" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {results.length ? (
            <ul className="srp__grid">
              {results.map((v, i) => (
                <li key={v.id}>
                  <StockCard v={v} eager={i < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="srp__empty">
              <p className="title">No sample listing matches these filters.</p>
              <p className="body">Remove a filter above, or clear them all to see every car.</p>
              <button type="button" className="btn btn--secondary" onClick={clear}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </StockPage>
  )
}

function Group({ title, children }) {
  return (
    <fieldset className="srp__group">
      <legend className="srp__legend">{title}</legend>
      {children}
    </fieldset>
  )
}

function Check({ label, count, checked, onChange }) {
  return (
    <label className="srp__check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="srp__box" aria-hidden="true" />
      <span className="srp__check-label">{label}</span>
      <span className="srp__check-count small tabular">{count}</span>
    </label>
  )
}

function Select({ label, value, onChange, children, inline = false }) {
  const id = useId()
  return (
    <div className={`srp__select${inline ? ' srp__select--inline' : ''}`}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <div className="select">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {children}
        </select>
        <Icon name="chevron-down" className="select__chevron icon--static" />
      </div>
    </div>
  )
}
