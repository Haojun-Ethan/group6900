/** 
 * validate a 6-digit verification code
 * @param {string}   value  - Code input
 * @returns {string | null} - Error message or null
 */

/*    restruction from Challenge2FAPage & setup2FApage, 2FA ----3-04 restruction */
export const validateCode =(value) => { 
    if(!value) return 'Code is required';
    if(!/^\d{6}$/.test(value)) return 'Code must be digits';  /* okta/google verity handbook */
    return null;
};

/**
 * 
 * @param {string} value - input
 * @returns {string} - Cleaned code
 */
export const filterCode = (value) =>value.replace(/\D/g, '').slice(0,6);