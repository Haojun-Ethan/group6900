import { AppBar, Box, Toolbar, Typography, Button, Stack, IconButton, Badge } from "@mui/material";
import { Outlet, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserMenu from './UserMenu';
import { useAuth  } from "../../hooks/useAuth";


function AppLayout() {

  const { user } = useAuth();
  const location = useLocation();
  
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography
            variant="h3"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: { xs: 1, md: 0 }, fontWeight: 700, letterSpacing: 0.5, textDecoration: 'none', color: 'inherit', mr:4 }}
          >
            DefendEd
          </Typography>
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button component={RouterLink} to="/" color={location.pathname === '/' ? 'primary' : 'inherit'}>
                Home
              </Button>

              <Button component={RouterLink} to="/modules" color={location.pathname.includes('/modules') && !location.pathname.includes('/user/') ? 'primary' : 'inherit'}>
                Browse Modules
              </Button>

              <Button component={RouterLink} to="/pathways" color={location.pathname.includes('/pathways') ? 'primary' : 'inherit'}>
                Pathways
              </Button>


              {user?.role === 'USER' && (
                <Button component={RouterLink} to="/user/modules" color={location.pathname.includes('/user/modules') ? 'primary' : 'inherit'}>
                  My Modules
                </Button>
              )}

              {(user?.role === 'OWNER' || user?.role === 'ADMIN') && (
                <Button component={RouterLink} to="/owner/modules" color={location.pathname.includes('/owner/') ? 'primary' : 'inherit'}>
                  Manage Modules
                </Button>
              )}

              {user?.role === 'ADMIN' && (
                <Button component={RouterLink} to="/admin/users" color={location.pathname.includes('/admin/') ? 'primary' : 'inherit'}>
                  Manage Users
                </Button>
              )}
            </Stack>

            <IconButton 
              color="inherit" 
              onClick={() => navigate('/notifications')}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

          <UserMenu />
        </Toolbar>
      </AppBar>

    
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;