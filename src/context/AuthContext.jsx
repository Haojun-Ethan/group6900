// The global auth state: who is logged in, and the login / 2FA / logout actions.
import { useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import * as authApi from '../api/auth';
import { AuthContext } from './authContextObject';

const getErrorStatus = (err) => err?.status || err?.response?.status;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(storage.getUser());
    const [authState, setAuthState] = useState(() => {
        if (storage.getChallengeId()) return 'MFA_PENDING';
        if (storage.getAccess()) return 'LOADING';
        return 'UNAUTHENTICATED';
    });

    const clearSession = useCallback(() => {
        storage.clearAll();
        setUser(null);
        setAuthState('UNAUTHENTICATED');
    }, []);

    /** Load the profile (role, 2FA status) from /accounts/me/ and mark the session as logged in. */
    const fetchAndSyncUser = useCallback(async () => {
        // client.js turns is_2fa_enabled into is2faEnabled (lowercase "f").
        const fullUser = await authApi.getMe();
        storage.setUser(fullUser);
        setUser(fullUser);
        setAuthState('AUTHENTICATED');
        return fullUser;
    }, []);

    /** After receiving tokens: load the profile, or undo the half-finished login if that fails. */
    const completeLogin = useCallback(async (access, refresh) => {
        storage.setAccess(access);
        storage.setRefresh(refresh);
        try {
            await fetchAndSyncUser();
        } catch (err) {
            clearSession();
            throw err;
        }
    }, [fetchAndSyncUser, clearSession]);

    // On app start, check the saved tokens still work and load the latest profile.
    useEffect(() => {
        const initSession = async () => {
            if (storage.getChallengeId()) {
                setUser(storage.getUser());
                setAuthState('MFA_PENDING');
                return;
            }

            if (!storage.getAccess()) {
                setAuthState('UNAUTHENTICATED');
                return;
            }

            try {
                await fetchAndSyncUser();
            } catch (err) {
                const status = getErrorStatus(err);
                const cachedUser = storage.getUser();

                // Network trouble (e.g. the server is still waking up): keep the cached profile
                // rather than logging the user out. A rejected token ends the session.
                if (status !== 401 && status !== 403 && cachedUser && storage.getAccess()) {
                    setUser(cachedUser);
                    setAuthState('AUTHENTICATED');
                } else {
                    clearSession();
                }
            }
        };

        initSession();
    }, [fetchAndSyncUser, clearSession]);

    // client.js fires this when a token refresh fails; the route guards then send the user to /login.
    useEffect(() => {
        window.addEventListener('session-expired', clearSession);
        return () => window.removeEventListener('session-expired', clearSession);
    }, [clearSession]);

    /**
     * Step 1 of login. With 2FA on, the backend returns a challenge instead of tokens.
     * @param {{username: string, password: string}} credentials
     * @returns {Promise<{mfaRequired: boolean}>}
     */
    const login = useCallback(async (credentials) => {
        const result = await authApi.login(credentials);

        if (result.mfaRequired) {
            storage.setChallengeId(result.challengeId);

            const tempUser = { username: credentials.username };
            storage.setUser(tempUser);
            setUser(tempUser);
            setAuthState('MFA_PENDING');
            return { mfaRequired: true };
        }

        await completeLogin(result.access, result.refresh);
        return { mfaRequired: false };
    }, [completeLogin]);

    /**
     * Step 2 of a 2FA login: the authenticator code, or a one-time recovery code.
     * @param {{otp?: string, recoveryCode?: string}} secondFactor
     */
    const submitOTP = useCallback(async ({ otp, recoveryCode }) => {
        const challengeId = storage.getChallengeId();
        if (!challengeId) throw new Error('Please log in again.');

        const { access, refresh } = await authApi.submitOTP({ challengeId, otp, recoveryCode });
        storage.removeChallengeId();
        await completeLogin(access, refresh);
    }, [completeLogin]);

    /** Leave the 2FA step and start again from the login form. */
    const cancelMFA = useCallback(() => {
        clearSession();
    }, [clearSession]);

    /** Revoke the refresh token on the server, then clear the local session. */
    const logout = useCallback(async () => {
        const refresh = storage.getRefresh();

        if (refresh) {
            try {
                await authApi.logout(refresh);
            } catch {
                // Log out locally anyway; the token expires on its own within a day.
            }
        }

        clearSession();
    }, [clearSession]);

    const value = {
        user,
        authState,
        isAuthenticated: authState === 'AUTHENTICATED',
        isMFAPending: authState === 'MFA_PENDING',
        login,
        submitOTP,
        cancelMFA,
        logout,
        refreshUser: fetchAndSyncUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
