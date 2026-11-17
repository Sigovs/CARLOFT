import { useEffect, useId, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { brand } from '../../data/brand.js'
import { lockScroll, unlockScroll } from '../../motion/scroll.js'
import { fmtPrice, stockTitle } from '../../data/v5/stock.js'

/* what the visitor can tick — the dealer's lead form sorts by these */
export const ASK_TOPICS = ['Check availability', 'Book a viewing', 'CARFAX report', 'Financing', 'Trade-in']

/**
 * "Ask about this car" (Alex, 2026-11-17): a panel that slides in from the right
 * with the enquiry form, the car it is about pinned at the top. Scrim, Escape and
 * the close button shut it; focus moves in, stays in, and returns.
 * The mockup sends nothing — the confirmation says so (content provenance).
 */
export default function AskDrawer({ v, open, preset, message, onClose }) {
  const ref = useRef(null)
  const returnTo = useRef(null)
  const titleId = useId()
  const [topics, setTopics] = useState([])
  const [sent, setSent] = useState(null)
  const title = `${v.year} ${stockTitle(v)}`

  // every opening starts a fresh form with the asked-for topic ticked
  useEffect(() => {
    if (!open) return
    setTopics(preset ? [preset] : ['Check availability'])
    setSent(null)
  }, [open, preset])

  useEffect(() => {
    if (!open) return
    returnTo.current = document.activeElement
    document.body.classList.add('is-locked')
    lockScroll()
    const t = setTimeout(() => ref.current?.querySelector('input')?.focus({ preventScroll: true }), 60)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !ref.current) return
      const items = [...ref.current.querySelectorAll('button, input, textarea, a[href]')].filter((el) => !el.disabled)
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.classList.remove('is-locked')
      unlockScroll()
      document.removeEventListener('keydown', onKey)
      returnTo.current?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  const toggle = (t) => setTopics((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))
  const onSubmit = (e) => {
    e.preventDefault()
    const name = new FormData(e.currentTarget).get('name')
    setSent(String(name).trim().split(/\s+/)[0] || 'there')
    requestAnimationFrame(() => ref.current?.querySelector('.ask__done-title')?.focus())
  }

  return (
    <div className={`ask${open ? ' is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <button type="button" className="ask__scrim" tabIndex={-1} aria-label="Close" onClick={onClose} />
      <div ref={ref} className="ask__sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="ask__head">
          <h2 id={titleId} className="h3 ask__title">
            Ask about this car
          </h2>
          <button type="button" className="ask__close" onClick={onClose} aria-label="Close">
            <Icon name="close" className="icon--static" />
          </button>
        </div>

        <div className="ask__body" data-lenis-prevent>
          <div className="ask__car">
            <img src={v.photos[0].src} width="960" height="640" alt="" decoding="async" />
            <div>
              <p className="ask__car-title">{title}</p>
              <p className="small ask__car-meta tabular">Sample price {fmtPrice(v.price)}</p>
              <p className="small ask__car-meta tabular">Stock {v.stockNo} (sample)</p>
            </div>
          </div>

          {sent ? (
            <div className="ask__done" role="status">
              <span className="ask__done-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <p className="h3 ask__done-title" tabIndex={-1}>
                Thanks, {sent}.
              </p>
              <p className="body ask__done-text">
                This is a mockup — the form is not connected yet, so nothing was sent. On the live site the
                dealer&rsquo;s inbox receives it.
              </p>
              <button type="button" className="btn btn--secondary" onClick={onClose}>
                Back to the car
              </button>
            </div>
          ) : (
            <form className="ask__form" onSubmit={onSubmit}>
              <fieldset className="ask__topics">
                <legend className="ask__legend small">I&rsquo;d like to know about</legend>
                <div className="ask__pills">
                  {ASK_TOPICS.map((t) => (
                    <button key={t} type="button" className="pill pill--outline pill--toggle" aria-pressed={topics.includes(t)} onClick={() => toggle(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <Field label="Name">{(id) => <input id={id} name="name" className="vdp-input" autoComplete="name" required />}</Field>
              <div className="ask__pair">
                <Field label="Email">{(id) => <input id={id} name="email" type="email" className="vdp-input" autoComplete="email" required />}</Field>
                <Field label="Phone" hint="optional">
                  {(id) => <input id={id} name="phone" type="tel" className="vdp-input" autoComplete="tel" />}
                </Field>
              </div>
              <Field label="Message">
                {(id) => (
                  <textarea
                    id={id}
                    name="message"
                    className="vdp-input ask__message"
                    rows={4}
                    defaultValue={message || `Hi, I'm interested in the ${title} (stock ${v.stockNo}).`}
                    key={open ? `open-${message || ''}` : 'closed'}
                  />
                )}
              </Field>

              <button type="submit" className="btn ask__send">
                Send message
                <Icon name="arrow-right" />
              </button>
              <p className="small ask__or">
                Or call <a href={brand.contact.phone.href}>{brand.contact.phone.value}</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  const id = useId()
  return (
    <div className="vdp-field">
      <label htmlFor={id} className="vdp-field__label small">
        {label}
        {hint ? <span className="ask__hint"> ({hint})</span> : null}
      </label>
      {children(id)}
    </div>
  )
}
