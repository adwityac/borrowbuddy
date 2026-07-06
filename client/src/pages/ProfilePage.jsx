import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, fetchWithAuth } = useAuth();
  const [profile, setProfile] = useState(user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const [profileRes, notificationRes] = await Promise.all([
        fetchWithAuth({ url: "/me" }),
        fetchWithAuth({ url: "/notifications" }),
      ]);
      setProfile(profileRes.data);
      setNotifications(notificationRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const markAllRead = async () => {
    await fetchWithAuth({ url: "/notifications/read-all", method: "post" });
    setNotifications((prev) => prev.map((item) => ({ ...item, seen: true, read: true })));
  };

  const clearNotifications = async () => {
    await fetchWithAuth({ url: "/notifications/clear", method: "delete" });
    setNotifications([]);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-soft p-4">{error}</div>}

      <div className="bg-white p-6 rounded-soft card-shadow flex flex-col gap-6 md:flex-row md:items-center">
        <div className="w-24 h-24 rounded-full bg-green-100 text-primary flex items-center justify-center text-3xl font-bold">
          {profile?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile?.name}</h1>
          <p className="text-gray-500">{profile?.email}</p>
          <p className="mt-2 text-sm capitalize text-gray-500">Role: {profile?.role}</p>
          {profile?.createdAt && (
            <p className="text-sm text-gray-500">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-gray-500">Updates about your borrow requests.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={markAllRead} className="px-4 py-2 border rounded-md text-sm">Mark all read</button>
            <button onClick={clearNotifications} className="px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm">Clear</button>
          </div>
        </div>

        {!notifications.length ? (
          <div className="bg-white border rounded-soft p-8 text-center text-gray-500">No notifications yet.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification._id} className="bg-white rounded-soft card-shadow p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.seen && <span className="rounded-full bg-green-100 text-primary px-3 py-1 text-xs">New</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
