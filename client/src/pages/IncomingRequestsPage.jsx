import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function IncomingRequestsPage() {
  const { fetchWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchWithAuth({ url: "/requests/incoming" });
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load incoming requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setError("");
      await fetchWithAuth({
        url: `/requests/${id}/${action}`,
        method: "post",
      });

      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Incoming Requests</h1>
        <p className="text-gray-500">Review borrow requests for items you own.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-soft p-4">{error}</div>}

      {loading ? (
        <p className="text-gray-500">Loading incoming requests...</p>
      ) : !requests.length ? (
        <div className="bg-white border rounded-soft p-8 text-center text-gray-500">No incoming requests.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-4 rounded-soft card-shadow grid gap-4 md:grid-cols-[1fr_140px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-lg">{req.item?.title || "Deleted item"}</h3>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">{req.status}</span>
                </div>
                <p className="text-gray-500">{req.item?.description}</p>
                <p className="mt-2 text-sm">
                  <b>Requester:</b> {req.requester?.name || "Unknown"}
                </p>

                {req.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleAction(req._id, "approve")} className="px-4 py-2 bg-green-600 text-white rounded-md">
                      Approve
                    </button>
                    <button onClick={() => handleAction(req._id, "reject")} className="px-4 py-2 bg-red-500 text-white rounded-md">
                      Reject
                    </button>
                  </div>
                )}

                {req.status === "approved" && (
                  <button onClick={() => handleAction(req._id, "returned")} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
                    Mark returned
                  </button>
                )}
              </div>

              {req.item?.imageUrl && (
                <img src={req.item.imageUrl} className="w-full h-28 rounded-md object-cover" alt={req.item.title} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
