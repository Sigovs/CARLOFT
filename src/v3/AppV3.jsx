import { useEffect, useMemo, useState } from 'react'
import { brand, navLinks, footerColumns } from '../data/brand.js'
import { vehiclesV2 } from '../data/v2/inventory.js'
import { formatPrice, formatMiles } from '../data/inventory.js'
import { reviews } from '../data/reviews.js'
import { logoLight } from '../data/v2/logo.js'
import { asset } from '../data/asset.js'
import { initScroll, scrollToEl } from '../motion/scroll.js'

/**
 * AppV3 — CAR LOFT homepage, V3 (Kirsten, 2026-10-29: the client wants the
 * Clutch approach; Alex: "not one-to-one").
 *
 * What is taken from the reference is its LOGIC, not its look: a dark site
 * where lit cars carry the colour, inventory straight after the hero, two clear
 * paths (sell / buy), proof, one closing ask. The expression is CAR LOFT's own:
 *
 *   header      clean over the hero (no bar), the logo large; a dark bar from the first scroll
 *   hero        lit showroom; a serif italic accent in the headline; a search bar IN the hero
 *   01 inventory  three-up grid filtered by the hero search and by make chips
 *   02 sell / consign  two paths side by side, one photograph each
 *   03 classics full-bleed band, copy over the dark wall
 *   04 service & finance  numbered rows beside the workshop photograph
 *   05 about    full-bleed photograph with a dark panel
 *   06 reviews  one editorial quote at a time
 *   closing     the showroom row, one ask
 *   footer · sticky mobile action bar
 *
 * No figures, ratings or claims are invented; prices are sample prices.
 */

const img = (file, w) => asset(`assets/${file}${w ? `-${w}` : ''}.webp`)

const Icon = ({ d, size = 20 }) => (
  <svg className="v3-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
const I = {
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  down: <path d="m6 9 6 6 6-6" />,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
}

/** Section label: an index number and a name — CAR LOFT's own wayfinding. */
const Label = ({ n, children }) => (
  <p className="v3-label">
    <span className="v3-label__n">{n}</span>
    <span className="v3-label__t">{children}</span>
  </p>
)

const Btn = ({ href, children, kind = 'primary', icon = true, size, ...rest }) => (
  <a className={`v3-btn v3-btn--${kind}${size ? ` v3-btn--${size}` : ''}`} href={href} {...rest}>
    {children}
    {icon ? <Icon d={I.arrow} size={18} /> : null}
  </a>
)

/* ---------------------------------------------------------------- header */
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`v3-header${scrolled || open ? ' is-scrolled' : ''}`}>
      <div className="v3-header__bar">
        <a className="v3-header__logo" href="#top" aria-label={`${brand.wordmark} — back to top`}>
          <img src={logoLight.src} width={logoLight.width} height={logoLight.height} alt="" />
        </a>
        <nav className="v3-header__nav" aria-label="Primary">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="v3-header__end">
          <a className="v3-header__phone" href={brand.contact.phone.href}>
            <Icon d={I.phone} size={16} />
            {brand.contact.phone.value}
          </a>
          <button type="button" className="v3-header__menu" aria-expanded={open} aria-controls="v3-menu" onClick={() => setOpen((o) => !o)}>
            <span className="visually-hidden">{open ? 'Close menu' : 'Menu'}</span>
            <Icon d={open ? I.close : I.menu} size={22} />
          </button>
        </div>
      </div>
      <nav id="v3-menu" className={`v3-sheet${open ? ' is-open' : ''}`} aria-label="Primary (mobile)" hidden={!open} data-lenis-prevent>
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
            <Icon d={I.arrow} size={18} />
          </a>
        ))}
        <a href={brand.contact.phone.href}>
          Call {brand.contact.phone.value}
          <Icon d={I.phone} size={18} />
        </a>
      </nav>
    </header>
  )
}

/* ---------------------------------------------------------------- hero (with search) */
const MAKES = [...new Set(vehiclesV2.map((v) => v.make))].sort()
const BODIES = [...new Set(vehiclesV2.map((v) => v.body))].sort()
const PRICES = [25000, 75000, 150000]

