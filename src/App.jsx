import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import OwnerRoute from "./routes/OwnerRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerProductForm from "./pages/OwnerProductForm";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route
          path="/owner"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/products/new"
          element={
            <OwnerRoute>
              <OwnerProductForm />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/products/:id/edit"
          element={
            <OwnerRoute>
              <OwnerProductForm />
            </OwnerRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}