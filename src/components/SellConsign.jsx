import { useRef } from 'react'
import Icon from './Icon.jsx'
import { useSellSequence } from '../motion/useSellSequence.js'
import { photos, photoProps } from '../data/photos.js'

/**
 * SellConsign (#sell) — BRIEF §14.5, MOTION.md §4.1.
 *
 * ─────────────────────────────── CLASS CONTRACT ───────────────────────────────
 * STATIC (default: no JS motion, reduced motion, <=1023px, or JS failed):
 *   reff1 layout — intro paragraph, then BOTH pathways side by side (stacked on
 *   narrow columns) separated by a hairline; image plate right (>=1024) or
 *   image first (<1024). The index is display:none. Nothing is hidden.
 *
 * STAGED (desktop motion branch only):
 *   The motion layer adds `.is-staged` to `section.sell` inside its
 *   gsap.matchMedia desktop branch and REMOVES it in that branch's cleanup.
 *   `.is-staged` switches CSS to:
 *     section.sell           height: 180vh
 *     .sell__stage           position: sticky; top: var(--header-h);
 *                            height: calc(100vh - var(--header-h))
 *     .sell__slot            all three .sell__group share grid-area 1/1
 *                            (slot height = tallest group; no reflow on swap)
 *     .sell__index           visible (01 Overview · 02 Sell · 03 Consign)
 *     .sell__group           pointer-events: none unless [data-active]
 *   The motion layer owns, per group: opacity / y (GSAP inline styles), the
 *   `data-active` attribute on the active .sell__group, `aria-current="step"`
 *   on the active .sell__index-btn, and the transform (scaleX) of .sell__fill.
 *   CSS never sets opacity on a group — a missing motion layer can never hide one.
 *
 * Other hooks:
 *   .sell__media  clip-path owner (approach reveal inset(0 0 0 22%) -> 0)
 *   .sell__frame  x / scale owner, anchored left; its spare equals the travel:
 *                 +64px staged (x down to -56px), +24px <1024 (x -24 → 0),
 *                 none on the static desktop layout — never exposes an edge
 *   .sell__heading [data-motion="heading"] persistent H2 (never exits)
 *   .sell__group[data-phase="0|1|2"] with ids sell-phase-0..2
 *   .sell__index-btn[data-phase-target="0|1|2"] aria-controls="sell-phase-N"
 *     (click behaviour — scroll to the phase midpoint — is the motion layer's;
 *      the buttons only exist visibly in the staged layout)
 * ──────────────────────────────────────────────────────────────────────────────
 */

const pathways = [
  {
    phase: 1,
    title: 'Sell Your Vehicle',
    text: 'Tell us about your car and we’ll come back with an offer.',
    cta: { label: 'Sell Your Vehicle', href: '#contact?topic=sell', variant: 'primary' },
  },
  {
    phase: 2,
    title: 'Consignment',
    text: 'For special and collector cars: we present and market the car for you.',
    cta: { label: 'Learn About Consignment', href: '#contact?topic=consign', variant: 'secondary' },
  },
]

const indexItems = [
  { phase: 0, num: '01', label: 'Overview' },
  { phase: 1, num: '02', label: 'Sell' },
  { phase: 2, num: '03', label: 'Consign' },
]

export default function SellConsign() {
  const rootRef = useRef(null)
  useSellSequence(rootRef)
  return (
    <section ref={rootRef} id="sell" className="sell" data-motion-root="sell" aria-labelledby="sell-title">
      <div className="sell__stage">
        <div className="sell__media" data-motion="image" data-reveal="right">
          <div className="sell__frame">
            <img
              {...photoProps(photos.sell)}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="sell__copy">
          <p className="eyebrow">Sell or consign</p>
          <h2 id="sell-title" className="display sell__heading" data-motion="heading">
            <span className="line-block">Make room </span>
            <span className="line-block">for what’s next.</span>
          </h2>

          <div className="sell__slot">
            <div className="sell__group sell__group--intro" data-phase="0" id="sell-phase-0">
              <p className="lead" data-motion="support">
                Selling your car? We can buy it outright, or consign it and handle the sale for you. Either way,
                it starts with a straightforward conversation.
              </p>
            </div>

            {pathways.map((p) => (
              <div
                key={p.phase}
                className="sell__group sell__group--path"
                data-phase={p.phase}
                id={`sell-phase-${p.phase}`}
              >
                <h3 className="title sell__path-title">{p.title}</h3>
                <p className="body sell__path-text">{p.text}</p>
                <div className="actions sell__path-actions">
                  <a className={`btn${p.cta.variant === 'secondary' ? ' btn--secondary' : ''}`} href={p.cta.href}>
                    {p.cta.label}
                    <Icon name="arrow-right" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <nav className="sell__index" aria-label="Sell or consign — steps">
            <ol className="sell__index-list">
              {indexItems.map((it) => (
                <li key={it.phase}>
                  <button
                    type="button"
                    className="sell__index-btn"
                    data-phase-target={it.phase}
                    aria-controls={`sell-phase-${it.phase}`}
                  >
                    <span className="sell__index-num tabular">{it.num}</span> {it.label}
                  </button>
                </li>
              ))}
            </ol>
            <div className="sell__track" aria-hidden="true">
              <span className="sell__fill" />
            </div>
          </nav>
        </div>
      </div>
    </section>
  )
}
