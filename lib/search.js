import { AARTI_DATA } from "@/lib/data/aartis";
import { byCategory, firstLine } from "@/lib/utils";

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

export function matchesQuery(aarti, query) {
  if (!query) return true;
  const q = normalize(query);
  const cat = byCategory(aarti.category);
  const haystack = [aarti.title, aarti.deity, cat ? cat.label : "", firstLine(aarti)]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

/**
 * runSearch(query, opts)
 * opts: { category, favoritesOnly, favoriteIds, letter, sort }
 */
export function runSearch(query, opts = {}) {
  let results = AARTI_DATA.filter((a) => matchesQuery(a, query));

  if (opts.category) {
    results = results.filter((a) => a.category === opts.category);
  }
  if (opts.favoritesOnly) {
    const favIds = opts.favoriteIds || [];
    results = results.filter((a) => favIds.includes(a.id));
  }
  if (opts.letter) {
    results = results.filter((a) => a.title.trim().startsWith(opts.letter));
  }

  switch (opts.sort) {
    case "az":
      results = [...results].sort((a, b) => a.title.localeCompare(b.title, "mr"));
      break;
    case "verses":
      results = [...results].sort((a, b) => a.verses.length - b.verses.length);
      break;
    default:
      break; // relevance / default: keep data order
  }

  return results;
}
