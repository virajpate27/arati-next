import { CATEGORY_DATA } from "@/lib/data/aartis";
import CategoryGrid from "@/components/CategoryGrid";

export const metadata = {
  title: "श्रेणी — आरती संग्रहालय",
};

export default function CategoriesPage() {
  return (
    <>
      <div className="container">
        <header className="page-header" data-entrance>
          <h1>आरती श्रेणी</h1>
          <p>देवतेनुसार आरत्या शोधा</p>
        </header>
      </div>

      <section className="section container" data-entrance>
        <CategoryGrid categories={CATEGORY_DATA} />
      </section>
    </>
  );
}
