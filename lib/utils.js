import { CATEGORY_DATA, AARTI_DATA } from "@/lib/data/aartis";

export function byCategory(id) {
  return CATEGORY_DATA.find((c) => c.id === id);
}

export function findAarti(id) {
  return AARTI_DATA.find((a) => a.id === id);
}

// First line of an aarti's opening verse — used on cards.
export function firstLine(aarti) {
  return aarti.description || (aarti.verses[0] && aarti.verses[0].text.split("\n")[0]);
}
