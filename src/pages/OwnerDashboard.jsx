import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/products";

export default function OwnerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError("Could not load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Manage Products</h1>
        <Link
          to="/owner/products/new"
          className="bg-black text-white rounded px-3 py-2 text-sm"
        >
          + New Product
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && products.length === 0 && (
        <p className="text-sm text-gray-500">No products yet.</p>
      )}

      <div className="flex flex-col divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">
                ${product.price} · {product.stock} in stock · {product.category}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link
                to={`/owner/products/${product.id}/edit`}
                className="text-gray-700 hover:text-black"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                disabled={deletingId === product.id}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deletingId === product.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}