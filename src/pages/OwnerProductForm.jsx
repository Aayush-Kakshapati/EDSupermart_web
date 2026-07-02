import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "../api/products";
import { CATEGORIES } from "../constants/constants";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "other",
  image_url: "",
};

export default function OwnerProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getProduct(id)
      .then((res) => {
        const { name, description, price, stock, category, image_url } = res.data;
        setForm({ name, description, price, stock, category, image_url });
      })
      .catch(() => setError("Could not load product"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/owner");
    } catch (err) {
      const data = err.response?.data;
      setError(
        data ? Object.values(data).flat().join(" ") : "Could not save product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500 px-6 py-8">Loading...</p>;

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">
        {isEdit ? "Edit Product" : "New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          rows={3}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          name="image_url"
          placeholder="Image URL (optional)"
          value={form.image_url}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white rounded px-3 py-2 text-sm mt-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </form>
    </div>
  );
}