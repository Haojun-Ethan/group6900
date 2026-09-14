const KEYS = {
    TOKEN: 'edu_token',
    USER: 'edu_user',
};


// Token
export const getToken = () => localStorage.getItem(KEYS.TOKEN);
export const setToken = (token) => localStorage.setItem(KEYS.TOKEN, token);
export const removeToken = () => localStorage.removeItem(KEYS.TOKEN);

// User
export const getUser = () => { 
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
};

export const setUser = (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user));


export const removeUser = () => localStorage.removeItem(KEYS.USER);


// Clear all storage 
export const clearAll = () => {
    removeToken();
    removeUser();
};
