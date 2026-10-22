import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Skeleton, Alert, Stack, Box,
} from '@mui/material';
//import * as modulesApi from '../../../api/modules';
import { useAuth } from '../../../hooks/useAuth';
import {
  PageContainer, PageTitle, ActionButton, EmptyState, Icon,
} from '../../../components/ui';
import ModuleCard from '../../../components/modules/ModuleCard';
import { MOCK_MODULES } from '../_mockData';

const DEMO_STATE = 'normal'; // 'normal' | 'loading' | 'empty' | 'error'

/*  Owner's module management page   课程管理员 */
function ManageModulesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);

            setError('');

            try {

                // future : const data = await modulesApi.listMyCreatedModules(user.username);

                const data = await new Promise((r) =>
                setTimeout(() => r(MOCK_MODULES.filter((m) => m.created_by?.username === 'owner_test')),400)
                );

                setModules(data);
            } catch (err) {
                setError(err.message || 'Failed to load modules');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [user]);

    const effectiveLoading = DEMO_STATE === 'loading' ? true : isLoading;
    const effectiveError = DEMO_STATE === 'error' ? 'Failed to load' : error;
    const effectiveModules = DEMO_STATE === 'empty' ? [] : modules;

    if (effectiveLoading) {
        return (
            <PageContainer maxWidth="lg">
                <PageTitle title="Manage Modules" />
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {[1, 2, 3].map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n}>
                        <Skeleton variant="rounded" height={200} />
                        </Grid>
                    ))}
                </Grid>
            </PageContainer>
        );
    }

    if (effectiveError) {
        return (
            <PageContainer maxWidth="lg">
                <PageTitle title="Manage Modules" />
                <Alert severity="error">{effectiveError}</Alert>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="lg">
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 3 }}
        >
            <PageTitle
            title="Manage Modules"
            subtitle={`${effectiveModules.length} module${effectiveModules.length === 1 ? '' : 's'} created by you`}
            />


            <ActionButton
            fullWidth={false}
            onClick={() => navigate('/owner/modules/create')}
            >

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon.Add fontSize="small" />
                    Create Module
                </Box>
            </ActionButton>
        </Stack>

        {effectiveModules.length === 0 ? (
            <EmptyState
            title="No modules yet"
            subtitle="Create your first training module to get started."
                action={
                    <ActionButton fullWidth={false} onClick={() => navigate('/owner/modules/create')} >
                    Create Module
                    </ActionButton>
                    
                }
            />
        ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
                {effectiveModules.map((m) => (
                    <Grid item xs={12} sm={6} md={4} key={m.id}>
                    <ModuleCard module={m} />

                    </Grid>
                ))}
            </Grid>
        )}
        </PageContainer>
    );
}

export default ManageModulesPage;