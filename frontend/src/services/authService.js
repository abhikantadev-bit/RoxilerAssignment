import apiClient from './apiClient';

// Auth endpoints
export const signup = (userData) => apiClient.post('/auth/signup', userData);
export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const updatePassword = (passwords) => apiClient.patch('/auth/update-password', passwords);

// Admin endpoints
export const getAdminDashboard = () => apiClient.get('/admin/dashboard');
export const getUsers = (params) => apiClient.get('/admin/users', { params });
export const getUserById = (id) => apiClient.get(`/admin/users/${id}`);
export const createUser = (userData) => apiClient.post('/admin/users', userData);
export const getStores = (params) => apiClient.get('/admin/stores', { params });
export const createStore = (storeData) => apiClient.post('/admin/stores', storeData);

// User endpoints
export const getStoresForUser = (params) => apiClient.get('/user/stores', { params });
export const submitRating = (ratingData) => apiClient.post('/user/ratings', ratingData);
export const updateRating = (storeId, ratingData) => apiClient.patch(`/user/ratings/${storeId}`, ratingData);

// Owner endpoints
export const getOwnerDashboard = () => apiClient.get('/owner/dashboard');

export default apiClient;
