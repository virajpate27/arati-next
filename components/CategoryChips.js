import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";

export default function CategoryChips({ categories, activeId }) {
  return (
    <div className="chip-row">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/list?category=${cat.id}`}
          className={`chip ${cat.id === activeId ? "is-active" : ""}`}
        >
          <CategoryIcon name={cat.icon} size={16} />
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
