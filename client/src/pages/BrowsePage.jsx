import React, { useEffect, useState } from "react";
import api from "../lib/api";
import CategoryFilterBar from "../components/CategoryFilterBar";
import ItemGrid from "../components/ItemGrid";

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/items");   
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load items", err);
        setError("Could not load items.");
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const visibleItems = items
    .filter((item) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term ||
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.ownerInfo?.name?.toLowerCase().includes(term);
      const matchesAvailability = availability === "all" || item.availability === availability;
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Items</h1>
          <p className="text-gray-500">Find available things shared by your community.</p>
        </div>
        <span className="text-sm text-gray-500">{visibleItems.length} item{visibleItems.length === 1 ? "" : "s"}</span>
      </div>

      <CategoryFilterBar
        search={search}
        onSearchChange={setSearch}
        availability={availability}
        onAvailabilityChange={setAvailability}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading items...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-soft p-4">{error}</div>
        ) : (
          <ItemGrid items={visibleItems} />
        )}
      </div>
    </div>
  );
}
