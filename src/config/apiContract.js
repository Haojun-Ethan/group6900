export const API_VERSION = 'v1.20260923';

export const ENDPOINTS ={

    register: '/accounts/register/',
    login: '/accounts/login/',
    login2FA: '/accounts/login/2fa/',
    refresh: '/api/token/refresh/',

    twoFASetup: '/accounts/2fa/setup/',
    twoFAQr: '/accounts/2fa/qr/',
    twoFAVerify: '/accounts/2fa/verify/',


    /*  Courses List ----07-01   */
    modules: '/modules/',
    moduleDetail: (id) => `/modules/${id}/`,
    moduleSchedule: (id) => `/modules/${id}/schedule/`,

    sections: '/sections/',
    sectionDetail: (id) => `/sections/${id}/`,
    sectionComplete: (id) => `/sections/${id}/complete/`,

    pathways: '/pathways/',
    pathwayDetail: (id) => `/pathways/${id}/`,
    pathwayAssign: (id) => `/pathways/${id}/assign/`,

    enrollments: '/enrollments/',
    enrollmentDetail: (id) => `/enrollments/${id}/`,
    enrollmentAssign: '/enrollments/assign/',

};

// Request
export const REQ = {

    username: 'username',
    email: 'email',
    password: 'password',
    challengeId: 'challenge_id',
    otp: 'otp',
    refresh: 'refresh',   
    

};

//Response
export const RES = {

    mfaRequired: 'mfa_required',
    access: 'access',
    refresh: 'refresh',
    challengeId: 'challenge_id',
    message: 'message',
    secret: 'secret',
    qrCode: 'qr_code',

   /*  Courses List ----07-01   */
    id: 'id',
    title: 'title',
    slug: 'slug',
    summary: 'summary',
    description: 'description',
    category: 'category',
    status: 'status',
    passMark: 'pass_mark',
    estimatedMinutes: 'estimated_minutes',
    selfEnrollAllowed: 'self_enroll_allowed',
    createdBy: 'created_by',
    sections: 'sections',
    schedule: 'schedule',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
};

// keys
export const STORAGE_KEYS = {

    access: 'edu_access',
    refresh: 'edu_refresh',
    user: 'edu_user',
    challengeId: 'edu_challenge_id',

};