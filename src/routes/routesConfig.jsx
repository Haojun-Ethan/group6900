import { lazy } from 'react';


//  load pages to reduce initial bundle size


const HomePage          = lazy(() => import('../pages/common/HomePage'));
const ModuleListPage    = lazy(() => import('../pages/common/ModuleListPage'));
const ModuleDetailPage  = lazy(() => import('../pages/common/ModuleDetailPage'));
const LoginPage         = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('../pages/auth/RegisterPage'));
const Setup2FAPage      = lazy(() => import('../pages/auth/Setup2FAPage'));
const Challenge2FAPage  = lazy(() => import('../pages/auth/Challenge2FAPage'));
const DashboardPage     = lazy(() => import('../pages/common/DashboardPage'));
const ProfilePage       = lazy(() => import('../pages/common/ProfilePage'));
const UnauthorizedPage  = lazy(() => import('../pages/common/UnauthorizedPage'));
const NotFoundPage      = lazy(() => import('../pages/common/NotFoundPage'));

// User pages 
const MyModulesPage     = lazy(() => import('../pages/user/MyModulesPage'));
const StudyPage         = lazy(() => import('../pages/user/StudyPage'));
const TakeQuizPage      = lazy(() => import('../pages/user/TakeQuizPage'));
const MyResultsPage     = lazy(() => import('../pages/user/MyResultsPage'));
const MyProgressPage    = lazy(() => import('../pages/user/MyProgressPage'));

// Owner pages 
const ManageModulesPage = lazy(() => import('../pages/owner/ManageModulesPage'));
const CreateModulePage  = lazy(() => import('../pages/owner/CreateModulePage'));
const EditModulePage    = lazy(() => import('../pages/owner/EditModulePage'));
const ManageQuizPage    = lazy(() => import('../pages/owner/ManageQuizPage'));
const AssessmentsPage   = lazy(() => import('../pages/owner/AssessmentsPage'));
const EnrollUsersPage   = lazy(() => import('../pages/owner/EnrollUsersPage'));
const TrackProgressPage = lazy(() => import('../pages/owner/TrackProgressPage'));

// Admin pages 
const ManageUsersPage   = lazy(() => import('../pages/admin/ManageUsersPage'));
const AssignRolesPage   = lazy(() => import('../pages/admin/AssignRolesPage'));
const SystemSettingsPage= lazy(() => import('../pages/admin/SystemSettingsPage'));
const ViewReportsPage   = lazy(() => import('../pages/admin/ViewReportsPage'));
const ActivityLogsPage  = lazy(() => import('../pages/admin/ActivityLogsPage'));


// first page do not use lazy load
import AuthLayout from '../layouts/AuthLayout';
import AppLayout  from '../layouts/AppLayout';
import AdminLayout from '../layouts/AdminLayout';


/* easy write incorrect */
export const ROLES = {
  USER: 'user',
  OWNER: 'owner',
  ADMIN: 'admin',
};

export const ALL_ROLES = [ROLES.USER, ROLES.OWNER, ROLES.ADMIN];

// router config
/**
 * @typedef {Object} RouteMeta
 * @property {string}   title    - Page title / 页面标题
 * @property {string[]} [roles]  - Required roles / 所需角色（
 * @property {boolean}  [public] - Public route, no auth needed / 公开路由
 * @property {string}   [navKey] - Nav group key / 所属导航分组
 * @property {string}   [icon]   - Icon name 
 */

/**
 * @typedef {Object} AppRoute
 * @property {string}    path
 * @property {React.ComponentType} element
 * @property {RouteMeta} meta
 * @property {boolean}   [index]
 */

