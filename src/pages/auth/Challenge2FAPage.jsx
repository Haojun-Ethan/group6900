
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import CodeInput from "../../components/auth/CodeInput";


/* rewrite 5-01 , all Challenge2FAPage*/

function Challenge2FAPage (){
    const { submitOTP } = useAuth();       
    const navigate = useNavigate();

    const handleSubmit = async (otp) => {
        await submitOTP(otp);
        navigate('/', { replace: true }); // Redirect to homepage after successful OTP submission
    };

    return (
        <div>
            <h1>Two-Factor Authentication</h1>
            <p>Please enter the 6-digit code from your authenticator app.</p>
            <CodeInput onSubmit={handleSubmit} submitLabel="Verify"/>
            <p>Wrong account? <a href="/login">Back to login</a></p>
        </div>
    );
}

export default Challenge2FAPage;