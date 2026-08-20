import axios from 'axios';

// Create custom Axios instance
const api = axios.create({
  // baseURL is empty because we use the Vite proxy config from vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor: Automatically attach JWT token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        const token = parsed.token || parsed.data?.token; // Handle potential nested responses
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error parsing token from localStorage', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor: Catch 401 Unauthorized errors and force log out the user
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
      // If we are not already on the login page, redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
