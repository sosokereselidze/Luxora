import apiClient from './client';

export const searchFragrances = (search, limit = 10) =>
  apiClient.get(`/fragrances/search?search=${encodeURIComponent(search)}&limit=${limit}`);

export const getSimilarFragrances = (name, limit = 10) =>
  apiClient.get(`/fragrances/similar?name=${encodeURIComponent(name)}&limit=${limit}`);

export const matchFragrances = (params = {}) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
  );
  const searchParams = new URLSearchParams(filtered).toString();
  return apiClient.get(`/fragrances/match${searchParams ? `?${searchParams}` : ''}`);
};

export const getBrandFragrances = (brandName, limit = 10) =>
  apiClient.get(`/fragrances/brand/${encodeURIComponent(brandName)}?limit=${limit}`);

export const searchNotes = (search, limit = 10) =>
  apiClient.get(`/fragrances/notes?search=${encodeURIComponent(search)}&limit=${limit}`);

export const searchAccords = (search, limit = 10) =>
  apiClient.get(`/fragrances/accords?search=${encodeURIComponent(search)}&limit=${limit}`);

export const getFragellaUsage = () => apiClient.get('/fragrances/usage');

// LOCAL STORAGE (MONGODB) API CALLS
export const getStoredFragrances = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/fragrances/store${query ? `?${query}` : ''}`);
};

export const getStoredFragrance = (id) => apiClient.get(`/fragrances/store/${id}`);

export const importFragrances = (fragrances) => 
  apiClient.post('/fragrances/import', { fragrances });

export const toggleVisibility = (id) => 
  apiClient.patch(`/fragrances/store/${id}/visibility`);

export const toggleFeatured = (id) => 
  apiClient.patch(`/fragrances/store/${id}/featured`);

export const deleteStoredFragrance = (id) => 
  apiClient.delete(`/fragrances/store/${id}`);

export const getStoredBrands = () => 
  apiClient.get('/fragrances/store/brands');

export const getStoredAccords = () =>
  apiClient.get('/fragrances/store/accords');

export const getStoredNotes = () =>
  apiClient.get('/fragrances/store/notes');

export const createFragranceReview = (id, data) =>
  apiClient.post(`/fragrances/store/${id}/reviews`, data);
