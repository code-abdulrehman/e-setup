import axios from 'axios';
// Removed the toast message import
// import { message } from 'ant-design-vue';
import { useAuthStore } from '@/lib/stores/useAuthStore';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VUE_APP_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Access the store dynamically
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Customize error handling based on error response
    if (error.response) {
      const { status, data } = error.response;
      const authStore = useAuthStore(); // Access the store dynamically
      if (status === 401) {
        console.error('Unauthorized. Please log in again.');
        authStore.logout();
      } else if (data && data.message) {
        console.error(data.message);
      } else {
        console.error('An unexpected error occurred.');
      }
    } else if (error.request) {
      console.error('No response from server. Please try again later.');
    } else {
      console.error(`Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
