import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { brand } from '../../data/brand.js'
import { scrollToY } from '../../motion/scroll.js'
import { StockPage, Crumbs, StockCard } from './StockPage.jsx'
import {
  BODIES,
  COLORS,
  DRIVES,
  EMPTY,
  HOME_URL,
  MAKES,
  MILE_STOPS,
  PRICE_STOPS,
  SORTS,
  TRANSMISSIONS,
  YEAR_MAX,
  YEAR_MIN,
  fmtPrice,
  panelCount,
  searchStock,
  stock,
} from '../../data/v5/stock.js'

/* ---- the filter state lives in the query string: a search can be shared or reloaded ---- */
const LIST = ['make', 'body', 'drive', 'color']
const SCALAR = ['transmission', 'priceMin', 'priceMax', 'yearMin', 'yearMax', 'mileMax', 'sort']
const fresh = (sort = 'newest') => ({ ...EMPTY, make: [], body: [], drive: [], color: [], sort })

function readQuery() {
  const q = new URLSearchParams(window.location.search)
  const f = fresh()
  LIST.forEach((k) => {
    const v = q.get(k)
    if (v) f[k] = v.split(',').filter(Boolean)
  })
  SCALAR.forEach((k) => {
    if (q.get(k)) f[k] = q.get(k)
  })
  return f
}
function writeQuery(f) {
  const url = new URL(window.location.href)
  ;[...LIST, ...SCALAR].forEach((k) => {
    const v = LIST.includes(k) ? f[k].join(',') : f[k]
    if (v && !(k === 'sort' && v === 'newest')) url.searchParams.set(k, v)
    else url.searchParams.delete(k)
  })
  ;['maxPrice', 'minYear'].forEach((k) => url.searchParams.delete(k)) // the old keys
  window.history.replaceState(window.history.state, '', url)
}

const LAST = PRICE_STOPS.length - 1
/** "Any price" · "Up to $400,000" · "$100,000 and up" · "$100,000 – $400,000" */
function priceText(lo, hi) {
  if (lo === 0 && hi === LAST) return 'Any price'
  if (lo === 0) return `Up to ${fmtPrice(PRICE_STOPS[hi])}`
  if (hi === LAST) return `${fmtPrice(PRICE_STOPS[lo])} and up`
  return `${fmtPrice(PRICE_STOPS[lo])} – ${fmtPrice(PRICE_STOPS[hi])}`
}
const priceIndex = (v, fallback) => (v === '' ? fallback : Math.max(0, PRICE_STOPS.findIndex((p) => p >= Number(v))))

/**
 * SRP — inventory_v5.html (Alex, 2026-11-16: the sidebar "looks like 2000" → rebuilt).
 * The home page's language: make chips in one row (the Featured inventory quick
 * filters), "Filters" + sort in the head row. "Filters" opens an accordion right
 * under it, across the page (Alex, 2026-11-17: no slide-in drawer) — sliders in one
 * row, pills in the next, colours last. The results take the full width.
 */
