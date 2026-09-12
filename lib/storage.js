/**
 * storage.js — thin, safe wrapper around LocalStorage.
 * Every key is namespaced under "aartisangrah:" to avoid collisions.
 * All functions are SSR-safe: on the server (no `window`) they act
 * as no-ops / return fallbacks, so this module can be imported from
 * any client component without guarding every call site.
 */

const NS = "aartisangrah:";

function isBrowser() {
  return typeof window !== "undefined";
}

export function get(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(NS + key);
  } catch {
    /* ignore */
  }
}

// ---- Favorites --------------------------------------------------
export function getFavorites() {
  return get("favorites", []);
}
export function isFavoriteId(id) {
  return getFavorites().includes(id);
}
export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx > -1) {
    favs.splice(idx, 1);
  } else {
    favs.unshift(id);
  }
  set("favorites", favs);
  return favs.includes(id);
}

// ---- Recently read ------------------------------------------------
export function getRecent() {
  return get("recent", []);
}
export function pushRecent(id) {
  let recent = getRecent().filter((r) => r !== id);
  recent.unshift(id);
  recent = recent.slice(0, 10);
  set("recent", recent);
}

// ---- Font size ------------------------------------------------
export const FONT_STEPS = ["small", "normal", "large", "xlarge"];
export function getFontSize() {
  return get("fontSize", "normal");
}
export function setFontSize(size) {
  if (FONT_STEPS.includes(size)) set("fontSize", size);
}

// ---- Reading mode (normal | focus) ------------------------------
export function getReadingMode() {
  return get("readingMode", "normal");
}
export function setReadingMode(mode) {
  set("readingMode", mode);
}

// ---- Manual verse markers, per-aarti ------------------------------
export function getMarker(aartiId) {
  const markers = get("markers", {});
  return markers[aartiId] ?? null;
}
export function setMarker(aartiId, verseId) {
  const markers = get("markers", {});
  markers[aartiId] = verseId;
  set("markers", markers);
}
export function clearMarker(aartiId) {
  const markers = get("markers", {});
  delete markers[aartiId];
  set("markers", markers);
}

// ---- Settings ------------------------------
export function getSettings() {
  return get("settings", { reduceMotion: false });
}
export function setSettings(patch) {
  set("settings", { ...getSettings(), ...patch });
}
