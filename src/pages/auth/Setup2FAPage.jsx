import { useState,useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { get2FAFlow, getTempToken } from "../../utils/storage";
import * as authApi from '../../api/auth'

function Setup2FAPage() {
    const  {verify2FA} = useAuth();
    const navigate = useNavigate();

    // Setup data from backend 
    const [setupData, setSetupData] = useState(null);   // { qrCodeUri, secret, expiresIn }
    const [setupError, setSetupError] = useState('');
    const [isLoadingSetup, setIsLoadingSetup] = useState(true);

    // Code input 
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);

    // Guard + fetch setup data / 守卫 + 拉取设置数据
    useEffect(() => {
        const tempToken = getTempToken();
        const flow = get2FAFlow();

        if (!tempToken || flow !== 'register') {
        navigate('/register', { replace: true });
        return;
        }
        const load = async () => {
            try {
                const data = await authApi.setup2FA(tempToken);
                setSetupData(data);
                // Focus code input after data is loaded
                setTimeout(() => inputRef.current?.focus(), 0);
            } catch (err) { setSetupError(err.message || 'Failed to load 2FA setup');
            } finally {
                setIsLoadingSetup(false);
            }
        };

    load();
    },[navigate]);

    /**
     * Validate code format (6 digits)
     * @param {string} value
     * @returns {string | null}
     */
    const validateCode = (value) => {
        if (!value) return 'Code is required';
        if (!/^\d{6}$/.test(value)) return 'Code must be 6 digits';   
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formatError = validateCode(code);
        if (formatError) { setError(formatError);return;}

        setIsLoading(true);
        try {
        await verify2FA(code);
        navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Verification failed');
            setCode('');
        inputRef.current?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(digits);
    };

    // Copy secret to clipboard / 复制密钥到剪贴板
    const handleCopySecret = async () => {
        if (!setupData?.secret) return;
        try {
        await navigator.clipboard.writeText(setupData.secret);
        } catch {
        // Extend it in future
        }
    };

    // ===== Render states  =====

    if (isLoadingSetup) {return <p>Loading 2FA setup...</p>;}

    if (setupError) {
        return (
        <div>
        <h1>Setup Failed</h1>
            <p style={{ color: 'red' }}>{setupError}</p>
            <button onClick={() => navigate('/register', { replace: true })}>Back to register</button>
        </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
        <h1>Set Up Two-Factor Authentication</h1>

        <p>Scan the QR code with your Okta Verify app.</p>

        {/* QR code rendered via external service / 用外部服务渲染二维码  2FA ----3-03*/}
        {setupData?.qrCodeUri && (
            <div>
            <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.qrCodeUri)}`}   /* change it when change api */
                alt="2FA QR Code"
                width={200}
                height={200}
            />
            </div>
        )}

        {/* Manual secret fallback /备用方案*/}
        <div>
            <p style={{ fontSize: 12, color: '#666' }}>Can't scan? Enter this key manually:</p>
            <code style={{ fontSize: 14, background: '#f4f4f4', padding: '4px 8px' }}> {setupData?.secret}</code>
            <button type="button" onClick={handleCopySecret} style={{ marginLeft: 8 }}> Copy</button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
            <label>Enter the 6-digit code</label>
                <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                onChange={handleChange}
                disabled={isLoading}
                maxLength={6}
            />
        </div>

        <button type="submit" disabled={isLoading || code.length !== 6}>{isLoading ? 'Verifying...' : 'Verify & Finish'}</button>

        <p>
            Wrong account? <a href="/register">Back to register</a>
        </p>
        </form>
    );
    }

    export default Setup2FAPage;