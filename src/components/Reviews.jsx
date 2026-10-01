import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { reviews } from '../data/reviews.js'
import { brand } from '../data/brand.js'
import Icon from './Icon.jsx'

/**
 * Reviews — dark, one centred testimonial at a time (a port of the shadcn
 * "TestimonialCarousel" design to this stack: Embla for the carousel, no
 * Next/Image, shadcn, Tailwind or TypeScript). Manual only — drag, arrow keys or
 * the dots; it never auto-advances (CLIENT-BRIEF M1: no endlessly moving carousel).
 * Reviews are SIMULATED samples for the mockup (data/reviews.js — replace before
 * launch). No logos, ratings or photos. "See all reviews" opens brand.reviewsUrl.
 *
 * MOTION CONTRACT
 *   section#reviews[data-motion-root="reviews"]
 *     h2 [data-motion="heading"] · .reviews__carousel [data-motion="support"]
 */
const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export default function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: false })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        emblaApi?.scrollPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        emblaApi?.scrollNext()
      }
    },
    [emblaApi],
  )

  return (
    <section id="reviews" className="reviews" data-motion-root="reviews" aria-labelledby="reviews-title">
      {/* Dirty radial ground: three irregular, blurred polygons + grain (decorative). */}
      <div className="reviews__bg" aria-hidden="true">
        <span className="reviews__shape reviews__shape--blue" />
        <span className="reviews__shape reviews__shape--deep" />
        <span className="reviews__shape reviews__shape--cognac" />
      </div>
      <div className="container reviews__inner">
        <div className="reviews__head">
          <p className="eyebrow">Reviews</p>
          <h2 id="reviews-title" className="h3" data-motion="heading">
            What our customers say.
          </h2>
        </div>

        <div
          className="reviews__carousel"
          data-motion="support"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <div className="reviews__viewport" ref={emblaRef}>
            <div className="reviews__track">
              {reviews.map((r, i) => (
                <figure
                  className="reviews__slide"
                  key={r.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${reviews.length}`}
                  aria-hidden={i !== current}
                >
                  <blockquote className="reviews__quote">
                    <p>{r.text}</p>
                  </blockquote>
                  <figcaption className="reviews__caption">
                    <span className="reviews__name">
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener">
                          {r.name}
                        </a>
                      ) : (
                        r.name
                      )}
                    </span>
                    <span className="reviews__role pill pill--chip-dark">{r.role}</span>
                    <span className="reviews__avatar" aria-hidden="true">
                      {r.avatar ? <img src={r.avatar} alt="" width="48" height="48" /> : initials(r.name)}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="reviews__dots">
            {reviews.map((r, i) => (
              <button
                type="button"
                key={r.id}
                className="reviews__dot"
                aria-label={`Go to review ${i + 1}`}
                aria-current={i === current ? 'true' : undefined}
                onClick={() => emblaApi?.scrollTo(i)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="reviews__more">
            <a className="pill pill--on-dark" href={brand.reviewsUrl} target="_blank" rel="noopener">
              See all reviews
              <Icon name="arrow-right" />
              <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
