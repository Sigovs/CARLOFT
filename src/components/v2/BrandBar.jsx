/**
 * BrandBar — V2.2 (index_v2_2.html), client ticket 2026-11-09: "the scrolling
 * brand bar like Clutch". The makes in the client's own order, set as type (no
 * trademark logos), running slowly left under the hero. The list is rendered
 * twice for a seamless loop; the copy is hidden from assistive tech. Pauses on
 * hover; under reduced motion it stands still and wraps (v2_2.css).
 */
const MAKES = ['Mercedes-Benz', 'Porsche', 'Toyota', 'Land Rover', 'Chevrolet', 'Ford', 'Mazda', 'Audi', 'Honda', 'BMW', 'Cadillac']

export default function BrandBar() {
  return (
    <section className="brandbar" aria-label="Makes">
      <div className="brandbar__track">
        <ul className="brandbar__list">
          {MAKES.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <ul className="brandbar__list brandbar__list--copy" aria-hidden="true">
          {MAKES.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
