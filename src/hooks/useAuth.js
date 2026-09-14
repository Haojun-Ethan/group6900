// import hooks for Authorization

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
    const cont=useContext(AuthContext);
    if (!cont) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return cont;
}



/*  wait backend api link
import axios from 'axios';
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Auto-attach token 
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(credentials) {
  if (USE_MOCK) return mockLogin(credentials);
  const res = await apiClient.post('/auth/login', credentials);
  return res.data;
}

export async function fetchMe() {
  if (USE_MOCK) return mockFetchMe(getToken());
  const res = await apiClient.get('/auth/me');
  return res.data;
}

export async function logout() {
  if (USE_MOCK) return mockLogout();
  await apiClient.post('/auth/logout');
}

*/