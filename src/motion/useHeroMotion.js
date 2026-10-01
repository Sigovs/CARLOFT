import { gsap, Observer, ScrollTrigger, useGSAP } from './gsap.js'
import { MQ } from './media.js'
import { CLIP, DIST, DUR, EASE, HERO, STAGGER } from './tokens.js'
import { fontsReady, headerHeight, splitLines } from './lines.js'

/**
 * Hero — the arrival (MOTION.md §5). Bound by name on purpose (MJ11 exception).
 *
 *  - Load: the image is painted at first paint (LCP, never a from-state). The
 *    active copy is held (opacity only, set here — never by CSS) until fonts
 *    are ready (capped 300ms), then: headline lines → lead → actions → controls.
 *  - Slide change: `transitionRef.current(dir)` replaces Hero's instant swap.
 *    Commit first (flushSync) so React owns is-active/inert/aria, then the wipe
 *    runs over the already-committed DOM with `.is-leaving` holding the
 *    outgoing slide visible underneath. Queue of one; a click mid-flight rushes
 *    the current transition (timeScale) and then runs the latest target.
 *  - Tone: the transparent header changes tone WITH the wipe front, item by item.
 *    At the wipe's start `applyTone(to)` sets the new tone; every header item
 *    the front has not reached yet is held on the old tone (data-zone-tone,
 *    motion.css) and flips the frame the front passes its centre. A single
 *    mid-wipe switch left white nav over the incoming pale frame for ~0.6s
 *    (forward) and charcoal wordmark over the outgoing dark one (measured).
 *  - Copy on forward wipes waits HERO.copyAfterWipe of the wipe: the copy column
 *    is on the LEFT and a forward wipe opens right→left, so the column is the
 *    last region to change; incoming copy rising earlier sat over the old frame.
 *  - Full-screen hero (2026-09-30): the copy overlays the plate, so the swipe
 *    surface is the whole section, and each slide carries its own eyebrow
 *    (animated with the lead).
 *  - Reduced: no branch → Hero keeps its instant swap (the authored still).
 */
const HEADER_ZONES = '.header__wordmark, .header__link, .header__menu-btn'

