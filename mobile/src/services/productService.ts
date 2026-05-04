import apiClient from './api';

export interface ReviewData {
  rating: number;
  comment: string;
  productInfo?: any;
}

export const getProduct = (id: string) => {
  return apiClient.get(`/products/${id}`);
};

export const createReview = (id: string, reviewData: ReviewData) => {
  return apiClient.post(`/products/${id}/reviews`, reviewData);
};
