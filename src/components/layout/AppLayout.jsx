import { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button, Stack, IconButton, Badge } from "@mui/material";
import { Outlet, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserMenu from './UserMenu';
import { useAuth  } from "../../hooks/useAuth";
import * as notificationsApi from "../../api/notifications";

// Re-check the bell count this often, besides on every page change.
const UNREAD_POLL_MS = 60000;

function AppLayout() {

  const { user } = useAuth();
  const location = useLocation();

  const navigate = useNavigate();

  const [unread, setUnread] = useState(0);

  // Count unread notifications on each page change, every minute, and whenever the notifications
  // page marks some as read.
  useEffect(() => {
    let ignore = false;

    const refresh = async () => {
      try {
        const count = await notificationsApi.getUnreadCount();
        if (!ignore) setUnread(count);
      } catch { /* keep the last count; a failed badge shouldn't break the page */ }
    };

    refresh();
    const timer = setInterval(refresh, UNREAD_POLL_MS);
    window.addEventListener(notificationsApi.NOTIFICATIONS_CHANGED, refresh);

    return () => {
      ignore = true;
      clearInterval(timer);
      window.removeEventListener(notificationsApi.NOTIFICATIONS_CHANGED, refresh);
    };
  }, [location.pathname]);

  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

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

              {isOwner && (
                <Button component={RouterLink} to="/owner/modules" color={location.pathname.startsWith('/owner/modules') ? 'primary' : 'inherit'}>
                  Manage Modules
                </Button>
              )}

              {isOwner && (
                <Button component={RouterLink} to="/owner/gradebook"
                  color={location.pathname.startsWith('/owner/gradebook') || location.pathname.startsWith('/owner/attempts') ? 'primary' : 'inherit'}>
                  Gradebook
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
              aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
            >
              <Badge badgeContent={unread} max={99} color="error">
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