export default function Srp() {
  const [f, setF] = useState(readQuery)
  const [open, setOpen] = useState(false)
  const filtersBtn = useRef(null)
  const barMark = useRef(null) // where the sticky bar sits in the flow
  // the makes row fades at its right end only while more makes hide there
  const makesRow = useRef(null)
  const [more, setMore] = useState(false)
  const measure = useCallback(() => {
    const el = makesRow.current
    if (el) setMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])
  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (makesRow.current) ro.observe(makesRow.current)
    return () => ro.disconnect()
  }, [measure])
  // the bar is stuck under the header: bring it back to its own place, so the panel
  // (which opens under it) and the first results are in view
  const unstick = useCallback(() => {
    const mark = barMark.current
    if (!mark) return
    const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0
    const top = mark.getBoundingClientRect().top
    if (top < head) scrollToY(window.scrollY + top - head)
  }, [])
  const toggleOpen = () => {
    if (!open) unstick()
    setOpen((o) => !o)
  }
  // Escape inside the panel: shut it and give focus back to the button that opened it
  const close = useCallback(() => {
    setOpen(false)
    filtersBtn.current?.focus({ preventScroll: true })
  }, [])
  // "Show N cars": shut it and bring the results up
  const showResults = useCallback(() => {
    setOpen(false)
    filtersBtn.current?.focus({ preventScroll: true })
    unstick()
  }, [unstick])
  const results = useMemo(() => searchStock(f), [f])
  const n = panelCount(f)

  useEffect(() => writeQuery(f), [f])
  useEffect(() => {
    document.title = `Inventory — ${brand.wordmark}`
  }, [])

  const toggle = (key, value) =>
    setF((p) => ({ ...p, [key]: p[key].includes(value) ? p[key].filter((x) => x !== value) : [...p[key], value] }))
  const set = (patch) => setF((p) => ({ ...p, ...patch }))
  const clearAll = () => setF((p) => fresh(p.sort))
  const clearPanel = () => setF((p) => ({ ...fresh(p.sort), make: p.make }))

  const priceLabel =
    f.priceMin || f.priceMax ? priceText(priceIndex(f.priceMin, 0), priceIndex(f.priceMax, LAST)) : null
  const yearLabel = f.yearMin || f.yearMax ? `${f.yearMin || YEAR_MIN} – ${f.yearMax || YEAR_MAX}` : null
  const chips = [
    ...f.body.map((b) => ({ label: b, off: () => toggle('body', b) })),
    ...(f.transmission ? [{ label: f.transmission, off: () => set({ transmission: '' }) }] : []),
    ...(priceLabel ? [{ label: priceLabel, off: () => set({ priceMin: '', priceMax: '' }) }] : []),
    ...(yearLabel ? [{ label: yearLabel, off: () => set({ yearMin: '', yearMax: '' }) }] : []),
    ...(f.mileMax ? [{ label: `Under ${Number(f.mileMax).toLocaleString('en-US')} mi`, off: () => set({ mileMax: '' }) }] : []),
    ...f.drive.map((d) => ({ label: d, off: () => toggle('drive', d) })),
    ...f.color.map((c) => ({ label: c, off: () => toggle('color', c) })),
  ]
  const countText = `${results.length} ${results.length === 1 ? 'car' : 'cars'}`

  return (
    <StockPage>
      <section className="stock-head" aria-labelledby="srp-title">
        <div className="container">
          <Crumbs items={[{ label: 'Home', href: HOME_URL }, { label: 'Inventory' }]} />
          <div className="stock-head__row">
            <div className="srp__title-block">
              <h1 id="srp-title" className="h2 stock-head__title">
                Inventory
              </h1>
              <p className="srp__count small tabular" aria-live="polite" aria-atomic="true">
                {countText} <span className="srp__of">of {stock.length}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters · the makes · sort — one bar under the head (Alex, 2026-11-17); it sticks
          under the header while the results scroll */}
      <span ref={barMark} className="srp-bar__mark" aria-hidden="true" />
      <div className="srp-bar">
        <div className="container srp-bar__inner">
          <button
            ref={filtersBtn}
            type="button"
            className="pill srp-bar__filters"
            aria-expanded={open}
            aria-controls="srp-panel"
            onClick={toggleOpen}
          >
            <FiltersIcon />
            Filters{n ? <span className="srp-bar__badge tabular">{n}</span> : null}
            <Icon name="chevron-down" className="srp-bar__chev icon--static" />
          </button>
          <div className="srp-bar__makes" role="group" aria-label="Make" ref={makesRow} data-more={more || undefined} onScroll={measure}>
            <button type="button" className="pill pill--outline pill--toggle" aria-pressed={!f.make.length} onClick={() => set({ make: [] })}>
              All
            </button>
            {MAKES.map((m) => (
              <button key={m} type="button" className="pill pill--outline pill--toggle" aria-pressed={f.make.includes(m)} onClick={() => toggle('make', m)}>
                {m}
              </button>
            ))}
          </div>
          <SortSelect value={f.sort} onChange={(v) => set({ sort: v })} />
        </div>
      </div>

      <div className="container srp">
        <FilterPanel open={open} onClose={close} onShow={showResults} f={f} set={set} toggle={toggle} clear={clearPanel} count={results.length} />

        {chips.length ? (
          <div className="srp__applied">
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
            <button type="button" className="srp__clear small" onClick={clearAll}>
              Clear all
            </button>
          </div>
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
            <p className="title">No car matches these filters.</p>
            <p className="body">Widen the price or the years, or clear the filters to see all {stock.length}.</p>
            <button type="button" className="btn btn--secondary" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </StockPage>
  )
}

/* ---------------------------------------------------------------------------
   The filters: an accordion under the head row, as wide as the page. It folds
   open in place (no scrim, no drawer, no scroll of its own); the results under it
   update live. Three rows: the sliders, the pills, the colours. Make is not here —
   the make chips under the head already do it.
   --------------------------------------------------------------------------- */
