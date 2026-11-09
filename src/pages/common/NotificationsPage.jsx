
// currently only a placeholder. Delete it in futrue.

import { Paper, Stack, Box } from '@mui/material';
import { PageContainer, PageTitle, EmptyState, ActionButton, Icon } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

function NotificationsPage() {
    const navigate = useNavigate();

    return (
        <PageContainer maxWidth="md">
            <Stack spacing={3}>
                <Box>
                    <ActionButton variant="ghost" fullWidth={false} onClick={() => navigate('/')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon.ArrowBack fontSize="small" /> Back to Home
                        </Box>
                    </ActionButton>
                </Box>

                <PageTitle 
                    title="Notifications" 
                    subtitle="Updates about your modules, enrollments, and due dates." 
                />

                <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>

                    <EmptyState 
                        title="Inbox Zero" 
                        subtitle="Stay tuned! The notification center is currently under construction and will be available soon." 
                    />
                </Paper>
            </Stack>
        </PageContainer>
    );
}

export default NotificationsPage;