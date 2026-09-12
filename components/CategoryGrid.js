import Link from "next/link";
import { AARTI_DATA } from "@/lib/data/aartis";
import CategoryIcon from "@/components/CategoryIcon";

export default function CategoryGrid({ categories }) {
  return (
    <div className="category-grid">
      {categories.map((cat) => {
        const count = AARTI_DATA.filter((a) => a.category === cat.id).length;
        return (
          <Link key={cat.id} href={`/list?category=${cat.id}`} className="category-tile" data-entrance>
            <span className="tile-icon">
              <CategoryIcon name={cat.icon} size={20} />
            </span>
            <h3>{cat.label}</h3>
            <span className="tile-count">{count} आरत्या</span>
          </Link>
        );
      })}
    </div>
  );
}