function FilterPanel({ open, onClose, onShow, f, set, toggle, clear, count }) {
  const pLo = priceIndex(f.priceMin, 0)
  const pHi = priceIndex(f.priceMax, PRICE_STOPS.length - 1)
  const yLo = f.yearMin === '' ? YEAR_MIN : Number(f.yearMin)
  const yHi = f.yearMax === '' ? YEAR_MAX : Number(f.yearMax)
  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
    }
  }

  return (
    <div id="srp-panel" className={`srp-filters${open ? ' is-open' : ''}`} inert={!open} onKeyDown={onKey}>
      <div className="srp-filters__clip">
        <div className="srp-filters__panel" role="region" aria-label="Filters">
          <div className="srp-filters__row">
            <PanelGroup title="Price" value={priceText(pLo, pHi)}>
              <Range
                min={0}
                max={PRICE_STOPS.length - 1}
                lo={pLo}
                hi={pHi}
                labels={['Minimum price', 'Maximum price']}
                text={(i) => (i === PRICE_STOPS.length - 1 ? 'No maximum' : fmtPrice(PRICE_STOPS[i]))}
                ticks={[[0, '$0'], [PRICE_STOPS.indexOf(100000), '$100k'], [LAST, '$2M+']]}
                onChange={(lo, hi) =>
                  set({ priceMin: lo === 0 ? '' : String(PRICE_STOPS[lo]), priceMax: hi === PRICE_STOPS.length - 1 ? '' : String(PRICE_STOPS[hi]) })
                }
              />
            </PanelGroup>

            <PanelGroup title="Year" value={`${yLo} – ${yHi}`}>
              <Range
                min={YEAR_MIN}
                max={YEAR_MAX}
                lo={yLo}
                hi={yHi}
                labels={['Earliest year', 'Latest year']}
                text={(y) => String(y)}
                ticks={[[YEAR_MIN, String(YEAR_MIN)], [YEAR_MAX, String(YEAR_MAX)]]}
                onChange={(lo, hi) => set({ yearMin: lo === YEAR_MIN ? '' : String(lo), yearMax: hi === YEAR_MAX ? '' : String(hi) })}
              />
            </PanelGroup>

            <PanelGroup title="Mileage" value={f.mileMax ? `Under ${Number(f.mileMax).toLocaleString('en-US')} mi` : 'Any mileage'}>
              <Range
                single
                min={0}
                max={MILE_STOPS.length}
                lo={0}
                hi={f.mileMax === '' ? MILE_STOPS.length : Math.max(0, MILE_STOPS.indexOf(Number(f.mileMax)))}
                labels={['', 'Maximum mileage']}
                text={(i) => (i === MILE_STOPS.length ? 'Any mileage' : `${MILE_STOPS[i].toLocaleString('en-US')} miles`)}
                ticks={[[0, '1k'], [MILE_STOPS.indexOf(10000), '10k'], [MILE_STOPS.indexOf(50000), '50k'], [MILE_STOPS.length, 'Any']]}
                onChange={(lo, hi) => set({ mileMax: hi === MILE_STOPS.length ? '' : String(MILE_STOPS[hi]) })}
              />
            </PanelGroup>
          </div>

          <div className="srp-filters__row srp-filters__row--pills">
            <PanelGroup title="Body type" value={f.body.length ? `${f.body.length} selected` : 'Any'}>
              <div className="srp-panel__pills" role="group" aria-label="Body type">
                {BODIES.map((b) => (
                  <button key={b} type="button" className="pill pill--outline pill--toggle" aria-pressed={f.body.includes(b)} onClick={() => toggle('body', b)}>
                    {b}
                  </button>
                ))}
              </div>
            </PanelGroup>

            <PanelGroup title="Transmission" value={f.transmission || 'Any'}>
              <div className="srp-panel__pills" role="group" aria-label="Transmission">
                {['', ...TRANSMISSIONS].map((t) => (
                  <button key={t || 'any'} type="button" className="pill pill--outline pill--toggle" aria-pressed={f.transmission === t} onClick={() => set({ transmission: t })}>
                    {t || 'Any'}
                  </button>
                ))}
              </div>
            </PanelGroup>

            <PanelGroup title="Drivetrain" value={f.drive.length ? `${f.drive.length} selected` : 'Any'}>
              <div className="srp-panel__pills" role="group" aria-label="Drivetrain">
                {DRIVES.map((d) => (
                  <button key={d} type="button" className="pill pill--outline pill--toggle" aria-pressed={f.drive.includes(d)} onClick={() => toggle('drive', d)}>
                    {d}
                  </button>
                ))}
              </div>
            </PanelGroup>
          </div>

          <div className="srp-filters__row srp-filters__row--wide">
            <PanelGroup title="Exterior color" value={f.color.length ? f.color.join(', ') : 'Any'}>
              <div className="srp-swatches" role="group" aria-label="Exterior color">
                {COLORS.map(([c, hex]) => (
                  <button key={c} type="button" className="srp-swatch" aria-pressed={f.color.includes(c)} onClick={() => toggle('color', c)}>
                    <span className="srp-swatch__dot" style={{ background: hex }} aria-hidden="true" />
                    <span className="srp-swatch__name small">{c}</span>
                  </button>
                ))}
              </div>
            </PanelGroup>
          </div>

          <div className="srp-filters__foot">
            <button type="button" className="srp__clear small" onClick={clear}>
              Reset filters
            </button>
            <button type="button" className="btn srp-filters__show" onClick={onShow}>
              Show {count} {count === 1 ? 'car' : 'cars'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelGroup({ title, value, children }) {
  return (
    <div className="srp-panel__group">
      <div className="srp-panel__group-head">
        <h3 className="srp-panel__legend">{title}</h3>
        {value ? <p className="srp-panel__value small tabular">{value}</p> : null}
      </div>
      {children}
    </div>
  )
}

/** Two thumbs on one track (two native range inputs stacked — keyboard and AT for free). */
function Range({ min, max, lo, hi, labels, text, ticks, onChange, single = false }) {
  const pct = (x) => ((x - min) / (max - min)) * 100
  return (
    <div className="range">
      <div className="range__track" aria-hidden="true">
        <span className="range__fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      </div>
      {single ? null : (
      <input
        type="range"
        className="range__input"
        min={min}
        max={max}
        step={1}
        value={lo}
        aria-label={labels[0]}
        aria-valuetext={text(lo)}
        onChange={(e) => onChange(Math.min(Number(e.target.value), hi), hi)}
      />
      )}
      <input
        type="range"
        className="range__input"
        min={min}
        max={max}
        step={1}
        value={hi}
        aria-label={labels[1]}
        aria-valuetext={text(hi)}
        onChange={(e) => onChange(lo, Math.max(Number(e.target.value), lo))}
      />
      <div className="range__ticks small tabular" aria-hidden="true">
        {ticks.map(([at, t]) => (
          <span key={t} style={{ left: `${pct(at)}%` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Sort — a listbox popover (WAI-ARIA "select-only combobox" pattern, reduced): the
 * button names the order; the menu opens below it. Arrow keys move, Enter / Space
 * pick, Escape and an outside click close, focus returns to the button.
 */
function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, SORTS.findIndex((s) => s.value === value)))
  const root = useRef(null)
  const button = useRef(null)
  const listId = useId()
  const current = SORTS.find((s) => s.value === value) || SORTS[0]

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => !root.current?.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open])

  const pick = (i) => {
    onChange(SORTS[i].value)
    setOpen(false)
    button.current?.focus()
  }
  const openAt = (i) => {
    setActive(i)
    setOpen(true)
  }
  const onKey = (e) => {
    const last = SORTS.length - 1
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      openAt(Math.max(0, SORTS.findIndex((s) => s.value === value)))
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') (e.preventDefault(), setActive((i) => Math.min(last, i + 1)))
    else if (e.key === 'ArrowUp') (e.preventDefault(), setActive((i) => Math.max(0, i - 1)))
    else if (e.key === 'Home') (e.preventDefault(), setActive(0))
    else if (e.key === 'End') (e.preventDefault(), setActive(last))
    else if (e.key === 'Enter' || e.key === ' ') (e.preventDefault(), pick(active))
    else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
  }

  return (
    <div className={`sort${open ? ' is-open' : ''}`} ref={root}>
      <button
        ref={button}
        type="button"
        className="sort__button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openAt(Math.max(0, SORTS.findIndex((s) => s.value === value))))}
        onKeyDown={onKey}
      >
        <span className="sort__prefix">Sort</span>
        <span className="sort__value">{current.label}</span>
        <Icon name="chevron-down" className="sort__chev icon--static" />
      </button>
      <ul id={listId} className="sort__menu" role="listbox" aria-label="Sort by" hidden={!open}>
        {SORTS.map((s, i) => (
          <li
            key={s.value}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={s.value === value}
            className={`sort__option${i === active ? ' is-active' : ''}`}
            onPointerEnter={() => setActive(i)}
            onClick={() => pick(i)}
          >
            {s.label}
            {s.value === value ? (
              <svg className="sort__check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Sliders glyph — drawn to the site's icon weight (1.5px, round caps). */
function FiltersIcon() {
  return (
    <svg className="icon icon--static" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  )
}
