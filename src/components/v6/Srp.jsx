import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { brand } from '../../data/brand.js'
import { scrollToY } from '../../motion/scroll.js'
import { StockPage, Crumbs, StockCard } from '../v5/StockPage.jsx'
import { HOME_URL, SORTS, stock } from '../../data/v5/stock.js'
import {
  LISTS,
  MAKES,
  MILE_STOPS,
  MODELS,
  SCALARS,
  YEARS,
  countWith,
  fmtMi,
  fresh,
  keyMake,
  keyModel,
  panelCount,
  search,
  valuesOf,
  withMakes,
  withModels,
} from '../../data/v6/search.js'
import Dropdown from './Dropdown.jsx'

/* ---- the filter state lives in the query string: a search can be shared or reloaded ---- */
function readQuery() {
  const q = new URLSearchParams(window.location.search)
  const f = fresh()
  LISTS.forEach((k) => {
    const v = q.get(k)
    if (v) f[k] = v.split(',').filter(Boolean)
  })
  SCALARS.forEach((k) => {
    if (q.get(k)) f[k] = q.get(k)
  })
  return withModels(f, f.model)
}
function writeQuery(f) {
  const url = new URL(window.location.href)
  ;[...LISTS, ...SCALARS].forEach((k) => {
    const v = LISTS.includes(k) ? f[k].join(',') : f[k]
    if (v && !(k === 'sort' && v === 'newest')) url.searchParams.set(k, v)
    else url.searchParams.delete(k)
  })
  ;['priceMin', 'priceMax', 'maxPrice', 'minYear'].forEach((k) => url.searchParams.delete(k)) // V5 keys
  window.history.replaceState(window.history.state, '', url)
}

