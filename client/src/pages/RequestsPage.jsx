import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RequestsPage() {
  const { fetchWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithAuth({
          url: "/requests/mine",
          method: "get",
        });

        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  if (!requests.length)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">My Requests</h2>
        <p>You haven't requested any items yet.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">My Requests</h2>

      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r._id} className="rounded-soft card-shadow p-4 bg-white">
            <h3 className="font-bold text-lg">{r.item?.title}</h3>
            <p className="text-gray-600">{r.item?.description}</p>
            <p className="mt-2 text-sm">
              Status:{" "}
              <span className="font-semibold capitalize">{r.status}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
