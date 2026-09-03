# Mahadev Eventz — Premium Event Management Website

A production-ready, luxury **Angular 20** website for *Mahadev Eventz* — built with standalone
components, signals, lazy-loaded routes, Tailwind CSS and Angular Animations.

> **We Make Your Moments Unforgettable** · 📞 9030630508

---

## ✨ Highlights

- **Angular 20** standalone components, `OnPush` change detection & **signals**
- **Zoneless change detection** — no `zone.js`, so Angular re-renders on signal
  writes and template events instead of on every patched browser callback
- **Lazy-loaded** routes with native **View Transitions**, preloaded once idle
- **Responsive WebP image pipeline** with generated `srcset` + intrinsic sizing
- **Tailwind CSS** luxury design system (gold `#D4AF37` on black `#0B0B0B`)
- **Playfair Display + Poppins** typography
- Cinematic **Angular Animations** — hero fade, slide, scale, stagger, counters, scroll reveal
- **Dark/Light** theme toggle (signal + `localStorage`)
- Fully **responsive / mobile-first**, **SEO-friendly** with meta tags + JSON-LD structured data
- Floating **WhatsApp** & **Call** buttons, **scroll progress** bar, **back-to-top**
- Reusable masonry **gallery** with category filters & accessible **lightbox**
- Reactive **booking form** with validation & success popup
- Custom directives: scroll-reveal, parallax, button ripple
- **Self-hosted icon subset** — 5.5KB of Font Awesome glyphs, no third-party CDN

## 🚀 Getting Started

```bash
npm install
npm start                 # dev server → http://localhost:4200
npm run build             # production build → dist/mahadev-eventz
npm run images:optimize   # regenerate WebP variants after adding photos
npm run icons:build       # regenerate the icon subset after adding an fa-* class
```

> Requires Node 20.19+ / 22.12+.

## 🖼 Images

Drop a `.jpeg`/`.jpg`/`.png` anywhere under `src/assets/images/`, reference it,
then run:

```bash
npm run images:optimize          # incremental — skips unchanged sources
npm run images:optimize -- --force
```

That script ([tools/optimize-images.mjs](tools/optimize-images.mjs)):

