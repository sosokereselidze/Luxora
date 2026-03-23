import axios from 'axios';

// In dev, use proxy (relative). In prod, use VITE_API_URL or full URL
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach token from localStorage when available
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('luxora_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) {}
  }
  return config;
});

export default apiClient;
