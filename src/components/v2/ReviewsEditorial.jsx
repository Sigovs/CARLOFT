import { useCallback, useState } from 'react'
import { reviews } from '../../data/reviews.js'
import { brand } from '../../data/brand.js'
import Icon from '../Icon.jsx'

/**
 * ReviewsEditorial — V2 Reviews (index_v2.html). A port of 21st.dev
 * "Editorial Testimonial" (jatin-yadav05) to this stack: no Next/Image, lucide,
 * Tailwind or TypeScript. One review at a time: a large tabular index, the quote
 * set large in the serif voice, the reviewer below; a line selector with a
 * 01 / 04 counter and prev / next. Neutral black ground with a fine film grain
 * (round 3: the grey light-leak haze was taken out — client: no grey grounds).
 *
 * Manual only — buttons, line selector, arrow keys; it never auto-advances
 * (CLIENT-BRIEF M1). The change is a crossfade + 16 px drift; under reduced
 * motion it is an instant swap. All reviews share one grid cell, so the
 * stage keeps the height of the longest quote and the control bar never moves. Reviews are SIMULATED samples (data/reviews.js).
 *
 * MOTION CONTRACT (same roles as V1, bound by src/motion/reveals.js)
 *   section#reviews.reviews[data-motion-root="reviews"]
 *     h2 [data-motion="heading"] · .rv2__stage [data-motion="support"]
 */
const pad = (n) => String(n).padStart(2, '0')

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export default function ReviewsEditorial() {
  const [active, setActive] = useState(0)
  const go = useCallback((index) => setActive((index + reviews.length) % reviews.length), [])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(active - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(active + 1)
    }
  }

  return (
    <section id="reviews" className="reviews rv2" data-motion-root="reviews" aria-labelledby="reviews-title">
      <div className="rv2__grain" aria-hidden="true" />
      <div className="container rv2__inner">
        <div className="rv2__head">
          <p className="eyebrow">Reviews</p>
          <h2 id="reviews-title" className="h3" data-motion="heading">
            What our customers say.
          </h2>
        </div>

        <div
          className="rv2__stage"
          data-motion="support"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <span className="rv2__index tabular" aria-hidden="true">
            {pad(active + 1)}
          </span>

          {/* Every review stacked in one cell: the stage is as tall as the longest
              quote, so nothing below it moves when the review changes. */}
          <div className="rv2__reviews">
            {reviews.map((r, i) => (
              <figure
                key={r.id}
                className={`rv2__review${i === active ? ' is-active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${reviews.length}`}
                aria-hidden={i !== active}
                inert={i !== active}
              >
                <blockquote className="rv2__quote">
                  <p>{r.text}</p>
                </blockquote>
                <figcaption className="rv2__author">
                  <span className="rv2__avatar" aria-hidden="true">
                    {r.avatar ? <img src={r.avatar} alt="" width="48" height="48" /> : initials(r.name)}
                  </span>
                  <span className="rv2__who">
                    <span className="rv2__name">
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener">
                          {r.name}
                        </a>
                      ) : (
                        r.name
                      )}
                    </span>
                    <span className="rv2__role">{r.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* One fixed control bar on the CTA's line: See all reviews · lines + count · arrows. */}
        <div className="rv2__bar">
          <a className="pill pill--on-dark rv2__more" href={brand.reviewsUrl} target="_blank" rel="noopener">
            See all reviews
            <Icon name="arrow-right" />
            <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
          </a>
          <div className="rv2__nav" role="group" aria-label="Choose a review">
            <div className="rv2__lines">
              {reviews.map((x, i) => (
                <button
                  type="button"
                  key={x.id}
                  className="rv2__line"
                  aria-label={`Go to review ${i + 1}`}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => go(i)}
                >
                  <span />
                </button>
              ))}
              <span className="rv2__count tabular" aria-hidden="true">
                {pad(active + 1)} / {pad(reviews.length)}
              </span>
            </div>
            <div className="rv2__arrows">
              <button type="button" className="rv2__arrow" aria-label="Previous review" onClick={() => go(active - 1)}>
                <Icon name="chevron-left" />
              </button>
              <button type="button" className="rv2__arrow" aria-label="Next review" onClick={() => go(active + 1)}>
                <Icon name="chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
