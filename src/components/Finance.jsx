import Icon from './Icon.jsx'
import { photos, photoProps } from '../data/photos.js'

/**
 * Finance (#finance) — BRIEF §14.8. Light-grey band, text left, the photograph
 * bleeding to the right edge at section height: 58vw from 1024 (Sell 50vw
 * sticky, Service 54% left) — critic #3 found the inset 2:1 plate undersized.
 * No application exists, so the action asks rather than applies; no terms or
 * service promise is stated (audit P2 #4).
 *
 * MOTION CONTRACT
 *   section#finance.chapter[data-motion-root="finance"]
 *     .chapter__media [data-motion="image"][data-reveal="calm"]  clip owner (inset(0 0 0 8%) + opacity)
 *       .chapter__layer  oversized 32px left: x owner (24 -> 0)
 *     h2 [data-motion="heading"] · .lead [data-motion="support"] · .actions [data-motion="cta"]
 */
export default function Finance() {
  return (
    <section
      id="finance"
      className="chapter chapter--ground finance"
      data-motion-root="finance"
      aria-labelledby="finance-title"
    >
      <div className="container finance__grid">
        <div className="chapter__text stack finance__text">
          <p className="eyebrow">Financing</p>
          <h2 id="finance-title" className="h2" data-motion="heading">
            Find your way forward.
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

        <div className="chapter__media finance__media" data-motion="image" data-reveal="calm">
          <div className="chapter__layer chapter__layer--wide">
            <img
              {...photoProps(photos.finance)}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
