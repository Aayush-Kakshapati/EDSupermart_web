import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="border border-gray-200 rounded p-4 flex flex-col gap-1 hover:border-gray-400 transition"
    >
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}
      <span className="font-medium">{product.name}</span>
      <span className="text-sm text-gray-500 capitalize">{product.category}</span>
      <div className="flex items-center justify-between mt-1">
        <span className="font-semibold">Rs.{product.price}</span>
        <span className="text-xs text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>
    </Link>
  );
}