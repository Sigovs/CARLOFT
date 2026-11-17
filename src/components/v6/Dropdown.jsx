import { useEffect, useId, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { scrollToY } from '../../motion/scroll.js'

/**
 * Dropdown — the V6 filter field (client round, 2026-11-17: "change the sliders and the
 * bubbles to dropdowns"). Designed, never the native list (Alex: the sort menu rule).
 * WAI-ARIA select-only combobox: the button opens a listbox under it; arrows move,
 * Home / End jump, Enter / Space pick, Escape / Tab / an outside click close, and focus
 * stays on the button.
 *
 *  options: [{ value, label, full?, count?, group? }] — full names it in the closed field;
 *           a count of 0 greys the option out
 *           (unless it is ticked); options with a group are listed under its name
 *  multi:   value is an array, each pick toggles and the menu stays open;
 *           otherwise value is a string and a pick closes the menu
 */
export default function Dropdown({ id, label, options, value, onChange, multi = false, any = 'Any', summary }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const button = useRef(null)
  const menu = useRef(null)
  const autoId = useId()
  const listId = `${id || autoId}-list`
  const picked = (o) => (multi ? value.includes(o.value) : value === o.value)
  const off = (o) => o.count === 0 && !picked(o)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => !root.current?.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', onDoc)
    // a menu that opens below the fold brings itself into view
    const r = menu.current?.getBoundingClientRect()
    if (r && r.bottom > window.innerHeight - 12) scrollToY(window.scrollY + r.bottom - window.innerHeight + 24)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open])

  // keep the active option in view inside a long menu
  useEffect(() => {
    if (open) menu.current?.querySelector(`#${CSS.escape(`${listId}-${active}`)}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, listId])

  const choose = (i) => {
    const o = options[i]
    if (!o || off(o)) return
    if (multi) onChange(picked(o) ? value.filter((x) => x !== o.value) : [...value, o.value])
    else {
      onChange(o.value)
      setOpen(false)
    }
  }
  const firstPicked = () => Math.max(0, options.findIndex(picked))
  const step = (from, dir) => {
    let i = from
    for (let n = 0; n < options.length; n++) {
      i = Math.min(options.length - 1, Math.max(0, i + dir))
      if (!off(options[i])) return i
    }
    return from
  }
  const onKey = (e) => {
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      setActive(firstPicked())
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') (e.preventDefault(), setActive((i) => step(i, 1)))
    else if (e.key === 'ArrowUp') (e.preventDefault(), setActive((i) => step(i, -1)))
    else if (e.key === 'Home') (e.preventDefault(), setActive(step(-1, 1)))
    else if (e.key === 'End') (e.preventDefault(), setActive(step(options.length, -1)))
    else if (e.key === 'Enter' || e.key === ' ') (e.preventDefault(), choose(active))
    else if (e.key === 'Escape') (e.stopPropagation(), setOpen(false))
    else if (e.key === 'Tab') setOpen(false)
  }

  // what the closed field says
  let text = summary
  if (text == null) {
    if (multi) {
      const on = options.filter(picked)
      const name = (o) => o.full || o.label
      text = !on.length ? any : on.length <= 2 ? on.map(name).join(', ') : `${on.length} selected`
    } else text = options.find(picked)?.label ?? any
  }
  const empty = multi ? !value.length : !value

  // options under their group names
  const groups = []
  options.forEach((o, i) => {
    const g = o.group || ''
    if (!groups.length || groups[groups.length - 1].name !== g) groups.push({ name: g, items: [] })
    groups[groups.length - 1].items.push([o, i])
  })
  const option = ([o, i]) => (
    <li
      key={o.value || 'any'}
      id={`${listId}-${i}`}
      role="option"
      aria-selected={picked(o)}
      aria-disabled={off(o) || undefined}
      className={`dd__option${i === active ? ' is-active' : ''}`}
      onPointerEnter={() => !off(o) && setActive(i)}
      onClick={() => choose(i)}
    >
      {multi ? <span className="dd__box" aria-hidden="true" /> : null}
      <span className="dd__label">{o.label}</span>
      {o.count != null ? <span className="dd__count small tabular">{o.count}</span> : null}
      {!multi && picked(o) ? (
        <svg className="dd__check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : null}
    </li>
  )

  return (
    <div className={`dd${open ? ' is-open' : ''}`} ref={root}>
      <button
        ref={button}
        id={id}
        type="button"
        className={`dd__button${empty ? ' is-empty' : ''}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label ? `${label}: ${text}` : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : (setActive(firstPicked()), setOpen(true)))}
        onKeyDown={onKey}
      >
        <span className="dd__value">{text}</span>
        <Icon name="chevron-down" className="dd__chev icon--static" />
      </button>
      <ul ref={menu} id={listId} className="dd__menu" role="listbox" aria-label={label} aria-multiselectable={multi || undefined} hidden={!open} data-lenis-prevent onMouseDown={(e) => e.preventDefault()}>
        {groups.map((g) =>
          g.name ? (
            <li key={g.name} role="presentation" className="dd__group">
              <span className="dd__group-name" aria-hidden="true">
                {g.name}
              </span>
              <ul role="group" aria-label={g.name}>
                {g.items.map(option)}
              </ul>
            </li>
          ) : (
            g.items.map(option)
          ),
        )}
      </ul>
    </div>
  )
}
