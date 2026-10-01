import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { brand } from '../data/brand.js'
import { heroSizes, heroSlides, heroSrc, heroSrcSet } from '../data/hero.js'
import Icon from './Icon.jsx'
import { useHeroMotion } from '../motion/useHeroMotion.js'

/**
 * Hero — FULL-SCREEN photographic slider (lead decision 2026-09-30, replaces the
 * split scene of BRIEF §10). 100svh (min 640px), edge to edge, starting at y=0
 * UNDER the sticky header (negative top margin = header height; no layout shift).
 * Type sits on the photograph; readability is solved per slide by frame, crop,
 * placement and — only where measured necessary — a localised gradient.
 *
 * MOTION CONTRACT
 *   section#top.hero[data-motion-root="hero"][data-active="0|1|2"][data-tone="light|dark"]
 *     role=region, aria-roledescription=carousel
 *     data-tone — tone of the transparent header over the photograph (via CSS
 *       :has, while header[data-header="top"]). The slider controls sit on their
 *       own white plate and are tone-independent (measured: no single tone reads
 *       over the frames' ground). Written imperatively by applyTone(i), never
 *       by React after first render. Without motion it switches on commit; the
 *       motion layer calls `applyTone(to)` at the wipe's midpoint so chrome and
 *       photograph change together.
 *   .hero__plate  — absolute, full-bleed stack (all media share grid-area 1/1)
 *     .slide__media[data-slide=i][data-scrim-top?][data-scrim-portrait?]   clip-path owner (wipe)
 *       .slide__img            x-translation owner
 *         img                  srcset 960/1600/2560, sizes from the frame geometry (heroSizes)
 *   .hero__field  — content grid over the plate (left edge = --edge)
 *     .hero__copies — grid stack
 *       .slide__copy[data-slide=i][data-tone][data-place-portrait]
 *           role=group aria-roledescription=slide
 *         .slide__headline  (h2.display, two authored .line-block spans — SplitText leaf)
 *         .slide__lead      (support)
 *         .slide__actions   (cta row; slides 1–2 identical, slide 3 differs)
 *     .hero__controls  .hero__prev / .hero__counter (aria-live) / .hero__next
 *
 *   State classes: `.is-active` on the current copy + media; inactive copies are
 *   inert + aria-hidden + visibility:hidden; `.is-leaving` keeps the outgoing
 *   copy/media painted during a transition. `go(dir)` is the single entry point.
 *   Swipe: the whole section (the field overlays the plate) has touch-action: pan-y.
 */

// Idle priming: after load, within this many ms at most (requestIdleCallback timeout).
const PRIME_IDLE_MS = 2500

