import apiClient from './api';

export interface FragranceParams {
  sort?: string;
  limit?: number;
  category?: string;
  brand?: string;
  keyword?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  accord?: string;
  note?: string;
  volume?: string;
  page?: number;
  admin?: string;
}

export const getStoredFragrances = (params: FragranceParams = {}) => {
  return apiClient.get('/fragrances/store', { params });
};

export const getStoredFragrance = (id: string) => {
  return apiClient.get(`/fragrances/store/${id}`);
};

export const getStoredBrands = () => {
  return apiClient.get('/fragrances/store/brands');
};

export const getStoredAccords = () => {
  return apiClient.get('/fragrances/store/accords');
};

export const getStoredNotes = () => {
  return apiClient.get('/fragrances/store/notes');
};
