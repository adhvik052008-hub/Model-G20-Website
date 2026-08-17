# Model G20 2026

The official website for **Model G20 2026** — an international summit simulation
convened by **The School of Raya**, hosted at **FLAME University, Pune**,
13–15 November 2026.

A zero-dependency static site: no framework, no bundler, no `node_modules`.
Fourteen pages, four stylesheets, five scripts. Deploys to GitHub Pages, Netlify,
Cloudflare Pages or any static host by copying the repository root.

**Editing the site → read [EDITING.md](EDITING.md).** It is written for someone
who has never opened this project before and assumes no prior knowledge.

---

## Quick start

```bash
# Serve locally — any static server works
python3 -m http.server 8000
# → http://localhost:8000

# After editing anything in src/, rebuild the pages
python3 build.py
```

There is no install step and no dependency to fetch.

---

## How the build works

Pages are assembled from a shared shell so the navigation, footer and `<head>`
cannot drift between the fourteen pages. `build.py` reads the partials, injects
each page's content, and writes plain HTML to the repository root.

```
src/partials/head.html      <head> template — meta, OG tags, fonts, schema.org
src/partials/header.html    Skip link, curtain, glass nav, mobile drawer
src/partials/footer.html    Footer, back-to-top
src/partials/crest.svg      The seal, inlined everywhere it appears

src/pages/*.html            Page content only, with front matter
build.py                    The assembler
↓
index.html, about.html, …   Generated — do not hand-edit
```

### The cover page is different

`src/pages/index.html` carries `standalone: true` in its front matter, which
means the build copies it through byte for byte. It is a complete HTML document
with its own styling, its own reduced navigation and its own animated canvas
background, and it does not use the shared shell at all. Edit it like any
ordinary HTML file; its eight likely edit points are numbered `EDIT 1` … `EDIT 8`
in the file itself.

If you edit a *generated* page in the repository root by mistake, the build
notices and refuses to overwrite it, telling you how to keep or discard the
change. `python3 build.py --force` overwrites regardless.

**Edit `src/pages/`, never the generated root HTML.** Anything written directly
into a root `.html` file is overwritten on the next build.

Front matter sits in an HTML comment at the top of each page file:

```html
<!--meta
title: Committees
nav: committees
description: Used for <title>, the meta description and the OG/Twitter tags.
scripts: matrix.js
-->
```

| Key           | Purpose                                                              |
| ------------- | -------------------------------------------------------------------- |
| `title`       | Page title; ` — Model G20 2026` is appended                          |
| `nav`         | Which nav item gets `aria-current="page"`                            |
| `description` | Meta description and social card copy                                |
| `scripts`     | Extra scripts for this page only, comma-separated                    |
| `body_class`  | Optional class on `<body>`                                           |
| `standalone`  | `true` copies the file through untouched, bypassing the shell        |

`python3 build.py --check` builds to memory and reports without writing.

### Adding a page

1. Create `src/pages/your-page.html` with front matter.
2. Add the slug to `PAGE_ORDER` in `build.py` (ordering only — an unlisted page
   still builds and is flagged in the log).
3. Link it from `src/partials/header.html` and `src/partials/footer.html`.
4. Run `python3 build.py`.

---

## Content lives in one file

Committees, delegations, the schedule, FAQs, Secretariat offices, resources,
gallery entries and fee tiers are all in **`assets/js/data.js`**. Editing that
file changes the site — no markup edits required. Add a committee to the
`COMMITTEES` array and it appears on the committees page, in the home track
list, in the country matrix, and in the registration form's dropdowns.

---

## Project layout

```
assets/css/tokens.css       Design tokens — colour, type, space, motion, elevation
assets/css/base.css         Reset, ground, typography, layout primitives, a11y
assets/css/components.css   25 components, all context-aware
assets/css/pages.css        Layouts that exist exactly once

assets/js/world.js          Generalised world geometry + equirectangular projection
assets/js/data.js           All conference content ← edit this
assets/js/render.js         Renders data into the DOM
assets/js/map.js            Dot-matrix delegation map
assets/js/matrix.js         Country matrix search/filter (matrix page only)
assets/js/app.js            Nav, reveals, countdown, modals, forms, wizard

assets/img/favicon.svg      The seal
assets/img/og.svg           Social card — see "Before launch" below
```

