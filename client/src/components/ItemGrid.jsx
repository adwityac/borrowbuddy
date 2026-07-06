import React from "react";
import ItemCard from "./ItemCard";

export default function ItemGrid({ items }) {
  if (!items.length) {
    return (
      <div className="bg-white border rounded-soft p-8 text-center text-gray-500">
        No items found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}
