// src/api/auth.js
import { mockLogin, mockFetchMe, mockLogout, mockRegister, mockSetup2FA,mockVerify2FA, mockChallenge2FA, } from './mock/auth.mock';
import axios from 'axios';
import { getToken } from '../utils/storage';

// Read mock flag from env   
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // Default base URL / 默认基础 URL
});


/* 2FA ---- 4-01*/
/**
 * Get 2FA setup QR code     获取 2FA 设置二维码
 * @param {string} tempToken - Temp token from register     / 注册下发的临时令牌
 * @returns {Promise<{ qrCodeUri: string, secret: string, expiresIn: number }>}
 */
export async function setup2FA(tempToken) {   
  if(USE_MOCK) return mockSetup2FA(tempToken);
  return apiClient.get('/auth/2fa/setup', { params: { tempToken } });   
}

/**
 * Challenge 2FA code during login    / 登录时 2FA 挑战
 * @param {{ tempToken: string, code: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function challenge2FA(data) {      
  if(USE_MOCK) return mockChallenge2FA(data);
  return apiClient.post('/auth/2fa/challenge', data);    
}

/**
 * Verify 2FA code during registration    / 注册时验证 2FA 验证码
 * @param {{ tempToken: string, code: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function verify2FA(data) {                  
  if(USE_MOCK) return mockVerify2FA(data);
  return apiClient.post('/auth/2fa/verify', data);
}

// Login API / 登录接口
/**
 * Login with email and password 
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, token: string } | { requires2FA: true, tempToken: string }>}
 */
export async function login(credentials) {
  if (USE_MOCK) {
    return mockLogin(credentials);
  }
  return apiClient.post('/auth/login', credentials);     
}

/**
 * Fetch current user by stored token / 用已存 token 获取当前用户
 * @returns {Promise<{ user: object }>}
 */
export async function fetchMe() {  
  if (USE_MOCK)  return mockFetchMe(getToken());
  return apiClient.get('/auth/me');                      
}

/**
 * Logout current session 
 * @returns {Promise<{ success: boolean }>}
 */
export async function logout() { 
  if (USE_MOCK) return mockLogout();
  return apiClient.post('/auth/logout');                 
}

/* register 3-01 */
/**
 * Register a new account
 * @param {{name:string, email:string, password: string}} data 
 * @returns {Promise <{requires2FASetup: true, tempToken: string}>}
 */
export async function register(data) {
  if (USE_MOCK) return mockRegister(data);
  return apiClient.post('/auth/register', data);         
}