function Select({ label, value, onChange, children }) {
  return (
    <label className="v3-field">
      <span className="v3-field__label">{label}</span>
      <span className="v3-field__control">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {children}
        </select>
        <Icon d={I.down} size={16} />
      </span>
    </label>
  )
}

function Hero({ filters, setFilters }) {
  const set = (k) => (v) => setFilters((f) => ({ ...f, [k]: v }))
  const submit = (e) => {
    e.preventDefault()
    const el = document.getElementById('inventory')
    if (el) scrollToEl(el)
  }
  return (
    <section id="top" className="v3-hero" aria-labelledby="v3-hero-title">
      <img
        className="v3-hero__img"
        src={img('v3-hero-showroom', 1600)}
        srcSet={`${img('v3-hero-showroom', 960)} 960w, ${img('v3-hero-showroom', 1600)} 1600w, ${img('v3-hero-showroom', 2752)} 2752w`}
        sizes="100vw"
        width="2752"
        height="1548"
        alt="A dark showroom with a white Porsche 911, a black Mercedes G-Class, an orange classic Camaro and a silver Lexus (generated placeholder image)."
        fetchPriority="high"
      />
      <div className="v3-hero__shade" aria-hidden="true" />
      <div className="v3-wrap v3-hero__copy">
        <h1 id="v3-hero-title" className="v3-display">
          Good cars.
          <br />
          <em>Real people.</em>
        </h1>
        <p className="v3-lead v3-hero__lead">
          An independent dealer in Newbury Park — used cars across every price range, classic American muscle and our
          own repair shop.
        </p>
      </div>
      <div className="v3-wrap v3-hero__dock">
        <form className="v3-search" onSubmit={submit} aria-label="Find a car">
          <Select label="Make" value={filters.make} onChange={set('make')}>
            <option value="">Any make</option>
            {MAKES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
          <Select label="Body" value={filters.body} onChange={set('body')}>
            <option value="">Any body</option>
            {BODIES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
          <Select label="Price" value={filters.price} onChange={set('price')}>
            <option value="">Any price</option>
            {PRICES.map((p) => (
              <option key={p} value={p}>
                Up to {formatPrice(p)}
              </option>
            ))}
          </Select>
          <button type="submit" className="v3-btn v3-btn--primary v3-search__go">
            <Icon d={I.search} size={18} />
            Find a car
          </button>
        </form>
        <p className="v3-hero__alt">
          Selling instead?{' '}
          <a href="#sell">
            Get an offer <Icon d={I.arrow} size={14} />
          </a>
        </p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- 01 inventory */
function Inventory({ filters, setFilters }) {
  const list = useMemo(
    () =>
      vehiclesV2.filter(
        (v) =>
          (!filters.make || v.make === filters.make) &&
          (!filters.body || v.body === filters.body) &&
          (!filters.price || v.price <= Number(filters.price)),
      ),
    [filters],
  )
  const shown = list.slice(0, 6)
  const anyFilter = filters.make || filters.body || filters.price
  return (
    <section id="inventory" className="v3-sec" aria-labelledby="v3-inv-title">
      <div className="v3-wrap">
        <div className="v3-head">
          <Label n="01">Inventory</Label>
          <h2 id="v3-inv-title" className="v3-h2">
            Handpicked, <em>across price ranges.</em>
          </h2>
        </div>
        <div className="v3-chips" role="group" aria-label="Filter by make">
          <button type="button" aria-pressed={!filters.make} onClick={() => setFilters((f) => ({ ...f, make: '' }))}>
            All
          </button>
          {MAKES.map((m) => (
            <button key={m} type="button" aria-pressed={filters.make === m} onClick={() => setFilters((f) => ({ ...f, make: f.make === m ? '' : m }))}>
              {m}
            </button>
          ))}
        </div>
        <p className="v3-count" aria-live="polite">
          {shown.length < list.length ? `${shown.length} of ${list.length} cars` : `${list.length} ${list.length === 1 ? 'car' : 'cars'}`}
          {anyFilter ? (
            <button type="button" onClick={() => setFilters({ make: '', body: '', price: '' })}>
              Clear filters
            </button>
          ) : null}
        </p>
        {shown.length ? (
          <ul className="v3-grid">
            {shown.map((v) => (
              <li key={v.id}>
                <a className="v3-card" href={`#contact?topic=car&id=${v.id}`}>
                  <span className="v3-card__media">
                    <img src={v.image} width={v.width} height={v.height} alt={`${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`} loading="lazy" decoding="async" />
                    <span className="v3-card__tag">{v.body}</span>
                  </span>
                  <span className="v3-card__body">
                    <span className="v3-card__title">
                      {v.make} {v.model}
                      {v.trim ? ` ${v.trim}` : ''}
                    </span>
                    <span className="v3-card__meta">
                      {v.year} · {formatMiles(v.mileage)} · {v.transmission}
                    </span>
                    <span className="v3-card__foot">
                      <span className="v3-card__price">
                        <small>Sample price</small>
                        {formatPrice(v.price)}
                      </span>
                      <span className="v3-card__go" aria-hidden="true">
                        <Icon d={I.arrow} size={18} />
                      </span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="v3-empty">No cars match those filters right now — clear a filter, or tell us what you are looking for.</p>
        )}
        <div className="v3-more">
          <Btn href={brand.inventoryUrl} kind="ghost">
            View all inventory
          </Btn>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- 02 sell / consign */
function SellConsign() {
  const paths = [
    {
      key: 'sell',
      title: 'Sell it to us',
      text: 'Tell us about your car and we come back with an offer. A straight answer, before anything else.',
      cta: { label: 'Get an offer', href: '#contact?topic=sell' },
      photo: { file: 'sell-gen-key-cayenne', alt: 'A hand holding out a car key in front of a white Porsche Cayenne (generated placeholder image).', pos: '55% 60%' },
    },
    {
      key: 'consign',
      title: 'Let us consign it',
      text: 'For special and collector cars: we photograph, present and market the car for you, and handle the sale.',
      cta: { label: 'About consignment', href: '#contact?topic=consign' },
      photo: { file: 'sell-gen-consign-shoot', alt: 'A red Mercedes-AMG GT on a turntable being photographed in a dark studio (generated placeholder image).', pos: '62% 60%' },
    },
  ]
  return (
    <section id="sell" className="v3-sec v3-sec--alt" aria-labelledby="v3-sell-title">
      <div className="v3-wrap">
        <div className="v3-head v3-head--split">
          <div>
            <Label n="02">Sell or consign</Label>
            <h2 id="v3-sell-title" className="v3-h2">
              Make room <em>for what’s next.</em>
            </h2>
          </div>
          <p className="v3-lead">Two ways to move on from your car. Either way, it starts with a straightforward conversation.</p>
        </div>
        <ul className="v3-paths">
          {paths.map((p) => (
            <li key={p.key} className="v3-path">
              <span className="v3-path__media">
                <img src={img(p.photo.file, 1000)} srcSet={`${img(p.photo.file, 1000)} 1000w, ${img(p.photo.file)} 2048w`} sizes="(min-width: 900px) 46vw, 100vw" width="2048" height="2048" alt={p.photo.alt} loading="lazy" decoding="async" style={{ objectPosition: p.photo.pos }} />
              </span>
              <span className="v3-path__body">
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Btn href={p.cta.href} kind="primary" size="sm">
                  {p.cta.label}
                </Btn>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- 03 classics */
function Classics() {
  return (
    <section id="classics" className="v3-band-photo" aria-labelledby="v3-cl-title">
      <img className="v3-band-photo__img" src={img('classics-gen-camaro', 1600)} srcSet={`${img('classics-gen-camaro', 960)} 960w, ${img('classics-gen-camaro', 1600)} 1600w, ${img('classics-gen-camaro')} 2752w`} sizes="100vw" width="2752" height="1290" alt="An orange 1969 Chevrolet Camaro SS in a minimal concrete garage (generated placeholder image)." loading="lazy" decoding="async" />
      <div className="v3-band-photo__shade" aria-hidden="true" />
      <div className="v3-wrap v3-band-photo__inner">
        <div>
          <Label n="03">Classic cars</Label>
          <h2 id="v3-cl-title" className="v3-h2">
            American muscle.
            <br />
            <em>Timeless character.</em>
          </h2>
        </div>
        <div>
          <p className="v3-lead">We buy, sell, consign and restore classic American muscle — from honest drivers to full restorations.</p>
          <div className="v3-actions">
            <Btn href="#contact?topic=classics">Ask about classics</Btn>
            <Btn href="#service" kind="ghost" icon={false}>
              Restoration services
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- 04 service & finance */
const SERVICES = [
  { n: '01', t: 'Repairs', d: 'Diagnostics, maintenance and mechanical repair.' },
  { n: '02', t: 'Paint & body', d: 'Collision repair, paintwork and refinishing.' },
  { n: '03', t: 'Restoration', d: 'Partial and complete restorations.' },
  { n: '04', t: 'Financing', d: 'Ask us about financing options when you find the right car.', id: 'finance' },
]
function Service() {
  return (
    <section id="service" className="v3-sec" aria-labelledby="v3-svc-title">
      <div className="v3-wrap v3-service">
        <figure className="v3-service__media">
          <img src={img('service-gen-lift-dark', 1000)} srcSet={`${img('service-gen-lift-dark', 1000)} 1000w, ${img('service-gen-lift-dark')} 2048w`} sizes="(min-width: 900px) 46vw, 100vw" width="2048" height="2048" alt="A silver Mercedes-Benz sedan on a lift in a dark, minimal workshop (generated placeholder image)." loading="lazy" decoding="async" />
        </figure>
        <div className="v3-service__copy">
          <Label n="04">Service &amp; finance</Label>
          <h2 id="v3-svc-title" className="v3-h2">
            Keep it running. <em>Bring it back.</em>
          </h2>
          <ol className="v3-rows">
            {SERVICES.map((s) => (
              <li key={s.n} id={s.id}>
                <span className="v3-rows__n">{s.n}</span>
                <span>
                  <strong>{s.t}</strong>
                  <span>{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="v3-actions">
            <Btn href="#contact?topic=service">Contact our repair shop</Btn>
            <Btn href="#contact?topic=finance" kind="ghost" icon={false}>
              Ask about financing
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- 05 about */
function About() {
  return (
    <section id="about" className="v3-sec v3-sec--alt" aria-labelledby="v3-about-title">
      <div className="v3-wrap v3-service v3-service--flip">
        <figure className="v3-service__media">
          <img src={img('sell-gen-supra', 1000)} srcSet={`${img('sell-gen-supra', 1000)} 1000w, ${img('sell-gen-supra')} 2048w`} sizes="(min-width: 900px) 46vw, 100vw" width="2048" height="2048" alt="A yellow Toyota Supra under a softbox in a dark studio (generated placeholder image)." loading="lazy" decoding="async" />
        </figure>
        <div className="v3-service__copy">
          <Label n="05">About</Label>
          <h2 id="v3-about-title" className="v3-h2">
            A personal approach <em>to buying cars.</em>
          </h2>
          <p className="v3-lead v3-about__lead">
            We’re an independent dealership for people who like good cars — from modern performance to classic
            American muscle. Sales, consignment and restoration, handled by people you can talk to.
          </p>
          <ul className="v3-pills">
            <li>Independent dealer</li>
            <li>Newbury Park, CA</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- 06 reviews */
const pad = (n) => String(n).padStart(2, '0')
function Reviews() {
  const [i, setI] = useState(0)
  const go = (d) => setI((x) => (x + d + reviews.length) % reviews.length)
  return (
    <section id="reviews" className="v3-sec" aria-labelledby="v3-rev-title">
      <div className="v3-wrap">
        <div className="v3-head v3-head--split">
          <div>
            <Label n="06">Reviews</Label>
            <h2 id="v3-rev-title" className="v3-h2">
              What our <em>customers say.</em>
            </h2>
          </div>
          <a className="v3-link" href={brand.reviewsUrl} target="_blank" rel="noopener">
            See all reviews <Icon d={I.arrow} size={16} />
            <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
        <div className="v3-quote" role="region" aria-roledescription="carousel" aria-label="Customer reviews (samples)">
          <div className="v3-quote__stack">
            {reviews.map((r, k) => (
              <figure key={r.id} className={`v3-quote__item${k === i ? ' is-active' : ''}`} aria-hidden={k !== i} inert={k !== i}>
                <blockquote>
                  <p>{r.text}</p>
                </blockquote>
                <figcaption>
                  <strong>{r.name}</strong> · {r.role}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="v3-quote__nav">
            <span className="v3-quote__count" aria-hidden="true">
              {pad(i + 1)} / {pad(reviews.length)}
            </span>
            <button type="button" className="v3-round" aria-label="Previous review" onClick={() => go(-1)}>
              <Icon d={I.left} />
            </button>
            <button type="button" className="v3-round" aria-label="Next review" onClick={() => go(1)}>
              <Icon d={I.right} />
            </button>
          </div>
        </div>
        <p className="v3-note">Sample reviews for the mockup.</p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- closing + footer */
function Closing() {
  return (
    <section className="v3-closing" aria-labelledby="v3-cta-title">
      <img className="v3-closing__img" src={img('footer-gen-showroom', 3168)} srcSet={`${img('footer-gen-showroom', 1200)} 1200w, ${img('footer-gen-showroom', 3168)} 3168w`} sizes="100vw" width="3168" height="1050" alt="" loading="lazy" decoding="async" />
      <div className="v3-wrap v3-closing__inner">
        <h2 id="v3-cta-title" className="v3-h2">
          Your next car <em>is a conversation away.</em>
        </h2>
        <div className="v3-actions v3-actions--center">
          <Btn href="#contact?topic=sell">Get an offer</Btn>
          <Btn href={brand.contact.phone.href} kind="ghost" icon={false}>
            Call {brand.contact.phone.value}
          </Btn>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const c = brand.contact
  return (
    <footer id="contact" className="v3-footer" aria-labelledby="v3-footer-title">
      <div className="v3-wrap v3-footer__grid">
        <div className="v3-footer__brand">
          <h2 id="v3-footer-title">
            <img src={logoLight.src} width={logoLight.width} height={logoLight.height} alt={brand.wordmark} loading="lazy" />
          </h2>
          <p>{brand.descriptor}</p>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            {col.links.map((l) => (
              <a key={l.href + l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        ))}
        <div className="v3-footer__visit">
          <h3>Visit</h3>
          <a href={c.address.href} target="_blank" rel="noopener">
            {c.address.value}
          </a>
          <a href={c.phone.href}>{c.phone.value}</a>
          <a href={c.email.href}>{c.email.value}</a>
        </div>
      </div>
      <div className="v3-wrap v3-footer__base">
        <span>
          © {new Date().getFullYear()} {brand.wordmark}.
        </span>
        <span>
          Powered by <strong>{brand.poweredBy}</strong>
        </span>
      </div>
    </footer>
  )
}

function StickyBar() {
  return (
    <div className="v3-sticky" role="region" aria-label="Quick actions">
      <a className="v3-btn v3-btn--primary" href="#sell">
        Get an offer
      </a>
      <a className="v3-btn v3-btn--ghost" href={brand.contact.phone.href} aria-label={`Call ${brand.contact.phone.value}`}>
        <Icon d={I.phone} size={18} />
        Call
      </a>
    </div>
  )
}

export default function AppV3() {
  const [filters, setFilters] = useState({ make: '', body: '', price: '' })
  useEffect(() => initScroll(), [])
  // In-page anchors go through the Lenis-aware scroller (anchors are off in Lenis).
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1).split('?')[0]
      const el = id ? document.getElementById(id) : null
      if (!el) return
      e.preventDefault()
      scrollToEl(el)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="v3">
      <a className="v3-skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero filters={filters} setFilters={setFilters} />
        <Inventory filters={filters} setFilters={setFilters} />
        <SellConsign />
        <Classics />
        <Service />
        <About />
        <Reviews />
        <Closing />
      </main>
      <Footer />
      <StickyBar />
    </div>
  )
}
