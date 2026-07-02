import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function OwnerRoute({ children }) {
  const { user, isOwner } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isOwner) return <Navigate to="/products" replace />;
  return children;
}