// The global state container enables all components to obtain the "current user". /全局状态，允许所有组件获取“当前用户”。
import { createContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import * as authApi from '../api/auth';


//Create context 
export const AuthContext = createContext(null);


const computeAuthState = ( ) => {
    if (storage.getAccess() && storage.getRefresh()) return 'AUTHENTICATED';
    if (storage.getChallengeId()) return 'MFA_PENDING';
    return 'UNAUTHENTICATED';
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(storage.getUser());
    const [authState, setAuthstate] = useState(computeAuthState);

    //const [isLoading, setIsLoading] = useState(true); // Loading state, when loading is running, the state is true, finished loading change to false
  

  // app start, restore session / 应用启动，恢复会话
    useEffect(() => {
        //initialize authorization
        setAuthstate(computeAuthState());  /* rewrite 5-01 - check error  */ 
        setUser(storage.getUser());

  }, []);

  const refreshState = useCallback(
    ( ) => { setAuthstate(computeAuthState());
        setUser(storage.getUser());
     },[]  );

     // login function / 登录函数

     /**
      * login and handle 2fa requirement
      * @param {{email:string, password:string}} credentials
      * @returns {Promise<{mfaRequired:boolean}>}
      */
    const login = useCallback(async (credentials) => {
        const result = await authApi.login(credentials);
        /* 2FA ----3-01 */
        if (result.mfaRequired) {
            storage.setChallengeId(result.challengeId);    /*rewrite 5-01 */
            refreshState();
            return{ mfaRequired:true};
        }
        storage.setAccess(result.access);   /*rewrite 5-01 */

        storage.setRefresh(result.refresh);        /*rewrite 5-01 */
        refreshState(); /*rewrite 5-01 */
        return { mfaRequired:false };
        }, [refreshState]);

    
       const submitOTP = useCallback(async ({otp}) => {
            const challengeId = storage.getChallengeId();
            if(!challengeId) throw new Error('Please login again.');

            const{access, refresh} = await authApi.submitOTP({challengeId, otp});
            storage.removeChallengeId();
            storage.setAccess(access);
            storage.setRefresh(refresh);
            refreshState();

        }, [refreshState]);
        
        // logout  
        const logout = useCallback(() => {
            storage.clearAll();
            refreshState();
        }, [refreshState]);

    // Provide context value 
    const value = {
        user,
        authState,
        isAuthenticated: authState === 'AUTHENTICATED',
        isMFAPending: authState === 'MFA_PENDING',
        login,
        submitOTP,
        logout,
       
    };

        
    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;

}