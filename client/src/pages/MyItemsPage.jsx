import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  description: "",
  imageFile: null,
};

export default function MyItemsPage() {
  const { user, fetchWithAuth } = useAuth();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", availability: "available" });
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeItems = useMemo(
    () => items.filter((item) => item.availability !== "borrowed").length,
    [items]
  );

  const loadItems = async () => {
    try {
      setItemsLoading(true);
      setError("");
      const res = await fetchWithAuth({ url: "/items/mine" });
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your items.");
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageFile) {
      setError("Please choose an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("image", form.imageFile);

    try {
      setLoading(true);
      setError("");

      const res = await fetchWithAuth({
        url: "/items",
        method: "post",
        data: formData,
      });

      setItems((prev) => [res.data, ...prev]);
      setForm(emptyForm);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload item.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      title: item.title,
      description: item.description,
      availability: item.availability || "available",
    });
  };

  const saveEdit = async (itemId) => {
    try {
      setError("");
      const res = await fetchWithAuth({
        url: `/items/${itemId}`,
        method: "put",
        data: editForm,
      });

      setItems((prev) => prev.map((item) => item._id === itemId ? res.data : item));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item.");
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm("Delete this item and its related requests?")) return;

    try {
      setError("");
      await fetchWithAuth({ url: `/items/${itemId}`, method: "delete" });
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Items</h1>
          <p className="text-gray-500">Manage what you are lending as {user?.name}.</p>
        </div>
        <div className="text-sm text-gray-500">
          {items.length} listed, {activeItems} not borrowed
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-soft p-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-soft card-shadow grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Item title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full border px-3 py-2 rounded-md"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }))}
          className="w-full border px-3 py-2 rounded-md"
          required
        />

        <textarea
          placeholder="Item description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full border px-3 py-2 rounded-md md:col-span-2"
          rows="3"
          required
        />

        <button disabled={loading} className="px-5 py-2 rounded-full bg-primary text-white md:w-fit disabled:opacity-60">
          {loading ? "Uploading..." : "Add Item"}
        </button>
      </form>

      <div className="mt-8">
        {itemsLoading ? (
          <p className="text-gray-500">Loading your items...</p>
        ) : !items.length ? (
          <div className="bg-white border rounded-soft p-8 text-center text-gray-500">
            You have not added any items yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-soft card-shadow p-4">
                <img src={item.imageUrl} alt={item.title} className="rounded-md w-full h-48 object-cover" />

                {editingId === item._id ? (
                  <div className="mt-4 space-y-3">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full border px-3 py-2 rounded-md"
                      rows="3"
                    />
                    <select
                      value={editForm.availability}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, availability: e.target.value }))}
                      className="w-full border px-3 py-2 rounded-md"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="borrowed">Borrowed</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(item._id)} className="px-4 py-2 bg-primary text-white rounded-md">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 border rounded-md">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="mt-2 text-sm capitalize text-gray-500">Status: {item.availability}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link to={`/item/${item._id}`} className="px-4 py-2 border rounded-md text-sm">View</Link>
                      <button onClick={() => startEdit(item)} className="px-4 py-2 border rounded-md text-sm">Edit</button>
                      <button onClick={() => deleteItem(item._id)} className="px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
