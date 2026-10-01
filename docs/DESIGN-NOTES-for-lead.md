# Design notes for the lead — changes that belong in motion-owned files

From designer #2 (typography / colour / composition pass, 2026-09-30).
Each change below is a **text-only edit inside an existing text node or attribute**.
No class names, `data-motion` / `data-reveal` attributes or DOM nodes change.

## 1. `src/components/SellConsign.jsx`: copy promises (audit P2 #2, #3) and apostrophes (critique #15)

In the `pathways` array:

```diff
-    text: "Tell us about your car and we'll come back with an offer. There's no obligation to accept.",
+    text: 'Tell us about your car and we’ll come back with an offer.',
```

```diff
-    text: 'For special and collector cars: we present and market the car, and you keep ownership until it sells.',
+    text: 'For special and collector cars: we present and market the car for you.',
```

In the H2 (a leaf text node inside `.line-block`, so SplitText is unaffected):

```diff
-            <span className="line-block">for what's next.</span>
+            <span className="line-block">for what’s next.</span>
```

These leave no unsourced promises in Sell/Consign. The process is described, and no outcome or
contract term is stated.

## 2. `src/components/Classics.jsx`: generated-image disclosure (audit P2 #8)

```diff
-                alt="A black 1969 Chevrolet Camaro in a dark workshop, with a mechanic at a tool chest behind it."
+                alt="Illustrative generated image: a black classic muscle car in a dim workshop."
```

```diff
-            <p className="classics__caption">Illustrative image</p>
+            <p className="classics__caption">Illustrative image (generated) — to be replaced</p>
```

The caption keeps its position (bottom-right, `--edge` / `--inset-caption`) and its colour
(`--c-on-dark-2` #b8bcc2 on graphite, 9.93:1). The longer string is about 300px at 14px and still
sits clear of the car.

## 3. Asset housekeeping (for your end-of-build cleanup)

- The hero slide 2 (`hero-porsche-911-cabriolet.webp`, 309 KB) is **no longer referenced**. The
  slide was cut per disposition #3 because the car spans 81.5% of its 3:2 source and the desktop
  plate (~1.16:1) shows at most 77%, so no object-position keeps both the tail and the nose at
  1440 or 1280. Add it to the unused-asset removal list (audit #14).
- The default featured trio now opens on **`inv-porsche-911.webp`, which is a lime/acid-green
  car**. That is the same visual problem the critic raised about the lime AMG (disposition #8).
  The ruling fixed the *model* mix, but the photograph still sets the section's colour. I have
  not swapped the image, because it is the only 911 in the inventory set and CP7 ties the row to
  the photograph. If a neutral-coloured 911 exists in WORK, swapping only the file is a
  one-line change in `src/data/inventory.js`.

## 4. Nothing needed in `Hero.jsx` / `Header.jsx`

- The hero now has 2 slides from `src/data/hero.js`. The counter reads `01 / 02`. Keyboard
  arrows and prev/next wrap correctly (verified).
- The tablet hero (768–1023) now docks `.hero__controls` on the plate's lower-right corner as a
  white chip. This is done with CSS grid placement only, with no DOM change. If the hero motion
  animates `[data-motion="controls"]` with `y`, it still works, because the element keeps its own box.
