/**
 * public/sw.js — placeholder service worker.
 *
 * Not registered anywhere yet (no navigator.serviceWorker.register
 * call in the app). Kept here so offline/precache support can be
 * switched on later -- e.g. with next-pwa or a manual runtime-caching
 * strategy -- without restructuring the project.
 *
 * Because Next.js fingerprints its build output (hashed chunk
 * filenames under /_next/static/...), a hand-written precache list
 * of pages/assets is impractical here. A runtime cache-first /
 * network-first strategy per request type is the right approach
 * once this is wired up.
 */

const CACHE_NAME = "aarti-sangrahalay-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return res;
          })
          .catch(() => cached)
    )
  );
});
