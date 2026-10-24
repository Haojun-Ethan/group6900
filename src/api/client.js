/* Rewrite ---- 4-01  and  debug ---6-02*/
/* updata ----8-01----  */
// src/api/client.js
import axios from 'axios';
import {  getAccess, getRefresh, setAccess, clearAll,} from '../utils/storage';
import { ENDPOINTS, REQ } from '../config/apiContract';


import { demoAdapter } from './demoAdapter';
import { adaptToSnake, adaptToCamel } from './adapter';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';  // DEMO

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  ...(DEMO_MODE ? { adapter: demoAdapter } : {}),  //DEMO
});

// Request interceptor 
apiClient.interceptors.request.use((config) => {
  const access = getAccess();
  if (access && !config.headers.Authorization) {         // 08-01  automount JWT Bearer Token
    config.headers.Authorization = `Bearer ${access}`;
  }

  if (config.data && !(config.data instanceof FormData) && !config.skipTransform) {

    config.data = adaptToSnake(config.data)
  }

  if ( config.params && typeof config.params === 'object' && !config.skipTransform) {
    config.params = adaptToSnake(config.params);
    
  }
  //config.headers['X-API-Version'] = API_VERSION;
  return config;
}, 
(error)=> Promise.reject(error));

// Singleton refresh promise 
let refreshPromise = null;

const doRefresh = async () => {
  const refresh = getRefresh();
  if (!refresh) throw new Error('No refresh token');
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${ENDPOINTS.refresh}`,
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
  ENDPOINTS.refresh,
];

apiClient.interceptors.response.use(
  /*(res) => res.data,      change 08-01*/
(response) => {
    // 204 No Content retrun null
    if (response.status === 204) {
      return null;
    }

    const payload = response.data;
    if (response.config?.skipTransform) {
      return payload;
    }

    // auto change to Camel
    return adaptToCamel(payload);
  },

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
        if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
        }
          return Promise.reject({ message: 'Session expired, please login again' });
        }
    }

    // ★ Extract error message 
    const data = error.response?.data;
    let message = 'Network error';
      if (data) {     /* 08-01 */
        if (typeof data === 'string') {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else if (data.detail) {
          message = data.detail;
        } else if (typeof data === 'object') {
          
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const fieldError = data[firstKey];
            message = Array.isArray(fieldError)
              ? `${firstKey}: ${fieldError[0]}`
              : `${firstKey}: ${fieldError}`;
          }
        }
      } else if (error.message) {
        message = error.message;
      }

    return Promise.reject({ message, status, raw: error });
  }
);

export default apiClient;