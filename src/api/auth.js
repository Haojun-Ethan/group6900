// src/api/auth.js
import apiClient from "./client";
import { ENDPOINTS,REQ, RES } from "../config/apiContract";


/**
 * 
 * @param {object} res - Raw response
 * @returns {mfaRequired:boolean, access?:string, refresh?:string,challengeId?:string}
 */
const normalizaLogin = (res) => (
  {
    mfaRequired: res[RES.mfaRequired],
    access:res[RES.access],
    refresh:res[RES.refresh],
    challengeID:res[RES.challengeId],
  }
);


/**
 * register new account
 * @param {username:string,email:string, password:string} data
 * @returns {Promise<object>} - Created user
 */
export async function register(data) {
  return apiClient.post(ENDPOINTS.register,{
    [REQ.username]:data.username,
    [REQ.email]:data.email,
    [REQ.password]:data.password,
  });
}
/**
 * 
 * @param {username:string, password:string} credentials 
 * @returns {Promise<{mfaRequired:boolean, access?:string, refresh?:string, challengeId?:string}>}
 */
export async function login(credentials){
  const res=await apiClient.post(ENDPOINTS.login,{
    [REQ.username]:credentials.username,
    [REQ.password]:credentials.password,
  });
  return normalizaLogin(res)
}

/**
 * submit otp when 2fa challenge
 * @param {challegeId:string,otp:string} data 
 * @returns {Promise<{access:string,refresh:string}>}
 */
export async function submitOTP({challengeId,otp}){
  const res=await apiClient.post(ENDPOINTS.login2FA,{
    [REQ.challengeId]:challengeId,
    [REQ.otp]:otp,
  });
  return {access:res[RES.access], refresh:res[RES.refresh]};

}

