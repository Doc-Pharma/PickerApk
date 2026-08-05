import axios from 'axios';
import { ENV } from '../config/env';

// Controlled by APP_MOCK_MODE=true in .env / .env.dev
export const MOCK_MODE = ENV.MOCK_MODE;

// In-memory token
let _token = null;

// Set token (called from UserContext)
export const setAuthToken = token => {
  _token = token;
};

// Clear token
export const clearAuthToken = () => {
  _token = null;
};

// Logout handler (from UserContext)
let logoutHandler = null;

export const setLogoutHandler = handler => {
  logoutHandler = handler;
};

// Axios instance
const api = axios.create({
  baseURL: ENV.API_URL || 'http://192.168.1.7:4004',
  timeout: ENV.TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use(
  config => {
    if (_token) {
      config.headers.Authorization = `Bearer ${_token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Global error handling
api.interceptors.response.use(
  response => response.data,
  async error => {
    const status = error?.response?.status;

    if (status === 401) {
      const backendMsg = error?.response?.data?.message || null;
      if (logoutHandler) {
        logoutHandler('SESSION_EXPIRED', backendMsg);
      }
      return Promise.reject(
        new Error(backendMsg || 'Session expired. Please log in again.'),
      );
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';

    const wrappedError = new Error(message);
    if (error?.response?.data?.code) {
      wrappedError.code = error.response.data.code;
    }

    return Promise.reject(wrappedError);
  },
);

// Generic request
export const request = async (method, endpoint, body = null, params = null) => {
  const res = await api({ method, url: endpoint, data: body, params });
  return res;
};
