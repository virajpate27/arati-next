import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AARTI_DATA, CATEGORY_DATA } from "@/lib/data/aartis";
import { byCategory, firstLine } from "@/lib/utils";
import AartiCard from "@/components/AartiCard";
import CategoryChips from "@/components/CategoryChips";
import CategoryIcon from "@/components/CategoryIcon";
import HomeSearchBar from "@/components/HomeSearchBar";

export default function HomePage() {
  const featured = AARTI_DATA[0];
  const featuredCategory = byCategory(featured.category);
  const popular = AARTI_DATA.slice(0, 6);

  return (
    <>
      <section className="hero container">
        <p className="eyebrow" data-entrance>
          ॥ श्री गणेशाय नमः ॥
        </p>
        <h1 data-entrance>आरती संग्रहालय</h1>
        <div className="ornament" data-entrance />
        <p className="tagline" data-entrance>
          भक्ती • परंपरा • संस्कृती
        </p>

        <div style={{ marginTop: 30 }} data-entrance>
          <HomeSearchBar />
        </div>
      </section>

      <section className="section container" data-entrance>
        <div className="section-head">
          <h2>आजची आरती</h2>
        </div>
        <article className="featured-card">
          <span className="card-deity">
            <CategoryIcon name={featuredCategory ? featuredCategory.icon : "flower-2"} size={16} />
            {featured.deity}
          </span>
          <h3>{featured.title}</h3>
          <p>{firstLine(featured)}</p>
          <Link className="btn btn-primary" href={`/aarti/${featured.id}`}>
            वाचा
            <ArrowRight size={18} />
          </Link>
        </article>
      </section>

      <section className="section container" data-entrance>
        <div className="section-head">
          <h2>लोकप्रिय आरत्या</h2>
          <Link className="see-all" href="/list">
            सर्व पहा →
          </Link>
        </div>
        <CategoryChips categories={CATEGORY_DATA} />
        <div className="card-grid" style={{ marginTop: 18 }}>
          {popular.map((aarti) => (
            <AartiCard key={aarti.id} aarti={aarti} />
          ))}
        </div>
      </section>
    </>
  );
}
