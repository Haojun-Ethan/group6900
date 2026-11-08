
import { Paper, Stack, Typography, Box, Button , Chip, Tooltip} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
//import { PageContainer, PageTitle } from '../../components/ui';
import { PageContainer, PageTitle } from '../../components/ui';

import SecurityIcon from '@mui/icons-material/Security';
import './AccountPage.css';


/**
 MUI handbook
https://mui.com/material-ui/react-list/
 */
function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const is2FaActive = Boolean(user?.is2FaEnabled);

  return (
    <PageContainer className="account-page" maxWidth="md">
      <Stack spacing={3}>
        <Box className="account-welcome">
          <PageTitle
            title="Account"
            subtitle={`Signed in as ${user?.username || 'User'}`}
          />
        </Box>
        
        <Paper className="account-security" elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, mb: 2, }}>
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>   
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
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/account/2fa/setup')}
                    >
                      Enable
                    </Button>
                )}
          </Box>
        </Paper>


        <Button variant="text" onClick={() => navigate('/')}>
          ← Back to Home
        </Button>
      </Stack>
    </PageContainer>
  );
}

export default AccountPage;