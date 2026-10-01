import { memo, useRef } from 'react'
import Icon from './Icon.jsx'
import { useClassicsSequence } from '../motion/useClassicsSequence.js'
import { photos, photoProps } from '../data/photos.js'

/**
 * Classics (#classics) — the one dark section. BRIEF §14.6, MOTION.md §4.2.
 * Memoised; its only prop is a stable ref, so nothing React re-renders lives
 * inside the pin-spacer.
 *
 * MOTION CONTRACT
 *   section#classics.classics.on-dark[data-motion-root="classics"]
 *     .classics__pin            the element the ScrollTrigger pin wraps
 *       .classics__stage        clip-path owner (approach: inset(7% 2.5% round 2px) -> 0)
 *                               desktop: height 100vh (min --h-classics-min)
 *         .classics__media
 *           .classics__layer    x / scale owner. Oversized 64px to the LEFT
 *                               (left: -64px; right: 0) so x +48 with scale 1.03
 *                               never exposes an edge; img object-position 100% 50%
 *             img
 *         .classics__copy       text column (inside the 2.5% approach inset: >= --edge)
 *           .classics__eyebrow                 (approach 0.80–1.00)
 *           h2.classics__heading
 *             .line-mask > .line.classics__line--1   "American muscle."     (authored, not SplitText)
 *             .line-mask > .line.classics__line--2   "Timeless character."
 *           .classics__body       [data-motion="support"]
 *           .classics__actions    [data-motion="cta"]  (both CTAs always focusable)
 *   <1024: stage is a normal block — image 4:3 full-bleed, text below.
 */
function Classics({ headerRef }) {
  const rootRef = useRef(null)
  useClassicsSequence(rootRef, headerRef)
  return (
    <section ref={rootRef} id="classics" className="classics on-dark" data-motion-root="classics" aria-labelledby="classics-title">
      <div className="classics__pin">
        <div className="classics__stage">
          <div className="classics__media">
            <div className="classics__layer">
              <img
              {...photoProps(photos.classics)}
              loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="classics__copy">
            <p className="eyebrow classics__eyebrow">Classic cars</p>
            <h2 id="classics-title" className="display-peak classics__heading">
              <span className="line-mask">
                <span className="line classics__line--1">American muscle.</span>
              </span>{' '}
              <span className="line-mask">
                <span className="line classics__line--2">Timeless character.</span>
              </span>
            </h2>
            <div className="classics__body" data-motion="support">
              <p className="body">
                We buy, sell, consign and restore classic American muscle — from honest drivers to full restorations.
              </p>
              <ul className="tags" aria-label="What we do with classics">
                {['Buy', 'Sell', 'Consign', 'Restore'].map((t) => (
                  <li className="pill pill--chip-dark" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="actions classics__actions" data-motion="cta">
              <a className="btn" href="#contact?topic=classics">
                Ask About Classics
                <Icon name="arrow-right" />
              </a>
              <a className="btn btn--on-dark" href="#service">
                Restoration Services
                <Icon name="arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Classics)
