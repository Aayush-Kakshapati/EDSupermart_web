import api from "./axios";

export const getProducts = () => api.get("/products/products/");

export const getProduct = (id) => api.get(`/products/products/${id}/`);

export const createProduct = (data) =>
  api.post("/products/products/create/", data);

export const updateProduct = (id, data) =>
  api.patch(`/products/products/${id}/update/`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/products/${id}/delete/`);

export const buyProduct = (id, quantity) =>
  api.post(`/products/products/${id}/buy/`, { quantity });