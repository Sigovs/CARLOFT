import { useCallback, useEffect, useMemo, useState } from 'react'
import { EMPTY_FILTERS, filterVehicles, hasActiveFilters, modelsFor } from '../data/inventory.js'

const KEYS = Object.keys(EMPTY_FILTERS)

function readQuery() {
  const q = new URLSearchParams(window.location.search)
  const f = { ...EMPTY_FILTERS }
  KEYS.forEach((k) => {
    if (q.get(k)) f[k] = q.get(k)
  })
  // Discard a model that does not belong to the make.
  if (f.model && !modelsFor(f.make).includes(f.model)) f.model = ''
  return f
}

/**
 * One filter state for the search band and the featured grid.
 * Mirrored into the query string (replaceState — no history spam, the hash
 * is preserved) so a filtered view can be shared or reloaded (BRIEF §14.3).
 */
export function useInventoryFilters() {
  const [filters, setFilters] = useState(readQuery)

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'make' && next.model && !modelsFor(value).includes(next.model)) next.model = ''
      return next
    })
  }, [])

  const clear = useCallback(() => setFilters({ ...EMPTY_FILTERS }), [])

  useEffect(() => {
    const url = new URL(window.location.href)
    KEYS.forEach((k) => (filters[k] ? url.searchParams.set(k, filters[k]) : url.searchParams.delete(k)))
    window.history.replaceState(window.history.state, '', url)
  }, [filters])

  const results = useMemo(() => filterVehicles(filters), [filters])
  const active = hasActiveFilters(filters)

  return { filters, setFilter, clear, results, active }
}
