import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyRequestsPage() {
  const { fetchWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchWithAuth({ url: "/requests/mine" });
      setRequests(res.data);
    })();
  }, []);

  if (!requests.length) return <p className="p-6">You haven’t requested any items.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Requests</h1>

      {requests.map((req) => (
        <div
          key={req._id}
          className="bg-white p-5 rounded-lg shadow mb-4"
        >
          <h2 className="text-xl font-semibold">{req.item.title}</h2>
          <p className="text-gray-600">{req.item.description}</p>
          <p className="mt-2">
            <b>Status:</b> {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
          </p>
        </div>
      ))}
    </div>
  );
}
