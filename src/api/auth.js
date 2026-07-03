import api from "./axios";

export const signup = (data) => api.post("/auth/signup/", data);

export const login = (username, password) =>
  api.post("/auth/login/", { username, password });