### The design system

The interior pages share one design system. The cover page deliberately does
not — it runs a display serif (Bodoni Moda) and its own layout, so it reads as
a title page rather than as another interior page. Both use the same four brand
colours.

Two pages document the system and are part of the deliverable:

- **`design-system.html`** — palette, type scale, space, radii, elevation,
  glass, motion, the full component library, identity usage rules and the
  accessibility standard. It is rendered from the live stylesheets, so it cannot
  drift from the built site.
- **`wireframes.html`** — information architecture, low-fidelity blueprints for
  the four structural page types, responsive behaviour by breakpoint, the four
  user journeys, and the edge-case states the design accounts for.

---

## Design language

| Token             | Value     | Role                                              |
| ----------------- | --------- | ------------------------------------------------- |
| Parchment         | `#EFDDC6` | The page ground                                   |
| Sovereign Maroon  | `#600808` | Primary action, active state, inverted sections   |
| Ivory             | `#FFFFFF` | Card surfaces, glass tint                         |
| Ink               | `#000000` | Type, warmed toward the ground                    |

Every other value in the system is a tonal derivation of those two brand hues —
there is no third hue anywhere. Type is Cormorant Garamond for display, Inter
for text and interface, IBM Plex Mono for data, each with a full local fallback
stack so the page keeps its serif/grotesque contrast if webfonts are blocked.

Maroon on parchment measures ≈9.4:1; parchment on maroon-800 ≈11:1. No
text-bearing pair falls below 4.5:1.

---

## Accessibility

- Skip link, semantic landmarks, one `<h1>` per page
- Full keyboard operation, including the map's delegation pins
- Focus trapped in modals and restored to the opener on close
- Countdown announces on the day boundary, not every second
- `prefers-reduced-motion` collapses all transitions, resolves reveals to their
  final state, drops the paper grain and does not mount the custom cursor
- Reveal animations are scoped to `html.js`, so a visitor without JavaScript
  sees fully rendered content rather than a blank page

---

## Before launch

This is a complete front end. Six things need real values before it goes live:

1. **Contact details** — `EVENT.email`, `EVENT.emailDelegates`, `EVENT.emailPress`
   and `EVENT.phone` in `assets/js/data.js`, plus the four addresses on
   `src/pages/contact.html` and the Contact block on the cover page, are all
   `…@modelg20.example` placeholders. Social links and the partner's website
   link point at `#`.
2. **Secretariat appointments** — offices in `SECRETARIAT` render
   "Appointment announced ahead of summit". Add a `name` key to any office to
   render the name instead.
3. **Seat availability** — `statusFor()` in `data.js` generates availability
   deterministically so the matrix demonstrates realistic density. Replace it
   with a lookup against the real allotment sheet.
4. **Fees and deadlines** — `FEES`, `ACCOMMODATION` and `EVENT.deadlines` carry
   indicative figures.
5. **Documents** — Resources links have no files behind them. Put PDFs in
   `assets/docs/` and point the links there; the click handler currently
   explains that the file is not bundled rather than 404-ing.
6. **Forms** — the contact form and registration wizard validate fully and show
   their success states, but nothing is transmitted; there is no backend.
   Point them at Formspree, Netlify Forms, a Google Form or your own endpoint.

Also worth doing: export `assets/img/og.svg` to a 1200×630 **PNG** and update the
`og:image` path in `src/partials/head.html` — several social platforms do not
render SVG previews.

Gallery images are generated placeholder compositions. Add a `src` key to any
entry in `GALLERY` and it renders that photograph instead, in the grid and in
the lightbox.

---

## Deploying to GitHub Pages

Settings → Pages → Deploy from a branch → select the branch, folder `/ (root)`.
The generated HTML is committed, so nothing needs to build on the server.

If the site is served from a project subpath, update `BASE_URL` in `build.py`
and rebuild so the canonical and social URLs are correct. All internal links are
relative and work from any subpath as-is.

---

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `backdrop-filter`,
`:has()`, CSS nesting-free custom properties, `grid-template-rows` transitions
and `IntersectionObserver`. Older browsers lose the glass blur and some reveal
animation; layout and content remain intact.

---

## Licence

Code: see `LICENSE`. Conference content, the crest and the wordmark are the
property of The School of Raya.
