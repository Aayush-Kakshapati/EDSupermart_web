import { useState } from "react";
import * as authApi from "../api/auth";

import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    persistSession(res.data);
    return res.data.user;
  };

  const signup = async (formData) => {
    const res = await authApi.signup(formData);
    persistSession(res.data);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isOwner = user?.role === "owner";

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
}