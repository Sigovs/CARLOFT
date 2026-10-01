import { brand, footerColumns, topicLabels } from '../data/brand.js'
import { vehicleTitle, vehicles } from '../data/inventory.js'
import { photos, photoProps } from '../data/photos.js'

/**
 * Footer (#contact) — BRIEF §14.12. The destination of every
 * `#contact?topic=…` action: it states what was asked about above the Visit
 * column. All contact details are visibly tagged PLACEHOLDER until provided.
 * Static by design — MOTION.md: the page stops here.
 * Dark, set apart from the page (client, 2026-09-30: "separate the footer, make it
 * darker, put a beautiful image in the background"): a night-street photograph
 * under a graphite scrim that deepens towards the links (legibility, not decoration).
 */
export default function Footer({ route }) {
  const topicKey = route?.target === 'contact' ? route.params.get('topic') : null
  let topic = topicKey ? topicLabels[topicKey] : null
  if (topicKey === 'car') {
    const v = vehicles.find((x) => x.id === route.params.get('id'))
    if (v) topic = `${vehicleTitle(v)} (illustrative listing)`
  }
  const year = new Date().getFullYear()
  const c = brand.contact

  return (
    <footer id="contact" className="footer" aria-labelledby="footer-title">
      <div className="footer__bg" aria-hidden="true">
        <img {...photoProps(photos.footer)} loading="lazy" decoding="async" />
      </div>
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <h2 id="footer-title" className="footer__wordmark">
              {brand.wordmark}
            </h2>
            <p className="small footer__descriptor">{brand.descriptor}</p>
          </div>

          {footerColumns.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3 className="eyebrow footer__heading">{col.title}</h3>
              <ul className="footer__links">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a className="footer__link" href={l.href}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col footer__visit">
            <h3 className="eyebrow footer__heading">Visit</h3>
            {topic && (
              <p className="footer__topic small" role="status">
                You asked about: <strong>{topic}</strong>. Contact details below are placeholders until the dealership
                publishes them.
              </p>
            )}
            <dl className="footer__contact">
              {[c.address, c.phone, c.email].filter(Boolean).map((item) => (
                <div className="footer__contact-row" key={item.label}>
                  <dt className="visually-hidden">{item.label}</dt>
                  <dd className="small">
                    {item.href ? (
                      <a
                        className="footer__link"
                        href={item.href}
                        {...(item.href.startsWith('http') && { target: '_blank', rel: 'noopener' })}
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {[c.address, c.phone, c.email].filter(Boolean).some((i) => i.placeholder) && (
              <p className="footer__placeholder">
                <span className="tag">Placeholder details</span>
              </p>
            )}
          </div>
        </div>

        <div className="footer__base">
          <p className="footer__legal small">
            © {year} {brand.wordmark}. {brand.legal}
          </p>
          <p className="footer__powered small">
            Powered by <span>{brand.poweredBy}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
