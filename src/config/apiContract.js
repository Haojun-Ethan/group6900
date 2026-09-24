export const API_VERSION = 'v1.20260923';

export const ENDPOINTS ={

    register: '/accounts/register/',
    login: '/accounts/login/',
    login2FA: '/accounts/login/2fa/',
    refresh: '/api/token/refresh/',

    twoFASetup: '/accounts/2fa/setup/',
    twoFAQr: '/accounts/2fa/qr/',
    twoFAVerify: '/accounts/2fa/verify/',

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

};

// keys
export const STORAGE_KEYS = {

    access: 'edu_access',
    refresh: 'edu_refresh',
    user: 'edu_user',
    challengeId: 'edu_challenge_id',

};