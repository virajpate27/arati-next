"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useFavorite } from "@/lib/hooks/useFavorite";
import { firstLine } from "@/lib/utils";

export default function AartiCard({ aarti }) {
  const { isFav, toggle } = useFavorite(aarti.id);

  return (
    <article className="aarti-card" data-entrance>
      <Link
        href={`/aarti/${aarti.id}`}
        className="card-top-link"
        style={{ display: "block", textDecoration: "none", color: "inherit" }}
      >
        <div className="card-top">
          <div>
            <span className="card-deity">{aarti.deity}</span>
            <h3>{aarti.title}</h3>
          </div>
        </div>
        <p className="card-line">{firstLine(aarti)}</p>
      </Link>
      <div className="card-meta">
        <span className="verse-count">कडवे: {aarti.verses.length}</span>
        <div className="card-actions">
          <button
            className={`fav-btn ${isFav ? "is-active" : ""}`}
            onClick={toggle}
            aria-label="आवडती चिन्हांकित करा"
            aria-pressed={isFav}
          >
            <Heart size={20} fill={isFav ? "currentColor" : "none"} />
          </button>
          <Link className="read-link" href={`/aarti/${aarti.id}`}>
            वाचा
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
