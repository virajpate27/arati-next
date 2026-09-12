/**
 * public/sw.js is GENERATED. Do not edit it by hand — edit this file
 * (scripts/sw-template.js) instead and re-run `npm run build`
 * (scripts/generate-sw.js runs automatically via "postbuild" and
 * bakes the precache list + a fresh cache version into it).
 *
 * Strategy:
 *  - Full-page navigations (hard loads, and Next.js's own fallback
 *    to a hard load when a soft client-side navigation fails):
 *    network-first, falling back to cache, falling back to /offline.
 *  - Hashed /_next/static/* build assets: cache-first (immutable).
 *  - Next.js RSC "flight" data fetches used for soft client-side
 *    navigation: cache if we have it, else network — and if the
 *    network fails, the fetch is left to reject instead of being
 *    papered over. Next.js treats that failure as a signal to retry
 *    the navigation as a full page load, which the branch above
 *    then serves from cache. Returning a substitute response here
 *    would break that mechanism.
 *  - Everything else same-origin (icons, manifest.json): stale-
 *    while-revalidate.
 */

const CACHE_VERSION = "__CACHE_VERSION__";
const CACHE_NAME = `aarti-sangrahalay-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";

// Filled in by scripts/generate-sw.js: the site-shell routes, every
// individual /aarti/<id> reading page, and (when a .next build is
// present) the hashed JS/CSS chunks those pages need.
const PRECACHE_URLS = "__PRECACHE_URLS__";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url, { cache: "no-cache" }).then((res) => {
            if (res && res.ok) return cache.put(url, res);
            return undefined;
          })
        )
      )
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isBuildAsset(url) {
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/");
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    return offline || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  return cached || (await networkFetch) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isBuildAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  const isRscDataFetch = request.headers.get("RSC") === "1" || url.search.includes("_rsc=");
  if (isRscDataFetch) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

// Lets the page ask the SW to do two things:
//  - SKIP_WAITING: activate an updated SW immediately (used by the
//    "update available" toast, after the user chooses to refresh).
//  - CACHE_URLS: eagerly fetch + cache a list of URLs (used by the
//    "save all aartis for offline" button in Settings). Replies with
//    CACHE_URLS_DONE so the UI can confirm completion.
self.addEventListener("message", (event) => {
  const { data } = event;
  if (!data) return;

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (data.type === "CACHE_URLS" && Array.isArray(data.urls)) {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) =>
          Promise.allSettled(
            data.urls.map((requestUrl) =>
              fetch(requestUrl, { cache: "no-cache" }).then((res) =>
                res.ok ? cache.put(requestUrl, res) : Promise.reject(new Error("bad response"))
              )
            )
          )
        )
        .then((results) => {
          const failed = results.filter((r) => r.status === "rejected").length;
          event.source?.postMessage({ type: "CACHE_URLS_DONE", total: data.urls.length, failed });
        })
    );
  }
});
