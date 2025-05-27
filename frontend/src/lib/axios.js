import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://159.65.146.33/api/v1'  // Production backend URL
    : 'http://localhost:8080/api/v1', // Development backend URL
  withCredentials: true,
  timeout: 10000,
});
