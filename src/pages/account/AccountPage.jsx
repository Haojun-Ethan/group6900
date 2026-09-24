
import { Paper, Stack, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer, PageTitle } from '../../components/ui';

/**
 MUI handbook
https://mui.com/material-ui/react-list/
 */
function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={3}>
        <PageTitle
          title="Account"
          subtitle={`Signed in as ${user?.username || 'User'}`}
        />

   
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
          <Typography variant="h3" gutterBottom>
            Security
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add an extra layer of security to your account
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={() => navigate('/account/2fa/setup')}
            >
              Enable
            </Button>
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