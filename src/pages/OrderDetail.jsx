import { useEffect, useState } from "react";
import { getOrder, updateOrderStatus, confirmDelivery } from "../api/orders";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadOrder = () => {
    setLoading(true);
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Could not load order"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      loadOrder();
    } catch {
      setError("Could not update status");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!confirm("Confirm that you have received this order?")) return;
    setUpdating(true);
    try {
      await confirmDelivery(id);
      loadOrder();
    } catch {
      setError("Could not confirm delivery");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "confirmed":
        return "text-blue-600 bg-blue-50";
      case "processing":
        return "text-purple-600 bg-purple-50";
      case "shipped":
        return "text-indigo-600 bg-indigo-50";
      case "delivered":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-8"><p className="text-sm text-gray-500">Loading...</p></div>;
  if (error) return <div className="max-w-4xl mx-auto px-6 py-8"><p className="text-sm text-red-600">{error}</p></div>;
  if (!order) return <div className="max-w-4xl mx-auto px-6 py-8"><p className="text-sm text-gray-500">Order not found.</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600 hover:text-gray-800 mb-4"
      >
        ← Back
      </button>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Order #{order.id}</h1>
          <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Order Date</p>
            <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{order.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{order.address || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-medium">{order.phone || "Not provided"}</p>
          </div>
        </div>
      </div>

      {user?.role === "owner" && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Update Status</h2>
          <div className="flex gap-2 flex-wrap">
            {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={updating || order.status === status}
                className={`px-4 py-2 rounded text-sm capitalize ${
                  order.status === status
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                } disabled:opacity-50`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {user?.role !== "owner" && order.status === "shipped" && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Confirm Delivery</h2>
          <button
            onClick={handleConfirmDelivery}
            disabled={updating}
            className="bg-green-600 text-white rounded px-4 py-2 text-sm disabled:opacity-50 hover:bg-green-700"
          >
            {updating ? "Confirming..." : "Confirm I Received This Order"}
          </button>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="font-semibold mb-4">Order Items</h2>
        <div className="flex flex-col divide-y divide-gray-200">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} · Rs. {item.price} each
                </p>
              </div>
              <p className="font-semibold">
                Rs. {(Number(item.quantity) * Number(item.price)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-end">
          <p className="font-semibold text-lg">
            Total: Rs. {Number(order.total_amount).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
