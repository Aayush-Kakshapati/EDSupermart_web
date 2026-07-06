import { useEffect, useState } from "react";
import { getOrders, deleteOrder } from "../api/orders";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError("Could not load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (id) => {
    const order = orders.find((o) => o.id === id);
    if (order.status !== "pending") {
      setError("Can only delete pending orders");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!confirm("Delete this order?")) return;
    setDeletingId(id);
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch {
      setError("Could not delete order");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-blue-600";
      case "processing":
        return "text-purple-600";
      case "shipped":
        return "text-indigo-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">
        {user?.role === "owner" ? "All Orders" : "My Orders"}
      </h1>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && orders.length === 0 && (
        <p className="text-sm text-gray-500">No orders found.</p>
      )}
      <div className="flex flex-col divide-y divide-gray-200">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <p className="font-medium">Order #{order.id}</p>
                <span className={`text-sm capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()} ·{" "}
                {order.order_items.length} items
              </p>
              <p className="font-semibold mt-1">Rs. {Number(order.total_amount).toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Details
              </button>
              {order.status === "pending" && user?.role !== "owner" && (
                <button
                  onClick={() => handleDelete(order.id)}
                  disabled={deletingId === order.id}
                  className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                >
                  {deletingId === order.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