/** @type {AppRoute[]} */
export const routesConfig = [

  // Public routes任何人可访问
  {
    path: '/',
    element: HomePage,

    meta: { title: 'Home', public: true, navKey: 'home', icon: 'home' },
  },
  {
    path: '/modules',
    element: ModuleListPage,
     meta: { title: 'Modules', public: true, navKey: 'home', icon: 'book' },
  },
  {
    path: '/modules/:id',
    element: ModuleDetailPage,
    meta: { title: 'Module Detail', public: true },
  },

  
  // Auth flow routes 
  {
    path: '/login',
    element: LoginPage,
    meta: { title: 'Login', public: true, layout: 'auth' },
  },
  {
    path: '/register',
    element: RegisterPage,
    meta: { title: 'Register', public: true, layout: 'auth' },
  },
  {
    path: '/register/setup-2fa',
    element: Setup2FAPage,
    meta: { title: 'Setup 2FA', public: true, layout: 'auth' },
  },
  {
    path: '/login/2fa',
    element: Challenge2FAPage,
    meta: { title: '2FA Verification', public: true, layout: 'auth' },
  },

  
  // Main app routes 
  {
    path: '/dashboard',
    element: DashboardPage,
    meta: { title: 'Dashboard', roles: ALL_ROLES, navKey: 'home', icon: 'home' },
  },
  {
    path: '/profile',
    element: ProfilePage,
    meta: { title: 'Profile', roles: ALL_ROLES, navKey: 'profile', icon: 'user' },
  },

  
  // User routes 
  {
    path: '/my-modules',
    element: MyModulesPage,
    meta: { title: 'My Modules', roles: [ROLES.USER], navKey: 'learning', icon: 'book' },
  },
  {
    path: '/study/:moduleId',
    element: StudyPage,
    meta: { title: 'Study', roles: [ROLES.USER], navKey: 'learning' },
  },
  {
    path: '/quiz/:moduleId',
    element: TakeQuizPage,
    meta: { title: 'Take Quiz', roles: [ROLES.USER], navKey: 'learning' },
  },
  {
    path: '/results',
    element: MyResultsPage,
    meta: { title: 'My Results', roles: [ROLES.USER], navKey: 'learning', icon: 'chart' },
  },
  {
    path: '/progress',
    element: MyProgressPage,
    meta: { title: 'My Progress', roles: [ROLES.USER], navKey: 'learning', icon: 'trending' },
  },

 
  // Owner routes 
  {
    path: '/manage/modules',
    element: ManageModulesPage,
    meta: { title: 'Manage Modules', roles: [ROLES.OWNER], navKey: 'manage', icon: 'folder' },
  },
  {
    path: '/manage/modules/create',
    element: CreateModulePage,
    meta: { title: 'Create Module', roles: [ROLES.OWNER], navKey: 'manage' },
  },
  {
    path: '/manage/modules/:id/edit',
    element: EditModulePage,
    meta: { title: 'Edit Module', roles: [ROLES.OWNER], navKey: 'manage' },
  },
  {
    path: '/manage/quiz/:moduleId',
    element: ManageQuizPage,
    meta: { title: 'Manage Quiz', roles: [ROLES.OWNER], navKey: 'manage' },
  },
  {
    path: '/manage/assessments',
    element: AssessmentsPage,
    meta: { title: 'Assessments', roles: [ROLES.OWNER], navKey: 'manage', icon: 'calendar' },
  },
  {
    path: '/manage/enroll',
    element: EnrollUsersPage,
    meta: { title: 'Enroll Users', roles: [ROLES.OWNER], navKey: 'manage', icon: 'user-plus' },
  },
  {
    path: '/manage/progress',
    element: TrackProgressPage,
    meta: { title: 'Track Progress', roles: [ROLES.OWNER], navKey: 'manage', icon: 'trending' },
  },


  // Admin routes 
  {
    path: '/admin/users',
    element: ManageUsersPage,
    meta: { title: 'Manage Users', roles: [ROLES.ADMIN], layout: 'admin', navKey: 'admin', icon: 'users' },
  },
  {
    path: '/admin/users/:id/roles',
    element: AssignRolesPage,
    meta: { title: 'Assign Roles', roles: [ROLES.ADMIN], layout: 'admin' },
  },
  {
    path: '/admin/settings',
    element: SystemSettingsPage,
    meta: { title: 'System Settings', roles: [ROLES.ADMIN], layout: 'admin', navKey: 'admin', icon: 'settings' },
  },
  {
    path: '/admin/reports',
    element: ViewReportsPage,
    meta: { title: 'Reports', roles: [ROLES.ADMIN], layout: 'admin', navKey: 'admin', icon: 'chart' },
  },
  {
    path: '/admin/logs',
    element: ActivityLogsPage,
    meta: { title: 'Activity Logs', roles: [ROLES.ADMIN], layout: 'admin', navKey: 'admin', icon: 'list' },
  },

  //  all user
  {
    path: '/unauthorized',
    element: UnauthorizedPage,
    meta: { title: 'Unauthorized', public: true },
  },
  {
    path: '*',
    element: NotFoundPage,
    meta: { title: 'Not Found', public: true },
  },
];

// NavGroup
/**
 * @typedef {Object} NavGroup
 * @property {string}   key    - Group key 
 * @property {string}   label  - Display label 
 * @property {string}   icon   - Icon name 
 * @property {string[]} roles  - Which roles see this group / 哪些角色可见
 */

/** @type {NavGroup[]} */
export const navGroups = [
  { key: 'home',     label: 'Home',     icon: 'home',     roles: ALL_ROLES },
  { key: 'learning', label: 'Learning', icon: 'book',     roles: [ROLES.USER] },
  { key: 'manage',   label: 'Manage',   icon: 'settings', roles: [ROLES.OWNER] },
  { key: 'admin',    label: 'Admin',    icon: 'shield',   roles: [ROLES.ADMIN] },
  { key: 'profile',  label: 'Profile',  icon: 'user',     roles: ALL_ROLES },
];

// witch Nav can visible
/**
 * Get nav groups visible to a role set
 * @param {string[]} userRoles
 * @returns {NavGroup[]}
 */
export function getVisibleNavGroups(userRoles) {
  return navGroups.filter((g) => g.roles.some((r) => userRoles.includes(r)));
}

/**
 * Get routes visible to a role set (for a given nav group)
 * @param {string[]} userRoles
 * @param {string} navKey
 * @returns {AppRoute[]}
 */
export function getRoutesByNav(userRoles, navKey) {
  return routesConfig.filter((r) => {
    if(r.meta.navKey !== navKey) return false;
    if(r.meta.public) return true;
    if (!r.meta.roles) return false;
    return r.meta.roles.some((role)=>userRoles.includes(role));
  });
}