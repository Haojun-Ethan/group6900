import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Skeleton, Alert, Stack, Box, Button, Paper } from '@mui/material';
import * as modulesApi from '../../../api/modules';
import { useAuth } from '../../../hooks/useAuth';
import { PageContainer, PageTitle, ActionButton, EmptyState, Icon, } from '../../../components/ui';
import ModuleCard from '../../../components/modules/ModuleCard';


/*  Owner's module management page    */
function ManageModulesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false; 
        const load = async () => {
            setIsLoading(true);

            setError('');

            try {

                // future : const data = await modulesApi.listMyCreatedModules(user.username);

                const allModules = await modulesApi.listModules(); 
                const myModules = (allModules || []).filter((m) => {
                        if (user?.role === 'ADMIN' || !m.createdBy) return true;
                        return m.createdBy?.username === user?.username;
                });

                if (!ignore) { setModules(myModules); }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || 'Failed to load modules');
                }
            } finally {
                if (!ignore) {setIsLoading(false);}
            }
        };
        load();
        return () => { ignore = true; }
    }, [user]);


    const handleDelete = async (moduleId, e) => {
        e.stopPropagation();    
        if (!window.confirm('Are you sure you want to delete this module? This cannot be undone.')) {
            return;
        }
        try {
            await modulesApi.deleteModule(moduleId);
            setModules((prev) => prev.filter((m) => m.id !== moduleId));
        } catch (err) {
            setError(err.message || 'Failed to delete module');
        }
    };



    if (isLoading) {
        return (
            <PageContainer maxWidth="lg">
                <PageTitle title="Manage Modules" />
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: '100%', m: 0 }}>
                    {[1, 2, 3].map((n) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
                        <Skeleton variant="rounded" height={200} />
                        </Grid>
                    ))}
                </Grid>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer maxWidth="lg">
                <PageTitle title="Manage Modules" />
                <Alert severity="error">{error}</Alert>
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
            subtitle={`${modules.length} module${modules.length === 1 ? '' : 's'} created by you`}
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

        {modules.length === 0 ? (
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
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: '100%', m: 0 }}>
                {modules.map((m) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.id} sx={{ minWidth: 0 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box  onClick={() => navigate(`/owner/modules/${m.id}/edit`)}   sx={{ cursor: 'pointer', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >                  
                                <ModuleCard module={m} />
                          </Box>     

                        <Paper  elevation={0}  sx={{  mt: 1, p: 1.5, borderRadius: 2,  border: '1px solid', borderColor: 'divider', display: 'flex', gap: 1,width: '100%', boxSizing: 'border-box'  }} >
                            <Button  
                                variant="outlined"  
                                fullWidth  
                                size="small"
                                startIcon={<Icon.Quiz />} 
                                onClick={(e) => { e.stopPropagation(); navigate(`/owner/modules/${m.id}/quiz`); }} 
                            >
                                Quiz
                            </Button>

                            <Button  
                                variant="outlined"  
                                fullWidth  
                                size="small"
                                startIcon={<Icon.Person />} 
                                onClick={(e) => { e.stopPropagation(); navigate(`/owner/modules/${m.id}/enrollments`); }} 
                            >
                                Users
                            </Button>

                            <Button  
                                variant="outlined"  
                                color="error"
                                fullWidth  
                                size="small"
                                startIcon={<Icon.Delete />} 
                                onClick={(e) => handleDelete(m.id, e)} 
                            >
                                Delete
                            </Button>
                        </Paper>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        )}
        </PageContainer>
    );
}

export default ManageModulesPage;