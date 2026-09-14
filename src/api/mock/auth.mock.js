// src/api/mock/auth.mock.js

// Mock user database / 模拟用户数据库
const mockUsers = [
  { id: 'u1', name: 'Alice', email: 'user@example.com', password: '12345678', roles: ['user'] },
  { id: 'u2', name: 'Bob', email: 'owner@example.com', password: '12345678', roles: ['owner'] },
    { id: 'u3', name: 'Charlie', email: 'admin@example.com', password: '12345678', roles: ['admin'] }
];

// Simulate network delay / 模拟网络延迟
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// Generate fake token / 生成假 token
const generateToken = (user) => `mock_token_${user.id}_${Date.now()}`;

// Mock login / 模拟登录
export async function mockLogin({ email, password }) {
  await delay();

  const user = mockUsers.find((u) => u.email === email);

  // Invalid credentials / 凭证错误
  if (!user || user.password !== password) {
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  // Success / 成功
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

// Mock logout / 模拟登出
export async function mockLogout() {
  await delay(200);
  return { success: true };
}