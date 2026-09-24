
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import CodeInput from "../../components/auth/CodeInput";

import { Stack,Link as MuiLink } from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import AuthLayout from "../../components/ui/AuthLayout";


/* rewrite 5-01 , all Challenge2FAPage*/

function Challenge2FAPage (){
    const { submitOTP } = useAuth();       
    const navigate = useNavigate();

    const handleSubmit = async (otp) => {
        await submitOTP(otp);
        navigate('/', { replace: true }); // Redirect to homepage after successful OTP submission
    };

    return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Enter the 6-digit code from your authenticator app."
    >
      <Stack spacing={3}>
        <CodeInput onSubmit={handleSubmit} submitLabel="Verify" />

        <MuiLink
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ textAlign: 'center', fontSize: '0.9rem' }}
        >
          Wrong account? Back to login
        </MuiLink>
      </Stack>
    </AuthLayout>
    );
}

export default Challenge2FAPage;


/*  MUI ----6-01
        <div>
            <h1>Two-Factor Authentication</h1>
            <p>Please enter the 6-digit code from your authenticator app.</p>
            <CodeInput onSubmit={handleSubmit} submitLabel="Verify"/>
            <p>Wrong account? <a href="/login">Back to login</a></p>
        </div>
*/