const KEYS = {
    TOKEN: 'edu_token',
    USER: 'edu_user',
    TEMP_TOKEN: 'edu_temp_token',  /* 2FA --- 3-01  vri user and 2fa tokenF */
    TWO_FA_FLOW: 'edu_2fa_flow'    /* 2FA --- 3-04  add 2FA flow */
};


// Token
export const getToken = () => localStorage.getItem(KEYS.TOKEN);
export const setToken = (token) => localStorage.setItem(KEYS.TOKEN, token);
export const removeToken = () => localStorage.removeItem(KEYS.TOKEN);

/* 2FA --- 3-04  add 2FA flow */
// 2FA flow marker - login & register
export const get2FAFlow = ( ) => localStorage.getItem(KEYS.TWO_FA_FLOW);
export const set2FAFlow = (flow) => localStorage.setItem(KEYS.TWO_FA_FLOW,flow);
export const remove2FAFlow=( ) => localStorage.removeItem(KEYS.TWO_FA_FLOW);


// User
export const getUser = () => { 
    const raw = localStorage.getItem(KEYS.USER);

    if (!raw || raw === 'undefined' || raw === 'null') return null;   
    try {
        return JSON.parse(raw);                                        
    } catch {
        return null;                                                 
    }
};

export const setUser = (user) => {
    
    if (!user) return;
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const removeUser = () => localStorage.removeItem(KEYS.USER);

//Temp token - 2FA flow    /*  2FA ---- 3-01 */
export const getTempToken = () => localStorage.getItem(KEYS.TEMP_TOKEN);
export const setTempToken = (token) => localStorage.setItem(KEYS.TEMP_TOKEN, token);
export const removeTempToken = () => localStorage.removeItem(KEYS.TEMP_TOKEN);


// Clear all storage 
export const clearAll = () => {  /* keep all keys are cleard */
    removeToken();
    removeUser();
    removeTempToken();  
    remove2FAFlow(); 
};
