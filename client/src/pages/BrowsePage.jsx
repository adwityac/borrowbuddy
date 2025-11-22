import React, { useEffect, useState } from "react";
import api from "../lib/api";
import CategoryFilterBar from "../components/CategoryFilterBar";
import ItemGrid from "../components/ItemGrid";

export default function BrowsePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await api.get("/items");   // ← GET /api/items
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load items", err);
      }
    }
    loadItems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Browse Items</h1>

      <CategoryFilterBar />

      <div className="mt-6">
        <ItemGrid items={items} />
      </div>
    </div>
  );
}
