import apiClient from './client';

// Stats & Analytics
export const getAdminStats = () => apiClient.get('/admin/stats');
export const getAdminAnalytics = () => apiClient.get('/admin/analytics');

// Users
export const getAdminUsers = () => apiClient.get('/admin/users');
export const getAdminUser = (id) => apiClient.get(`/admin/users/${id}`);
export const updateAdminUser = (id, data) => apiClient.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => apiClient.delete(`/admin/users/${id}`);

// Reviews
export const getAdminReviews = () => apiClient.get('/admin/reviews');
export const deleteAdminReview = (productId, reviewId) =>
  apiClient.delete(`/admin/reviews/${productId}/${reviewId}`);

// Orders (pay)
export const markOrderPaid = (id) => apiClient.put(`/admin/orders/${id}/pay`);
