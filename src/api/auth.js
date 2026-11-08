// src/api/auth.js
import apiClient from "./client";
import { ENDPOINTS, } from "../config/apiContract";



export async function register(data) {
  return apiClient.post(ENDPOINTS.register, data);
}

/**
 * step 1 - login
 */
export async function login(credentials) {
  // apiClient auto change credetials to camelCase
  return apiClient.post(ENDPOINTS.login, credentials);
}

/**
 * step 2 - finish a 2FA login with either the 6-digit code or a one-time recovery code
 * @param {{ challengeId: string, otp?: string, recoveryCode?: string }} data
 */
export async function submitOTP({ challengeId, otp, recoveryCode }) {
  return apiClient.post(ENDPOINTS.login2FA, recoveryCode ? { challengeId, recoveryCode } : { challengeId, otp });
}

/**
 * Revoke the refresh token on the server, so it can't be used again after logout.
 * @param {string} refresh
 */
export async function logout(refresh) {
  return apiClient.post(ENDPOINTS.logout, { refresh });
}

/**
 * get info 
 * RealWorld FullStack API Specs (Current User Endpoint)
 * https://realworld-docs.netlify.app/docs/specs/frontend-specs/api/
 *
 * @returns {Promise<{ id: number, username: string, email: string, role: 'USER'|'OWNER'|'ADMIN', is2faEnabled: boolean }>}
 */
export async function getMe() {
  return apiClient.get(ENDPOINTS.me);
}

export async function setup2FA() {
  return apiClient.post(ENDPOINTS.twoFASetup);
}

export async function fetch2FAQR() {
  return apiClient.get(ENDPOINTS.twoFAQr);
}

export async function verify2FA(otp) {
  return apiClient.post(ENDPOINTS.twoFAVerify, { otp });
}

/*
 * Turning 2FA off and replacing recovery codes both re-check the user's identity:
 * the password plus either a 6-digit code or one recovery code.
 */
const identity = ({ password, otp, recoveryCode }) =>
  recoveryCode ? { password, recoveryCode } : { password, otp };

/** @param {{password: string, otp?: string, recoveryCode?: string}} confirmation */
export async function disable2FA(confirmation) {
  return apiClient.post(ENDPOINTS.twoFADisable, identity(confirmation));
}

/**
 * Replace all recovery codes; the old ones stop working.
 * @param {{password: string, otp?: string, recoveryCode?: string}} confirmation
 * @returns {Promise<{recoveryCodes: string[]}>}
 */
export async function regenerateRecoveryCodes(confirmation) {
  return apiClient.post(ENDPOINTS.twoFARecoveryCodes, identity(confirmation));
}