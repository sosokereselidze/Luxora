import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

/**
 * 🚀 DYNAMIC IP DISCOVERY
 * We use Constants.expoConfig.hostUri to automatically detect your computer's 
 * internal IP address. No more hardcoded IPs or Network Errors!
 */
const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || '';
  const ip = hostUri.split(':').shift();
  
  if (!ip || ip.includes('localhost')) {
    // Fallback for emulator or when hostUri is missing
    return 'http://10.0.2.2:5000'; 
  }
  
  return `http://${ip}:5000`;
};

const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;

console.log('📡 LUXORA CONNECTED VIA:', API_URL);

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
