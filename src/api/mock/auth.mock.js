// src/api/mock/auth.mock.js

import { data } from "react-router-dom";


//---------------login & register-----

// Mock user database / 模拟用户数据库
const mockUsers = [
  { id: 'u1', name: 'Alice', email: 'user@example.com', password: '123456nN', roles: ['user'] },
  { id: 'u2', name: 'Bob', email: 'owner@example.com', password: '123456nN', roles: ['owner'] },
    { id: 'u3', name: 'Charlie', email: 'admin@example.com', password: '123456nN', roles: ['admin'] }
];


// Simulate network delay 
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// Generate fake token / 生成假 token
const generateToken = (user) => `mock_token_${user.id}_${Date.now()}`;  /* becareful ` isnot ' and must use $ */

// Mock login 
export async function mockLogin({ email, password }) {
  await delay();

  const user = mockUsers.find((u) => u.email === email);

  // Invalid credentials / 凭证错误
  if (!user || user.password !== password) {
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }
   /*  2FA  -----2FA 4-01  */
  if (user.twoFactorEnabled) {
    const tempToken = `temp_${user.id}_${Date.now()}`;   /* becareful ` isnot ' and must use $   */
    return {requires2FA:true, tempToken}
  }

  // Success 
  return {
    user: { id: user.id, name: user.name, email: user.email, roles: user.roles },
    token: generateToken(user),
  };
}

export async function mockFetchMe(token) {
  await delay(300);

  // Parse user id from token / 从 token 解析用户 id
  const userId = token?.split('_')[2];
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    throw { code: 'UNAUTHORIZED', message: 'Session expired' };
  }

  return {
    user: { id: user.id, name: user.name, email: user.email, roles: user.roles },
  };
}

// Mock logout 
export async function mockLogout() {
  await delay(200);
  return { success: true };
}


/* register 3-01  */
export async function mockRegister({name,email,password}) { /* debug （：string  is typescript grammar） export async function mockRegister({name,email,password:string}) */
  await delay();

  if (mockUsers.some((u)=> u.email ===email)){
    throw {code:'EMAIL_EXISTS', message:'This email is already registered'}
  }

  const newUser = {
    id: `u${mockUsers.length + 1}`,   /*debug: use` (~ same key) don't use '  */
    name,
    email,
    password,
    roles:['user'],
    twoFactorEnabled:true, //not been enabled . Wait  2FA Settings completed  /* 2FA ---- 4-01 */
  };
  mockUsers.push(newUser);


  /* 2FA --- 4-01 */
  const tempToken = `temp_${newUser.id}_${Date.now()}`;
  return {requires2FASetup: true,tempToken};

 /*  before 2FA  --- 4-01
 return{
    user:{id:newUser, name:newUser.name, email: newUser.email, roles:newUser.roles},
    token: generateToken(newUser),
  };
  */
}


//-------2FA------------

// otpauth URI
const MOCK_QR_URI='otpauth://totp/EduSphere:demo@example.com?secret=JBSWY3DPEHPK3PXP&issuer=EduSphere';

// secret
const MOCK_SECRET = 'JBSWY3DPEHPK3PXP';

//vri-code
const MOCK_VALID_CODE='123456';

/**
 * Mock: get 2FA setup QR code / 模拟获取 2FA 设置二维码
 * @param {string} tempToken - Temp token from register 
 * @returns {Promise<{ qrCodeUri: string, secret: string, expiresIn: number }>}
 */
export async function mockSetup2FA(tempToken) { // Mock QR code 
  await delay(400);


  if (!tempToken || !tempToken.startsWith('temp_')) {
    throw { code: 'INVALID_TEMP_TOKEN', message: 'Temp token is invalid' };
  }

  return {
    qrCodeUri: MOCK_QR_URI,
    secret: MOCK_SECRET,
    expiresIn: 300,    // 5 minutes
  };
}




//  https://raw.githubusercontent.com/fastapi/fastapi/b07569d1708eff6fb5aacb05aab023d64c23a719/tests/test_security_http_client_credentials.py#1
/**
 * Mock: verify 2FA code during registration 
 * @param {{ tempToken: string, code: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function mockVerify2FA({ tempToken, code }) {  
  await delay();

  if (!tempToken) {
    throw { code: 'INVALID_TEMP_TOKEN', message: 'Temp token is missing' };
  }

  if (code !== MOCK_VALID_CODE) {
    throw { code: 'INVALID_CODE', message: 'Invalid code, please try again' };
  }

  // Extract the user from  tempToken
  const userId = tempToken.split('_')[1];
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    throw { code: 'INVALID_TEMP_TOKEN', message: 'User not found' };
  }

  // User started 2FA
  user.twoFactorEnabled = false;

  return {
    user: { id: user.id, name: user.name, email: user.email, roles: user.roles },
    token: generateToken(user),
  };
}

/**
 * Mock: challenge 2FA code during login 
 * @param {{ tempToken: string, code: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function mockChallenge2FA({ tempToken, code }) {  
  await delay();

  if (!tempToken) {
    throw { code: 'INVALID_TEMP_TOKEN', message: 'Temp token is missing' };
  }



  if (code !== MOCK_VALID_CODE) {
    throw { code: 'INVALID_CODE', message: 'Invalid code, please try again' };
  }


  const userId = tempToken.split('_')[1]; /*  esay lose */
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    throw { code: 'INVALID_TEMP_TOKEN', message: 'User not found' };
  }

  return {
    user: { id: user.id, name: user.name, email: user.email, roles: user.roles },
    token: generateToken(user),
  };
}
