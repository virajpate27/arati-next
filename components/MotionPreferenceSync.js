"use client";

import { useEffect } from "react";
import { getSettings } from "@/lib/storage";

export const SETTINGS_EVENT = "aarti:settings-changed";

/**
 * Applies the "गती कमी करा" (reduce motion) preference from Settings
 * to <html class="reduce-motion">, independent of the OS-level
 * prefers-reduced-motion media query. Renders nothing.
 */
export default function MotionPreferenceSync() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.classList.toggle("reduce-motion", !!getSettings().reduceMotion);
    };
    apply();
    window.addEventListener(SETTINGS_EVENT, apply);
    return () => window.removeEventListener(SETTINGS_EVENT, apply);
  }, []);

  return null;
}
