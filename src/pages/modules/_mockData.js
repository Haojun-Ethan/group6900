
// template for mock data for modules

export const MOCK_MODULES = [
  {
    id: 1,
    title: 'Phishing Awareness',
    slug: 'phishing-awareness',
    summary: 'Learn to spot phishing emails and what to do when you see one.',
    description: 'An introduction to identifying and reporting phishing attempts.',
    category: 'Social Engineering',
    created_by: { id: 1, username: 'owner_test' },
    status: 'PUBLISHED',
    pass_mark: 80,
    estimated_minutes: 20,
    self_enroll_allowed: true,
    version: 1,
    sections: [],
    schedule: null,
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-10T10:00:00Z',
  },
  {
    id: 2,
    title: 'Password Security Basics',
    slug: 'password-security-basics',
    summary: 'Create strong passwords and manage them safely.',
    description: 'Why password hygiene matters and how to do it right.',
    category: 'Authentication',
    created_by: { id: 2, username: 'alice' },
    status: 'PUBLISHED',
    pass_mark: 70,
    estimated_minutes: 15,
    self_enroll_allowed: true,
    version: 1,
    sections: [],
    schedule: null,
    created_at: '2026-09-05T10:00:00Z',
    updated_at: '2026-09-12T10:00:00Z',
  },
  {
    id: 3,
    title: 'Incident Reporting 101',
    slug: 'incident-reporting-101',
    summary: 'Know what to do when you spot a security incident.',
    description: 'Step-by-step guide to reporting incidents.',
    category: 'Incident Response',
    created_by: { id: 1, username: 'owner_test' },
    status: 'DRAFT',
    pass_mark: 80,
    estimated_minutes: 10,
    self_enroll_allowed: false,
    version: 1,
    sections: [],
    schedule: null,
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-15T10:00:00Z',
  },
];


/* 7-01  Module detail */
export const MOCK_MODULE_DETAIL = {
  id: 1,
  title: 'Phishing Awareness',
  slug: 'phishing-awareness',
  summary: 'Learn to spot phishing emails and what to do when you see one.',
  description:
    'An introduction to identifying and reporting phishing attempts. This module covers the most common attack patterns, how to verify sender identity, and the correct reporting workflow in your organisation.',
  category: 'Social Engineering',
  created_by: { id: 1, username: 'owner_test' },
  status: 'PUBLISHED',
  pass_mark: 80,
  estimated_minutes: 20,
  self_enroll_allowed: true,
  version: 1,
  sections: [
    {
      id: 101,
      module: 1,
      title: 'What is phishing?',
      body: 'Phishing is a social engineering attack where an attacker impersonates a trusted contact to trick you into handing over credentials or clicking a malicious link.',
      order: 1,
      created_at: '2026-09-01T10:00:00Z',
    },
    {
      id: 102,
      module: 1,
      title: 'Common red flags',
      body: 'Urgency, unexpected requests, mismatched sender domains, and links that don\'t go where they claim. Learn to spot each one with real examples.',
      order: 2,
      created_at: '2026-09-02T10:00:00Z',
    },
    {
      id: 103,
      module: 1,
      title: 'How to report',
      body: 'Forward suspicious emails to security@yourcompany.com. Never click the link first. If you already clicked, contact IT immediately.',
      order: 3,
      created_at: '2026-09-03T10:00:00Z',
    },
  ],
  schedule: null,
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-10T10:00:00Z',
};

/* My enrollments (mock) */
export const MOCK_MY_ENROLLMENTS = [
  {
    id: 1,
    user: { id: 2, username: 'testuser' },
    module: 1,
    module_title: 'Phishing Awareness',
    pathway: null,
    pathway_name: null,
    source: 'SELF',
    enrolled_at: '2026-09-05T10:00:00Z',
    due_at: '2026-10-05T10:00:00Z',
    last_passed_at: null,
    status: 'COMPLIANT',
  },
];

export const MOCK_ENROLLED_MODULES = [
  {
    id: 1,
    module: 1,
    module_title: 'Phishing Awareness',
    source: 'SELF',
    enrolled_at: '2026-09-05T10:00:00Z',
    due_at: '2026-10-05T10:00:00Z',
    last_passed_at: null,
    status: 'COMPLIANT',
    progress: { completed: 1, total: 3 }, 
  },
  {
    id: 2,
    module: 2,
    module_title: 'Password Security Basics',
    source: 'ADMIN',
    enrolled_at: '2026-09-01T10:00:00Z',
    due_at: '2026-09-20T10:00:00Z',
    last_passed_at: '2026-09-15T10:00:00Z',
    status: 'OVERDUE',
    progress: { completed: 3, total: 3 },
  },
];

/* Completed section IDs for the study page (mock)*/
export const MOCK_COMPLETED_SECTION_IDS = [101];


export const MOCK_SCHEDULE = {
  id: 1,
  frequency: 'QUARTERLY',
  custom_interval_days: null,
  initial_due_days: 14,
  reminder_days_before: 7,
  overdue_reminder_days: 3,
  is_active: true,
};

/**  Frequency choices   */
export const FREQUENCY_CHOICES = [
  { value: 'ONCE',         label: 'Once' },
  { value: 'WEEKLY',       label: 'Weekly' },
  { value: 'FORTNIGHTLY',  label: 'Fortnightly' },
  { value: 'MONTHLY',      label: 'Monthly' },
  { value: 'QUARTERLY',    label: 'Quarterly' },
  { value: 'SIX_MONTHLY',  label: 'Every 6 Months' },
  { value: 'ANNUAL',       label: 'Annual' },
  { value: 'CUSTOM',       label: 'Custom' },
];

/*  Mock users list (admin page)  用户列表,主页）   */
export const MOCK_USERS = [
  { id: 1, username: 'owner_test', email: 'owner@test.com',     role: 'OWNER', is_2fa_enabled: true,    created_at: '2026-09-01T00:00:00Z' },
  { id: 2, username: 'alice',      email: 'alice@test.com',     role: 'USER',  is_2fa_enabled: false,   created_at: '2026-09-01T00:00:00Z' },
  { id: 3, username: 'admin',      email: 'admin@test.com',     role: 'ADMIN', is_2fa_enabled: true,    created_at: '2026-09-01T00:00:00Z' },
  { id: 4, username: 'bob',        email: 'bob@test.com',       role: 'USER',  is_2fa_enabled: false,   created_at: '2026-09-01T00:00:00Z' },
  { id: 5, username: 'carol',      email: 'carol@test.com',     role: 'OWNER', is_2fa_enabled: false,   created_at: '2026-09-01T00:00:00Z' },
];