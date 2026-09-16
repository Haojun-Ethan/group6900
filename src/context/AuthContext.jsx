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
    const login = useCallback(async (credentials) => {
        const result = await authApi.login(credentials);
        storage.setToken(result.token);
        storage.setUser(result.user);
        setUser(result.user);
        return result.user;
        }, []);

    // logout function / 登出函数
    const logout = useCallback(() => {
        try {
             authApi.logout();
        } catch(err) {
            // try display error message / 尝试显示错误信息
            console.error('[Auth] logout API failed'), { code: err?.code, message : err?.message, timestamp: new Date().toISOString(),};
        }
        storage.clearAll();
        setUser(null);
    }, []);

    // role check function / 角色检查函数
    const hasRole = useCallback((role) => {
        if (!user) return false;
        if (Array.isArray(user.roles)) 
            return role.some((r) => user.roles.includes(r));
        
        //return user.roles === role;
        return user.roles.includes(role);
    }, [user]);

    /* register 3-01 */
    const register = useCallback(async(data)=> {
        const result = await authApi.register(data);
        storage.setToken(result.token);
        storage.setUser(result.user);
        setUser(result.user);
        return result.user;
    },[]);

    // Provide context value / 提供上下文值
    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,  /* don't forget add it when write register code */
        logout,
        hasRole,
    };


    
    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;

}