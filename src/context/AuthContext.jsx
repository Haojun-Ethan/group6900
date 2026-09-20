// The global state container enables all components to obtain the "current user". /全局状态，允许所有组件获取“当前用户”。
import { createContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import * as authApi from '../api/auth';


//Create context 
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());


  const [isLoading, setIsLoading] = useState(true); // Loading state, when loading is running, the state is true, finished loading change to false
  

  // app start, restore session / 应用启动，恢复会话
  useEffect(() => {
   //initialize authorization
    const initAuth = async () => {
        const token = storage.getToken();

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // verify token by fetching user / 验证 token 通过获取用户
            const {user} = await authApi.fetchMe();
            setUser(user);
            storage.setUser(user);
        } catch {
            // token invalid, clear storage / token 无效，清除存储
            storage.clearAll();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    initAuth();

  }, []);

     // login function / 登录函数

     /**
      * login and handle 2fa requirement
      * @param {{emal:string, password:string}} credentials
      * @returns {Promise<{user?: object,requires2FA?: boolean}>}
      */
    const login = useCallback(async (credentials) => {
        const result = await authApi.login(credentials);
        /* 2FA ----3-01 */
        if (result.requires2FA) {
            storage.setTempToken(result.tempToken);   
            storage.set2FAFlow('login')     /* 2FA ----3-04*/
            return { requires2FA: true };
        }
        storage.setToken(result.token);   

        storage.setUser(result.user);        
        setUser(result.user);
        return { requires2FA: false, user: result.user };
        }, []);

    // logout function 
    const logout = useCallback(() => {
        try {
             authApi.logout();
        } catch(err) {
            // try display error message 
            console.error('[Auth] logout API failed'), { code: err?.code, message : err?.message, timestamp: new Date().toISOString(),};
        }
        storage.clearAll();
        setUser(null);
    }, []);

    // role check function    / 角色检查函数
    const hasRole = useCallback((role) => {
        if (!user) return false;
        if (Array.isArray(user.roles)) 
            return role.some((r) => user.roles.includes(r));
        
        //return user.roles === role;
        return user.roles.includes(role);
    }, [user]);

    /* register 3-01 */
    /**
     * register and handle 2FA setup requirement
     * @param {{name:string, email: string, password:string}} data
     * @returns {Promise<{user?: object, requires2FAsetup?: boolean}>}
     */
    const register = useCallback(async(data)=> {
        const result = await authApi.register(data);
        /* 2FA -----3-01 */
        if (result.requires2FASetup) {
            storage.setTempToken(result.tempToken);
            storage.set2FAFlow('register')  /* 2FA ---- 3-04 */
            return { requires2FASetup: true };
        }
        storage.setToken(result.token);
        storage.setUser(result.user);
        setUser(result.user);
        return { requires2FASetup: false, user: result.user };
    },[]);

        /* 2fa -----3-01 */
    // 2FA verify

    /**
     * complate 2fa setup after register
     * @param {string} code - 6-digit code
     * @returns {Promise<Object>} -Logged in user
     */
    const verify2FA = useCallback(async (code) => {
        const tempToken = storage.getTempToken();
        if(!tempToken){ throw {code:'INVALID_TEMP_TOKEN', message:'Session expired. Plese register again'};}  /* 2FA ----3-02 Add a check */
        const result = await authApi.verify2FA({ tempToken, code });
        storage.removeTempToken();
        storage.remove2FAFlow();  /* 2FA ---- 3-04 */
        storage.setToken(result.token);
        storage.setUser(result.user);
        setUser(result.user);
        return result.user;
    }, []);

    // 2FA challenge
    /**
     * finish 2fa challenge at login
     * @param {string} code 6-digit code
     * @returns {Promise<Object>} Loged in user 
     */
    const challenge2FA = useCallback(async (code) => {
        const tempToken = storage.getTempToken();
        if(!tempToken){ throw {code:'INVALID_TEMP_TOKEN', message:'Session expired. Plese register again'};}  /* 2FA ----3-02 Add a check  - same verify2fa */
        const result = await authApi.challenge2FA({ tempToken, code });
        storage.removeTempToken();
        storage.remove2FAFlow(); /* 2FA ---- 3-04 */
        storage.setToken(result.token);
        storage.setUser(result.user);
        setUser(result.user);
        return result.user;
    }, []);

    // Provide context value 
    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,  /* don't forget add it when write register code */
        logout,
        hasRole,
        verify2FA,  /* don't forget add it when write 2FA code */
        challenge2FA,
    };

        
    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;

}