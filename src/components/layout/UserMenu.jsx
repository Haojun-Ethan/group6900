import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Avatar, ListItemIcon, Divider, Box, Typography, Chip} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../ui';


//https://mui.com/material-ui/react-menu/
function UserMenu(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleAccount = () => {
        handleClose();
        
        navigate('/account');
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login', { replace: true });
    };

    
     const initial = (user?.username || 'U').charAt(0).toUpperCase();

    return (
        <>
        <IconButton onClick={handleOpen} size="small" aria-label="User menu">
            <Avatar
            sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.95rem',
                fontWeight: 600,
            }}
            >
            {initial}
            </Avatar>
        </IconButton>

        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { minWidth: 200, mt: 1 } } }}
        >
           {/* Add user identity overview header    08-01 */}
            <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body1" fontWeight={600} noWrap>
                    {user?.username || 'User'}
                </Typography>
                {user?.email && (
                    <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ mb: 0.5 }}>
                        {user.email}
                    </Typography>
                )}
                {user?.role && (
                    <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'ADMIN' ? 'error' : user.role === 'OWNER' ? 'warning' : 'primary'}
                        sx={{ fontSize: '0.65rem', height: 20 }}
                    />
                )}
            </Box>


            <Divider />

            <MenuItem onClick={handleAccount}>
            <ListItemIcon><Icon.Settings fontSize="small" /></ListItemIcon>
            Account
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
            <ListItemIcon><Icon.Logout fontSize="small" /></ListItemIcon>
            Logout
            </MenuItem>
        </Menu>
        </>
    );
}

export default UserMenu;