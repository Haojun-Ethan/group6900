// src/pages/account/Setup2FAPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack, Box, Typography, Paper, 
} from '@mui/material';
import * as authApi from '../../api/auth';
import { PageContainer, PageTitle, ActionButton, AlertMessage, Icon } from '../../components/ui';
import CodeInput from '../../components/auth/CodeInput';

/*
 PyOTP handbook : https://pyauth.github.io/pyotp/
 */
function Setup2FAPage() {
  const navigate = useNavigate();

  // Setup data 
  const [secret,setSecret]=useState('');
  const [qrCode,setQrCode]=useState('');

  const [setupError,setSetupError] = useState('');
  const [isLoadingSetup,setIsLoadingSetup] = useState(true);

  // Success state 
  const [isEnabled,setIsEnabled] = useState(false);

  // generate secret + fetch QR
  useEffect(() => {
    const load = async () => {
      try {
        // Step 1: generate secret 
       // await authApi.setup2FA();
        const setupRes = await authApi.setup2FA();
        setSecret(setupRes.secret);

        // Step 2: get QR
       
        const { qrCode } = await authApi.fetch2FAQR();
        setQrCode(qrCode);

        // Also fetch secret for manual entry 
        //const setupRes = await authApi.setup2FA();   /* put at here, setup is called 2 times */
        //setSecret(setupRes.secret);
      } catch (err) {
        setSetupError(err.message || 'Failed to load 2FA setup');
      } finally {
        setIsLoadingSetup(false);
      }
    };
    load();
  }, []);

  /**
   * Submit OTP to verify and enable 
   * @param {string} otp
   */
  const handleSubmit = async (otp) => {
    await authApi.verify2FA(otp);
    setIsEnabled(true);
  };



  if (isLoadingSetup) {
    return (
      <PageContainer maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: 2, textAlign: 'center' }}>
          <Typography>Loading 2FA setup...</Typography>
        </Paper>
      </PageContainer>
    );
  }


  if (setupError) {
    return (
      <PageContainer maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: 2 }}>
          <Stack spacing={2.5}>
            <PageTitle title="Setup Failed" />
            <AlertMessage type="error">{setupError}</AlertMessage>
            <ActionButton onClick={() => navigate('/account')}>
              Back to Account
            </ActionButton>
          </Stack>
        </Paper>
      </PageContainer>
    );
  }

  // Success
  if (isEnabled) {
    return (
      <PageContainer maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: 2 }}>
          <Stack spacing={2.5} alignItems="center">
            <Icon.CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
            <PageTitle
              title="2FA Enabled"
              subtitle="Two-factor authentication is now active for your account."
            />
            <ActionButton onClick={() => navigate('/account')}>
              Back to Account
            </ActionButton>
          </Stack>
        </Paper>
      </PageContainer>
    );
  }


  return (
    <PageContainer maxWidth="sm">
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          <PageTitle
            title="Set Up 2FA"
            subtitle="Scan the QR code with your Okta Verify app."
          />

          {/* QR code */}
          {qrCode && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="2FA QR Code"
                style={{
                  width: 200,
                  height: 200,
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          {/* Manual secret  */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Can't scan? Enter this key manually:
            </Typography>
            <Box
              component="code"
              sx={{
                display: 'block',
                p: 1.5,
                backgroundColor: '#f5f5f7',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                wordBreak: 'break-all',
              }}
            >
              {secret || 'Loading...'}
            </Box>
          </Box>

          {/* OTP input */}
          <CodeInput
            onSubmit={handleSubmit}
            submitLabel="Verify & Enable"
            loadingLabel="Enabling..."
          />

          <ActionButton variant="ghost" onClick={() => navigate('/account')}>
            Cancel
          </ActionButton>
        </Stack>
      </Paper>
    </PageContainer>
  );
}

export default Setup2FAPage;