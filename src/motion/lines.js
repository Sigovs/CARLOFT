import { gsap, SplitText } from './gsap.js'
import { DIST, FONT_CAP } from './tokens.js'

/**
 * Line masks — MOTION.md §6.3. SplitText with mask:'lines' (mask class
 * `line-mask`, which base.css pads for descenders), autoSplit so lines rebuild
 * on width change / font load, and the animation returned from onSplit so a
 * re-split reverts it and restores it at the same time.
 *
 * Authored `.line-block` spans are split individually (a decided break stays a
 * break; a block that wraps on a narrow screen becomes two masked lines).
 * aria:'none' — the words stay real text inside the heading; `auto` would put
 * the label on the line-block spans, which screen readers ignore.
 */
export function splitLines(el, onSplit) {
  const blocks = el.querySelectorAll('.line-block')
  return SplitText.create(blocks.length ? [...blocks] : el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'line',
    tag: 'span',
    autoSplit: true,
    aria: 'none',
    onSplit,
  })
}

/** Scroll-triggered line rise. Returns the SplitText instance. */
export function lineReveal(el, { start, stagger, duration, ease, delay = 0, trigger = el }) {
  return splitLines(el, (self) =>
    gsap.from(self.lines, {
      yPercent: DIST.line,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger: { trigger, start, once: true },
    }),
  )
}

/** Fonts, capped: measured work never waits on a font that is not coming. */
export function fontsReady(cap = FONT_CAP) {
  const ready = document.fonts ? document.fonts.ready : Promise.resolve()
  return Promise.race([ready, new Promise((r) => setTimeout(r, cap))])
}

/** Header height from the token the header itself uses (no document query). */
export function headerHeight(el) {
  return parseFloat(getComputedStyle(el).getPropertyValue('--header-h')) || 0
}
