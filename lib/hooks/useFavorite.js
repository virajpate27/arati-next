"use client";

import { useCallback, useEffect, useState } from "react";
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from "@/lib/storage";

// Any component that changes favorites dispatches this event so every
// other mounted component (cards, tabs, settings counts, ...) re-syncs
// without needing a shared context provider.
const EVENT = "aarti:favorites-changed";

export function useFavorite(id) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(id));
    const handler = () => setIsFav(getFavorites().includes(id));
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [id]);

  const toggle = useCallback(() => {
    toggleFavoriteStorage(id);
    window.dispatchEvent(new Event(EVENT));
  }, [id]);

  return { isFav, toggle };
}

export function useFavoriteIds() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(getFavorites());
    const handler = () => setIds(getFavorites());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return ids;
}

export const FAVORITES_EVENT = EVENT;
