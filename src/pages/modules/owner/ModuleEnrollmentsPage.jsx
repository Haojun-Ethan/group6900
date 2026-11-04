// src/pages/modules/owner/ModuleEnrollmentsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Stack, Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Alert, Chip, Autocomplete, TextField, CircularProgress } from '@mui/material';
import * as modulesApi from '../../../api/modules';
import * as enrollmentsApi from '../../../api/enrollments';
import * as usersApi from '../../../api/users';
import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';

function ModuleEnrollmentsPage() {
    const { id: moduleId } = useParams();
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    
    const loadData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const [modData, enrollData, userData] = await Promise.all([
                modulesApi.getModule(moduleId),
                enrollmentsApi.listModuleEnrollments(moduleId),
                usersApi.listUsers().catch(() => []) 
            ]);
            setModule(modData);
            setEnrollments(enrollData || []);
            setAllUsers((userData || []).filter(u => u.role === 'USER')); 
        } catch (err) {
            setError(err.message || 'Failed to load enrollments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [moduleId]);

   
    const handleAssign = async () => {
        if (selectedUsers.length === 0) return;
        
        setIsAssigning(true);
        setError('');
        setSuccess('');
        try {
            const userIds = selectedUsers.map(u => u.id);
            await enrollmentsApi.assignEnrollment(moduleId, userIds);
            
            setSuccess(`Successfully assigned ${userIds.length} user(s).`);
            setSelectedUsers([]); 
            loadData(); 
        } catch (err) {
            
            setError(err.message || 'Failed to assign users. Note: Backend requires staff/owner permission.');
        } finally {
            setIsAssigning(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }


    const enrolledUserIds = new Set(enrollments.map(e => e.user?.id));
    const availableUsers = allUsers.filter(u => !enrolledUserIds.has(u.id));

    return (
        <PageContainer maxWidth="lg">
            <Stack spacing={3}>
                <Box>
                    <ActionButton variant="ghost" fullWidth={false} onClick={() => navigate('/owner/modules')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon.ArrowBack fontSize="small" /> Back to Manage Modules
                        </Box>
                    </ActionButton>
                </Box>

                <PageTitle 
                    title="Module Enrollments" 
                    subtitle={module ? `Managing: ${module.title}` : 'Loading module...'} 
                />

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

         
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>Assign Users</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <Autocomplete
                            multiple
                            options={availableUsers}
                            getOptionLabel={(option) => `${option.username} (${option.email})`}
                            value={selectedUsers}
                            onChange={(e, newValue) => setSelectedUsers(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select users to assign" variant="outlined" size="small" />
                            )}
                            sx={{ flexGrow: 1, width: '100%' }}
                        />
                        <ActionButton 
                            fullWidth={false} 
                            onClick={handleAssign} 
                            loading={isAssigning}
                            disabled={selectedUsers.length === 0}
                        >
                            Assign Selected
                        </ActionButton>
                    </Stack>
                </Paper>

        
                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h4">Enrolled Users ({enrollments.length})</Typography>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Enrolled At</TableCell>
                                <TableCell>Due At</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrollments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No users enrolled in this module yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                enrollments.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell>{e.user?.username || 'Unknown'}</TableCell>
                                        <TableCell>{e.source}</TableCell>
                                        <TableCell>{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : '-'}</TableCell>
                                        <TableCell>{e.dueAt ? new Date(e.dueAt).toLocaleDateString() : '-'}</TableCell>


                                        <TableCell> <Chip label={e.status} size="small" variant="outlined" /> </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Stack>
        </PageContainer>
    );
}

export default ModuleEnrollmentsPage;