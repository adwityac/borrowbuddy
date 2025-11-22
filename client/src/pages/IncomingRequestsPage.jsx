import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function IncomingRequestsPage() {
  const { fetchWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const res = await fetchWithAuth({ url: "/requests/incoming" });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await fetchWithAuth({
        url: `/requests/${id}/${action}`,
        method: "post",
      });

      loadRequests(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  if (requests.length === 0)
    return <p className="p-6">No incoming requests.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Incoming Requests</h2>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white p-4 rounded-md shadow-sm flex justify-between"
          >
            <div>
              <h3 className="font-bold">{req.item.title}</h3>
              <p className="text-gray-500">{req.item.description}</p>
              <p>
                <b>Requester:</b> {req.requester.name}
              </p>
              <p>
                <b>Status:</b> {req.status}
              </p>

              {req.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAction(req._id, "approve")}
                    className="px-4 py-1 bg-green-600 text-white rounded-md"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="px-4 py-1 bg-red-500 text-white rounded-md"
                  >
                    Reject
                  </button>
                </div>
              )}

              {req.status === "approved" && (
                <p className="text-green-600 mt-2 font-semibold">
                  ✔ Approved — waiting return
                </p>
              )}

              {req.status === "rejected" && (
                <p className="text-red-600 mt-2 font-semibold">
                  ✖ Rejected
                </p>
              )}
            </div>

            <img
              src={req.item.imageUrl}
              className="w-32 h-24 rounded-md object-cover"
              alt="item"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
