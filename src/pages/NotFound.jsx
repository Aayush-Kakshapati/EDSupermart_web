import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <h1 className="text-xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-4">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/products" className="text-black underline text-sm">
        Back to products
      </Link>
    </div>
  );
}