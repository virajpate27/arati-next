"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Wraps the `beforeinstallprompt` flow. Chromium-based browsers fire
 * this event once the manifest + service worker + HTTPS criteria are
 * met. Safari and Firefox never fire it — canInstall stays false
 * there, and people install via the browser's own share/menu option
 * instead (iOS Safari: Share → Add to Home Screen).
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setInstalled(standalone);

    function onBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredPrompt(event);
    }
    function onAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "unavailable";
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome; // "accepted" | "dismissed"
  }, [deferredPrompt]);

  return {
    canInstall: !!deferredPrompt && !installed,
    installed,
    promptInstall,
  };
}
