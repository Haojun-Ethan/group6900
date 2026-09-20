import { useState,useRef, useEffect } from "react";
import {validateCode, sanitizeCode} from '../../utils/codeValidation';



function CodeInput({onSubmit, submitLabel ='Verity', loadingLabel = 'Verifying', autoFocus = true,}){

    const [code,setCode] =  useState('');
    const [error,setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);


    // auto-focus on mount
    useEffect ( () => { if (autoFocus) inputRef.current?.focus(); },[autoFocus]); /* if inputRef.current is not null/undefined， call on focus. if is return undefined. */

    const handleChange = (e) =>{ setCode(sanitizeCode(e.target.value));};
    const handleSubmit = async (e)=> {
        e.preventDefault();
        setError('');

        const formatErr = validateCode(code);
        if(formatErr) {
            setError(formatErr);
            return;
        }

        setIsLoading(true);
        try{
            await onSubmit(code);
        } catch (err) {
            setError(err.message || 'Verification failed');
            setCode('');
            inputRef.current?.focus();

        } finally { setIsLoading(false);}
    };

    return(
        <form onSubmit={handleSubmit}>

            {error && <p style={{color:'red'}}> {error}</p>}
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
                {isLoading ? loadingLabel : submitLabel}
            </button>

            <p>
                Wrong account? <a href="/login">Back to login</a>
            </p>
        </form>
    );
    


}

export default CodeInput;