import { useEffect, useRef } from 'react'
import { formatMiles, formatPrice, vehicleTitle } from '../data/inventory.js'
import Icon from './Icon.jsx'
import { lockScroll, unlockScroll } from '../motion/scroll.js'

/**
 * VehicleDialog — in-page detail for an illustrative listing (no detail page
 * exists, BRIEF §14.4). Native <dialog>: modal focus trap, Escape and
 * focus-return come from the platform.
 */
export default function VehicleDialog({ vehicle, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (vehicle && !d.open) {
      d.showModal()
      lockScroll()
    }
    if (!vehicle && d.open) d.close()
    if (!vehicle) unlockScroll()
  }, [vehicle])

  const v = vehicle
  const facts = v
    ? [
        ['Make', v.make],
        ['Model', v.model],
        ['Trim', v.trim || '—'],
        ['Body type', v.body],
        ['Year', v.year || 'Not stated'],
        ['Mileage', formatMiles(v.mileage)],
        ['Transmission', v.transmission],
        ['Sample price', formatPrice(v.price)],
      ]
    : []

  return (
    <dialog
      ref={ref}
      className="vehicle-dialog"
      data-lenis-prevent
      aria-labelledby="vehicle-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close() // click on backdrop
      }}
    >
      {v && (
        <div className="vehicle-dialog__inner">
          <div className="vehicle-dialog__media frame">
            <img
              src={v.image}
              width={v.width}
              height={v.height}
              alt={`${vehicleTitle(v)}, illustrative photograph.`}
              style={{ objectPosition: v.objectPosition }}
            />
          </div>
          <div className="vehicle-dialog__body">
            <div className="vehicle-dialog__top">
              <p className="eyebrow">Illustrative listing</p>
              <button type="button" className="vehicle-dialog__close" aria-label="Close details" onClick={() => ref.current?.close()}>
                <Icon name="close" />
              </button>
            </div>
            <h2 id="vehicle-dialog-title" className="h3">
              {vehicleTitle(v)}
            </h2>
            <dl className="plate tabular">
              {facts.map(([k, val]) => (
                <div className="plate__row" key={k}>
                  <dt>{k}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
            <p className="small vehicle-dialog__note">
              This listing is illustrative: the photograph, figures and price are samples, not a car currently for sale.
            </p>
            <div className="actions">
              <a
                className="btn"
                href={`#contact?topic=car&id=${v.id}`}
                onClick={() => ref.current?.close()}
              >
                Ask About This Car
                <Icon name="arrow-right" />
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
