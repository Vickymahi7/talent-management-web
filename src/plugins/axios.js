// axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config;
});


export default axiosInstance;
