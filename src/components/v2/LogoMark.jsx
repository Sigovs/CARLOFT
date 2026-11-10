/**
 * LogoMark — V2.2 logo (index_v2_2.html). The client's vector master is used as
 * a CSS luminance mask: its white shapes show our fill (plain white; the neon
 * glow around it is on the parent, v2_2.css), its black detail lines and its transparent ground
 * stay open. Decorative: the link or heading around it carries the name.
 */
export default function LogoMark({ logo, className = '' }) {
  return (
    <span
      className={`logo-mark ${className}`}
      aria-hidden="true"
      style={{ '--logo': `url("${logo.src}")`, '--logo-ratio': `${logo.width} / ${logo.height}` }}
    />
  )
}
