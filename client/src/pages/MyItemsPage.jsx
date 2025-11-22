import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function MyItemsPage() {
  const { fetchWithAuth } = useAuth();

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user's items
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/items");
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Submit new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please choose an image.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageFile); // 👈 important

    try {
      setLoading(true);

      const res = await fetchWithAuth({
        url: "/items",
        method: "post",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newItem = res.data;
      setItems((prev) => [newItem, ...prev]);

      // Reset form
      setTitle("");
      setDescription("");
      setImageFile(null);

    } catch (err) {
      console.error(err);
      alert("Failed to upload item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">My Items</h2>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-soft card-shadow space-y-4"
      >
        <input
          type="text"
          placeholder="Item title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          required
        />

        <textarea
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          rows="3"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full border px-3 py-2 rounded-md"
          required
        />

        <button
          disabled={loading}
          className="px-5 py-2 rounded-full bg-primary text-white"
        >
          {loading ? "Uploading..." : "Add Item"}
        </button>
      </form>

      {/* Item List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-soft card-shadow p-4"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="rounded-md w-full h-48 object-cover"
            />
            <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
