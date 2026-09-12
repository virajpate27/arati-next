"use client";

import { useMemo, useState } from "react";
import { AARTI_DATA } from "@/lib/data/aartis";
import { useFavoriteIds } from "@/lib/hooks/useFavorite";
import { useRecentIds } from "@/lib/hooks/useRecent";
import AartiCard from "@/components/AartiCard";

export default function FavoritesClient() {
  const [tab, setTab] = useState("favorites");
  const favIds = useFavoriteIds();
  const recentIds = useRecentIds();

  const list = useMemo(() => {
    const ids = tab === "favorites" ? favIds : recentIds;
    return ids.map((id) => AARTI_DATA.find((a) => a.id === id)).filter(Boolean);
  }, [tab, favIds, recentIds]);

  const emptyMsg =
    tab === "favorites"
      ? "अजून कोणतीही आरती आवडती म्हणून चिन्हांकित केलेली नाही."
      : "अजून कोणतीही आरती वाचलेली नाही.";

  return (
    <div className="container">
      <header className="page-header" data-entrance>
        <h1>माझ्या आवडत्या आरत्या</h1>
        <p>तुम्ही जतन केलेल्या आणि अलीकडे वाचलेल्या आरत्या</p>
      </header>

      <div className="tabs" data-entrance style={{ marginTop: 22 }}>
        <button className={`tab-btn ${tab === "favorites" ? "is-active" : ""}`} onClick={() => setTab("favorites")}>
          आवडत्या
        </button>
        <button className={`tab-btn ${tab === "recent" ? "is-active" : ""}`} onClick={() => setTab("recent")}>
          अलीकडे वाचलेल्या
        </button>
      </div>

      <div className="card-grid" data-entrance>
        {list.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <p>{emptyMsg}</p>
          </div>
        ) : (
          list.map((aarti) => <AartiCard key={aarti.id} aarti={aarti} />)
        )}
      </div>
    </div>
  );
}
