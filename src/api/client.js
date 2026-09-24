/* Rewrite ---- 4-01  and  debug ---6-02*/

// src/api/client.js
import axios from 'axios';
import {
  getAccess, getRefresh, setAccess, clearAll,
} from '../utils/storage';
import { ENDPOINTS, REQ } from '../config/apiContract';


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor 
apiClient.interceptors.request.use((config) => {
  const access = getAccess();
  if (access) config.headers.Authorization = `Bearer ${access}`;
  //config.headers['X-API-Version'] = API_VERSION;
  return config;
});

// Singleton refresh promise 
let refreshPromise = null;

const doRefresh = async () => {
  const refresh = getRefresh();
  if (!refresh) throw new Error('No refresh token');
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.refresh}`,
    { [REQ.refresh]: refresh }
  );
  setAccess(data.access);
  return data.access;
};

// Endpoints that should NOT trigger refresh
const AUTH_ENDPOINTS = [
  ENDPOINTS.login,
  ENDPOINTS.register,
  ENDPOINTS.login2FA,
];

apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // ★ Skip refresh logic for auth endpoints 
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) =>
      original?.url?.includes(ep)
    );

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
        }
        const newAccess = await refreshPromise;
        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(original);
      } catch {
        clearAll();
        window.location.href = '/login';
        return Promise.reject({ message: 'Session expired' });
      }
    }

    // ★ Extract error message 
    const data = error.response?.data;
    let message = 'Network error';
    if (data?.message) message = data.message;
    else if (data?.detail) message = data.detail;
    else if (data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey])) {
        message = `${firstKey}: ${data[firstKey][0]}`;
      }
    }

    return Promise.reject({ message });
  }
);

export default apiClient;