import { useState } from 'react';
import { Paper, Stack, Typography, Box, Button, Chip, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

import { useAuth } from '../../hooks/useAuth';
import * as authApi from '../../api/auth';
import { PageContainer, PageTitle, AlertMessage } from '../../components/ui';
import ConfirmIdentityDialog from '../../components/auth/ConfirmIdentityDialog';
import RecoveryCodesPanel from '../../components/auth/RecoveryCodesPanel';
import './AccountPage.css';

function AccountPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const is2FaActive = Boolean(user?.is2faEnabled);

  // Which identity check is open: 'disable' | 'codes' | null
  const [confirming, setConfirming] = useState(null);
  const [newCodes, setNewCodes] = useState([]);
  const [notice, setNotice] = useState('');

  const handleDisable = async (confirmation) => {
    await authApi.disable2FA(confirmation);
    setConfirming(null);
    setNotice('Two-factor authentication is now off. Your recovery codes no longer work.');
    try { await refreshUser(); } catch { /* the page updates on the next profile load */ }
  };

  const handleNewCodes = async (confirmation) => {
    const { recoveryCodes } = await authApi.regenerateRecoveryCodes(confirmation);
    setConfirming(null);
    setNewCodes(recoveryCodes || []);
  };

  return (
    <PageContainer className="account-page" maxWidth="md">
      <Stack spacing={3}>
        <Box className="account-welcome">
          <PageTitle
            title="Account"
            subtitle={`Signed in as ${user?.username || 'User'}`}
          />
        </Box>

        {notice && <AlertMessage type="success">{notice}</AlertMessage>}

        <Paper className="account-security" elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box className="account-security-icon">
              <SecurityIcon />
            </Box>
            <Typography variant="h3" gutterBottom>
              Security
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3, pb: 3, borderBottom: '1px solid #e2e8f0' }}>
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your account password.
              </Typography>
            </Box>

            <Tooltip title="Backend API is not available yet">
              <span>
                <Button variant="outlined" disabled>
                  Change
                </Button>
              </span>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {is2FaActive
                  ? 'Two-factor authentication is currently protecting your account.'
                  : 'Add an extra layer of security to your account.'}
              </Typography>
            </Box>

            {is2FaActive ? (
              <Chip label="Enabled" color="success" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1.5, px: 1 }} />
            ) : (
              <Button variant="outlined" onClick={() => navigate('/account/2fa/setup')}>
                Enable
              </Button>
            )}
          </Box>

          {is2FaActive && (
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
              <Button variant="outlined" onClick={() => { setNotice(''); setConfirming('codes'); }}>
                New recovery codes
              </Button>
              <Button variant="outlined" color="error" onClick={() => { setNotice(''); setConfirming('disable'); }}>
                Turn off 2FA
              </Button>
            </Stack>
          )}
        </Paper>

        <Button variant="text" onClick={() => navigate('/')}>
          ← Back to Home
        </Button>
      </Stack>

      <ConfirmIdentityDialog
        open={confirming === 'codes'}
        title="Get new recovery codes"
        description="Your current recovery codes will stop working. Confirm it's you to continue."
        confirmLabel="Get new codes"
        onClose={() => setConfirming(null)}
        onConfirm={handleNewCodes}
      />

      <ConfirmIdentityDialog
        open={confirming === 'disable'}
        title="Turn off two-factor authentication"
        description="Anyone with your password will be able to sign in. Confirm it's you to continue."
        confirmLabel="Turn off 2FA"
        danger
        onClose={() => setConfirming(null)}
        onConfirm={handleDisable}
      />

      <Dialog open={newCodes.length > 0} fullWidth maxWidth="sm">
        <DialogTitle>Your new recovery codes</DialogTitle>
        <DialogContent>
          <RecoveryCodesPanel codes={newCodes} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setNewCodes([])}>I've saved my codes</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

export default AccountPage;
