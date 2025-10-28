import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/users/register/', userData);
export const login = (credentials) => api.post('/users/login/', credentials);
export const getProfile = () => api.get('/users/profile/');
export const updateProfile = (profileData) => api.put('/users/profile/', profileData);

// Product APIs
export const getProducts = () => api.get('/products/products/');
export const getProduct = (id) => api.get(`/products/products/${id}/`);

// Category APIs
export const getCategories = () => api.get('/products/categories/');

// Order APIs
export const getOrders = () => api.get('/orders/orders/');
export const createOrder = (orderData) => api.post('/orders/orders/', orderData);
export const cancelOrder = (orderId) => api.delete(`/orders/orders/${orderId}/`);

export default api;