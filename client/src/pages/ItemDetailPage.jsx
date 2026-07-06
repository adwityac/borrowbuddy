import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const { user, fetchWithAuth } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/items/${itemId}`);
        setItem(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load item.");
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId]);

  const requestItem = async () => {
    try {
      setRequesting(true);
      setError("");
      setMessage("");

      await fetchWithAuth({
        url: `/requests/${itemId}`,
        method: "post",
      });

      setMessage("Request sent. The owner will see it in their incoming requests.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not request item.");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading item...</p>;
  if (error && !item) return <div className="max-w-3xl mx-auto p-6 text-red-700">{error}</div>;
  if (!item) return <p className="p-6">Item not found.</p>;

  const ownerId = item.owner?._id || item.owner;
  const isOwner = ownerId === user?.userId || ownerId === user?.id;
  const isAvailable = item.availability === "available";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {message && <div className="mb-4 bg-green-50 border border-green-100 text-green-700 rounded-soft p-4">{message}</div>}
      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-soft p-4">{error}</div>}

      <div className="bg-white rounded-soft card-shadow overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-80 object-cover" />

        <div className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <p className="text-gray-600 mt-2">{item.description}</p>
              {item.ownerInfo?.name && (
                <p className="text-sm text-gray-500 mt-3">Shared by {item.ownerInfo.name}</p>
              )}
            </div>
            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-700">
              {item.availability}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {isOwner ? (
              <>
                <p className="text-gray-500">You own this item.</p>
                <Link to="/items" className="px-4 py-2 border rounded-md">Manage item</Link>
              </>
            ) : (
              <button
                onClick={requestItem}
                disabled={requesting || !isAvailable}
                className="px-5 py-2 bg-primary text-white rounded-md disabled:opacity-50"
              >
                {requesting ? "Sending..." : isAvailable ? "Request Item" : "Not available"}
              </button>
            )}
            <Link to="/browse" className="px-5 py-2 border rounded-md">Back to Browse</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
