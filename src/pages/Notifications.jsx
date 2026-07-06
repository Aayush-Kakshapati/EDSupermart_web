import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../api/notifications";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch {
      setError("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      setError("Could not mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch {
      setError("Could not mark all as read");
    }
  };

  const handleClick = (n) => {
    if (!n.is_read) handleMarkAsRead(n.id);

    if (n.order_id) {
      navigate(`/orders/${n.order_id}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Notifications</h1>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className={`p-4 border rounded cursor-pointer ${
              n.is_read ? "opacity-60" : "bg-gray-50"
            }`}
          >
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-gray-600">{n.message}</p>

            {!n.is_read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(n.id);
                }}
                className="text-xs text-blue-600 mt-2"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}