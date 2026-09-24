import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer, Icon } from '../../components/ui';


const HOME_CARDS = [
    {
        key: 'browse',
        title: 'Browse Modules',
        description: 'Discover available training modules',
        path: '/modules',
        roles: ['USER', 'OWNER', 'ADMIN'],
        icon: 'School',
    },
    {
        key: 'my-modules',
        title: 'My Modules',
        description: 'Continue your enrolled courses',
        path: '/user/modules',
        roles: ['USER'],
        icon: 'School',
    },
    {
        key: 'manage-modules',
        title: 'Manage Modules',
        description: 'Create and edit training content',
        path: '/owner/modules',
        roles: ['OWNER', 'ADMIN'],
        icon: 'Dashboard',
    },
    {
        key: 'manage-users',
        title: 'Manage Users',
        description: 'Manage user accounts and roles',
        path: '/admin/users',
        roles: ['ADMIN'],
        icon: 'Person',
    },
    {
        key: 'account',
        title: 'Account Settings',
        description: 'Profile and security settings',
        path: '/account',
        roles: ['USER', 'OWNER', 'ADMIN'],
        icon: 'Settings',
    },
];

// Get icon component by name

const ICON_MAP = {
    School: Icon.School,
    Dashboard: Icon.Dashboard,
    Person: Icon.Person,
    Settings: Icon.Settings,
};

/* Home page 
 https://mui.com/material-ui/react-grid/
 */
function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Backend does not return user.role yet

    const userRole = user?.role;
    // Filter cards for different role
    const visibleCards = userRole
    ? HOME_CARDS.filter((card) => card.roles.includes(userRole))
    : HOME_CARDS;

    return (
    <PageContainer maxWidth="lg">

    <Box sx={{ mb: 4 }}>
        <Typography variant="h1" gutterBottom>
        Welcome back, {user?.username || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
        Here's an overview of what you can do.
        </Typography>
    </Box>

    
    <Grid container spacing={{ xs: 2, md: 3 }}>
        {visibleCards.map((card) => {
        const IconComp = ICON_MAP[card.icon] || Icon.School;
        return (
            <Grid item xs={12} sm={6} md={4} key={card.key}>
            <Paper
                elevation={0}
                onClick={() => navigate(card.path)}
                sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                // Hover lift  /* easier than asp+vb script */
                
                // https://mui.com/material-ui/customization/transitions/
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(59, 91, 140, 0.08)',
                        color: 'primary.main',
                        mb: 2,
                    }}
                    >
                    <IconComp />
                </Box>

                <Typography variant="h3" gutterBottom>
                {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {card.description}
                </Typography>
            </Paper>
            </Grid>
        );
        })}
    </Grid>
    </PageContainer>
);
}

export default HomePage;