import { brand } from '../data/brand.js'
import { instagramTiles } from '../data/instagram.js'
import Icon from './Icon.jsx'

/**
 * Instagram — BRIEF §14.11. Text cols 1–4, three 1:1 tiles cols 5–12.
 * While brand.instagramUrl is null the tiles are plain figures (no hover, no
 * arrow) — never a dead link. With a URL they become links with the
 * hover scale (--hover-scale) + arrow.
 *
 * MOTION CONTRACT
 *   section#instagram[data-motion-root="instagram"]
 *     h2 [data-motion="heading"] · .instagram__copy [data-motion="support"]
 *     ul.instagram__tiles [data-motion="group"] > li.tile (.tile__img = hover scale owner)
 */
export default function Instagram() {
  const url = brand.instagramUrl
  return (
    <section id="instagram" className="instagram" data-motion-root="instagram" aria-labelledby="instagram-title">
      <div className="container instagram__grid">
        <div className="instagram__text stack">
          <p className="eyebrow">Instagram</p>
          <h2 id="instagram-title" className="h3" data-motion="heading">
            Follow along.
          </h2>
          <div className="instagram__copy" data-motion="support">
            <p className="small">Arrivals, behind the scenes and work in the shop.</p>
            <p className="small instagram__handle">
              {url ? (
                <a className="text-link" href={url} target="_blank" rel="noopener">
                  {brand.instagramHandle}
                  <Icon name="arrow-right" />
                </a>
              ) : (
                <>
                  {brand.instagramHandle} <span className="tag">Placeholder</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="instagram__media">
          <ul className="instagram__tiles" data-motion="group">
            {instagramTiles.map((t) => {
              const inner = (
                <>
                  <div className="tile__media frame">
                    <div className="tile__img">
                      <img src={t.src} width="900" height="900" alt={t.alt} loading="lazy" decoding="async" />
                    </div>
                    <span className="tile__badge" aria-hidden="true">
                      <Icon name="instagram" />
                    </span>
                  </div>
                  {url && <Icon name="arrow-right" className="tile__arrow" />}
                </>
              )
              return (
                <li className="tile" key={t.id}>
                  {url ? (
                    <a
                      className="tile__link"
                      href={url}
                      target="_blank"
                      rel="noopener"
                      aria-label={`${t.alt} On Instagram (opens in a new tab)`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <figure className="tile__figure">{inner}</figure>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
