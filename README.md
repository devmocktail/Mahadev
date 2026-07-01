# Mahadev Eventz — Premium Event Management Website

A production-ready, luxury **Angular 20** website for *Mahadev Eventz* — built with standalone
components, signals, lazy-loaded routes, Tailwind CSS and Angular Animations.

> **We Make Your Moments Unforgettable** · 📞 9030630508

---

## ✨ Highlights

- **Angular 20** standalone components, `OnPush` change detection & **signals**
- **Lazy-loaded** routes with native **View Transitions** for smooth page changes
- **Tailwind CSS** luxury design system (gold `#D4AF37` on black `#0B0B0B`)
- **Playfair Display + Poppins** typography
- Cinematic **Angular Animations** — hero fade, slide, scale, stagger, counters, scroll reveal
- **Dark/Light** theme toggle (signal + `localStorage`)
- Fully **responsive / mobile-first**, **SEO-friendly** with meta tags + JSON-LD structured data
- Floating **WhatsApp** & **Call** buttons, **scroll progress** bar, **back-to-top**
- Reusable masonry **gallery** with category filters & accessible **lightbox**
- Reactive **booking form** with validation & success popup
- Custom directives: scroll-reveal, parallax, button ripple
- Heroicon-style + **FontAwesome** brand icons

## 🚀 Getting Started

```bash
npm install
npm start          # dev server → http://localhost:4200
npm run build      # production build → dist/mahadev-eventz
```

> Requires Node 18.19+ / 20+.

## 🗂 Folder Structure

```
src/
├─ app/
│  ├─ core/                # framework-level singletons
│  │  ├─ animations/       # reusable Angular animation triggers
│  │  ├─ data/             # static content datasets
│  │  ├─ directives/       # reveal, parallax, ripple
│  │  ├─ models/           # TypeScript interfaces
│  │  └─ services/         # seo, theme, scroll, booking, content
│  ├─ shared/components/   # reusable UI (navbar, footer, button, counter,
│  │                       #   cards, loader, section-header, page-banner,
│  │                       #   scroll-progress, back-to-top, floating-actions, logo)
│  ├─ components/          # page sections (hero, about, services, gallery,
│  │                       #   why-choose, testimonials, booking-form, faq, contact)
│  ├─ pages/               # routed pages (home, about, services, gallery,
│  │                       #   testimonials, booking, contact, not-found)
│  ├─ app.ts               # root shell
│  ├─ app.config.ts        # providers (router, animations)
│  └─ app.routes.ts        # lazy-loaded routes
├─ assets/images/          # placeholder SVG imagery
└─ styles.scss             # Tailwind layers + design tokens
```

## 🎨 Customising

- **Brand / contact info** → `src/app/core/data/company.data.ts`
- **Services, gallery, testimonials, FAQs** → `src/app/core/data/*`
- **Theme colours / fonts** → `tailwind.config.js`
- **Images** → replace the placeholder SVGs in `src/assets/images/`

---

© Mahadev Eventz. All rights reserved.
