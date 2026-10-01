# Client brief (verbatim, 2026-09-30)

Two messages. **Message 2 overrides Message 1 wherever they conflict.**

---

## Message 2 — IMPORTANT UPDATE (overrides conflicting instructions in Message 1)

### Starting point

We are starting completely from scratch. The project folder contains ONLY one reference image. There is no existing website, codebase, component library, or implementation to preserve.

Create the complete project, install the necessary dependencies, and build a working responsive homepage. Use Vite, React, and GSAP with ScrollTrigger unless the workspace instructions require another stack.

The reference image is the approved visual direction, not an existing website.

For temporary photography, search WORK recursively. You may use suitable images from ANY folder within WORK, including other projects. Inspect them visually, select coherent assets, and COPY the chosen files into this project's public/assets folder. Do not move or modify the originals. Do not depend on absolute WORK paths at runtime.

### Motion is a core design requirement

This must be a deliberately choreographed scrolling website. A static page with a few fade-ins is insufficient.

Design the motion architecture BEFORE implementation. The art-director and motion-designers must create a section-by-section plan specifying:
- what moves
- the scroll trigger
- whether the animation is scrubbed, entrance-based, sticky, or pinned
- its duration and scroll distance
- how it transitions into the next section
- the mobile adaptation

Use the reference for visual composition, then develop the scrolling experience around it.

Required motion language:
- Large headings rise into view through clean line masks, with carefully staggered lines.
- Supporting text follows with smaller, softer movement.
- Photographs reveal through animated clipping or expanding containers, with subtle internal translation.
- Sticky compositions let imagery remain in view while related text progresses.
- At least TWO meaningful desktop sticky/pinned sequences, with distinct choreography.
- Sections should connect through movement and changing composition, not operate as isolated fade-in blocks.

### Required signature sequences

1. SELL / CONSIGNMENT — sticky editorial sequence

Use a desktop section approximately 160–190vh tall with a sticky visual stage around one viewport high.

Keep a large vehicle/detail image anchored on one side while the other side progresses through:
- "Make room for what's next."
- Sell Your Vehicle
- Consignment

Reveal each text group as its scroll phase arrives. Allow the image framing to shift subtly between phases.

Maintain one clear active text group. Do not stack fading text on top of itself or leave unreadable ghost layers. Keep the associated CTA interactive.

This should feel like one continuous composition developing through scroll.

2. CLASSICS — main cinematic scroll sequence

Use a dark, approximately viewport-height stage with a controlled desktop pin lasting around one additional viewport of scrolling.

Choreograph a continuous progression:
- The dark photographic stage opens through a mask.
- "American muscle." rises through a line mask.
- "Timeless character." follows.
- The image framing gently shifts to reveal more of the classic car.
- Supporting copy and the two CTAs settle into their final positions.
- The composition holds briefly before releasing into the bright Service section.

Use a flattened photograph honestly: move the whole image layer and its crop. Do not pretend the car is an independent 3D object. Keep scale changes minimal and preserve the vehicle's proportions.

Do not make the animation merely a zoom. The effect comes from coordinated image reveal, framing, typography, and scroll timing.

### Remaining sections

- Hero: a polished entrance and a working image slider with directional masked transitions.
- Inventory: restrained, quick staggered entrances and precise hover interactions.
- Service: a substantial image reveal, headline line reveals, and subtle scroll-linked photographic movement.
- Finance: headline and supporting copy flow into place with a calmer image reveal.
- About: deliberate typography entrance with generous breathing room.
- Reviews / Instagram: quieter group entrances so the page has varied intensity.

Vary the choreography. Do not apply identical movement to every section.

### Implementation requirements

Use gsap.matchMedia() for desktop/mobile/reduced-motion behavior.

On mobile:
- Convert pinned sequences into natural stacked sections.
- Keep strong image and text reveals.
- Avoid excessive scroll distances and overlapping content.
- Keep all CTAs accessible.

For reduced motion:
- Show the complete content immediately.
- Remove pinning, scrubbed movement, and elaborate transitions.

Use native scrolling. Smooth motion should come from well-built GSAP timelines, easing, and scrub smoothing, not scroll hijacking.

Make line masks responsive and rebuild them safely when needed. Wait for fonts and relevant images before measuring layouts. Clean up GSAP contexts, pins, and listeners correctly.

Verify the actual experience by scrolling forward and backward, quickly and slowly, and resizing between desktop and mobile. Screenshots alone are not enough to validate motion.

Keep the approved light design and ONE dark Classics section. The final result must preserve the reference's visual quality while adding a substantial, intentional scrolling experience.

---

## Message 1 — original brief (still binding where not overridden)

