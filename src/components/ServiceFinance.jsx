import { useRef } from 'react'
import { brand } from '../data/brand.js'
import Icon from './Icon.jsx'
import { photos, photoProps } from '../data/photos.js'
import { useServiceFinance } from '../motion/useServiceFinance.js'

/**
 * Service + Finance — ONE chapter that changes on scroll (client, 2026-09-30:
 * "merge these two sections into one; let it change on scroll"). Replaces the
 * separate Service.jsx and Finance.jsx (kept in the tree, unused — restore by
 * rendering them in App.jsx in place of <ServiceFinance />).
 *
 * CLASS CONTRACT (motion: src/motion/useServiceFinance.js)
 *   section#service.svcfin[data-motion-root="svcfin"]   (.is-staged on desktop ≥1024)
 *     span#finance.svcfin__anchor          nav target for "Finance" (the phase-2 point)
 *     .svcfin__stage                       sticky 100vh stage when staged
 *       .svcfin__frame[data-phase=0|1]     clip owner  > .svcfin__layer (y/scale owner) > img
 *       .svcfin__group[data-phase=0|1]     text group; motion owns opacity/x + data-active
 *       .svcfin__index                     01 Service · 02 Finance (staged only)
 *   STATIC (default · mobile · reduced motion): the two stories stack —
 *   photo, text, photo, text — all visible.
 */
const services = [
  { num: '01', title: 'Repairs', text: 'Diagnostics, maintenance and mechanical repair.' },
  { num: '02', title: 'Paint & Body', text: 'Collision repair, paintwork and refinishing.' },
  { num: '03', title: 'Restoration', text: 'Partial and complete restorations.' },
]

export default function ServiceFinance() {
  const rootRef = useRef(null)
  useServiceFinance(rootRef)
  const external = Boolean(brand.repairShopUrl)

  return (
    <section ref={rootRef} id="service" className="svcfin" data-motion-root="svcfin" aria-label="Service and financing">
      <span id="finance" className="svcfin__anchor" aria-hidden="true" />
      <div className="svcfin__stage">
        <div className="svcfin__frame" data-phase="0">
          <div className="svcfin__layer">
            <img {...photoProps(photos.service)} loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="svcfin__group stack" data-phase="0" id="svcfin-phase-0">
          <p className="eyebrow">Service &amp; restoration</p>
          <h2 id="service-title" className="h2" data-motion="heading">
            <span className="line-block">Keep it running. </span>
            <span className="line-block">Bring it back.</span>
          </h2>
          <p className="lead" data-motion="support">
            Repairs, paint, body work and restoration for daily drivers, modern performance cars and classics.
          </p>
          <ul className="tags" aria-label="Cars we work on">
            {['Daily drivers', 'Performance cars', 'Classics'].map((t) => (
              <li className="pill pill--chip" key={t}>
                {t}
              </li>
            ))}
          </ul>
          <ol className="service__list" data-motion="group">
            {services.map((s) => (
              <li className="service__item" key={s.num}>
                <span className="service__num small tabular" aria-hidden="true">
                  {s.num}
                </span>
                <div>
                  <h3 className="title">{s.title}</h3>
                  <p className="small service__text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="actions" data-motion="cta">
            {external ? (
              <a className="btn" href={brand.repairShopUrl} target="_blank" rel="noopener">
                Visit Our Repair Shop
                <Icon name="arrow-right" />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            ) : (
              <a className="btn" href="#contact?topic=service">
                Contact Our Repair Shop
                <Icon name="arrow-right" />
              </a>
            )}
          </div>
        </div>

        <div className="svcfin__frame" data-phase="1">
          <div className="svcfin__layer">
            <img {...photoProps(photos.finance)} loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="svcfin__group stack" data-phase="1" id="svcfin-phase-1">
          <p className="eyebrow">Financing</p>
          <h2 id="finance-title" className="h2" data-motion="heading">
            <span className="line-block">Find your </span>
            <span className="line-block">way forward.</span>
          </h2>
          <p className="lead" data-motion="support">
            Ask us about financing options when you find the right car.
          </p>
          <div className="actions" data-motion="cta">
            <a className="btn" href="#contact?topic=finance">
              Ask About Financing
              <Icon name="arrow-right" />
            </a>
          </div>
        </div>

        <nav className="svcfin__index" aria-label="Service and financing">
          <button type="button" className="svcfin__index-btn" data-phase-target="0">
            <span className="tabular">01</span> Service
          </button>
          <button type="button" className="svcfin__index-btn" data-phase-target="1">
            <span className="tabular">02</span> Finance
          </button>
          <span className="svcfin__track" aria-hidden="true">
            <span className="svcfin__fill" />
          </span>
        </nav>
      </div>
    </section>
  )
}