export default function Hero() {
  const [active, setActive] = useState(0)
  // Non-initial slide images are not requested until first interaction or idle.
  // The motion layer decodes before it wipes.
  const [primed, setPrimed] = useState(false)
  const count = heroSlides.length
  const rootRef = useRef(null)
  const activeRef = useRef(0)
  const transitionRef = useRef(null) // set by the motion layer while a motion branch is live

  // Synchronous commit: the motion layer animates the DOM React has just written.
  const commit = useCallback((to) => {
    activeRef.current = to
    flushSync(() => setActive(to))
  }, [])

  // Shared-chrome tone (controls + transparent header). Imperative so React never
  // resets it mid-wipe.
  const applyTone = useCallback((i) => {
    const root = rootRef.current
    if (root) root.dataset.tone = heroSlides[i].tone
  }, [])

  // Without a live motion branch the tone follows the commit immediately.
  useLayoutEffect(() => {
    if (!transitionRef.current) applyTone(active)
  }, [active, applyTone])

  const prime = useCallback(() => flushSync(() => setPrimed(true)), [])

  useEffect(() => {
    if (primed) return undefined
    let idle = 0
    const schedule = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setPrimed(true), { timeout: PRIME_IDLE_MS })
        : window.setTimeout(() => setPrimed(true), PRIME_IDLE_MS)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      window.removeEventListener('load', schedule)
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
    }
  }, [primed])

  const go = useCallback(
    (dir) => {
      if (!primed) prime() // the incoming <img> gets its src before the motion layer decodes it
      if (transitionRef.current) transitionRef.current(dir)
      else commit((activeRef.current + dir + count) % count)
    },
    [count, commit, primed, prime],
  )

  useHeroMotion(rootRef, { activeRef, commit, count, transitionRef, applyTone })

  const onKeyDown = (e) => {
    if (e.target.closest('input, select, textarea')) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <section
      ref={rootRef}
      id="top"
      className="hero"
      data-motion-root="hero"
      data-active={active}
      data-tone={heroSlides[0].tone}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
      onKeyDown={onKeyDown}
      onPointerEnter={primed ? undefined : () => setPrimed(true)}
      onFocus={primed ? undefined : () => setPrimed(true)}
      onTouchStart={primed ? undefined : () => setPrimed(true)}
    >
      <h1 className="visually-hidden">{brand.wordmark} — independent car dealer</h1>

      <div className="hero__plate">
        {heroSlides.map((s, i) => {
          const isActive = i === active
          const first = i === 0
          const load = first || primed
          return (
            <div
              key={s.id}
              className={`slide__media${isActive ? ' is-active' : ''}`}
              data-slide={i}
              data-scrim-portrait={s.scrim?.portrait}
              data-scrim-top={s.scrim?.top}
              aria-hidden={!isActive}
              style={{
                '--pos': s.pos,
                '--pos-wide': s.posWide,
                '--pos-narrow': s.posNarrow || s.pos,
                '--pos-portrait': s.posPortrait,
                '--zoom-portrait': s.zoomPortrait || 1,
              }}
            >
              <div className="slide__img">
                <img
                  src={load ? heroSrc(s) : undefined}
                  srcSet={load ? heroSrcSet(s) : undefined}
                  sizes={heroSizes(s)}
                  width={s.width}
                  height={s.height}
                  alt={s.alt}
                  loading={first ? 'eager' : 'lazy'}
                  fetchPriority={first ? 'high' : 'auto'}
                  decoding={first ? 'sync' : 'async'}
                  draggable={false}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="hero__field">
        <div className="hero__copies">
          {heroSlides.map((s, i) => {
            const isActive = i === active
            return (
              <div
                key={s.id}
                className={`slide__copy${isActive ? ' is-active' : ''}`}
                data-slide={i}
                data-tone={s.tone}
                data-place-portrait={s.placePortrait}
                data-place-actions={s.placeActions}
                style={s.leadMax ? { '--lead-max': s.leadMax } : undefined}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!isActive}
                inert={!isActive}
              >
                <h2 className="display slide__headline" data-motion="heading">
                  {s.lines.map((line, li) => (
                    <span className="line-block" key={line}>
                      {line}
                      {li < s.lines.length - 1 ? ' ' : null}
                    </span>
                  ))}
                </h2>
                <p className="lead slide__lead" data-motion="support">
                  {s.lead}
                </p>
                <div className="actions slide__actions" data-motion="cta">
                  {s.actions.map((a) => (
                    <a
                      key={a.label}
                      className={`btn${a.variant === 'secondary' ? ' btn--photo' : ''}`}
                      href={a.href}
                    >
                      {a.label}
                      <Icon name="arrow-right" />
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="hero__controls" data-motion="controls">
          <button type="button" className="hero__btn hero__prev" aria-label="Previous vehicle" onClick={() => go(-1)}>
            <Icon name="chevron-left" />
          </button>
          <p className="hero__counter tabular" aria-live="polite" aria-atomic="true">
            <span className="visually-hidden">Slide </span>
            {pad(active + 1)} <span aria-hidden="true">/</span>
            <span className="visually-hidden">of</span> {pad(count)}
          </p>
          <button type="button" className="hero__btn hero__next" aria-label="Next vehicle" onClick={() => go(1)}>
            <Icon name="chevron-right" />
          </button>
        </div>
      </div>
    </section>
  )
}
