import { useRef } from 'react'
import Icon from './Icon.jsx'
import { brand } from '../data/brand.js'
import { photos, photoProps } from '../data/photos.js'
import { useAboutSticky } from '../motion/useAboutSticky.js'

/**
 * About (#about) — full-screen chapter (client, 2026-09-30: "make About a full
 * screen section", then "make About sticky"). The photograph fills the screen; the
 * copy sits on ONE solid white panel (type is never set on the photo, so any
 * replacement photo stays legible). Desktop (≥1024, motion on): a 190vh sticky
 * stage — the panel rises over the held photo with the scroll, holds, and both
 * leave together (src/motion/useAboutSticky.js). Otherwise: one static full screen.
 *
 * MOTION CONTRACT (unchanged)
 *   section#about[data-motion-root="about"]
 *     h2 [data-motion="heading"] (slow stagger) · .body [data-motion="support"] · .actions [data-motion="cta"]
 *     .about__media [data-motion="image"][data-reveal="down"]  clip owner (inset(0 0 100% 0) -> 0)
 *       .about__layer  inner layer for internal translation
 */
export default function About() {
  const rootRef = useRef(null)
  useAboutSticky(rootRef)
  return (
    <section ref={rootRef} id="about" className="about" data-motion-root="about" aria-labelledby="about-title">
      <div className="about__media" data-motion="image" data-reveal="down">
        <div className="about__layer">
          <div className="about__parallax">
            <img
              {...photoProps(photos.about)}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="container about__inner">
        <div className="about__panel stack">
          <p className="eyebrow">About</p>
          <h2 id="about-title" className="h2" data-motion="heading">
            <span className="line-block">A personal approach </span>
            <span className="line-block">to buying cars.</span>
          </h2>
          <p className="body" data-motion="support">
            We’re an independent dealership for people who like good cars — from modern performance to classic
            American muscle. Sales, consignment and restoration, handled by people you can talk to.
          </p>
          <ul className="tags" aria-label="About the dealership">
            {['Independent dealer', 'Newbury Park, CA'].map((t) => (
              <li className="pill pill--chip" key={t}>
                {t}
              </li>
            ))}
          </ul>
          <div className="actions" data-motion="cta">
            <a className="btn btn--secondary" href="#contact?topic=visit">
              Plan a Visit
              <Icon name="arrow-right" />
            </a>
            <a className="btn btn--secondary" href={brand.contact.phone.href} aria-label={`Call us at ${brand.contact.phone.value}`}>
              <Icon name="phone" className="icon--static" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
