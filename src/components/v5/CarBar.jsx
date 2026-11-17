import { useEffect, useState } from 'react'
import Icon from '../Icon.jsx'
import { brand } from '../../data/brand.js'
import { fmtPrice } from '../../data/v5/stock.js'
import { TitleText } from './StockPage.jsx'

/**
 * The car bar (Alex, 2026-11-17: "Ask about this car — somewhere else too").
 * Once the summary's asks have scrolled up out of view, a bar rises from the
 * bottom with the car, its price and the two asks; it steps aside for the footer
 * (never covers it) and while the enquiry panel is open. Reduced motion: no slide.
 */
export default function CarBar({ v, asksRef, onAsk, hidden }) {
  const [past, setPast] = useState(false) // the asks are above the screen
  const [atEnd, setAtEnd] = useState(false) // the footer is on screen

  useEffect(() => {
    const asks = asksRef.current
    const footer = document.querySelector('.footer')
    if (!asks) return
    // the asks count as gone once they slide under the fixed header
    const head = Math.round(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === asks) setPast(!e.isIntersecting && e.boundingClientRect.top < head)
          else setAtEnd(e.isIntersecting)
        })
      },
      { rootMargin: `-${head}px 0px 0px 0px` },
    )
    io.observe(asks)
    if (footer) io.observe(footer)
    return () => io.disconnect()
  }, [asksRef])

  const show = past && !atEnd && !hidden

  return (
    <div className={`car-bar${show ? ' is-shown' : ''}`} inert={!show} aria-hidden={!show}>
      <div className="container car-bar__inner">
        <img className="car-bar__img" src={v.photos[0].src} width="960" height="640" alt="" decoding="async" />
        <div className="car-bar__car">
          <p className="car-bar__title">
            {v.year} <TitleText v={v} />
          </p>
          <p className="small car-bar__price tabular">
            <span className="car-bar__label">Sample price</span> {fmtPrice(v.price)}
          </p>
        </div>
        <a className="btn btn--secondary car-bar__call" href={brand.contact.phone.href} aria-label={`Call ${brand.contact.phone.value}`}>
          <Icon name="phone" className="icon--static" />
          <span className="car-bar__call-text">Call</span>
        </a>
        <a className="btn car-bar__ask" href={`#contact?topic=car&id=${encodeURIComponent(v.id)}`} aria-haspopup="dialog" onClick={onAsk}>
          Ask about this car
        </a>
      </div>
    </div>
  )
}
