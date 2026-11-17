import { useEffect, useId, useRef, useState } from 'react'

const KEY = 'carloft:saved'
const readSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
const writeSaved = (ids) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    /* private mode / blocked storage: the button still toggles for this visit */
  }
}

/**
 * Save · Share · Text to phone — the VDP's three small actions (Alex, 2026-11-17),
 * one row at the foot of the summary.
 * Save keeps the car in this browser (a mockup has no accounts). Share uses the
 * phone's share sheet, and on a desktop copies the link. Text to phone opens a
 * number field under the row; the mockup sends nothing and says so.
 */
export default function SaveShare({ v, title }) {
  const [saved, setSaved] = useState(() => readSaved().includes(v.id))
  const [note, setNote] = useState('')
  const [texting, setTexting] = useState(false)
  const timer = useRef(0)
  const phoneId = useId()
  const panelId = useId()
  const field = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (texting) field.current?.focus()
  }, [texting])
  const say = (text, ms = 2600) => {
    setNote(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setNote(''), ms)
  }

  const toggleSave = () => {
    const ids = readSaved().filter((x) => x !== v.id)
    const next = !saved
    writeSaved(next ? [...ids, v.id] : ids)
    setSaved(next)
    say(next ? 'Saved in this browser' : 'Removed from saved')
  }

  const share = async () => {
    const url = window.location.href.split('#')[0]
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* the visitor closed the sheet */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      say('Link copied')
    } catch {
      say('Copy the link from the address bar')
    }
  }

  const sendText = (e) => {
    e.preventDefault()
    const number = String(new FormData(e.currentTarget).get('phone') || '').trim()
    setTexting(false)
    say(`Mockup — nothing was sent. Live, the dealer texts the link to ${number}.`, 5200)
  }

  return (
    <div className="vdp-acts">
      <div className="vdp-acts__row">
        <button type="button" className="vdp-act" aria-pressed={saved} onClick={toggleSave}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
          </svg>
          {saved ? 'Saved' : 'Save'}
        </button>
        <button type="button" className="vdp-act" onClick={share}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15V4M8 7.5L12 3.5l4 4M6 11v7.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V11" />
          </svg>
          Share
        </button>
        <button type="button" className="vdp-act" aria-expanded={texting} aria-controls={panelId} onClick={() => setTexting((t) => !t)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="7" y="2.5" width="10" height="19" rx="2" />
            <path d="M11 18.5h2" />
          </svg>
          Text to phone
        </button>
      </div>

      <form id={panelId} className="vdp-acts__text" hidden={!texting} onSubmit={sendText}>
        <label htmlFor={phoneId} className="vdp-field__label small">
          Your mobile number — we text you the link to this car
        </label>
        <div className="vdp-acts__send">
          <input ref={field} id={phoneId} name="phone" type="tel" className="vdp-input" autoComplete="tel" placeholder="(555) 555-0123" required />
          <button type="submit" className="btn btn--secondary vdp-acts__go">
            Send
          </button>
        </div>
      </form>

      <p className="vdp-acts__note small" role="status" aria-live="polite">
        {note}
      </p>
    </div>
  )
}
