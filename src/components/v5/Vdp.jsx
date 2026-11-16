import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { brand } from '../../data/brand.js'
import { asset } from '../../data/asset.js'
import { StockPage, Crumbs, StockCard, TitleText } from './StockPage.jsx'
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
              <div className="vdp__asks">
                <a className="btn" href={`#contact?topic=car&id=${encodeURIComponent(v.id)}`}>
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
              <a className="vdp-carfax" href={`#contact?topic=carfax&id=${encodeURIComponent(v.id)}`}>
                {/* CARFAX's own dealer badge (partnerstatic.carfax.com/img/valuebadge/showme.svg) */}
                <img className="vdp-carfax__badge" src={asset('assets/carfax-show-me.svg')} width="301" height="105" alt="Show me the CARFAX" />
                <span className="vdp-carfax__text">
                  <span className="vdp-carfax__title">Vehicle history report</span>
                </span>
                <Icon name="arrow-right" className="vdp-carfax__arrow" />
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
