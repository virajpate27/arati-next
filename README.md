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

## PWA / offline support

The app installs like a native app and works fully offline once opened:

- `scripts/sw-template.js` — the real service-worker logic (network-first
  navigations with an `/offline` fallback, cache-first for hashed
  `/_next/static` assets, cache-or-network for Next.js's RSC data
  fetches).
- `scripts/generate-sw.js` — runs automatically after `next build` (via
  the `postbuild` script) and writes the actual `public/sw.js`: it bakes
  in every shell route, every individual `/aarti/<id>` page (read
  straight from `lib/data/aartis.js`, so new aartis are picked up
  automatically), and — when a `.next` build is present — the exact
  hashed JS/CSS chunk paths those pages need. The cache is versioned by
  a hash of that list, so a new build always invalidates old caches.
- `components/PwaRegister.js` registers the worker (production only)
  and shows `<UpdateToast />` when a new version has finished
  installing in the background, instead of silently reloading mid-read.
- `components/OfflineIndicator.js` shows a small pill when the browser
  goes offline.
- Settings → "अ‍ॅप व ऑफलाइन" has an install button
  (`components/InstallPwaButton.js` + `lib/hooks/usePwaInstall.js`,
  wrapping `beforeinstallprompt`) and a "साठवा" button that tells the
  service worker to eagerly cache every aarti right away, instead of
  waiting for each one to be opened once.

Run `npm run build` (not just `next build` directly) so the postbuild
step regenerates `public/sw.js` — otherwise you'll ship a stale
precache list.

## Listen (offline-capable text-to-speech)

No aarti currently ships an audio recording (`audio: null` for all 38
in `lib/data/aartis.js`). The reader's speaker button
(`lib/hooks/useSpeechReader.js`) uses the browser's built-in
`speechSynthesis` API instead — no audio files to host, and it reads
verse-by-verse so the existing verse-highlight/scroll logic follows
along. It prefers a Marathi voice, falls back to Hindi, then whatever
default voice exists. On-device voices keep working offline; a
browser's "cloud" voices (if any) won't.

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
