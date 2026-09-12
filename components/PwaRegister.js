"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js in production only (in dev, Next.js rebuilds
 * constantly and a caching SW would just fight the dev server /
 * serve stale chunks). When an updated SW finishes installing, it
 * sits "waiting" instead of taking over immediately — we fire a
 * DOM event so <UpdateToast /> can offer the user a refresh, and
 * only apply the update once they choose to.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let reloadedOnce = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloadedOnce) return;
      reloadedOnce = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        const announceIfWaiting = () => {
          if (registration.waiting) {
            window.dispatchEvent(new CustomEvent("aartisangrah:update-available"));
          }
        };
        announceIfWaiting();

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              announceIfWaiting();
            }
          });
        });

        // Used by <UpdateToast /> when the user taps "refresh".
        window.__aartiApplyPwaUpdate = () => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        };
      })
      .catch(() => {
        /* offline support just won't be available this session */
      });
  }, []);

  return null;
}
