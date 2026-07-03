import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            <Link to='/cart' className="text-gray-500">Cart</Link>
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