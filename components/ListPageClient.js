"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, SearchX } from "lucide-react";
import { AARTI_DATA, CATEGORY_DATA } from "@/lib/data/aartis";
import { runSearch } from "@/lib/search";
import { useFavoriteIds } from "@/lib/hooks/useFavorite";
import AartiCard from "@/components/AartiCard";
import CategoryChips from "@/components/CategoryChips";

export default function ListPageClient() {
  const params = useSearchParams();
  const categoryFromParams = params.get("category") || "";

  const [q, setQ] = useState(params.get("q") || "");
  const [letter, setLetter] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState("relevance");
  const favoriteIds = useFavoriteIds();

  // Keep the search box synced if the person arrives with a new ?q=
  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  const letters = useMemo(
    () => Array.from(new Set(AARTI_DATA.map((a) => a.title.trim()[0]))).sort((a, b) => a.localeCompare(b, "mr")),
    []
  );

  const results = useMemo(
    () =>
      runSearch(q, {
        category: categoryFromParams,
        favoritesOnly,
        favoriteIds,
        letter,
        sort,
      }),
    [q, categoryFromParams, favoritesOnly, favoriteIds, letter, sort]
  );

  return (
    <div className="container">
      <header className="page-header" data-entrance>
        <h1>सर्व आरत्या</h1>
        <p>शीर्षक, देवता किंवा श्रेणीनुसार शोधा</p>
      </header>

      <div style={{ margin: "22px 0" }} data-entrance>
        <div className="search-bar">
          <Search className="search-icon" size={20} aria-hidden="true" />
          <label htmlFor="list-search-input" className="visually-hidden">
            आरती शोधा
          </label>
          <input
            id="list-search-input"
            type="search"
            placeholder="आरती शोधा..."
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button type="button" className="clear-btn show" aria-label="शोध पुसा" onClick={() => setQ("")}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div data-entrance style={{ marginBottom: 18 }}>
        <CategoryChips categories={CATEGORY_DATA} activeId={categoryFromParams} />
      </div>

      <div className="alpha-row" data-entrance>
        <button className={`alpha-chip ${letter === "" ? "is-active" : ""}`} onClick={() => setLetter("")}>
          सर्व
        </button>
        {letters.map((l) => (
          <button key={l} className={`alpha-chip ${letter === l ? "is-active" : ""}`} onClick={() => setLetter(l)}>
            {l}
          </button>
        ))}
      </div>

      <div className="filter-bar" data-entrance>
        <div className="filter-row">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
            />
            फक्त आवडत्या
          </label>
          <select className="sort-select" aria-label="क्रमवारी" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">प्रासंगिकता</option>
            <option value="az">अ ते ज्ञ</option>
            <option value="verses">कडव्यांनुसार</option>
          </select>
        </div>
        <p className="result-count">{results.length} आरत्या सापडल्या</p>
      </div>

      <div className="card-grid" data-entrance>
        {results.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <SearchX />
            <p>तुमच्या शोधाशी जुळणारी आरती सापडली नाही.</p>
          </div>
        ) : (
          results.map((aarti) => <AartiCard key={aarti.id} aarti={aarti} />)
        )}
      </div>
    </div>
  );
}
