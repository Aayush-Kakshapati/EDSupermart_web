import api from "./axios";

export const getProducts = () => api.get("/products/");

export const getProduct = (id) => api.get(`/products/${id}/`);

export const createProduct = (data) =>
  api.post("/products/create/", data);

export const updateProduct = (id, data) =>
  api.patch(`/products/${id}/update/`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}/delete/`);

export const buyProduct = (id, quantity) =>
  api.post(`/products/${id}/buy/`, { quantity });