import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ ...form, role: "customer" });
      navigate("/products");
    } catch (err) {
      const data = err.response?.data;
      setError(
        data ? Object.values(data).flat().join(" ") : "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 px-6">
      <h1 className="text-xl font-semibold mb-6">Sign up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <input
          name="phone"
          placeholder="Phone (e.g. +977 98013456789)"
          value={form.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-3 py-2 text-sm mt-2 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-black underline">
          Log in
        </Link>
      </p>
    </div>
  );
}