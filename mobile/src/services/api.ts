import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CONFIGURATION TIP:
 * 1. For Android Emulator: Use 'http://10.0.2.2:5000/api'
 * 2. For Physical Device: Use 'http://YOUR_COMPUTER_IP:5000/api'
 *    (Find your IP by running 'ipconfig' in cmd)
 */
const BASE_URL = 'http://192.168.0.104:5000'; // Updated to your computer's IP
export const API_URL = `${BASE_URL}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to fix image URLs
export const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80';
  if (imagePath.startsWith('http')) return imagePath;
  // If it's a relative path like /uploads/..., prefix it with the server URL
  return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
