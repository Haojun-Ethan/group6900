// src/api/auth.js
import { mockLogin, mockFetchMe, mockLogout, mockRegister } from './mock/auth.mock';
import axios from 'axios';
import { getToken } from '../utils/storage';

// Read mock flag from env / 从环境变量读取 mock 开关
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // Default base URL / 默认基础 URL
});

// Login API / 登录接口
// Future: replace mock with real API / 未来：用真实接口替换 mock
export async function login(credentials) {
  if (USE_MOCK) {
    return mockLogin(credentials);
  }
  // TODO: real backend call / TODO: 真实后端调用
  // return apiClient.post('/auth/login', credentials);
  throw new Error('Real API not configured yet');
  /*   wait backend api link
  const res = await axios.post('/api/auth/login', credentials);
    return res.data; 
  */
}

export async function fetchMe() {
  if (USE_MOCK)  return mockFetchMe(getToken());
  throw new Error('Real API not configured yet');
}

export async function logout() {
  if (USE_MOCK) return mockLogout();
  throw new Error('Real API not configured yet');
}


/* register 3-01 */
/**
 * Register a new account
 * @param {{name:string, email:string, password: string}} data 
 * @returns {Promise <{user:object, token:string}>}
 */
export async function register(data) {
  if (USE_MOCK) return mockRegister(data);
  throw new Error('Real API not configured')
}