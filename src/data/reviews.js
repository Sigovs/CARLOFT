/**
 * reviews.js — SIMULATED SAMPLE REVIEWS for the mockup (client, 2026-09-30:
 * "simulate the reviews"). They are not real customers; the section shows a
 * visible "Sample reviews" note while `sample` is true. Replace each entry with a
 * real, attributable review before launch and set `sample` to false:
 *   text    the review, verbatim
 *   name    reviewer's display name as published
 *   role    short tagline (what they bought / which service)
 *   url     optional link to the original review
 *   avatar  optional /assets/… image; without one, initials are shown
 */

export const reviewsAreSamples = true

export const reviews = [
  {
    id: 'review-1',
    text: 'Straightforward from the first call. They answered every question about the car’s history and never pushed. Drove home the same afternoon.',
    name: 'Mark T.',
    role: 'Bought a Lexus ES',
    url: null,
    avatar: null,
  },
  {
    id: 'review-2',
    text: 'I consigned my 911 with them. Clear terms, great photos, and they kept me posted every step until it sold.',
    name: 'Daniel R.',
    role: 'Consigned a Porsche 911',
    url: null,
    avatar: null,
  },
  {
    id: 'review-3',
    text: 'They brought my father’s Chevelle back to life. Careful work, honest updates, and it runs better than I remember.',
    name: 'Sarah K.',
    role: 'Classic restoration',
    url: null,
    avatar: null,
  },
  {
    id: 'review-4',
    text: 'Service is quick and they explain what actually needs doing before they start. That’s why I keep coming back.',
    name: 'James L.',
    role: 'Service customer',
    url: null,
    avatar: null,
  },
]
