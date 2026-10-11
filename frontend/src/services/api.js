import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hx_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      const authEntryRequest = url.startsWith('/api/auth/') && !url.startsWith('/api/auth/me');
      if (!authEntryRequest) {
        localStorage.removeItem('hx_token');
        localStorage.removeItem('hx_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(err);
  }
);

export default API;
