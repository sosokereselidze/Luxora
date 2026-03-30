import apiClient from './client';

export const createOrder = (orderData) =>
  apiClient.post('/orders', orderData);

export const getMyOrders = () => apiClient.get('/orders/my');

export const getOrder = (id) => apiClient.get(`/orders/${id}`);

export const getAllOrders = () => apiClient.get('/orders');

export const updateOrderStatus = (id, status) =>
  apiClient.put(`/orders/${id}/status`, { status });
