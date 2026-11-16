import { useEffect } from 'react'
import Header from '../Header.jsx'
import Footer from '../Footer.jsx'
import Icon from '../Icon.jsx'
import { useHashRoute } from '../../hooks/useHashRoute.js'
import { initScroll } from '../../motion/scroll.js'
import { fmtMiles, fmtPrice, stockTitle, vdpUrl } from '../../data/v5/stock.js'

/**
 * StockPage — the shell of the V5 inner pages (SRP, VDP): the V5 header (solid from
 * the start), the light inventory ground, the same footer (#contact). Lenis as on the
 * home page (DNA90, src/motion/scroll.js).
 */
export function StockPage({ children }) {
  const route = useHashRoute()
  useEffect(() => initScroll(), [])
  return (
    <div className="page page--stock">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="stock">
        {children}
      </main>
      <Footer route={route} />
    </div>
  )
}

/** Breadcrumb: Home / Inventory / … — the last item is the current page. */
export function Crumbs({ items }) {
  return (
    <nav className="stock-crumbs small" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>
            {it.href ? <a href={it.href}>{it.label}</a> : <span aria-current="page">{it.label}</span>}
            {i < items.length - 1 ? <Icon name="chevron-right" className="icon--static" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** A listing title on the page: the make never breaks at its hyphen (Mercedes-Benz). */
export function TitleText({ v }) {
  return (
    <>
      <span className="stock-make">{v.make}</span> {v.model}
      {v.trim ? ` ${v.trim}` : ''}
    </>
  )
}

/** A listing card — the home page's card (white on the grey), as a link to the VDP. */
export function StockCard({ v, eager = false }) {
  const p = v.photos[0]
  return (
    <article className="card stock-card">
      <div className="card__media frame">
        <div className="card__img">
          <img
            src={p.src}
            srcSet={p.srcSet}
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 92vw"
            width="960"
            height="640"
            alt={`${v.year} ${stockTitle(v)}, ${v.color.toLowerCase()}, studio photograph.`}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
        <span className="pill pill--chip card__tag">{v.body}</span>
      </div>
      <div className="card__body">
        <h3 className="title card__title">
          <a className="card__open" href={vdpUrl(v.id)}>
            <TitleText v={v} />
          </a>
        </h3>
        <ul className="card__meta small tabular" aria-label="Details">
          <li>{v.year}</li>
          <li>{fmtMiles(v.mileage)}</li>
          <li>{v.transmission}</li>
        </ul>
        <div className="card__foot">
          <p className="card__price">
            <span className="card__price-label">Sample price</span>{' '}
            <span className="card__price-value tabular">{fmtPrice(v.price)}</span>
          </p>
          <Icon name="arrow-right" className="card__arrow" />
        </div>
      </div>
    </article>
  )
}
