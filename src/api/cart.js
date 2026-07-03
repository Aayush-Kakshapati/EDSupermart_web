import api from "./axios";

export const getCart = () => api.get('/cart/')

export const addCartItems = (id, quantity = 1) => api.post('/cart/items/' ,{product: id, quantity})

export const deleteCartItem = (id) => api.delete(`/cart/items/${id}/`)