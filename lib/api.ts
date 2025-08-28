import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://joulepoint.platform-api-test.joulepoint.com';

// Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Inject Authorization header if token exists
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * ✅ AUTHENTICATION APIS
 */

// Login with username and password
export const login = async (username: string, password: string) => {
  const response = await api.post('/api/users/login_with_password/', {
    username,
    password
  });
  const { access_token, refresh_token } = response.data;
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }
  return response.data;
};

// Refresh Access Token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/refresh_token/`, {
      refresh: refreshToken
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    const newAccessToken = response.data.access;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', newAccessToken);
    }
    return newAccessToken;
  } catch (error) {
    return null;
  }
};

// Logout
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

/**
 * ✅ TENANT API
 */
export const validateDomain = async (domain: string) => {
  return api.get(`/api/tenant/validate-domain/`, {
    params: { domain }
  }).then(res => res.data);
};

/**
 * ✅ USER APIs
 */

// Get logged-in user profile
export const getMyProfile = async () => {
  return api.get('/api/users/users/me/').then(res => res.data);
};

// List all users
export const listUsers = async () => {
  return api.get('/api/users/users/').then(res => res.data);
};

// Get user permissions
export const getUserPermissions = async (userId: number) => {
  return api.get(`/api/users/users/${userId}/permissions/`).then(res => res.data);
};

/**
 * ✅ FLEET & OBD DEVICE APIs
 */

// List OBD Devices
export const listOBDDevices = async () => {
  return api.get('/api/fleet/obd-devices/').then(res => res.data);
};

// Get specific OBD device details
export const getOBDDevice = async (id: number) => {
  return api.get(`/api/fleet/obd-devices/${id}/`).then(res => res.data);
};

/**
 * ✅ SIM MANAGEMENT
 */
export const listSIMCards = async () => {
  return api.get('/api/fleet/sims/').then(res => res.data);
};

/**
 * ✅ GENERIC REQUEST HELPERS
 */
export const getRequest = async (url: string, params: any = {}) => {
  const response = await api.get(url, { params });
  return response.data;
};

export const postRequest = async (url: string, data: any = {}) => {
  const response = await api.post(url, data);
  return response.data;
};

export default api;
