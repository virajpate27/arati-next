#!/usr/bin/env node
/**
 * scripts/generate-sw.js
 * ------------------------------------------------------------
 * Runs automatically after `next build` (see the "postbuild" script
 * in package.json) and writes the real public/sw.js.
 *
 * Why generated instead of hand-written: Next.js fingerprints every
 * JS/CSS chunk with a content hash, so a hand-written precache list
 * goes stale the moment the app is rebuilt. This script reads the
 * actual build output plus the aarti list and bakes a fresh,
 * versioned precache manifest into the service worker every time.
 *
 * Safe to run without a prior `next build` too (e.g. right after
 * cloning the repo) — it still produces a fully valid service
 * worker, it just precaches the known page routes instead of exact
 * hashed asset files. The runtime caching strategy in the template
 * fills the rest in as pages get visited normally.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const NEXT_DIR = path.join(ROOT, ".next");
const OUT_FILE = path.join(ROOT, "public", "sw.js");
const TEMPLATE_FILE = path.join(__dirname, "sw-template.js");
const AARTIS_FILE = path.join(ROOT, "lib", "data", "aartis.js");

const SHELL_ROUTES = ["/", "/list", "/categories", "/favorites", "/settings", "/about", "/offline"];

function getAartiRoutes() {
  const src = fs.readFileSync(AARTIS_FILE, "utf8");
  const startIdx = src.indexOf("export const AARTI_DATA");
  const body = startIdx === -1 ? src : src.slice(startIdx);
  const ids = [...body.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
  return ids.map((id) => `/aarti/${id}`);
}

// Best-effort: pull hashed JS/CSS chunk paths out of Next's own build
// manifests, when a build is actually present.
function getBuildAssets() {
  const assets = new Set();
  const manifestFiles = ["app-build-manifest.json", "build-manifest.json"];

  for (const name of manifestFiles) {
    const file = path.join(NEXT_DIR, name);
    if (!fs.existsSync(file)) continue;
    try {
      const json = JSON.parse(fs.readFileSync(file, "utf8"));
      const pages = json.pages || {};
      Object.values(pages).forEach((list) => {
        (list || []).forEach((asset) => {
          if (asset.endsWith(".js") || asset.endsWith(".css")) {
            assets.add(`/_next/${asset}`);
          }
        });
      });
    } catch {
      // Malformed/partial manifest — skip it, runtime caching covers the gap.
    }
  }
  return [...assets];
}

const precacheUrls = [
  ...SHELL_ROUTES,
  ...getAartiRoutes(),
  ...getBuildAssets(),
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
].filter((url, i, arr) => arr.indexOf(url) === i);

const cacheVersion = crypto.createHash("sha1").update(JSON.stringify(precacheUrls)).digest("hex").slice(0, 10);

const template = fs.readFileSync(TEMPLATE_FILE, "utf8");
const output = template
  .replace('"__CACHE_VERSION__"', JSON.stringify(cacheVersion))
  .replace('"__PRECACHE_URLS__"', JSON.stringify(precacheUrls, null, 2));

fs.writeFileSync(OUT_FILE, output);
console.log(`[generate-sw] wrote public/sw.js — ${precacheUrls.length} URLs precached, version ${cacheVersion}`);
