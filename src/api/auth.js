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
 * step 2 - submit OTp
 */
export async function submitOTP({ challengeId, otp }) {
  return apiClient.post(ENDPOINTS.login2FA, { challengeId, otp });
}

/**
 * get info 
 * RealWorld FullStack API Specs (Current User Endpoint)
 * https://realworld-docs.netlify.app/docs/specs/frontend-specs/api/
 *
 * @returns {Promise<{ id: number, username: string, email: string, role: 'USER'|'OWNER'|'ADMIN', is2FaEnabled: boolean }>}
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