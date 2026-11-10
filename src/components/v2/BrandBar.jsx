/**
 * BrandBar — V2.2 (index_v2_2.html), client ticket 2026-11-09: "the scrolling
 * brand bar like Clutch"; Alex: "in a brutalist style" (refs: futuristic
 * brutalist graphic packs, Bauhaus shapes). The makes in the client's own order,
 * set as type (no trademark logos), each a small brutalist "badge": an index
 * number, a geometric glyph, the name — plain, outlined or inverted in a
 * repeating rhythm. Monochrome. The list is rendered twice for a seamless loop;
 * the copy is hidden from assistive tech. Pauses on hover; under reduced motion
 * it stands still and wraps (v2_2.css).
 */
const MAKES = ['Mercedes-Benz', 'Porsche', 'Toyota', 'Land Rover', 'Chevrolet', 'Ford', 'Mazda', 'Audi', 'Honda', 'BMW', 'Cadillac']

/* Geometric glyphs (Bauhaus / brutalist vocabulary), 24×24, currentColor. */
const GLYPHS = [
  // four-point star
  <path key="star" d="M12 1.5 14.2 9.8 22.5 12 14.2 14.2 12 22.5 9.8 14.2 1.5 12 9.8 9.8Z" fill="currentColor" />,
  // ring with a dot
  <g key="ring">
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3.2" fill="currentColor" />
  </g>,
  // double chevron
  <path key="chev" d="M2 4h5l6 8-6 8H2l6-8Zm9 0h5l6 8-6 8h-5l6-8Z" fill="currentColor" />,
  // half disc over a bar
  <g key="half">
    <path d="M3 13a9 9 0 0 1 18 0Z" fill="currentColor" />
    <rect x="3" y="16" width="18" height="3" fill="currentColor" />
  </g>,
]

const STYLES = ['plain', 'outline', 'solid']
const pad = (n) => String(n).padStart(2, '0')

function List({ copy = false }) {
  return (
    <ul className={`brandbar__list${copy ? ' brandbar__list--copy' : ''}`} aria-hidden={copy || undefined}>
      {MAKES.map((m, i) => (
        <li key={m} className={`brandbar__item brandbar__item--${STYLES[i % STYLES.length]}`}>
          <span className="brandbar__n" aria-hidden="true">
            {pad(i + 1)}
          </span>
          <svg className="brandbar__glyph" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            {GLYPHS[i % GLYPHS.length]}
          </svg>
          <span className="brandbar__name">{m}</span>
        </li>
      ))}
    </ul>
  )
}

export default function BrandBar() {
  return (
    <section className="brandbar" aria-label="Makes">
      <div className="brandbar__track">
        <List />
        <List copy />
      </div>
    </section>
  )
}
