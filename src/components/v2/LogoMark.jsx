/**
 * LogoMark — V2.2 logo (index_v2_2.html). Two layers in one box:
 *  - the glow: a pre-rendered Miami Blue neon AROUND the outer contour only
 *    (src/data/v2/logo.js), reaching past the box by its pad;
 *  - the ink: the client's vector master as a CSS luminance mask over plain
 *    white — its black detail lines and transparent ground stay open; or, for a
 *    master with its own colours (logo.image), the SVG drawn as it is.
 * Decorative: the link or heading around it carries the name.
 */
export default function LogoMark({ logo, className = '' }) {
  const g = logo.glow
  return (
    <span className={`logo-mark ${className}`} aria-hidden="true" style={{ '--logo-ratio': `${logo.width} / ${logo.height}` }}>
      {g ? (
        <span
          className="logo-mark__glow"
          style={{ backgroundImage: `url("${g.src}")`, inset: `-${g.padY}% -${g.padX}%` }}
        />
      ) : null}
      {logo.image ? (
        <img className="logo-mark__ink logo-mark__ink--image" src={logo.src} width={logo.width} height={logo.height} alt="" decoding="async" />
      ) : (
        <span className="logo-mark__ink" style={{ '--logo': `url("${logo.src}")` }} />
      )}
    </span>
  )
}
