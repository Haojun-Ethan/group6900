import {
  MOCK_MODULES,
  MOCK_MODULE_DETAIL,
  MOCK_ENROLLED_MODULES,
  MOCK_USERS,
} from '../pages/modules/_mockData';
import * as quizMock from '../mocks/quizMock';

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

// Remember which demo user logged in, so /accounts/me/ still answers after a page reload.
const DEMO_ROLE_KEY = 'demo_role';
const currentDemoUser = () => {
  try { return DEMO_USERS[localStorage.getItem(DEMO_ROLE_KEY)] || DEMO_USERS.user; } catch { return DEMO_USERS.user; }
};

// The numeric id in a URL such as /attempts/12/submit/
const idFromUrl = (url) => Number(url.match(/\/(\d+)\//)?.[1]);

const parseBody = (config) => (typeof config.data === 'string' ? JSON.parse(config.data) : config.data);

/** Turn a quizMock { status, body } result into an axios response or error. */
const fromMock = ({ status, body }) => {
  if (status < 400) return buildResponse(body, status);

  const error = new Error('Request failed');
  error.response = { data: body, status, statusText: 'Error', headers: {}, config: {} };
  return Promise.reject(error);
};

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

      let role = 'user';
      if (username.includes('owner')) role = 'owner';
      else if (username.includes('admin')) role = 'admin';
      try { localStorage.setItem(DEMO_ROLE_KEY, role); } catch { /* ignore */ }

      // No 2FA in demo mode: tokens straight away.
      return buildResponse({
        mfa_required: false,
        access: MOCK_ACCESS,
        refresh: MOCK_REFRESH,
      });
    },
  },

  // ============ Current user / logout ============
  {
    match: (m, u) => m === 'get' && u.endsWith('/accounts/me/'),
    handle: async () => {
      await delay(100);
      return buildResponse(currentDemoUser());
    },
  },
  {
    match: (m, u) => m === 'post' && u.endsWith('/accounts/logout/'),
    handle: async () => {
      await delay(100);
      return buildResponse({ detail: 'Logged out.' });
    },
  },

  // ============ Refresh ============
  {
    match: (m, u) => m === 'post' && u.endsWith('/api/token/refresh/'),
    handle: async () => {
      await delay(100);
      return buildResponse({ access: MOCK_ACCESS, refresh: MOCK_REFRESH });
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

  // ============ Quiz (same paths as the backend; logic in src/mocks/quizMock.js) ============
  {
    match: (m, u) => m === 'get' && u.endsWith('/questions/'),
    handle: async (config) => {
      await delay();
      return buildResponse(quizMock.listQuestions(config.params?.module));
    },
  },
  {
    match: (m, u) => m === 'post' && u.endsWith('/attempts/'),
    handle: async (config) => {
      await delay();
      return fromMock(quizMock.startAttempt(parseBody(config)?.module));
    },
  },
  {
    match: (m, u) => m === 'post' && /\/attempts\/\d+\/submit\/$/.test(u),
    handle: async (config) => {
      await delay();
      return fromMock(quizMock.submitAttempt(idFromUrl(config.url), parseBody(config)));
    },
  },
  {
    match: (m, u) => m === 'get' && /\/attempts\/\d+\/$/.test(u),
    handle: async (config) => {
      await delay();
      return fromMock(quizMock.getAttempt(idFromUrl(config.url)));
    },
  },

  // ============ Notifications (demo: a single welcome message, nothing persists) ============
  {
    match: (m, u) => m === 'get' && u.endsWith('/notifications/unread-count/'),
    handle: async () => buildResponse({ count: 1 }),
  },
  {
    match: (m, u) => m === 'get' && u.endsWith('/notifications/'),
    handle: async () => {
      await delay();
      return buildResponse([{
        id: 1, title: 'Welcome to DefendEd', message: 'This is demo mode, so nothing you do here is saved.',
        link: '/modules', is_read: false, created_at: new Date().toISOString(),
      }]);
    },
  },
  {
    match: (m, u) => /\/notifications\//.test(u) && (m === 'post' || m === 'delete'),
    handle: async () => buildResponse({ updated: 0 }),
  },

  // ============ Gradebook (demo: empty) ============
  {
    match: (m, u) => m === 'get' && u.endsWith('/gradebook/'),
    handle: async () => {
      await delay();
      return buildResponse([]);
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
        if (err.response) throw err;   // a deliberate mock error response (e.g. 404, 400)
        return buildError(err.message || 'Mock error', 500);
      }
    }
  }

  return buildError(`Demo mode: no mock for ${method.toUpperCase()} ${url}`, 404);
};