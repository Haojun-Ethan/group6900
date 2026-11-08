import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Link as MuiLink } from "@mui/material";

import { useAuth } from "../../hooks/useAuth";
import CodeInput from "../../components/auth/CodeInput";
import AuthLayout from "../../components/ui/AuthLayout";
import { ActionButton, AlertMessage, FormField } from "../../components/ui";
import './Challenge2FAPage.css';

/** Login step 2: the authenticator code, or a one-time recovery code if the phone is lost. */
function Challenge2FAPage() {
    const { submitOTP, cancelMFA } = useAuth();
    const navigate = useNavigate();

    const [useRecovery, setUseRecovery] = useState(false);
    const [recoveryCode, setRecoveryCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const finish = () => navigate('/', { replace: true });

    const handleOtp = async (otp) => {
        await submitOTP({ otp });   // CodeInput shows any error
        finish();
    };

    const handleRecovery = async (e) => {
        e.preventDefault();
        if (!recoveryCode.trim()) {
            setError('Enter one of your recovery codes');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            await submitOTP({ recoveryCode: recoveryCode.trim() });
            finish();
        } catch (err) {
            setError(err.message || 'That recovery code was not accepted');
        } finally {
            setIsLoading(false);
        }
    };

    // Clear the pending challenge first; otherwise the guest-only /login route sends us straight back here.
    const backToLogin = (e) => {
        e.preventDefault();
        cancelMFA();
        navigate('/login', { replace: true });
    };

    const toggleMode = (e) => {
        e.preventDefault();
        setUseRecovery((v) => !v);
        setError('');
    };

    return (
        <AuthLayout
            className="challenge-2fa-page"
            title="Two-Factor Authentication"
            subtitle={useRecovery
                ? 'Enter one of the recovery codes you saved when you set up 2FA. Each code works once.'
                : 'Enter the 6-digit code from your authenticator app.'}
        >
            <Stack spacing={3}>
                {useRecovery ? (
                    <form onSubmit={handleRecovery}>
                        <Stack spacing={2.5}>
                            {error && <AlertMessage type="error">{error}</AlertMessage>}
                            <FormField
                                label="Recovery code"
                                value={recoveryCode}
                                onChange={(e) => setRecoveryCode(e.target.value)}
                                disabled={isLoading}
                                autoComplete="off"
                                inputProps={{ maxLength: 32, style: { textAlign: 'center', letterSpacing: '0.2rem' } }}
                            />
                            <ActionButton type="submit" loading={isLoading} loadingText="Verifying...">
                                Verify
                            </ActionButton>
                        </Stack>
                    </form>
                ) : (
                    <CodeInput onSubmit={handleOtp} submitLabel="Verify" />
                )}

                <MuiLink component="button" type="button" onClick={toggleMode} underline="hover"
                    sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    {useRecovery ? 'Use my authenticator app instead' : 'Lost your phone? Use a recovery code'}
                </MuiLink>

                <MuiLink component="button" type="button" onClick={backToLogin} underline="hover"
                    sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    Wrong account? Back to login
                </MuiLink>
            </Stack>
        </AuthLayout>
    );
}

export default Challenge2FAPage;
