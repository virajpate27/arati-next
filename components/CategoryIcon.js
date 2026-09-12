import { ICON_MAP } from "@/lib/icon-map";

export default function CategoryIcon({ name, size = 18 }) {
  const Icon = ICON_MAP[name] || ICON_MAP["flower-2"];
  return <Icon size={size} aria-hidden="true" />;
}
