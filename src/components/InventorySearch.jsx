import { bodyTypes, formatPrice, makes, modelsFor, priceOptions } from '../data/inventory.js'
import Icon from './Icon.jsx'

/**
 * InventorySearch — the grey band under the hero (BRIEF §14.3).
 * No dead control: every select filters the featured grid live; Search
 * Vehicles scrolls to #inventory and moves focus to the result count.
 * Static by design — MOTION.md cuts any entrance on this band.
 */
export default function InventorySearch({ filters, setFilter, onSearch }) {
  const models = modelsFor(filters.make)

  const fields = [
    {
      key: 'make',
      label: 'Make',
      any: 'Any make',
      options: makes.map((m) => ({ value: m, label: m })),
    },
    {
      key: 'model',
      label: 'Model',
      any: 'Any model',
      options: models.map((m) => ({ value: m, label: m })),
    },
    {
      key: 'price',
      label: 'Max price',
      any: 'Any price',
      options: priceOptions.map((p) => ({ value: String(p), label: `Up to ${formatPrice(p)}` })),
    },
    {
      key: 'body',
      label: 'Body type',
      any: 'Any body type',
      options: bodyTypes.map((b) => ({ value: b, label: b })),
    },
  ]

  return (
    <section className="search-band" aria-labelledby="search-title">
      <form
        className="search container"
        role="search"
        aria-labelledby="search-title"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
      >
        <h2 id="search-title" className="eyebrow search__title">
          Find your next car
        </h2>

        {fields.map((f) => (
          <div className="search__field" key={f.key}>
            <label className="search__label" htmlFor={`search-${f.key}`}>
              {f.label}
            </label>
            <div className="select">
              <select
                id={`search-${f.key}`}
                name={f.key}
                value={filters[f.key]}
                onChange={(e) => setFilter(f.key, e.target.value)}
              >
                <option value="">{f.any}</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" className="select__chevron" />
            </div>
          </div>
        ))}

        <button type="submit" className="btn search__submit">
          Search Vehicles
          <Icon name="arrow-right" />
        </button>
      </form>
    </section>
  )
}