/**
 * SRP — inventory_v6.html. The V5 page (make chips, Filters, sort in the title row, the
 * accordion across the page) with the client's V6 filters: every field a dropdown,
 * make and model added, price gone, every list built from the stock (see
 * src/data/v6/search.js).
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
  // after "Show N cars": if the bar has scrolled off, bring it back, so the first results are in view
  const unstick = useCallback(() => {
    const mark = barMark.current
    if (!mark) return
    const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0
    const top = mark.getBoundingClientRect().top
    if (top < head) scrollToY(window.scrollY + top - head)
  }, [])
  const toggleOpen = () => setOpen((o) => !o)
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
  const results = useMemo(() => search(f), [f])
  const n = panelCount(f)

  useEffect(() => writeQuery(f), [f])
  useEffect(() => {
    document.title = `Inventory — ${brand.wordmark}`
  }, [])

  const set = (patch) => setF((p) => ({ ...p, ...patch }))
  const pull = (key, value) => setF((p) => ({ ...p, [key]: p[key].filter((x) => x !== value) }))
  const setMakes = (make) => setF((p) => withMakes(p, make))
  const setModels = (model) => setF((p) => withModels(p, model))
  const toggleMake = (m) => setF((p) => withMakes(p, p.make.includes(m) ? p.make.filter((x) => x !== m) : [...p.make, m]))
  const clearAll = () => setF((p) => fresh(p.sort))

  // the applied filters under the bar (the makes show in the chips row already)
  const yearLabel = f.yearMin || f.yearMax ? (f.yearMin && f.yearMax ? (f.yearMin === f.yearMax ? f.yearMin : `${f.yearMin} – ${f.yearMax}`) : f.yearMin ? `${f.yearMin} and newer` : `${f.yearMax} and older`) : null
  const chips = [
    ...f.model.map((k) => ({ label: `${keyMake(k)} ${keyModel(k)}`, off: () => pull('model', k) })),
    ...(yearLabel ? [{ label: yearLabel, off: () => set({ yearMin: '', yearMax: '' }) }] : []),
    ...(f.mileMax ? [{ label: `Under ${fmtMi(f.mileMax)}`, off: () => set({ mileMax: '' }) }] : []),
    ...['body', 'transmission', 'drive', 'color'].flatMap((k) => f[k].map((x) => ({ label: x, off: () => pull(k, x) }))),
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
            {/* sort beside the title and the count (Alex, 2026-11-17) */}
            <SortSelect value={f.sort} onChange={(v) => set({ sort: v })} />
          </div>
        </div>
      </section>

      {/* Filters and the makes — one bar under the head (Alex, 2026-11-17), not sticky */}
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
            <button type="button" className="pill pill--outline pill--toggle" aria-pressed={!f.make.length} onClick={() => setMakes([])}>
              All
            </button>
            {MAKES.map((m) => (
              <button key={m} type="button" className="pill pill--outline pill--toggle" aria-pressed={f.make.includes(m)} onClick={() => toggleMake(m)}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container srp">
        <FilterPanel open={open} onClose={close} onShow={showResults} f={f} set={set} setMakes={setMakes} setModels={setModels} clear={clearAll} count={results.length} />

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
            <p className="body">Widen the years or the mileage, or clear the filters to see all {stock.length}.</p>
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
   The filters (V6, client round 2026-11-17): the V5 accordion under the bar, as
   wide as the page, now one grid of dropdowns — Make, Model, Year, Mileage /
   Body type, Transmission, Drivetrain, Exterior color. Every list comes from the
   stock with the number of cars each choice finds, so a feed's own spellings show
   as they are and nothing is lost. No price (it stays in the sort).
   --------------------------------------------------------------------------- */
function FilterPanel({ open, onClose, onShow, f, set, setMakes, setModels, clear, count }) {
  // the panel's clip lets a dropdown hang out of it only once it has finished opening
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    if (!open) {
      setSettled(false)
      return
    }
    const t = setTimeout(() => setSettled(true), 700) // the fold (--dur-m) + its delay
    return () => clearTimeout(t)
  }, [open])
  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
    }
  }

  // the options, each with how many cars it would find
  const makeOpts = MAKES.map((m) => ({ value: m, label: m, count: countWith(f, withMakes({ ...f, make: [m] }, [m])) }))
  const inMakes = f.make.length ? MODELS.filter((k) => f.make.includes(keyMake(k))) : MODELS
  const grouped = new Set(inMakes.map(keyMake)).size > 1
  const modelOpts = inMakes.map((k) => ({
    value: k,
    label: keyModel(k),
    full: `${keyMake(k)} ${keyModel(k)}`,
    group: grouped ? keyMake(k) : undefined,
    count: countWith(f, { make: [keyMake(k)], model: [k] }),
  }))
  const listOpts = (key) => valuesOf(key).map((x) => ({ value: x, label: x, count: countWith(f, { [key]: [x] }) }))
  const anyOpt = (label) => ({ value: '', label })
  const fromOpts = [anyOpt('Any year'), ...YEARS.map((y) => ({ value: String(y), label: String(y), count: f.yearMax && y > Number(f.yearMax) ? 0 : undefined }))]
  const toOpts = [anyOpt('Any year'), ...YEARS.map((y) => ({ value: String(y), label: String(y), count: f.yearMin && y < Number(f.yearMin) ? 0 : undefined }))]
  const mileOpts = [anyOpt('Any mileage'), ...MILE_STOPS.map((m) => ({ value: String(m), label: `Under ${fmtMi(m)}`, count: countWith(f, { mileMax: String(m) }) }))]

  return (
    <div id="srp-panel" className={`srp-filters v6f${open ? ' is-open' : ''}${settled ? ' is-settled' : ''}`} inert={!open} onKeyDown={onKey}>
      <div className="srp-filters__clip">
        <div className="srp-filters__panel" role="region" aria-label="Filters">
          <div className="v6f__grid">
            <Field id="f-make" title="Make">
              <Dropdown id="f-make" label="Make" multi options={makeOpts} value={f.make} onChange={setMakes} any="Any make" />
            </Field>
            <Field id="f-model" title="Model">
              <Dropdown id="f-model" label="Model" multi options={modelOpts} value={f.model} onChange={setModels} any="Any model" />
            </Field>
            <Field id="f-year" title="Year">
              <div className="v6f__pair">
                <Dropdown id="f-year" label="Year from" options={fromOpts} value={f.yearMin} onChange={(v) => set({ yearMin: v })} summary={f.yearMin ? `From ${f.yearMin}` : 'From'} />
                <Dropdown id="f-year-to" label="Year to" options={toOpts} value={f.yearMax} onChange={(v) => set({ yearMax: v })} summary={f.yearMax ? `To ${f.yearMax}` : 'To'} />
              </div>
            </Field>
            <Field id="f-miles" title="Mileage">
              <Dropdown id="f-miles" label="Mileage" options={mileOpts} value={f.mileMax} onChange={(v) => set({ mileMax: v })} any="Any mileage" />
            </Field>
            <Field id="f-body" title="Body type">
              <Dropdown id="f-body" label="Body type" multi options={listOpts('body')} value={f.body} onChange={(v) => set({ body: v })} />
            </Field>
            <Field id="f-trans" title="Transmission">
              <Dropdown id="f-trans" label="Transmission" multi options={listOpts('transmission')} value={f.transmission} onChange={(v) => set({ transmission: v })} />
            </Field>
            <Field id="f-drive" title="Drivetrain">
              <Dropdown id="f-drive" label="Drivetrain" multi options={listOpts('drive')} value={f.drive} onChange={(v) => set({ drive: v })} />
            </Field>
            <Field id="f-color" title="Exterior color">
              <Dropdown id="f-color" label="Exterior color" multi options={listOpts('color')} value={f.color} onChange={(v) => set({ color: v })} />
            </Field>
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

function Field({ id, title, children }) {
  return (
    <div className="v6f__field">
      <label className="srp-panel__legend v6f__label" htmlFor={id}>
        {title}
      </label>
      {children}
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
