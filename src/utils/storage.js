/* Rewrite , follow backend----- 5---01*/
// src/utils/storage.js
import { STORAGE_KEYS } from '../config/apiContract';

// Access token 
export const getAccess = () => localStorage.getItem(STORAGE_KEYS.access);
export const setAccess = (v) => localStorage.setItem(STORAGE_KEYS.access, v);
export const removeAccess = ( ) => localStorage.removeItem(STORAGE_KEYS.access);

// Refresh token 
export const getRefresh = () => localStorage.getItem(STORAGE_KEYS.refresh);
export const setRefresh = (v)=> localStorage.setItem(STORAGE_KEYS.refresh, v);
export const removeRefresh = ( ) => localStorage.removeItem(STORAGE_KEYS.refresh);

// User info 
export const getUser = () => {
const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    try {return JSON.parse(raw);} catch {return null;}
};
export const setUser = (u) => {
if (!u) return;
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
};
export const removeUser = () => localStorage.removeItem(STORAGE_KEYS.user);

// 2FA challenge id 
export const getChallengeId =( )=> localStorage.getItem(STORAGE_KEYS.challengeId);
export const setChallengeId = (v) => localStorage.setItem(STORAGE_KEYS.challengeId, v);
export const removeChallengeId = () => localStorage.removeItem(STORAGE_KEYS.challengeId);

// Clear all 
export const clearAll = ( ) => {
    removeAccess();
    removeRefresh();
    removeUser();
    removeChallengeId();
};