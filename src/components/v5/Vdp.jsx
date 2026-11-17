import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { brand } from '../../data/brand.js'
import { asset } from '../../data/asset.js'
import { StockPage, Crumbs, StockCard, TitleText } from './StockPage.jsx'
import AskDrawer from './AskDrawer.jsx'
import CarBar from './CarBar.jsx'
import { HOME_URL, SRP_URL, fmtMiles, fmtPrice, similarTo, stockById, stockTitle } from '../../data/v5/stock.js'

const pad = (n) => String(n).padStart(2, '0')

/**
 * VDP — vehicle_v5.html?id=…. The gallery (main frame, arrows, counter, thumbnails;
 * arrow keys and a swipe), the summary beside it (sticky on desktop): title, sample
 * price, the facts, the asks. Below: the full details and similar cars.
 */
export default function Vdp() {
  const id = new URLSearchParams(window.location.search).get('id')
  const v = stockById(id)
  const [ask, setAsk] = useState({ open: false, preset: '', message: '' })
  const closeAsk = useCallback(() => setAsk((a) => ({ ...a, open: false })), [])
  const asksRef = useRef(null)
  const openAsk = (preset) => (e) => {
    e.preventDefault()
    setAsk({ open: true, preset, message: '' })
  }

  useEffect(() => {
    if (v) document.title = `${v.year} ${stockTitle(v)} — ${brand.wordmark}`
  }, [v])

  if (!v) {
    return (
      <StockPage>
        <section className="stock-head">
          <div className="container">
            <Crumbs items={[{ label: 'Home', href: HOME_URL }, { label: 'Inventory', href: SRP_URL }, { label: 'Not found' }]} />
            <h1 className="h2 stock-head__title">This listing is not here.</h1>
            <p className="body vdp-missing">It may have sold, or the link is incomplete.</p>
            <a className="btn btn--secondary vdp-missing__cta" href={SRP_URL}>
              See all inventory
              <Icon name="arrow-right" />
            </a>
          </div>
        </section>
      </StockPage>
    )
  }

  const title = stockTitle(v)
  const facts = [
    ['Year', v.year],
    ['Mileage', `${fmtMiles(v.mileage)} (sample)`],
    ['Exterior', v.color],
    ['Body', v.body],
    ['Transmission', `${v.transmission} (sample)`],
    ['Drivetrain', v.drive],
    ['Stock number', `${v.stockNo} (sample)`],
  ]

  return (
    <StockPage>
      <section className="vdp" aria-labelledby="vdp-title">
        <div className="container">
          <Crumbs items={[{ label: 'Home', href: HOME_URL }, { label: 'Inventory', href: SRP_URL }, { label: `${v.year} ${title}` }]} />
          <div className="vdp__grid">
            <Gallery v={v} />

            <div className="vdp__summary">
              <p className="eyebrow vdp__eyebrow">
                {v.year} · {v.body}
              </p>
              <h1 id="vdp-title" className="h3 vdp__title">
                <TitleText v={v} />
              </h1>
              <p className="vdp__price">
                <span className="vdp__price-label small">Sample price</span>
                <span className="vdp__price-value tabular">{fmtPrice(v.price)}</span>
              </p>
              <ul className="vdp__tags" aria-label="Key facts">
                <li>{fmtMiles(v.mileage)}</li>
                <li>{v.transmission}</li>
                <li>{v.color}</li>
              </ul>
              <div className="vdp__asks" ref={asksRef}>
                <a className="btn" href={`#contact?topic=car&id=${encodeURIComponent(v.id)}`} aria-haspopup="dialog" onClick={openAsk('')}>
                  Ask about this car
                  <Icon name="arrow-right" />
                </a>
                <a className="btn btn--secondary" href={brand.contact.phone.href}>
                  <Icon name="phone" className="icon--static" />
                  Call {brand.contact.phone.value}
                </a>
                {/* secondary ask (Alex): an outline button, not a text link */}
                <a className="btn btn--secondary vdp__outline" href={`${HOME_URL}#finance`}>
                  Financing and trade-ins
                  <Icon name="arrow-right" />
                </a>
              </div>
              {/* CARFAX (Alex, 2026-11-16). A placeholder row in our own type — not CARFAX's
                  badge: the live badge and report link come from the dealer's CARFAX account by
                  VIN, and neither the account nor the VINs exist yet. Until then it asks for it. */}
              <a className="vdp-carfax" href={`#contact?topic=carfax&id=${encodeURIComponent(v.id)}`} aria-haspopup="dialog" onClick={openAsk('CARFAX report')}>
                {/* the CARFAX logo with "Vehicle History Reports" (Wikimedia Commons, Carfaxlogo3.svg — Alex's reference) */}
                <img className="vdp-carfax__badge" src={asset('assets/carfax-logo.svg')} width="151" height="36" alt="CARFAX Vehicle History Reports" />
                <span className="vdp-carfax__text visually-hidden">See the vehicle history report</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Description (Alex, 2026-11-16). Only what the data and the photographs show; the
          dealer's own text (condition, options, records, ownership) replaces the second
          paragraph — nothing here may describe a real car's history (content provenance). */}
      <section className="vdp-details vdp-desc" aria-labelledby="vdp-desc-title">
        <div className="container vdp-details__grid">
          <h2 id="vdp-desc-title" className="h3 section-title">
            Description
          </h2>
          <div className="vdp-desc__body">
            <p className="lead">
              {v.year} {title} in {v.color.toLowerCase()} — a {v.body.toLowerCase()} with{' '}
              {v.drive.toLowerCase()}, photographed in our studio from every side.
            </p>
            <p className="body">
              The dealer&rsquo;s description goes here: condition inside and out, options and
              equipment, service records, ownership history, and what comes with the car — keys,
              books, covers, warranty.
            </p>
          </div>
        </div>
      </section>

      <section className="vdp-details" aria-labelledby="vdp-details-title">
        <div className="container vdp-details__grid">
          <h2 id="vdp-details-title" className="h3 section-title">
            Vehicle details
          </h2>
          <dl className="vdp-specs">
            {facts.map(([k, val]) => (
              <div key={k} className="vdp-specs__row">
                <dt className="small">{k}</dt>
                <dd className="tabular">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Finance and trade-in ON the page, no click away (Alex, 2026-11-16: "как на других
          дилерских — информация сразу, без перехода"; TWINS / PRESTIGE / MAX VDPs). */}
      <PaymentEstimator v={v} />
      <TradeIn v={v} onAsk={(message) => setAsk({ open: true, preset: 'Trade-in', message })} />

      <section id="photos" className="vdp-photos" aria-labelledby="vdp-photos-title">
        <div className="container">
          <h2 id="vdp-photos-title" className="h3 section-title">
            All photos
          </h2>
          <ul className="vdp-photos__grid">
            {v.photos.map((p, k) => (
              <li key={p.src}>
                <img
                  src={p.src}
                  srcSet={p.srcSet}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  width="960"
                  height="640"
                  alt={`${v.year} ${title}, photograph ${k + 1} of ${v.photos.length}.`}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="vdp-similar" aria-labelledby="vdp-similar-title">
        <div className="container">
          <div className="vdp-similar__head">
            <h2 id="vdp-similar-title" className="h3 section-title">
              Similar cars
            </h2>
            <a className="btn btn--secondary vdp-similar__all" href={SRP_URL}>
              View All Inventory
              <Icon name="arrow-right" />
            </a>
          </div>
          <ul className="srp__grid">
            {similarTo(v).map((s) => (
              <li key={s.id}>
                <StockCard v={s} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CarBar v={v} asksRef={asksRef} onAsk={openAsk('')} hidden={ask.open} />
      <AskDrawer v={v} open={ask.open} preset={ask.preset} message={ask.message} onClose={closeAsk} />
    </StockPage>
  )
}

function Gallery({ v }) {
  const [i, setI] = useState(0)
  const n = v.photos.length
  const go = (d) => setI((x) => (x + d + n) % n)
  const start = useRef(null)
  const title = `${v.year} ${stockTitle(v)}`

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
  }
  // swipe: a horizontal drag of 40px+ on touch / pen
  const onDown = (e) => {
    if (e.pointerType !== 'mouse') start.current = e.clientX
  }
  const onUp = (e) => {
    if (start.current == null) return
    const dx = e.clientX - start.current
    start.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  return (
    <div className="vdp-gallery" role="region" aria-roledescription="gallery" aria-label={`${title} photographs`}>
      <div className="vdp-gallery__stage" tabIndex={n > 1 ? 0 : -1} onKeyDown={onKey} onPointerDown={onDown} onPointerUp={onUp}>
        {v.photos.map((p, k) => (
          <img
            key={p.src}
            className={`vdp-gallery__img${k === i ? ' is-on' : ''}`}
            src={p.src}
            srcSet={p.srcSet}
            sizes="(min-width: 1024px) 60vw, 100vw"
            width="960"
            height="640"
            alt={k === i ? `${title}, ${v.color.toLowerCase()}, photograph ${k + 1} of ${n}.` : ''}
            aria-hidden={k !== i}
            loading={k === 0 ? 'eager' : 'lazy'}
            fetchPriority={k === 0 ? 'high' : undefined}
            decoding="async"
            draggable="false"
          />
        ))}
        <span className="pill pill--chip card__tag">{v.body}</span>
        {n > 1 ? (
          <div className="vdp-gallery__nav">
            <span className="vdp-gallery__count small tabular" aria-live="polite">
              {pad(i + 1)} / {pad(n)}
            </span>
            <button type="button" className="vdp-gallery__arrow" onClick={() => go(-1)} aria-label="Previous photograph">
              <Icon name="chevron-left" className="icon--static" />
            </button>
            <button type="button" className="vdp-gallery__arrow" onClick={() => go(1)} aria-label="Next photograph">
              <Icon name="chevron-right" className="icon--static" />
            </button>
          </div>
        ) : null}
      </div>

      {n > 1 ? (
        <ul className="vdp-gallery__thumbs" aria-label="All photographs">
          {v.photos.map((p, k) => (
            <li key={p.src}>
              <button
                type="button"
                className="vdp-gallery__thumb"
                aria-pressed={k === i}
                aria-label={`Photograph ${k + 1} of ${n}`}
                onClick={() => setI(k)}
              >
                <img src={p.src} width="960" height="640" alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/* ---------- payment estimator ---------- */
const TERMS = [36, 48, 60, 72, 84]
const SAMPLE_APR = 7.9 // placeholder rate — the dealer's lender rates replace it
const round1000 = (n) => Math.round(n / 1000) * 1000
const toNum = (s) => Math.max(0, Number(String(s).replace(/[^0-9.]/g, '')) || 0)

function monthly(principal, apr, months) {
  if (principal <= 0) return 0
  const r = apr / 100 / 12
  if (!r) return principal / months
  return (principal * r) / (1 - (1 + r) ** -months)
}

function PaymentEstimator({ v }) {
  const [price, setPrice] = useState(String(v.price))
  const [down, setDown] = useState(String(round1000(v.price * 0.2)))
  const [trade, setTrade] = useState('0')
  const [term, setTerm] = useState(60)
  const [apr, setApr] = useState(String(SAMPLE_APR))
  const financed = Math.max(0, toNum(price) - toNum(down) - toNum(trade))
  const pay = monthly(financed, toNum(apr), term)

  return (
    <section className="vdp-tool" aria-labelledby="vdp-pay-title">
      <div className="container vdp-details__grid">
        <div className="vdp-tool__head">
          <h2 id="vdp-pay-title" className="h3 section-title">
            Estimate your payment
          </h2>
        </div>
        <div className="vdp-tool__panel vdp-pay">
          <div className="vdp-pay__fields">
            <Money label="Vehicle price" value={price} onChange={setPrice} />
            <Money label="Down payment" value={down} onChange={setDown} />
            <Money label="Trade-in value" value={trade} onChange={setTrade} />
            <Field label="Term">
              {(id) => (
                <div className="select">
                  <select id={id} value={term} onChange={(e) => setTerm(Number(e.target.value))}>
                    {TERMS.map((t) => (
                      <option key={t} value={t}>
                        {t} months
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" className="select__chevron icon--static" />
                </div>
              )}
            </Field>
            <Field label="APR, %">
              {(id) => <input id={id} className="vdp-input" inputMode="decimal" value={apr} onChange={(e) => setApr(e.target.value)} />}
            </Field>
          </div>
          <div className="vdp-pay__result" aria-live="polite">
            <p className="eyebrow vdp-pay__label">Estimated payment</p>
            <p className="vdp-pay__value tabular">
              {fmtPrice(Math.round(pay))}
              <span>/mo</span>
            </p>
            <p className="small vdp-pay__financed tabular">
              {fmtPrice(financed)} financed over {term} months
            </p>
            <a className="btn vdp-pay__cta" href={`${HOME_URL}#finance`}>
              Apply for financing
              <Icon name="arrow-right" />
            </a>
            <p className="small vdp-pay__fine">
              Estimate only, not a credit offer. The rate shown is a sample; terms depend on approved
              credit. Tax, title and fees are not included.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- trade-in ---------- */
const CONDITIONS = ['Excellent', 'Good', 'Fair']

/**
 * Value your trade (Alex, 2026-11-17: "in a dark card, and a different design").
 * One dark card: the promise and three steps on the left, the car in a form plate
 * of its own on the right. "Get my offer" opens the enquiry panel with Trade-in
 * ticked and the car written into the message — no jump to the footer.
 */
function TradeIn({ v, onAsk }) {
  const [condition, setCondition] = useState('Good')
  const onSubmit = (e) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const car = ['year', 'make', 'model'].map((k) => String(d.get(k) || '').trim()).filter(Boolean).join(' ')
    const miles = String(d.get('mileage') || '').trim()
    onAsk(
      `Hi, I'd like an offer for my ${car || 'car'}${miles ? `, ${miles} miles` : ''}, ${condition.toLowerCase()} condition — ` +
        `to put toward the ${v.year} ${stockTitle(v)} (stock ${v.stockNo}).`,
    )
  }
  return (
    <section className="vdp-tool" aria-labelledby="vdp-trade-title">
      <div className="container">
        <div className="vdp-trade-card">
          <div className="vdp-trade-card__copy">
            <h2 id="vdp-trade-title" className="h3 section-title">
              Value your trade
            </h2>
            <p className="body vdp-tool__lede">Tell us about your car and we come back with an offer you can put toward this one.</p>
            <ol className="vdp-trade-steps">
              <li>
                <span className="vdp-trade-steps__n tabular">01</span>
                <span>Tell us about your car</span>
              </li>
              <li>
                <span className="vdp-trade-steps__n tabular">02</span>
                <span>We look at it and make an offer</span>
              </li>
              <li>
                <span className="vdp-trade-steps__n tabular">03</span>
                <span>
                  Put it toward the {v.year} <TitleText v={v} />
                </span>
              </li>
            </ol>
          </div>

          <form className="vdp-trade" onSubmit={onSubmit} aria-labelledby="vdp-trade-form-title">
            <p id="vdp-trade-form-title" className="vdp-trade__title">
              Your car
            </p>
            <div className="vdp-trade__fields">
              <Field label="Year">{(id) => <input id={id} name="year" className="vdp-input" inputMode="numeric" placeholder="2019" />}</Field>
              <Field label="Make">{(id) => <input id={id} name="make" className="vdp-input" placeholder="Porsche" />}</Field>
              <Field label="Model">{(id) => <input id={id} name="model" className="vdp-input" placeholder="Cayenne" />}</Field>
              <Field label="Mileage">{(id) => <input id={id} name="mileage" className="vdp-input" inputMode="numeric" placeholder="32,000" />}</Field>
            </div>
            <fieldset className="vdp-trade__condition">
              <legend className="vdp-field__label small">Condition</legend>
              <div className="vdp-trade__pills">
                {CONDITIONS.map((c) => (
                  <button key={c} type="button" className="vdp-trade__pill" aria-pressed={condition === c} onClick={() => setCondition(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>
            <button type="submit" className="btn btn--secondary vdp-trade__cta">
              Get my offer
              <Icon name="arrow-right" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }) {
  const id = useId()
  return (
    <div className="vdp-field">
      <label htmlFor={id} className="vdp-field__label small">
        {label}
      </label>
      {children(id)}
    </div>
  )
}

function Money({ label, value, onChange }) {
  return (
    <Field label={label}>
      {(id) => (
        <div className="vdp-money">
          <span aria-hidden="true">$</span>
          <input
            id={id}
            className="vdp-input tabular"
            inputMode="numeric"
            value={Number(toNum(value)).toLocaleString('en-US')}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
    </Field>
  )
}
