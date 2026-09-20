import { useEffect, useState, useRef } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getTempToken, get2FAFlow } from "../../utils/storage";


function Challenge2FAPage (){
    const {challenge2FA} = useAuth();
    const navigate = useNavigate;

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);
    useEffect(( ) => { 
        inputRef.current?.focus();
     },
    []);

    useEffect(( ) => { 
        const tempToken = getTempToken()
        const flow = get2FAFlow();
        if(!getTempToken || flow !=='login') {
            navigate('/login',{replace:true});
        }
    },[navigate]);


    const validateCode =(value) => { 
        if(!value) return 'Code is required';
        if(!/^\d{6}$/.test(value)) return 'Code must be digits';  /* okta/google verity handbook */
        return null;
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setError('');

        const formatErr = validateCode(code);
        if(formatErr) {
            setError(formatErr);
            return;
        }

        setIsLoading(true);
        try{
            challenge2FA(code);
            navigate('/',{replace:true});
        } catch (err){
            setError(err.message || 'Verification failed');
            setCode('');
            inputRef.current?.focus();

        } finally {
            setIsLoading(false);
        }
    

    };

    const handleChange = (e) => { 
        const digits= e.target.value.replace(/\D/g,'').slice(0,6);   /* Regular Expression, \D -> 0-9; /g-> golbal */
        setCode(digits);
     }

     return(

        <form onSubmit={handleSubmit}>
            <h1>Two-Factor Authentication</h1>

            <p>Enter the 6-digit code from your Okta Verify app.</p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label>Verification Code</label>
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

            <button type="submit" disabled={isLoading || code.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify'}
            </button>

            <p>
                Wrong account? <a href="/login">Back to login</a>
            </p>
        </form>
    );



}


export default Challenge2FAPage;