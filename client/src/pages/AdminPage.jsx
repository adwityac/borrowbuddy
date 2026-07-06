import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user, fetchWithAuth } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdmin = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsRes, usersRes, itemsRes, requestsRes] = await Promise.all([
        fetchWithAuth({ url: "/admin/stats" }),
        fetchWithAuth({ url: "/admin/users" }),
        fetchWithAuth({ url: "/admin/items" }),
        fetchWithAuth({ url: "/admin/requests" }),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const setUserBan = async (id, banned) => {
    try {
      await fetchWithAuth({ url: `/admin/users/${id}/${banned ? "ban" : "unban"}`, method: "post" });
      loadAdmin();
    } catch (err) {
      setError(err.response?.data?.message || "User action failed.");
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;

    try {
      await fetchWithAuth({ url: `/admin/items/${id}`, method: "delete" });
      loadAdmin();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  };

  if (user?.role !== "admin") {
    return <div className="max-w-4xl mx-auto p-6 text-red-700">Admin access only.</div>;
  }

  if (loading) return <p className="p-6 text-gray-500">Loading admin panel...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-500">Moderate users, items, and borrowing activity.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-soft p-4">{error}</div>}

      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Users" value={stats.users} />
          <Stat label="Items" value={stats.items} />
          <Stat label="Requests" value={stats.requests} />
          <Stat label="Pending" value={stats.pendingRequests} />
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-3">Users</h2>
        <div className="bg-white rounded-soft card-shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3 capitalize">{item.role}</td>
                  <td className="p-3">
                    {item.role === "banned" ? (
                      <button onClick={() => setUserBan(item._id, false)} className="px-3 py-1 border rounded-md">Unban</button>
                    ) : (
                      <button onClick={() => setUserBan(item._id, true)} className="px-3 py-1 bg-red-50 text-red-700 rounded-md">Ban</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold mb-3">Items</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-soft card-shadow p-4 flex justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">Owner: {item.owner?.name || "Unknown"}</p>
                  <p className="text-sm text-gray-500 capitalize">Status: {item.availability}</p>
                </div>
                <button onClick={() => deleteItem(item._id)} className="h-fit px-3 py-1 bg-red-50 text-red-700 rounded-md">Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Requests</h2>
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-soft card-shadow p-4">
                <h3 className="font-semibold">{request.item?.title || "Deleted item"}</h3>
                <p className="text-sm text-gray-500">Requester: {request.requester?.name || "Unknown"}</p>
                <p className="text-sm text-gray-500">Owner: {request.owner?.name || "Unknown"}</p>
                <p className="text-sm text-gray-500 capitalize">Status: {request.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-soft card-shadow p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
