import apiClient from './client';

export const getProducts = (params = {}) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
  );
  const searchParams = new URLSearchParams(filtered).toString();
  return apiClient.get(`/products${searchParams ? `?${searchParams}` : ''}`);
};

export const getProduct = (id) => apiClient.get(`/products/${id}`);

export const getFeaturedProducts = () =>
  apiClient.get('/products?featured=true');

export const getBrands = () => apiClient.get('/products/brands/list');

export const createProduct = (data) => apiClient.post('/products', data);

export const updateProduct = (id, data) =>
  apiClient.put(`/products/${id}`, data);

export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

export const createReview = (id, data) =>
  apiClient.post(`/products/${id}/reviews`, data);
