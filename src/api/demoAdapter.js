import {
  MOCK_MODULES,
  MOCK_MODULE_DETAIL,
  MOCK_ENROLLED_MODULES,
  MOCK_USERS,
} from '../pages/modules/_mockData';
import { MOCK_QUIZ_QUESTIONS } from '../pages/quizzes/_mockQuizData';

const MOCK_ACCESS = 'demo_access_token';
const MOCK_REFRESH = 'demo_refresh_token';

/**
 * Demo users - three roles, all password = anything
 * 演示用户 - 三种角色，密码随便填
 */
const DEMO_USERS = {
  user:  { id: 1, username: 'demo_user',  email: 'user@demo.com',  role: 'USER',  is_2fa_enabled: false },
  owner: { id: 2, username: 'demo_owner', email: 'owner@demo.com', role: 'OWNER', is_2fa_enabled: false },
  admin: { id: 3, username: 'demo_admin', email: 'admin@demo.com', role: 'ADMIN', is_2fa_enabled: false },
};

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const buildResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

const buildError = (message, status = 400) => {
  const error = new Error(message);
  error.response = {
    data: { message },
    status,
    statusText: 'Error',
    headers: {},
    config: {},
  };
  return Promise.reject(error);
};

/**
 * Route handlers / 路由处理
 */
const routeHandlers = [
  // ============ Login ============
  // 演示：识别 username 里的关键字决定角色
  {
    match: (m, u) => m === 'post' && u.endsWith('/accounts/login/'),
    handle: async (config) => {
      await delay();
      const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const username = body?.username || '';

      let user = DEMO_USERS.user;
      if (username.includes('owner')) user = DEMO_USERS.owner;
      else if (username.includes('admin')) user = DEMO_USERS.admin;

      // 直接返回 token，不需要 2FA
      return buildResponse({
        mfa_required: false,
        access: MOCK_ACCESS,
        refresh: MOCK_REFRESH,
        user,
      });
    },
  },

  // ============ Refresh ============
  {
    match: (m, u) => m === 'post' && u.endsWith('/api/token/refresh/'),
    handle: async () => {
      await delay(100);
      return buildResponse({ access: MOCK_ACCESS });
    },
  },

  // ============ Modules ============
  {
    match: (m, u) => m === 'get' && u.endsWith('/modules/'),
    handle: async () => {
      await delay();
      return buildResponse(MOCK_MODULES);
    },
  },
  {
    match: (m, u) => m === 'get' && /\/modules\/\d+\/$/.test(u),
    handle: async () => {
      await delay();
      return buildResponse(MOCK_MODULE_DETAIL);
    },
  },
  {
    match: (m, u) => m === 'get' && /\/modules\/\d+\/schedule\/$/.test(u),
    handle: async () => {
      await delay();
      return buildResponse(null);
    },
  },

  // ============ Sections ============
  {
    match: (m, u) => m === 'get' && u.includes('/sections/'),
    handle: async () => {
      await delay();
      return buildResponse(MOCK_MODULE_DETAIL.sections);
    },
  },
  {
    match: (m, u) => m === 'post' && /\/sections\/\d+\/complete\/$/.test(u),
    handle: async () => {
      await delay();
      return buildResponse(null, 204);
    },
  },

  // ============ Enrollments ============
  {
    match: (m, u) => m === 'get' && u.endsWith('/enrollments/'),
    handle: async () => {
      await delay();
      return buildResponse(MOCK_ENROLLED_MODULES);
    },
  },

  // ============ Quiz ============
  {
    match: (m, u) => m === 'get' && /\/modules\/\d+\/questions\/$/.test(u),
    handle: async () => {
      await delay();
      return buildResponse(MOCK_QUIZ_QUESTIONS);
    },
  },

  // ============ Users (admin) ============
  {
    match: (m, u) => m === 'get' && u.endsWith('/accounts/users/'),
    handle: async () => {
      await delay();
      return buildResponse(MOCK_USERS);
    },
  },
];

export const demoAdapter = async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';

  for (const route of routeHandlers) {
    if (route.match(method, url)) {
      try {
        return await route.handle(config);
      } catch (err) {
        return buildError(err.message || 'Mock error', 500);
      }
    }
  }

  return buildError(`Demo mode: no mock for ${method.toUpperCase()} ${url}`, 404);
};