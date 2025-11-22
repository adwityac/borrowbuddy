import React from "react";
import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  // Support mock items (which might not have availability)
  const isAvailable = item.availability ?? "available";

  // Some mock items might use `id` instead of `_id`
  const itemId = item._id || item.id;

  return (
    <div className="bg-white rounded-soft p-4 card-shadow hover:shadow-lg transition-all">
      <div className="h-44 rounded-md overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="mt-3 font-semibold text-lg">{item.title}</h3>
      <p className="text-sm text-gray-500 truncate">{item.description}</p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-3 h-3 rounded-full ${
              isAvailable === "available"
                ? "bg-green-500"
                : "bg-yellow-400"
            }`}
          ></span>
          <span>{isAvailable}</span>
        </div>

        {/* Only show "View" for real DB items */}
        {itemId && (
          <Link
            to={`/item/${itemId}`}
            className="text-primary text-sm font-medium"
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
}
