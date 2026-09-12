import {
  Flower2,
  Sparkles,
  MoonStar,
  Sun,
  Flame,
  Flower,
  Wind,
  Flag,
  Feather,
  BookOpen,
} from "lucide-react";

// Maps the plain string icon ids stored in lib/data/aartis.js to an
// actual lucide-react component. Keeping the data file framework-agnostic
// (plain strings) means it can still be reused outside of React if needed.
export const ICON_MAP = {
  "flower-2": Flower2,
  sparkles: Sparkles,
  "moon-star": MoonStar,
  sun: Sun,
  flame: Flame,
  flower: Flower,
  wind: Wind,
  "bow-arrow": Flag,
  feather: Feather,
  "book-open": BookOpen,
};
