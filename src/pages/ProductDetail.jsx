import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api/products";
import { createOrder } from "../api/orders";
import { addCartItems } from "../api/cart";
import { useAuth } from "../hooks/useAuth";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setMessage("");
    setAddingToCart(true);

    try {
      await addCartItems(Number(id), quantity);
      setMessage("Product added to cart!");
    } catch (err) {
      const data = err.response?.data;
      const detail =
        data?.error ||
        (typeof data === "object" ? Object.values(data).flat()[0] : null);

      setError(detail || "Could not add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuy = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setMessage("");
    setPlacingOrder(true);

    try {
      await createOrder({
        items: [
          {
            product_id: Number(id),
            quantity,
          },
        ],
      });

      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      const data = err.response?.data;
      const detail =
        data?.error ||
        data?.items?.[0] ||
        (typeof data === "object" ? Object.values(data).flat()[0] : null);

      setError(detail || "Could not place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-gray-500 px-6 py-8">
        Loading...
      </p>
    );
  }

  if (error && !product) {
    return (
      <p className="text-sm text-red-600 px-6 py-8">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-56 object-cover rounded mb-4"
        />
      )}

      <h1 className="text-xl font-semibold">{product.name}</h1>

      <p className="text-sm text-gray-500 capitalize mb-2">
        {product.category}
      </p>

      {product.description && (
        <p className="text-sm text-gray-700 mb-4">
          {product.description}
        </p>
      )}

      <p className="font-semibold text-lg mb-1">
        Rs. {product.price}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        {product.stock > 0
          ? `${product.stock} in stock`
          : "Out of stock"}
      </p>

      {product.stock > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm">Quantity</label>

          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
          />
        </div>
      )}

      {message && (
        <p className="text-green-600 text-sm mb-3">
          {message}
        </p>
      )}

      {error && (
        <p className="text-red-600 text-sm mb-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || addingToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
        >
          {addingToCart ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={handleBuy}
          disabled={product.stock <= 0 || placingOrder}
          className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
        >
          {placingOrder
            ? "Placing order..."
            : product.stock <= 0
            ? "Out of stock"
            : "Buy Now"}
        </button>
      </div>
    </div>
  );
}