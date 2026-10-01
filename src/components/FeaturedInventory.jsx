import { useEffect, useRef, useState } from 'react'
import {
  makes,
  formatPrice,
  vehicleMeta,
  vehicleTitle,
  vehicles,
} from '../data/inventory.js'
import Icon from './Icon.jsx'
import { brand } from '../data/brand.js'
import VehicleDialog from './VehicleDialog.jsx'
import { useInventoryRail } from '../motion/useInventoryRail.js'

/**
 * FeaturedInventory (#inventory) — BRIEF §14.4.
 * Default: the three `featured` illustrative cards. "Show All 7 Listings"
 * expands in place. With any filter active, every match shows. Zero matches =
 * empty state with Clear Filters. The count is aria-live and is the focus
 * target after Search Vehicles.
 *
 * MOTION CONTRACT
 *   section#inventory[data-motion-root="inventory"]
 *     .featured__heading [data-motion="heading"]      h2 line mask
 *     .featured__tools   [data-motion="cta"]          count + show-all link
 *     .featured__grid    [data-motion="cards"][data-count=N][data-state="default|all|filtered|empty"]
 *       .card            one per result (keyed by vehicle id)
 *         .card__media > .card__img > img             hover scale lives on .card__img
 *   After every results change the component dispatches
 *   `window` CustomEvent "layout:change" (detail: { source: "inventory" }) once the
 *   new DOM is committed — the motion layer's cue for ScrollTrigger.refresh().
 */
export default function FeaturedInventory({ results, active, clear, countRef, filters, setFilter }) {
  const [openId, setOpenId] = useState(null)
  const firstRender = useRef(true)
  const rootRef = useRef(null)
  useInventoryRail(rootRef)

  // The rail shows every listing; filters narrow it.
  const list = active ? results : vehicles
  const state = active ? (results.length ? 'filtered' : 'empty') : 'all'
  const total = vehicles.length

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.dispatchEvent(new CustomEvent('layout:change', { detail: { source: 'inventory' } }))
  }, [state, list.length])

  const openVehicle = vehicles.find((v) => v.id === openId) || null

  return (
    <section ref={rootRef} id="inventory" className="featured" data-motion-root="inventory" aria-labelledby="featured-title">
      <div className="container">
        <div className="featured__head">
          <div className="stack">
            <p className="eyebrow">Featured inventory</p>
            <h2 id="featured-title" className="h3 featured__heading" data-motion="heading">
              Handpicked, across price ranges.
            </h2>
          </div>

          <div className="featured__tools" data-motion="cta">
            <p
              ref={countRef}
              className="featured__count visually-hidden"
              aria-live="polite"
              aria-atomic="true"
              tabIndex={-1}
            >
              {state === 'empty'
                ? `Showing 0 of ${total} illustrative listings — no match for these filters`
                : `Showing ${list.length} of ${total} illustrative listings`}
            </p>

          </div>
        </div>

        {/* Quick filters by make — real controls on the same filter state as the search band. */}
        <div className="featured__makes" data-motion="cta">
          <div className="featured__make-list" role="group" aria-label="Filter by make">
          {makes.map((m) => {
            const on = filters?.make === m
            return (
              <button
                type="button"
                key={m}
                className="pill pill--outline pill--toggle"
                aria-pressed={on}
                onClick={() => setFilter?.('make', on ? '' : m)}
              >
                {m}
              </button>
            )
          })}
          </div>
          <div className="featured__actions">
              {active && (
                <button type="button" className="pill pill--outline" onClick={clear}>
                  Clear Filters
                  <Icon name="close" />
                </button>
              )}
              {/* CTA to the full inventory page (brand.inventoryUrl). */}
              <a className="btn btn--secondary" href={brand.inventoryUrl}>
                View All Inventory
                <Icon name="arrow-right" />
              </a>
          </div>
        </div>

        {state === 'empty' ? (
          <div className="featured__empty">
            <p className="title">No illustrative listing matches these filters.</p>
            <p className="body">
              Try a different make, a higher price or another body type — or clear the filters to see all {total}.
            </p>
            <button type="button" className="btn btn--secondary" onClick={clear}>
              Clear Filters
              <Icon name="arrow-right" />
            </button>
          </div>
        ) : (
          <div className="featured__viewport">
          <ul
            id="featured-grid"
            className="featured__grid featured__track"
            data-motion="cards"
            data-count={list.length}
            data-state={state}
          >
            {list.map((v) => (
              <li key={v.id}>
                <VehicleCard vehicle={v} onOpen={() => setOpenId(v.id)} />
              </li>
            ))}
          </ul>
          </div>
        )}
      </div>

      <VehicleDialog vehicle={openVehicle} onClose={() => setOpenId(null)} />
    </section>
  )
}

function VehicleCard({ vehicle: v, onOpen }) {
  const meta = vehicleMeta(v)
  return (
    <article className="card">
      <div className="card__media frame">
        <div className="card__img">
          <img
            src={v.image}
            width={v.width}
            height={v.height}
            alt={`${vehicleTitle(v)}, illustrative photograph.`}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: v.objectPosition }}
          />
        </div>
        <span className="pill pill--chip card__tag">{v.body}</span>
      </div>
      <div className="card__body">
        <h3 className="title card__title">
          {/* Stretched button: the whole card opens the dialog, one tab stop. */}
          <button type="button" className="card__open" onClick={onOpen} aria-haspopup="dialog">
            {vehicleTitle(v)}
          </button>
        </h3>
        <ul className="card__meta small tabular" aria-label="Details">
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <div className="card__foot">
          <p className="card__price">
            <span className="card__price-label">Sample price</span>{' '}
            <span className="card__price-value tabular">{formatPrice(v.price)}</span>
          </p>
          <Icon name="arrow-right" className="card__arrow" />
        </div>
      </div>
    </article>
  )
}
