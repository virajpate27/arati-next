# आरती संग्रहालय — Next.js edition

A Next.js (App Router, JavaScript) port of the original static site, with
the exact same design, data, and reading experience.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For a production build:

```bash
npm run build
npm run start
```

> **Note:** `npm run build` fetches Noto Sans/Serif Devanagari from Google
> Fonts at build time via `next/font/google` (self-hosted afterwards, no
> runtime request). This requires normal internet access during the build —
> it will fail in network-locked sandboxes that block `fonts.googleapis.com`.

## Project structure

```
app/
  layout.js              Root layout: html/body, next/font, global CSS
  not-found.js           Generic 404
  (site)/                Route group with the shared header/nav/footer
    layout.js
    page.js               Home                       /
    list/page.js          Search & browse             /list
    categories/page.js    Category grid                /categories
    favorites/page.js     Favorites + Recently read     /favorites
    settings/page.js      Reading preferences            /settings
    about/page.js         About                          /about
  aarti/[id]/
    page.js               Reading page (own header, no site nav)
    not-found.js          Aarti-specific 404

components/               Shared UI (AartiCard, CategoryChips, ...)
components/reader/        ReaderPage.js — the verse-tracking reading UI

lib/
  data/aartis.js          All 38 aartis + categories (single source of truth)
  storage.js              SSR-safe localStorage wrapper
  search.js               Instant client-side search/filter
  utils.js, icon-map.js
  hooks/useFavorite.js     Favorite state, synced across components via
                           a window CustomEvent (no context provider needed)
  hooks/useRecent.js

styles/                   Same CSS as the static site (main/components/responsive)
public/                   manifest.json, sw.js (placeholder, unregistered), icons
```

## Notable changes from the static HTML/JS version

- **Routing**: multi-page HTML → Next.js file-based routing.
  `aarti.html?id=...` became the dynamic route `/aarti/[id]`.
- **Rendering**: vanilla DOM manipulation → React components. The
  IntersectionObserver-based active-verse tracking is ported 1:1 into a
  `useEffect` in `components/reader/ReaderPage.js`.
- **Fonts**: Google Fonts `<link>` tag → `next/font/google` (self-hosted,
  zero layout shift, no external request at runtime).
- **Icons**: Lucide CDN script → the `lucide-react` npm package.
- **Animations**: dropped GSAP for a plain CSS entrance animation
  (`[data-entrance]` keyframe in `styles/main.css`), removing a dependency.
- **State sync**: the old `document.dispatchEvent(new CustomEvent(...))`
  pattern for favorites became a small custom hook (`useFavorite` /
  `useFavoriteIds`) built on the same idea (a window event), avoiding a
  full Context provider for something this small.
- **Data**: `data/aartis.js` is unchanged in content, just exported as
  ES modules from `lib/data/aartis.js`.

## Adding a new aarti

Add an entry to the `AARTI_DATA` array in `lib/data/aartis.js` — every
page (list, search, categories, favorites, the reading page) picks it up
automatically. No other code changes needed.
