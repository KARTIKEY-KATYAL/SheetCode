import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.sheetcode.in';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;