1. emits WebP variants at 400/600/800/1200px (never upscaling, plus the
   source's own width when that adds real resolution),
2. regenerates `src/app/core/data/image-manifest.ts` with every image's
   intrinsic dimensions,
3. rewrites the LCP `<link rel="preload">` block in `src/index.html`.

Source files are never modified — they stay as the `<picture>` fallback. Always
render images through `<app-img>`, which reads the manifest to emit the right
`srcset`, `width`/`height` (so nothing shifts as images load) and lazy-loading:

```html
<app-img
  src="assets/images/gallery/photos/photo-01.jpeg"
  alt="…"
  sizes="(min-width: 1280px) 384px, (min-width: 640px) 45vw, 92vw"
  imgClass="h-full w-full object-cover" />
```

Add `priority` to the single above-the-fold LCP image on a page; everything
else lazy-loads by default. Paths not in the manifest (SVGs, remote URLs)
degrade to a plain `<img>`.

## 🔤 Icons

Icons are a **self-hosted subset** of Font Awesome containing only the ~45
glyphs the templates actually use: 5.5KB of woff2 plus ~3KB of CSS, versus a
~100KB stylesheet and 274KB of webfonts from cdnjs. The site makes no
third-party icon request at all.

Use them exactly as before — `<i class="fa-solid fa-house"></i>`. After adding
an icon that isn't already in the set, regenerate:

```bash
npm run icons:build      # downloads FA, subsets it, rewrites src/styles/icons.scss
```

`npm run build` runs `icons:check` first ([tools/check-icons.mjs](tools/check-icons.mjs)),
which fails the build and names the offending file if a template uses a glyph
that isn't in the subset — otherwise a missing icon would render as nothing at
all, silently. Bump `FA_VERSION` in
[tools/build-icons.mjs](tools/build-icons.mjs) to move to a newer Font Awesome.

## ⚡ Performance notes

- **Scroll** — `ScrollService` writes the 0–1 progress to a `--scroll-progress`
  CSS custom property each frame; only two coarse booleans are signals, so a
  full-page scroll costs a couple of change detection runs rather than one per
  frame. Never make the raw progress a signal.
- **Parallax** — one shared scroll listener and one `requestAnimationFrame`
  serve every `appParallax` element, reads are batched before writes, and
  off-screen elements drop out of the pass entirely.
- **Reveal** — `appReveal` fails *visible*: the hidden state is
  `.reveal--armed`, applied by the directive itself, never a static CSS rule.
  If JS doesn't run, reduced motion is set, or the IntersectionObserver never
  reports an intersection, content just shows — and a safety timer reveals
  anything still hidden after 3.5s. A decorative animation must never be able
  to hide content permanently. `will-change` lives on the armed class, so
  dropping it releases the compositor layer automatically.
- **Failed route loads** — every page is a dynamic `import()`, and one dropped
  request used to leave the outlet silently empty: shell visible, content
  blank, no error, no way out but a manual reload. `RouteRecoveryService`
  reloads once per URL per tab (a browser caches the *rejection* of a failed
  module import, so only a reload clears it — which also refreshes a stale
  index.html pointing at chunk names a newer deploy no longer has), then shows
  a "Try again" panel instead of a blank page. The per-URL sessionStorage
  marker bounds it, so it can never become a reload loop.
- **Lightbox** — opening a gallery image paints the thumbnail the browser
  already has (briefly blurred) and swaps in the full-resolution variant when
  it arrives, so it never shows an empty frame. Tiles also prefetch their
  full-size variant on hover, and the lightbox prefetches its neighbours.
- **Route preloading** — `IdlePreloadStrategy` waits for `requestIdleCallback`
  rather than firing the moment the first navigation ends, so route chunks
  never compete with the images on screen; it skips preloading entirely on 2G
  or when Save-Data is set.
- **Third-party CSS** — only Google Fonts remains, loaded non-blocking. Icons
  are self-hosted (see above), so there is no cdnjs round trip on the critical
  path.
- **Caching** — `netlify.toml` marks hashed JS/CSS immutable for a year and
  forces revalidation of `index.html`, so deploys take effect immediately.

## 🗂 Folder Structure

```
src/
├─ app/
│  ├─ core/                # framework-level singletons
│  │  ├─ animations/       # reusable Angular animation triggers
│  │  ├─ data/             # static content datasets
│  │  ├─ directives/       # reveal, parallax, ripple
│  │  ├─ models/           # TypeScript interfaces
│  │  ├─ router/           # idle preloading, failed-route recovery
│  │  └─ services/         # seo, theme, scroll, booking, content
│  ├─ shared/components/   # reusable UI (navbar, footer, button, counter, img,
│  │                       #   cards, loader, section-header, page-banner,
│  │                       #   scroll-progress, back-to-top, floating-actions, logo)
│  ├─ components/          # page sections (hero, about, services, gallery,
│  │                       #   why-choose, testimonials, booking-form, faq, contact)
│  ├─ pages/               # routed pages (home, about, services, gallery,
│  │                       #   testimonials, booking, contact, not-found)
│  ├─ app.ts               # root shell
│  ├─ app.config.ts        # providers (zoneless CD, router, async animations)
│  └─ app.routes.ts        # lazy-loaded routes
├─ assets/images/          # source images + generated WebP variants
├─ assets/fonts/           # generated icon-font subset
├─ styles/icons.scss       # generated icon CSS (do not edit)
└─ styles.scss             # Tailwind layers + design tokens
tools/optimize-images.mjs  # image pipeline  (see "Images")
tools/build-icons.mjs      # icon subsetting (see "Icons")
tools/check-icons.mjs      # prebuild guard for missing icons
```

## 🎨 Customising

- **Brand / contact info** → `src/app/core/data/company.data.ts`
- **Services, gallery, testimonials, FAQs** → `src/app/core/data/*`
- **Theme colours / fonts** → `tailwind.config.js`
- **Images** → drop files in `src/assets/images/`, then `npm run images:optimize`

---

© Mahadev Eventz. All rights reserved.
