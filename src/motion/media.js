/** gsap.matchMedia conditions (MOTION.md §6.1). Tablets share the mobile branch. */
export const MQ = {
  isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  isMobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
}
