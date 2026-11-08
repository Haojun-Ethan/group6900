// src/api/client.js
/*
  https://axios.rest/pages/advanced/interceptors
  https://render.com/docs/free#spinning-down-on-idle  (free tier spins down after 15 minutes idle)
*/
import axios from 'axios';
import { getAccess, getRefresh, setAccess, setRefresh, clearAll } from '../utils/storage';
import { ENDPOINTS, REQ } from '../config/apiContract';
import { demoAdapter } from './demoAdapter';
import { adaptToSnake, adaptToCamel } from './adapter';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Show the "server is waking up" notice when a request takes longer than this.
const WAKE_UP_NOTICE_MS = 3000;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 40000,
  headers: { 'Content-Type': 'application/json' },
  ...(DEMO_MODE ? { adapter: demoAdapter } : {}),
});

// Each request has its own timer, so a fast response can't cancel the notice for a slow one.
const clearWakeUpTimer = (config) => {
  if (config?._wakeUpTimer) clearTimeout(config._wakeUpTimer);
};

// Request: attach the token, convert camelCase keys to the backend's snake_case.
apiClient.interceptors.request.use((config) => {
  if (!DEMO_MODE) {
    config._wakeUpTimer = setTimeout(() => {
      window.dispatchEvent(new Event('server-waking-up'));
    }, WAKE_UP_NOTICE_MS);
  }

  const access = getAccess();
  if (access && !config.skipAuth && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  if (config.data && !(config.data instanceof FormData) && !config.skipTransform) {
    config.data = adaptToSnake(config.data);
  }

  if (config.params && typeof config.params === 'object' && !config.skipTransform) {
    config.params = adaptToSnake(config.params);
  }

  return config;
}, (error) => Promise.reject(error));

// One refresh at a time: requests that 401 together all wait for the same refresh.
let refreshPromise = null;

const doRefresh = async () => {
  const refresh = getRefresh();
  if (!refresh) throw new Error('No refresh token');

  // Goes through apiClient so demo mode uses the demo adapter too. skipAuth: the expired access
  // token isn't needed here.
  const data = await apiClient.post(ENDPOINTS.refresh, { [REQ.refresh]: refresh }, { skipAuth: true });

  setAccess(data.access);

  // The backend rotates refresh tokens and blacklists the old one, so keep the new one.
  if (data.refresh) setRefresh(data.refresh);

  return data.access;
};

// Endpoints whose 401 means "wrong credentials", not "access token expired".
const AUTH_ENDPOINTS = [
  ENDPOINTS.login,
  ENDPOINTS.register,
  ENDPOINTS.login2FA,
  ENDPOINTS.refresh,
];

/** Turn a DRF error body into one readable line. */
const errorMessage = (data, fallback) => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if (data.detail) return data.detail;

  const firstKey = Object.keys(data)[0];
  if (!firstKey) return fallback;

  const value = data[firstKey];
  const text = Array.isArray(value) ? value[0] : value;

  // Errors not tied to one field don't need the key in front.
  return firstKey === 'non_field_errors' ? String(text) : `${firstKey}: ${text}`;
};

apiClient.interceptors.response.use(
  (response) => {
    clearWakeUpTimer(response.config);

    if (response.status === 204) return null;

    const payload = response.data;
    if (response.config?.skipTransform) return payload;

    // The backend sends snake_case; the app uses camelCase.
    return adaptToCamel(payload);
  },

  async (error) => {
    const original = error.config;
    clearWakeUpTimer(original);

    const status = error.response?.status;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => original?.url?.includes(ep));

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
        }
        const newAccess = await refreshPromise;
        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(original);
      } catch {
        // Refresh failed: the session is over. AuthContext listens for this and sends the
        // user to the login page.
        clearAll();
        window.dispatchEvent(new Event('session-expired'));
        return Promise.reject({ message: 'Session expired, please log in again', status, raw: error });
      }
    }

    const body = error.response?.data;
    const message = errorMessage(body, error.message || 'Network error');

    // fieldErrors: the backend's per-field messages in camelCase, e.g. { password: ['Too common.', ...] },
    // so forms can show each one under its field.
    const fieldErrors = body && typeof body === 'object' && !Array.isArray(body) ? adaptToCamel(body) : {};

    return Promise.reject({ message, status, fieldErrors, raw: error });
  }
);

export default apiClient;
