/**
 * brand.js — every brand-related string on the page reads from here.
 *
 * Business name: CAR LOFT (confirmed by the client, 2026-09-30; replaces the
 * temporary "DEALERSHIP" wordmark). Logo still pending — the wordmark is set in
 * type. No component hard-codes any of this.
 *
 * `placeholder: true` marks a value that must be rendered with a visible
 * "Placeholder" tag until real information is provided (content-provenance CP4).
 */

export const brand = {
  wordmark: 'CAR LOFT',
  nameNote: '',
  domain: 'carsloft.com',
  descriptor: 'Independent dealer — sales, consignment, classics, service.',

  contact: {
    // Provided by the client, 2026-09-30.
    address: {
      label: 'Address',
      value: '165 Ruby Dr., Newbury Park, CA 91320',
      href: 'https://maps.google.com/?q=165+Ruby+Dr,+Newbury+Park,+CA+91320',
      placeholder: false,
    },
    phone: { label: 'Phone', value: '(818) 464-6908', href: 'tel:+18184646908', placeholder: false },
    email: { label: 'Email', value: 'info@carloft.com', href: 'mailto:info@carloft.com', placeholder: false },
    // Hours are not published on the site (client, 2026-09-30).
  },

  /** Full inventory page — "View All Inventory" CTA. The page itself is not built
   *  yet; point this at the dealer's inventory URL when it exists. */
  inventoryUrl: '/inventory',

  /** "See all reviews" — the business on Google Maps (its reviews live there).
   *  Swap for a direct reviews URL (Google, Yelp…) when available. */
  reviewsUrl: 'https://www.google.com/maps/search/?api=1&query=CAR+LOFT+165+Ruby+Dr+Newbury+Park+CA+91320',

  /** Separate repair shop. `null` until the client provides the URL (BRIEF §17.1). */
  repairShopUrl: null,

  /** Instagram. Tiles render as plain figures while `instagramUrl` is null. */
  instagramHandle: '@handle pending',
  instagramUrl: null,

  /** Document <title> and meta description — injected into index.html at build
   *  and dev time by the `brand-meta` plugin in vite.config.js. No claim words. */
  meta: {
    title: 'Used cars, classics, consignment and service',
    description:
      'Independent dealership: used cars across price ranges, classic American muscle, consignment, service and restoration.',
  },

  legal:
    'Listings, prices, reviews and some photographs on this page are illustrative placeholders.',
}

/** Header navigation — in-page anchors, in section order. */
export const navLinks = [
  { label: 'Inventory', href: '#inventory' },
  { label: 'Sell & Consign', href: '#sell' },
  { label: 'Classics', href: '#classics' },
  { label: 'Service', href: '#service' },
  { label: 'Finance', href: '#finance' },
  { label: 'About', href: '#about' },
]

/** Footer columns. `topic` links land on #contact and state what was asked. */
export const footerColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'Inventory', href: '#inventory' },
      { label: 'Classics', href: '#classics' },
      { label: 'Sell', href: '#contact?topic=sell' },
      { label: 'Consign', href: '#contact?topic=consign' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Service & Restoration', href: '#service' },
      { label: 'Finance', href: '#finance' },
    ],
  },
]

/** Human labels for `#contact?topic=…` (footer "You asked about: …"). */
export const topicLabels = {
  sell: 'Selling your vehicle',
  consign: 'Consignment',
  classics: 'Classic cars',
  service: 'Service & restoration',
  finance: 'Financing',
  visit: 'Planning a visit',
  car: 'An illustrative listing',
}