Build a complete, polished, responsive dealership homepage using the attached image (`reference/reff1.png`) as the primary visual reference.

This is a NEW project. "CAR LOFT" belongs to another project and must not appear here. The business name and logo are pending. Use a discreet temporary "DEALERSHIP" wordmark, with branding centralized for easy replacement.

Preserve the reference's composition, bright atmosphere, large sections, restrained blue accents, and single dark Classics section.

### Assets
- Hero: approachable contemporary cars, preferably Porsche plus Mercedes or a comparable mix
- Inventory: a mix of premium and everyday vehicles
- Sell/Consignment: automotive detail or a strong cropped vehicle photograph
- Classics: classic American muscle car with a composition suitable for a dark section
- Service: genuine workshop, repairs, restoration, paint/body work
- Finance: restrained interior/detail photography rather than handshake, cash, or credit-card clichés
- About/Instagram: suitable supporting automotive imagery

Build every section as real HTML/CSS with separate image assets (never the reference screenshot as a background). The reference contains illustrative content: do not copy its invented address, phone, hours, vehicle specifications, claims, or dealership building identity as real business information.

### Business and structure
Independent dealer selling vehicles across price ranges: Porsche, Mercedes, Lexus, Honda, Toyota.

Required order: 1 Compact header · 2 Hero slider · 3 Inventory search · 4 Featured inventory · 5 Sell Your Vehicle and Consignment · 6 Classic muscle car sales and service — the ONE dark section · 7 Service — link to a separate repair shop · 8 Finance · 9 About · 10 Reviews · 11 Instagram · 12 Footer.

Service capabilities: repairs, restoration, paint, auto body. Keep Inventory, Sell, Consignment, Service, Classics, Finance as clear user pathways. Sell and Consignment share a section but have distinct descriptions and actions. Use editable local mock data. Mark reviews and business info as placeholders. Do not invent testimonials, ratings, credentials, financing promises, or claim illustrative cars are actual stock.

### Static design
- Predominantly white and very light gray; charcoal type; restrained muted blue primary actions
- Clean, confident sans-serif with excellent hierarchy
- Strong photography and intentional crops
- Large, substantial sections below inventory; generous internal spacing; clear transitions
- Crisp borders, minimal corner rounding
- Practical dealership experience with editorial visual quality
- At 1440px: content width around 1280–1320px
- Hero spacious and strong. Inventory compact, clear, useful. Sections below = substantial chapters.
- Classics: enough height for a large vehicle and generous type; graphite/near-black, white text, blue primary action, restrained outlined secondary. Preserve the car's silhouette.

Avoid: black-and-gold luxury, frosted glass, decorative gradients, excessive pills/rounded cards, tiny type, repetitive equal blocks, dense service icon grids, indiscriminate decorative motion.

### Motion detail (Message 1, still applies where compatible)
- Header: sticky, compact; after leaving the hero, smoothly introduce subtle border/solid background; stable height, no layout shift.
- Hero slider: ≥2 images; prev/next + restrained counter; controlled horizontal reveal / masked movement; headline, text and CTA move as one transition. No Ken Burns, no generic dissolve. Prefer manual; if autoplay, pause on interaction, hover, offscreen. Initial entrance: short headline reveal, then copy and actions; hero image already visible.
- Inventory: restrained group reveal, small y, short stagger. Hover: image scale ≈1.025, small arrow move. No tilt/magnetic. Search controls must work against the mock dataset or route to a working inventory view — no dead controls.
- Sell/Consign: never hide both pathways behind a long sequence.
- Classics: keep car grounded; never rotate, fake-drive, distort; no crude background removal; limited travel ≈30–60px at desktop; both CTAs usable throughout; mobile = simple reveal.
- Service: bright; image + headline complementary; services enter as a small group. Video only if genuinely better, with poster + reduced-motion fallback.
- Finance/About: calm. Reviews/Instagram: quiet group reveals; Instagram hover slight scale + arrow. No marquee, no auto carousel.
- Micro: restrained color/border changes, small arrow translation, clear focus/active. No cursor followers, no magnetic buttons.

### Quality & accessibility
Animate transforms/opacity. No permanent opacity:0 if JS fails. Reduced motion = fully visible content. Touch scrolling native. Don't animate every paragraph separately. Modest distances, consistent timing. No text clipping/broken masks on font load/resize. Refresh ScrollTrigger after fonts/images. No horizontal overflow. Stable image aspect ratios. Optimise large assets, lazy-load below the fold. Verify fast/slow/backward scroll and after resize.

Verify at ~1440, 768, 390. Check console. Do not publish or deploy externally.