export function useHeroMotion(rootRef, { activeRef, commit, count, transitionRef, applyTone }) {
  useGSAP(
    () => {
      const root = rootRef.current
      const mm = gsap.matchMedia()

      // --- The header band is a no-text zone (every mode, incl. reduced motion) ---
      // The header is transparent over the full-screen hero, so as the hero scrolls
      // away its copy and the white controls plate slid UNDER the header's type
      // (measured: the white wordmark vanished on the white plate at 100px from
      // the hero's end; the eyebrow crossed the wordmark after ~70px of scroll).
      // The field is masked so its content fades out over the 20px above the
      // header's bottom edge and never paints under the bar. Not an animation —
      // a scroll-state edge — so it lives outside the matchMedia split.
      const field = root.querySelector('.hero__field')
      if (field) {
        root.classList.add('is-cut')
        const setCut = (self) => {
          const H = headerHeight(root)
          field.style.setProperty('--hero-cut', `${H + Math.max(0, self.scroll() - self.start)}px`)
        }
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          onUpdate: setCut,
          onRefresh: setCut,
        })
      }

      // The matchMedia context's own contextSafe: wrapping with useGSAP's would nest
      // the outer context inside the inner one (a cycle) when called during a refresh.
      mm.add(MQ, (context, contextSafe) => {
        const { isDesktop, reduce } = context.conditions
        if (reduce) return

        const q = gsap.utils.selector(root)
        const copies = q('.slide__copy')
        const medias = q('.slide__media')
        const controls = q('.hero__controls')[0]
        const wipe = isDesktop ? DUR.xl : DUR.l
        const lineStagger = isDesktop ? STAGGER.linesHero : STAGGER.linesMobile
        const part = (copy, sel) => copy.querySelector(sel)
        // Actions animate only when they change — in content OR in position (a
        // shorter lead moves the row; an unanimated jump would read as a glitch).
        // …or in tone: the same labels are styled differently on a light vs a dark frame.
        const actionsDiffer = (a, b) => {
          const x = part(copies[a], '.slide__actions')
          const y = part(copies[b], '.slide__actions')
          return (
            x.textContent !== y.textContent ||
            copies[a].dataset.tone !== copies[b].dataset.tone ||
            Math.abs(x.offsetTop - y.offsetTop) > 1
          )
        }

        // --- Load: hold the active copy (opacity only) until the lines exist ---
        const first = copies[activeRef.current]
        const hold = [part(first, '.slide__headline'), part(first, '.slide__lead'), part(first, '.slide__actions'), controls]
        gsap.set(hold, { opacity: 0 })

        let live = true
        fontsReady(HERO.fontCap).then(() => {
          if (!live) return
          context.add(() => {
            const initial = activeRef.current
            copies.forEach((copy, i) => {
              const headline = part(copy, '.slide__headline')
              splitLines(headline, (self) => {
                if (i !== initial) return undefined
                gsap.set(headline, { opacity: 1 })
                // Returned so a re-split restores it at the same time (§6.3).
                return gsap
                  .timeline({ delay: HERO.loadDelay })
                  .from(self.lines, { yPercent: DIST.line, duration: DUR.l, ease: EASE.expo, stagger: lineStagger }, 0)
                  .fromTo(part(copy, '.slide__lead'), { opacity: 0, y: DIST.heroLeadLoad }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out }, HERO.loadLead)
                  .fromTo(part(copy, '.slide__actions'), { opacity: 0, y: DIST.cta }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out }, HERO.loadActions)
                  .fromTo(controls, { opacity: 0 }, { opacity: 1, duration: DUR.s, ease: EASE.out }, HERO.loadControls)
              })
            })
          })
        })

        // --- Slide transition ---------------------------------------------------
        let tl = null
        let queued = null

        // The header is the page's, not the hero's: reached through the page root,
        // never a document-wide query (G2).
        const header$ = () => root.closest('.page')?.querySelector('.header')
        let activeZones = []
        const clearZones = () => {
          activeZones.forEach((el) => delete el.dataset.zoneTone)
          activeZones = []
        }

        // Decode gate: the incoming photograph is decoded BEFORE the wipe starts,
        // so the mask never opens on an empty plate (its src may only just have
        // been set — Hero defers non-initial slides until interaction/idle).
        let decoding = false
        const decodedImgs = new WeakSet()
        const run = contextSafe((dir) => {
          if ((tl && tl.isActive()) || decoding) {
            queued = dir
            tl?.timeScale(HERO.rushScale)
            return
          }
          const target = (activeRef.current + dir + count) % count
          const img = medias[target].querySelector('img')
          if (img && !decodedImgs.has(img)) {
            decoding = true
            const decoded = img.decode ? img.decode().catch(() => {}) : Promise.resolve()
            Promise.race([decoded, new Promise((r) => setTimeout(r, HERO.decodeCap))]).then(() => {
              decoding = false
              if (img.naturalWidth) decodedImgs.add(img)
              if (!live) return
              start(dir)
            })
            return
          }
          start(dir)
        })

        const start = contextSafe((dir) => {
          const from = activeRef.current
          const to = (from + dir + count) % count
          commit(to) // React: is-active / inert / aria-hidden / counter, synchronously

          const outCopy = copies[from]
          const inCopy = copies[to]
          const outMedia = medias[from]
          const inMedia = medias[to]
          const outImg = outMedia.firstElementChild
          const inImg = inMedia.firstElementChild
          const outLines = outCopy.querySelectorAll('.slide__headline .line')
          const inLines = inCopy.querySelectorAll('.slide__headline .line')
          const changedActions = actionsDiffer(from, to)
          const shift = dir > 0 ? Math.max(0, wipe * HERO.copyAfterWipe - HERO.linesAt) : 0
          const outText = [part(outCopy, '.slide__lead'), changedActions && part(outCopy, '.slide__actions')].filter(Boolean)

          // Header items follow the wipe front (see header comment). Measured now,
          // at rest; only while the header is transparent over the hero.
          const fromTone = copies[from].dataset.tone
          const toTone = copies[to].dataset.tone
          const header = header$()
          const zones =
            header && header.dataset.header === 'top' && fromTone !== toTone
              ? [...header.querySelectorAll(HEADER_ZONES)].filter((el) => el.getClientRects().length)
              : []
          const W = root.clientWidth
          const zoneX = zones.map((el) => {
            const r = el.getBoundingClientRect()
            return r.left + r.width / 2
          })
          clearZones()
          zones.forEach((el) => (el.dataset.zoneTone = fromTone))
          activeZones = zones
          applyTone?.(to)
          const followFront = function () {
            const e = this.ratio // eased progress of the clip
            const front = dir > 0 ? W * (1 - e) : W * e
            zones.forEach((el, i) => {
              const passed = dir > 0 ? front <= zoneX[i] : front >= zoneX[i]
              if (passed && el.dataset.zoneTone !== toTone) el.dataset.zoneTone = toTone
            })
          }

          outCopy.classList.add('is-leaving')
          outMedia.classList.add('is-leaving')
          // Unchanged actions do not animate: the incoming set simply sits where the outgoing one was.
          if (!changedActions) gsap.set(part(outCopy, '.slide__actions'), { opacity: 0 })

          tl = gsap.timeline({
            onComplete: () => {
              clearZones()
              outCopy.classList.remove('is-leaving')
              outMedia.classList.remove('is-leaving')
              // Named props only: .slide__media carries React's --pos inline vars.
              gsap.set(inMedia, { clearProps: 'clipPath' })
              gsap.set([outImg, inImg, ...outLines], { clearProps: 'transform' })
              gsap.set([...outText, part(outCopy, '.slide__actions')], { clearProps: 'opacity,transform' })
              tl = null
              if (queued !== null) {
                const next = queued
                queued = null
                run(next)
              }
            },
          })
          tl.fromTo(inMedia, { clipPath: dir > 0 ? CLIP.heroNext : CLIP.heroPrev }, { clipPath: CLIP.open, duration: wipe, ease: EASE.wipe, onUpdate: followFront }, 0)
            .fromTo(inImg, { xPercent: DIST.heroIn * dir }, { xPercent: 0, duration: wipe, ease: EASE.wipe }, 0)
            .to(outImg, { xPercent: DIST.heroOut * dir, duration: wipe, ease: EASE.wipe }, 0)
            .to(outLines, { yPercent: -DIST.lineExit, duration: DUR.s, ease: EASE.in, overwrite: 'auto' }, 0)
            // The outgoing copy stops painting the moment its exit is done — nothing lingers in a mask pad.
            .call(() => outCopy.classList.remove('is-leaving'), null, DUR.s)
            .to(outText, { opacity: 0, y: -DIST.exit, duration: DUR.s, ease: EASE.in, overwrite: 'auto' }, 0)
            .fromTo(inLines, { yPercent: DIST.line }, { yPercent: 0, duration: DUR.l, ease: EASE.expo, stagger: lineStagger, overwrite: 'auto' }, HERO.linesAt + shift)
            .fromTo(part(inCopy, '.slide__lead'), { opacity: 0, y: DIST.heroLead }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out }, HERO.leadAt + shift)
          if (changedActions) {
            tl.fromTo(part(inCopy, '.slide__actions'), { opacity: 0, y: DIST.cta }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out }, HERO.actionsAt + shift)
          }
        })
        transitionRef.current = run

        // --- Swipe (touch + pointer drag anywhere on the hero; vertical scroll untouched).
        // The copy overlays the plate full-screen, so the section is the surface;
        // dragMinimum keeps taps on links and buttons as clicks.
        Observer.create({
          target: root,
          type: 'touch,pointer',
          lockAxis: true,
          dragMinimum: HERO.dragMin,
          onRelease: (self) => {
            const dx = self.x - self.startX
            if (Math.abs(dx) >= HERO.swipe && Math.abs(dx) > Math.abs(self.y - self.startY)) run(dx < 0 ? 1 : -1)
          },
        })

        return () => {
          live = false
          transitionRef.current = null
          tl = null
          queued = null
          decoding = false
          copies.forEach((c) => c.classList.remove('is-leaving'))
          medias.forEach((m) => m.classList.remove('is-leaving'))
          clearZones()
          applyTone?.(activeRef.current) // a revert mid-wipe must not leave the chrome on the old tone
        }
      })

      return () => {
        root.classList.remove('is-cut')
        field?.style.removeProperty('--hero-cut')
      }
    },
    { scope: rootRef },
  )
}
