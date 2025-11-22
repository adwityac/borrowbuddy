import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const { user, fetchWithAuth } = useAuth();

  const [item, setItem] = useState(null);
  const [requesting, setRequesting] = useState(false);

  // Load item details
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/items/${itemId}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [itemId]);

  // Request an item
  const requestItem = async () => {
    try {
      setRequesting(true);

      await fetchWithAuth({
        url: `/requests/${itemId}`,
        method: "post",
      });

      alert("Request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Could not request item.");
    } finally {
      setRequesting(false);
    }
  };

  if (!item) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-72 object-cover rounded-lg"
      />

      <h1 className="text-3xl font-bold mt-4">{item.title}</h1>
      <p className="text-gray-600 mt-2">{item.description}</p>

      {/* Request Button */}
      {item.owner === user?.userId ? (
        <p className="mt-4 text-gray-500">You own this item.</p>
      ) : (
        <button
          onClick={requestItem}
          disabled={requesting}
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-md"
        >
          {requesting ? "Sending..." : "Request Item"}
        </button>
      )}
    </div>
  );
}
