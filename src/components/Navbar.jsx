import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getUnreadCount } from "../api/notifications";

export default function Navbar() {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      getUnreadCount()
        .then((res) => setUnreadCount(res.data.count))
        .catch(() => {});
    }
  }, [user]);

  return (
    <nav className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/products" className="font-semibold text-lg">
        SuperMart
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {isOwner && (
          <Link to="/owner" className="text-gray-700 hover:text-black">
            Dashboard
          </Link>
        )}

        {user ? (
          <>
            <span className="text-gray-500">{user.username}</span>

            <Link to="/cart" className="text-gray-500">
              Cart
            </Link>

            <Link to="/orders" className="text-gray-500">
              Orders
            </Link>

            {/* ✅ ONLY NAVIGATION NOW */}
            <Link
              to="/notifications"
              className="text-gray-500 relative hover:text-black"
            >
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-black"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-black">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-black">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}