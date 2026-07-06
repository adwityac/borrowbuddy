import React from "react";
import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  const availability = item.availability ?? "available";
  const itemId = item._id || item.id;
  const statusClass = {
    available: "bg-green-500",
    requested: "bg-yellow-400",
    borrowed: "bg-blue-500",
    unavailable: "bg-gray-400",
  }[availability] || "bg-gray-400";

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
      {item.ownerInfo?.name && (
        <p className="mt-1 text-xs text-gray-400">Shared by {item.ownerInfo.name}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-3 h-3 rounded-full ${statusClass}`}></span>
          <span className="capitalize">{availability}</span>
        </div>

     
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
