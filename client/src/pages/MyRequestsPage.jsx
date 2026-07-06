import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyRequestsPage() {
  const { fetchWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchWithAuth({ url: "/requests/mine" });
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const cancelRequest = async (requestId) => {
    try {
      setError("");
      await fetchWithAuth({ url: `/requests/${requestId}`, method: "delete" });
      setRequests((prev) => prev.filter((request) => request._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel request.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Requests</h1>
        <p className="text-gray-500">Track the items you have asked to borrow.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-soft p-4">{error}</div>}

      {loading ? (
        <p className="text-gray-500">Loading your requests...</p>
      ) : !requests.length ? (
        <div className="bg-white border rounded-soft p-8 text-center text-gray-500">You have not requested any items yet.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-5 rounded-soft card-shadow grid gap-4 md:grid-cols-[1fr_120px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{req.item?.title || "Deleted item"}</h2>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">{req.status}</span>
                </div>
                <p className="text-gray-600">{req.item?.description}</p>
                <p className="mt-2 text-sm text-gray-500">Owner: {req.owner?.name || "Unknown"}</p>
                <div className="mt-4 flex gap-2">
                  {req.item?._id && <Link to={`/item/${req.item._id}`} className="px-4 py-2 border rounded-md text-sm">View item</Link>}
                  {req.status === "pending" && (
                    <button onClick={() => cancelRequest(req._id)} className="px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm">
                      Cancel request
                    </button>
                  )}
                </div>
              </div>
              {req.item?.imageUrl && <img src={req.item.imageUrl} alt={req.item.title} className="w-full h-24 rounded-md object-cover" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
