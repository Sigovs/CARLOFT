import { useEffect, useRef, useState } from 'react'
import { brand, navLinks, footerColumns } from '../data/brand.js'
import { vehiclesV2 } from '../data/v2/inventory.js'
import { formatPrice, formatMiles } from '../data/inventory.js'
import { reviews } from '../data/reviews.js'
import { logoLight } from '../data/v2/logo.js'
import { asset } from '../data/asset.js'
import { initScroll, scrollToEl } from '../motion/scroll.js'

/**
 * AppV3 — CAR LOFT homepage on the Clutch layout (clutchmotorsco.com, client
 * reference): dark site, two alternating near-blacks, wide heavy display type,
 * 10px buttons, 12px cards with a hairline border.
 *
 *   header (dark, logo · nav · phone · primary CTA)
 *   hero (full-bleed lit showroom, eyebrow, headline, lead, 2 CTAs, 3 points)
 *   brand marquee
 *   In stock now — card row + arrows + View all
 *   split: Sell & consign (photo left)   · alt ground
 *   split: Classics (photo right)
 *   split: Service & financing (photo left) · alt ground
 *   Why CAR LOFT — 4 feature cards
 *   Reviews — 3 cards
 *   closing CTA band
 *   footer · sticky mobile action bar
 *
 * Only the LAYOUT follows the reference. Copy, photography, colour and brand
 * are CAR LOFT's own; no figures or claims are invented (the reference's
 * numbers and ratings are not carried over). Prices are sample prices.
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
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  car: <><path d="M5 17h14" /><path d="M3 17v-4l2.2-4.4A2 2 0 0 1 7 7.5h10a2 2 0 0 1 1.8 1.1L21 13v4" /><circle cx="7.5" cy="17" r="1.8" /><circle cx="16.5" cy="17" r="1.8" /><path d="M3 13h18" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m10.8 12.2 8.7-8.7" /><path d="m17 6 2.5 2.5" /><path d="m14.5 8.5 2 2" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.5 17.2a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.1-5.4l-2.4 2.4-2.3-.4-.4-2.3 2.4-2.4z" />,
  doc: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h4" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
}

const Eyebrow = ({ children }) => (
  <p className="v3-eyebrow">
    <span className="v3-eyebrow__rule" aria-hidden="true" />
    {children}
  </p>
)

const Btn = ({ href, children, kind = 'primary', icon = true, ...rest }) => (
  <a className={`v3-btn v3-btn--${kind}`} href={href} {...rest}>
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
    <header className={`v3-header${scrolled ? ' is-scrolled' : ''}`}>
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
            {brand.contact.phone.value}
          </a>
          <Btn href="#sell" icon={false} className="v3-btn v3-btn--primary v3-btn--sm">
            Get an offer
          </Btn>
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

/* ---------------------------------------------------------------- hero */
function Hero() {
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
      <div className="v3-wrap v3-hero__inner">
        <Eyebrow>Newbury Park, California</Eyebrow>
        <h1 id="v3-hero-title" className="v3-display">
          Good cars.
          <br />
          Real people.
        </h1>
        <p className="v3-lead v3-hero__lead">
          Used cars across every price range, classic American muscle and our own repair shop. Buying, selling or
          consigning, it starts with a straightforward conversation.
        </p>
        <div className="v3-actions">
          <Btn href="#sell">Sell your car</Btn>
          <Btn href="#inventory" kind="ghost" icon={false}>
            Shop inventory
          </Btn>
        </div>
        <ul className="v3-points" aria-label="What we do">
          <li>Buy · sell · consign</li>
          <li>In-house service &amp; restoration</li>
          <li>Classic American muscle</li>
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- brands */
const MAKES = ['Porsche', 'Mercedes-Benz', 'Lexus', 'Toyota', 'Honda', 'Chevrolet', 'Ford', 'Land Rover', 'Mazda']
function Brands() {
  const row = MAKES.map((m) => <li key={m}>{m}</li>)
  return (
    <section className="v3-brands" aria-label="Makes we sell">
      <div className="v3-brands__track">
        <ul>{row}</ul>
        <ul aria-hidden="true">{row}</ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- inventory */
function Inventory() {
  const rail = useRef(null)
  const step = (dir) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector('.v3-card')
    el.scrollBy({ left: dir * ((card?.offsetWidth || 300) + 20), behavior: 'smooth' })
  }
  return (
    <section id="inventory" className="v3-sec" aria-labelledby="v3-inv-title">
      <div className="v3-wrap">
        <div className="v3-sec__head v3-sec__head--row">
          <div>
            <Eyebrow>In stock now</Eyebrow>
            <h2 id="v3-inv-title" className="v3-h2">
              Handpicked inventory
            </h2>
          </div>
          <div className="v3-sec__tools">
            <Btn href={brand.inventoryUrl} kind="ghost" icon={false} className="v3-btn v3-btn--ghost v3-btn--sm">
              View all inventory
            </Btn>
            <button type="button" className="v3-round" aria-label="Previous cars" onClick={() => step(-1)}>
              <Icon d={I.left} />
            </button>
            <button type="button" className="v3-round" aria-label="Next cars" onClick={() => step(1)}>
              <Icon d={I.right} />
            </button>
          </div>
        </div>
      </div>
      <div className="v3-rail" ref={rail} tabIndex={0} aria-label="Cars in stock (sample listings)" data-lenis-prevent-horizontal>
        {vehiclesV2.map((v) => (
          <a key={v.id} className="v3-card" href={`#contact?topic=car&id=${v.id}`}>
            <span className="v3-card__media">
              <img src={v.image} width={v.width} height={v.height} alt={`${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`} loading="lazy" decoding="async" />
            </span>
            <span className="v3-card__body">
              <span className="v3-card__kicker">
                {v.year} {v.make}
              </span>
              <span className="v3-card__title">
                {v.model}
                {v.trim ? ` ${v.trim}` : ''}
              </span>
              <span className="v3-card__foot">
                <span className="v3-card__price">
                  {formatPrice(v.price)}
                  <small>Sample price</small>
                </span>
                <span className="v3-card__miles">{formatMiles(v.mileage)}</span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- splits */
function Split({ id, alt, flip, photo, chip, eyebrow, title, text, list, tags, actions }) {
  return (
    <section id={id} className={`v3-sec${alt ? ' v3-sec--alt' : ''}`} aria-labelledby={`${id}-title`}>
      <div className={`v3-wrap v3-split${flip ? ' v3-split--flip' : ''}`}>
        <figure className="v3-split__media">
          <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1024px) 560px, 100vw" width={photo.w} height={photo.h} alt={photo.alt} loading="lazy" decoding="async" style={photo.pos ? { objectPosition: photo.pos } : undefined} />
          {chip ? <figcaption className="v3-chip">{chip}</figcaption> : null}
        </figure>
        <div className="v3-split__copy">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={`${id}-title`} className="v3-h2">
            {title}
          </h2>
          <p className="v3-lead">{text}</p>
          {list ? (
            <ul className="v3-checks">
              {list.map((x) => (
                <li key={x.t}>
                  <span className="v3-checks__ico" aria-hidden="true">
                    <Icon d={I.check} size={14} />
                  </span>
                  <span>
                    <strong>{x.t}</strong>
                    {x.d ? <span> — {x.d}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {tags ? (
            <ul className="v3-tags" aria-label="What we do">
              {tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
          <div className="v3-actions">
            {actions.map((a, i) => (
              <Btn key={a.label} href={a.href} kind={i === 0 ? 'primary' : 'ghost'} icon={i === 0}>
                {a.label}
              </Btn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const pic = (file, w, h, alt, mid = 1000, pos) => ({
  pos,
  src: img(file, mid),
  srcSet: `${img(file, mid)} ${mid}w, ${img(file)} ${w}w`,
  w,
  h,
  alt,
})

/* ---------------------------------------------------------------- why */
const WHY = [
  { ico: I.car, t: 'Every price range', d: 'Daily drivers to performance cars and classics, each one handpicked.' },
  { ico: I.key, t: 'Sell or consign', d: 'We buy outright, or present and market your car for you.' },
  { ico: I.wrench, t: 'Our own repair shop', d: 'Repairs, paint and body work, and full restorations in-house.' },
  { ico: I.doc, t: 'Financing options', d: 'Ask us about financing when you find the right car.' },
]
function Why() {
  return (
    <section id="about" className="v3-sec v3-sec--alt" aria-labelledby="v3-why-title">
      <div className="v3-wrap">
        <div className="v3-sec__head">
          <Eyebrow>Why CAR LOFT</Eyebrow>
          <h2 id="v3-why-title" className="v3-h2">
            A personal approach
            <br />
            to buying cars
          </h2>
        </div>
        <ul className="v3-why">
          {WHY.map((w) => (
            <li key={w.t} className="v3-why__card">
              <span className="v3-why__ico">
                <Icon d={w.ico} />
              </span>
              <h3>{w.t}</h3>
              <p>{w.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- reviews */
const initials = (n) =>
  n
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
function Reviews() {
  return (
    <section id="reviews" className="v3-sec" aria-labelledby="v3-rev-title">
      <div className="v3-wrap">
        <div className="v3-sec__head v3-sec__head--row">
          <div>
            <Eyebrow>Reviews</Eyebrow>
            <h2 id="v3-rev-title" className="v3-h2">
              What our customers say
            </h2>
          </div>
          <a className="v3-link" href={brand.reviewsUrl} target="_blank" rel="noopener">
            See all reviews
            <Icon d={I.arrow} size={16} />
            <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
        <ul className="v3-reviews">
          {reviews.slice(0, 3).map((r) => (
            <li key={r.id} className="v3-review">
              <div className="v3-review__who">
                <span className="v3-review__avatar" aria-hidden="true">
                  {initials(r.name)}
                </span>
                <span>
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </span>
              </div>
              <blockquote>
                <p>{r.text}</p>
              </blockquote>
            </li>
          ))}
        </ul>
        <p className="v3-note">Sample reviews for the mockup.</p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- closing CTA */
function Closing() {
  return (
    <section className="v3-sec v3-sec--tight" aria-labelledby="v3-cta-title">
      <div className="v3-wrap">
        <div className="v3-band">
          <Eyebrow>Talk to us</Eyebrow>
          <h2 id="v3-cta-title" className="v3-h2">
            Selling or buying?
          </h2>
          <p className="v3-lead">Tell us about your car, or what you are looking for. We come back with a straight answer.</p>
          <div className="v3-actions v3-actions--center">
            <Btn href="#contact?topic=sell">Get an offer</Btn>
            <Btn href={brand.contact.phone.href} kind="ghost" icon={false}>
              Call {brand.contact.phone.value}
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- footer */
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
        <div>
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

/* ---------------------------------------------------------------- sticky bar (phones) */
function StickyBar() {
  return (
    <div className="v3-sticky" role="region" aria-label="Quick actions">
      <a className="v3-btn v3-btn--primary" href="#sell">
        Sell your car
      </a>
      <a className="v3-btn v3-btn--ghost" href={brand.contact.phone.href} aria-label={`Call ${brand.contact.phone.value}`}>
        <Icon d={I.phone} size={18} />
        Call
      </a>
    </div>
  )
}

export default function AppV3() {
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
        <Hero />
        <Brands />
        <Inventory />
        <Split
          id="sell"
          alt
          photo={pic('sell-gen-key-cayenne', 2048, 2048, 'A hand holding out a car key in front of a white Porsche Cayenne (generated placeholder image).')}
          chip="Sell"
          eyebrow="Sell or consign"
          title={
            <>
              Make room
              <br />
              for what’s next
            </>
          }
          text="Selling your car? We can buy it outright, or consign it and handle the sale for you."
          list={[
            { t: 'Sell', d: 'tell us about your car and we come back with an offer' },
            { t: 'Consign', d: 'for special and collector cars, we present and market it for you' },
            { t: 'One conversation', d: 'a straight answer before anything else' },
          ]}
          actions={[
            { label: 'Get an offer', href: '#contact?topic=sell' },
            { label: 'About consignment', href: '#contact?topic=consign' },
          ]}
        />
        <Split
          id="classics"
          flip
          photo={pic('classics-gen-camaro', 2752, 1290, 'An orange 1969 Chevrolet Camaro SS in a minimal concrete garage (generated placeholder image).', 1600, '74% 60%')}
          chip="Classics"
          eyebrow="Classic cars"
          title={
            <>
              American muscle.
              <br />
              Timeless character.
            </>
          }
          text="We buy, sell, consign and restore classic American muscle — from honest drivers to full restorations."
          tags={['Buy', 'Sell', 'Consign', 'Restore']}
          actions={[
            { label: 'Ask about classics', href: '#contact?topic=classics' },
            { label: 'Restoration services', href: '#service' },
          ]}
        />
        <span id="finance" className="v3-anchor" aria-hidden="true" />
        <Split
          id="service"
          alt
          photo={pic('service-gen-lift-dark', 2048, 2048, 'A silver Mercedes-Benz sedan on a lift in a dark, minimal workshop (generated placeholder image).')}
          chip="Service"
          eyebrow="Service & financing"
          title={
            <>
              Keep it running.
              <br />
              Bring it back.
            </>
          }
          text="Repairs, paint, body work and restoration for daily drivers, modern performance cars and classics — and financing options when you find the right car."
          list={[
            { t: 'Repairs', d: 'diagnostics, maintenance and mechanical repair' },
            { t: 'Paint & body', d: 'collision repair, paintwork and refinishing' },
            { t: 'Restoration', d: 'partial and complete restorations' },
          ]}
          actions={[
            { label: 'Contact our repair shop', href: '#contact?topic=service' },
            { label: 'Ask about financing', href: '#contact?topic=finance' },
          ]}
        />
        <Why />
        <Reviews />
        <Closing />
      </main>
      <Footer />
      <StickyBar />
    </div>
  )
}
