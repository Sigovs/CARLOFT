/**
 * The one GSAP entry point (MOTION.md §6.1). Plugins are registered once here;
 * every motion file imports from this module, never from 'gsap' directly.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Observer } from 'gsap/Observer'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Observer, useGSAP)

// Lenis drives the scroll (src/motion/scroll.js, on gsap.ticker). Ignore the
// mobile URL-bar resize so pins and scrubs do not jump when the toolbar collapses.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, Observer, useGSAP }

// Dev-only handle for verification scripts (trigger counts, progress reads).
if (import.meta.env.DEV && typeof window !== 'undefined') window.__gsap = { gsap, ScrollTrigger }
