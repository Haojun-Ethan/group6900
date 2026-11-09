import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Stack, Box, Alert,Dialog,  DialogTitle,DialogContent, DialogActions, Autocomplete,TextField,Button, } from '@mui/material';
import apiClient from '../../../api/client';
import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';
/* added 10-01 */
import * as pathwaysApi from '../../../api/pathways'; 
import * as usersApi from '../../../api/users';
import { useAuth } from '../../../hooks/useAuth';

function PathwayDetailPage() {
    const [pathway, setPathway] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    /* added 10-01 */
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignSuccess, setAssignSuccess] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState('');
    const { user } = useAuth();



    useEffect(() => {
        let ignore = false;
        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await apiClient.get(`/pathways/${id}/`);
                if (!ignore) setPathway(data || null);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load pathways');
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();
        
        return () => { ignore = true; }
    }, [id]);

    const handleOpenAssign = async () => {
        setIsAssignOpen(true);
        setAssignSuccess('');
        try {
            const users = await usersApi.listUsers();
            // ordinary users are assigned
            setAllUsers(users.filter(u => u.role === 'USER') || []);
        } catch {
            setError('Failed to load users for assignment');
        }
    };

    const handleAssign = async ( ) => {
        if (selectedUsers.length === 0 ) return;
        setIsAssigning(true);

        try {
            const userIds = selectedUsers.map(u => u.id);
            await pathwaysApi.assignPathway(id, userIds);
            setAssignSuccess(`Successfully assigned pathway to ${userIds.length} user(s).`);
            setSelectedUsers([]);
            setIsAssignOpen(false);
        } catch (err) {
            setError(err.message || 'Failed to assign pathway');
        } finally {
            setIsAssigning (false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <Typography>Loading ...</Typography>
            </PageContainer>
        );
    }

    if (!pathway) {
        return (
            <PageContainer>
                <Alert severity="error ">Pathways not found.</Alert>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Alert severity="error">{error}</Alert>
            </PageContainer>
        );
    }  
    
    // judge owner or admin
    const canAssign = user?.role === 'OWNER' || user?.role === 'ADMIN' ;  /* added 10-01 */ 

    return (
        <PageContainer maxWidth="md">
            <Stack spacing={3   }>
                <Box>
                    <ActionButton variant="ghost" fullWidth={false} onClick={() => navigate('/pathways')} >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon.ArrowBack fontSize='small' /> Back to Pathways
                        </Box>
                    </ActionButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>


                <PageTitle title={pathway.name} subtitle={pathway.description} />
                
                    {canAssign && (
                        <ActionButton fullWidth={false} onClick={handleOpenAssign}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon.Person fontSize="small" />
                                Assign to Users
                            </Box>
                        </ActionButton>
                    )}
                </Box>

                 {assignSuccess && <Alert severity="success">{assignSuccess}</Alert>}

                <Typography variant='h3' sx={{ mt: 2 }}>Modules in this Pathway</Typography>

                    <Stack spacing={2}> 
                        {pathway.modules?.map((link, index) => (
                            <Paper key={link.id} elevation={0} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {index + 1}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant='h4'>{link.module_title}</Typography>
                                </Box>
                                <ActionButton fullWidth={false} variant="secondary" onClick={() => navigate(`/modules/${link.module}`)}>View Module</ActionButton>
                            </Paper>
                        ))} 
                    </Stack>
            </Stack>

                <Dialog open={ isAssignOpen } onClose={ ( ) => !isAssigning && setIsAssignOpen(false )} fullWidth maxWidth="sm">
                    <DialogTitle>Assign Pathway</DialogTitle>
                    <DialogContent dividers>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Selecting users below will automatically enroll them in all modules included in this pathway.
                        </Typography>

                        <Autocomplete
                            multiple
                            options={allUsers}
                            getOptionLabel = {(option) => `${option.username} (${option.email})`}
                            value = {selectedUsers}
                            onChange={ (e, newValue) => setSelectedUsers(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select users" variant="outlined" size="small" />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={ ( ) => setIsAssignOpen(false)} disabled={isAssigning}>Cancel</Button>

                        <Button onClick={handleAssign} variant="contained" disabled={selectedUsers.length === 0 || isAssigning}>
                            {isAssigning ? 'Assigning...' : 'Assign'}
                        </Button>
                    </DialogActions>
                </Dialog>
        </PageContainer>
    );
}
export default PathwayDetailPage;