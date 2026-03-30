import axios from 'axios';
import apiClient from './client';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Auth uses raw axios for login/register to set token before apiClient is used
export const login = async (email, password) => {
  const { data } = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
  });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await axios.post(`${API_BASE}/auth/register`, {
    name,
    email,
    password,
  });
  return data;
};

export const googleLogin = async (token) => {
  const { data } = await axios.post(`${API_BASE}/auth/google`, { token });
  return data;
};

// Use apiClient for authenticated requests
export const getMe = () => apiClient.get('/auth/me');
