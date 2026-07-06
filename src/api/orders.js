import api from "./axios";

export const getOrders = () => api.get("/orders/");

export const getOrder = (id) => api.get(`/orders/${id}/`);

export const createOrder = (data) => api.post("/orders/create/", data);

export const updateOrder = (id, data) => api.patch(`/orders/${id}/update/`, data);

export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status/`, { status });

export const confirmDelivery = (id) => api.post(`/orders/${id}/confirm-delivery/`);

export const deleteOrder = (id) => api.delete(`/orders/${id}/delete/`);
