import { useEffect, useState } from "react";
import { getCart, deleteCartItem } from "../api/cart";
import { createOrder } from "../api/orders";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [message, setMessage] = useState("");

  const loadCart = () => {
    setLoading(true);
    getCart()
      .then((res) => setCartItems(res.data.items ?? []))
      .catch(() => setError("Could not load cart"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this item from cart?")) return;
    setDeletingId(id);
    try {
      await deleteCartItem(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
        setError("Could not remove item");
    
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setError("");
    setMessage("");
    setCheckingOut(true);

    try {
      const items = cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      await createOrder({ items });

      setMessage("Order placed successfully!");
      setCartItems([]);
      setTimeout(() => {
        setMessage("");
        navigate("/orders");
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      const detail =
        data?.error ||
        data?.items?.[0] ||
        (typeof data === "object" ? Object.values(data).flat()[0] : null);
      setError(detail || "Could not place order. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setCheckingOut(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold">Cart Items</h1>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && cartItems.length === 0 && (
        <p className="text-sm text-gray-500">No products in cart.</p>
      )}
      <div className="flex flex-col divide-y divide-gray-200">
        {cartItems.map((cartItem) => (
          <div
            key={cartItem.id}
            className="flex items-center justify-between py-3"
          >
            <div>
              <p className="font-medium">{cartItem.product.name}</p>
              <p className="text-sm text-gray-500">
                Rs. {cartItem.product.price} · Qty: {cartItem.quantity} ·{" "}
                {cartItem.product.stock} in stock
              </p>
            </div>
            <button
              onClick={() => handleDelete(cartItem.id)}
              disabled={deletingId === cartItem.id}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {deletingId === cartItem.id ? "Removing..." : "Remove"}
            </button>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <p className="font-semibold mt-4 mb-2">Total: Rs. {total.toFixed(2)}</p>
      )}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

      {cartItems.length > 0 && (
        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
        >
          {checkingOut ? "Processing..." : "Checkout"}
        </button>
      )}
    </div>
  );
}
