import axios from 'axios';

// In dev, always use relative proxy (/api) to avoid CORS issues
// In prod, use VITE_API_URL or default to relative if the proxy is handled by the platform (like Vercel rewrites)
const API_BASE = import.meta.env.MODE === 'development' ? '/api' : (import.meta.env.VITE_API_URL || '/api');

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
