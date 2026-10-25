// The global state container enables all components to obtain the "current user". /全局状态，允许所有组件获取“当前用户”。
import { createContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import * as authApi from '../api/auth';


//Create context 
export const AuthContext = createContext(null);

/* delete 08-01
const computeAuthState = ( ) => {
    if (storage.getAccess() && storage.getRefresh()) return 'AUTHENTICATED';
    if (storage.getChallengeId()) return 'MFA_PENDING';
    return 'UNAUTHENTICATED';
};
*/
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(storage.getUser());
    const [authState, setAuthState] = useState(() => {
        if (storage.getChallengeId()) return 'MFA_PENDING';
        if (storage.getAccess()) return 'LOADING';
        return 'UNAUTHENTICATED';
    });

    //const [isLoading, setIsLoading] = useState(true); // Loading state, when loading is running, the state is true, finished loading change to false
  
    /*add 08-01*/
    const getErrorStatus = (err) => err?.status || err?.response?.status;
    const syncUserSession = async () => {
        try {
            const fullUser = await authApi.getMe();
            storage.setUser(fullUser);
            setUser(fullUser);
            setAuthState('AUTHENTICATED');
            return fullUser;
        } catch (err) {
            storage.clearAll();
            setUser(null);
            setAuthState('UNAUTHENTICATED');
            throw err;
        }
    };
    /* Add 08-01  When the application is first mounted, verify the local credentials and pull the latest user Profile*/
    const initSession = useCallback(async () => {
        const access = storage.getAccess();
        const challengeId = storage.getChallengeId();

        if (challengeId) {
            setUser(storage.getUser());
            setAuthState('MFA_PENDING');
           
            return;
        }

        if (access) {
            try {
                const fullUser = await authApi.getMe();
                storage.setUser(fullUser);
                setUser(fullUser);
                setAuthState('AUTHENTICATED');
            } catch (err) {
            // Token failed and auto-refresh failed
            const status = getErrorStatus(err);
                if (status === 401 || status === 403) {
                    
                    storage.clearAll();
                    setUser(null);
                    setAuthState('UNAUTHENTICATED');
                } else {
                    const cachedUser = storage.getUser();
                    if (cachedUser) {
                        setUser(cachedUser);
                        setAuthState('AUTHENTICATED');
                    } else {
                        setAuthState('UNAUTHENTICATED');
                    }
                    }
            }
        }  else {
            setAuthState('UNAUTHENTICATED');
        }
  }, []);


  // app start, restore session / 应用启动，恢复会话
    useEffect(() => {
        
        let ignore = false;
        const initialize = async () => {
            if (storage.getAccess() || storage.getChallengeId()) {
                await initSession();
            }
        };
        initialize();
        return () => { ignore = true; };
    }, [initSession]);

  

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

            const  tempUser = { username: credentials.username }; /* add 08-01  */

            storage.setUser(tempUser);  /*rewrite 5-01 */
            setUser(tempUser);
            setAuthState('MFA_PENDING')
            return{ mfaRequired:true};
        }
        storage.setAccess(result.access);   /*rewrite 5-01 */

        storage.setRefresh(result.refresh);        /*rewrite 5-03 */
        //storage.setUser({username: credentials.username});  /*rewrite 5-03 */
        /*const user = result.user || { username: credentials.username };
  storage.setUser(user);

        refreshState(); rewrite 5-01 
        return { mfaRequired:false };*/

        /* 08-01*/
        await syncUserSession();

        return { mfaRequired: false };
        }, []);

    
       const submitOTP = useCallback(async ({otp}) => {
            const challengeId = storage.getChallengeId();
            if(!challengeId) throw new Error('Please login again.');

            const{access, refresh} = await authApi.submitOTP({challengeId, otp});
            storage.removeChallengeId();
            storage.setAccess(access);
            storage.setRefresh(refresh);

            await syncUserSession();

        }, []);
        
        // logout  
        const logout = useCallback(() => {
            storage.clearAll();
            setUser(null);
            setAuthState('UNAUTHENTICATED');
        }, []);

    // Provide context value 
    const value = {
        user,
        authState,
        isAuthenticated: authState === 'AUTHENTICATED',
        isMFAPending: authState === 'MFA_PENDING',
        login,
        submitOTP,
        logout,
        refreshUser:initSession,
       
    };

        
    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;

}