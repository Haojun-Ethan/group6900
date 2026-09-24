import { useState,useRef, useEffect } from "react";
import {validateCode, filterCode} from '../../utils/codeValidation';
import { Stack } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { FormField, ActionButton, AlertMessage } from "../ui";


function CodeInput({onSubmit, submitLabel ='Verity', loadingLabel = 'Verifying', autoFocus = true,}){

    const [code,setCode] =  useState('');
    const [error,setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);


    // auto-focus on mount
    useEffect ( () => { if (autoFocus) inputRef.current?.focus(); },[autoFocus]); /* if inputRef.current is not null/undefined， call on focus. if is return undefined. */

    const handleChange = (e) =>{ setCode(filterCode(e.target.value));};
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
            <Stack spacing={2.5}>
                {error && <AlertMessage type="error">{error}</AlertMessage>}

                <FormField
                label="Verification Code"
                value={code}
                onChange={handleChange}
                
                disabled={isLoading}
                inputRef={inputRef}


                inputProps={{
                    inputMode: 'numeric',
                    autoComplete: 'one-time-code',
                    maxLength: 6,
                    style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    letterSpacing: '0.5rem',
                    },
                }}
                />

                <ActionButton
                type="submit"
                loading={isLoading}
                loadingText={loadingLabel}
                disabled={code.length !== 6}
                >
                {submitLabel}
                </ActionButton>
            </Stack>
        </form>       
    );
    


}

export default CodeInput;

 
/*  MUI ----06-01
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
        */