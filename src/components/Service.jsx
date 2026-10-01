import { brand } from '../data/brand.js'
import Icon from './Icon.jsx'
import { photos, photoProps } from '../data/photos.js'

/**
 * Service (#service) — BRIEF §14.7. White; plate LEFT (54%, full section
 * height, bleeding), text right (cols 8–12). Three hairline-ruled numbered rows,
 * no icons (DNA33). CTA becomes an external "Visit Our Repair Shop" link as soon
 * as brand.repairShopUrl is set.
 *
 * MOTION CONTRACT
 *   section#service.chapter[data-motion-root="service"]
 *     .chapter__media  [data-motion="image"][data-reveal="up"]   clip owner (inset(100% 0 0 0) -> 0)
 *       .chapter__layer  112% tall, top-anchored: y owner (reveal yPercent -8 -> 0, then 0 -> -40px)
 *     .chapter__text
 *       h2 [data-motion="heading"] · .lead [data-motion="support"]
 *       ol.service__list [data-motion="group"] > li (3 items, stagger as one group)
 *       .actions [data-motion="cta"]
 */
const services = [
  { num: '01', title: 'Repairs', text: 'Diagnostics, maintenance and mechanical repair.' },
  { num: '02', title: 'Paint & Body', text: 'Collision repair, paintwork and refinishing.' },
  { num: '03', title: 'Restoration', text: 'Partial and complete restorations.' },
]

export default function Service() {
  const external = Boolean(brand.repairShopUrl)
  return (
    <section
      id="service"
      className="chapter chapter--media-left service"
      data-motion-root="service"
      aria-labelledby="service-title"
    >
      <div className="chapter__media" data-motion="image" data-reveal="up">
        <div className="chapter__layer chapter__layer--tall">
          <img
              {...photoProps(photos.service)}
              loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="chapter__text stack">
        <p className="eyebrow">Service &amp; restoration</p>
        <h2 id="service-title" className="h2" data-motion="heading">
          <span className="line-block">Keep it running. </span>
          <span className="line-block">Bring it back.</span>
        </h2>
        <p className="lead" data-motion="support">
          Repairs, paint, body work and restoration for daily drivers, modern performance cars and classics.
        </p>
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
    </section>
  )
}
