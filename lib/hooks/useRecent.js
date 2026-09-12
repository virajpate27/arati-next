"use client";

import { useState } from "react";
import { getRecent } from "@/lib/storage";

// Recent ids only change when a reading page is visited (a full route
// navigation elsewhere), so a fresh read on mount is enough — no need
// for the event-bus pattern used by favorites.
export function useRecentIds() {
  const [ids] = useState(() => getRecent());
  return ids;
}
