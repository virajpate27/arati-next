"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/list?q=${encodeURIComponent(query)}` : "/list");
  }

  return (
    <form className="search-bar" role="search" aria-label="आरती शोधा" onSubmit={handleSubmit}>
      <Search className="search-icon" size={20} aria-hidden="true" />
      <label htmlFor="home-search-input" className="visually-hidden">
        आरती शोधा
      </label>
      <input
        id="home-search-input"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="आरती शोधा..."
        autoComplete="off"
      />
    </form>
  );
}
