import { useState, useEffect } from 'react';
import {  Paper,   Chip, IconButton, Tooltip, Box, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, FormControl, Alert, Grid, Typography, } from '@mui/material';
import * as usersApi from '../../api/users';
import { PageContainer, PageTitle, Icon, ActionButton } from '../../components/ui';
//import { MOCK_USERS } from '../modules/_mockData';
//import { setUser } from '../../utils/storage';



//const DEMO_STATE = "normal"; // 'normal' | 'loading' | 'empty' | 'error'



function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {    /* https://react.dev/learn/you-might-not-need-an-effect#fetching-data */

        let ignore = false;
        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                // future: const data = await usersApi.listUsers();
               /* const data = await new Promise((r) =>
                    setTimeout(() => r(MOCK_USERS), 400)
                );*/
                const data = await usersApi.listUsers();
                if (!ignore) setUsers(data);
            } catch   {
                if (!ignore)  setError( 'The user management interface has not been fully developed yet and data cannot be loaded.');  // (err.message || 'Failed to load users');
            } finally {
                if(!ignore)  setIsLoading(false);
            }
        };
        load();
        return () => { ignore = true; };
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        let prev;
        setUsers((u) => { prev = u; return u.map((x) => (x.id === userId ? { ...x, role: newRole } : x)); });

        try {
            // future: await usersApi.updateUserRole(userId, newRole);
            /*await new Promise((r) => setTimeout(r, 300)); */
            await usersApi.updateUserRole(userId, newRole);

        }   catch (err) {
            setUsers(prev);  // roll back 
            setError(err.message || 'Failed to update role');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Delete this user?')) {
            return;

        }

        const prev = users;
        setUsers((u) => u.filter((x) => x.id !== userId));

        try {
            // future: await usersApi.deleteUser(userId);
           /* await new Promise((r) => setTimeout(r, 300)); */
            await usersApi.deleteUser(userId);
        } catch (err) {
            setUsers(prev);  // roll back 
            setError(err.message || 'Failed to delete user');
        }
    };

   /* const effectiveLoading = DEMO_STATE === 'loading' ? true : isLoading;
  const effectiveError = DEMO_STATE === 'error' ? 'Failed to load' : error;
    const effectiveUsers = DEMO_STATE === 'empty' ? [] : users;
*/

    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const ownerCount = users.filter(u => u.role === 'OWNER').length;
    const regularCount = users.filter(u => u.role === 'USER').length;

    return (
        <PageContainer maxWidth="lg">

            <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Notice:</strong> Changing a user's role here immediately updates their frontend interface and access level. 
                To fully grant system-level execution privileges (such as creating or publishing modules), the account must be verified and authorized by the system Superuser.
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: {xs:'column', sm:'row'}, justifyContent: 'space-between', alignItems: {xs:'flex-start', sm:'center'}, mb: 3 }}>
                <PageTitle title="Manage Users"  subtitle={`${users.length} user${users.length === 1 ? '' : 's'}`} />
                <Tooltip title="Backend API does not support setting password on create yet">
                    <span>
                        <ActionButton fullWidth={false} disabled>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon.Add fontSize="small" />
                                Create User
                            </Box>
                            </ActionButton>
                    </span>
                </Tooltip>
            </Box>

                {/* 09-01 */}
            {!isLoading && !error && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                        <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h4" color="primary.main">{totalUsers}</Typography>
                            <Typography variant="body2" color="text.secondary">Total Users</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h4" color="error.main">{adminCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Admins</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h4" color="warning.main">{ownerCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Owners</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h4" color="success.main">{regularCount}</Typography>
                            <Typography variant="body2" color="text.secondary">Learners</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}




               {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>   
                )}

            {isLoading ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>Loading... </ Paper>
            ) : users.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}> No users </ Paper>
            ) : (
                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {/* Horizontal scroll on mobile  */}
                <Box sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>2FA</TableCell>
                        <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => {
                            const has2FA = Boolean(u.is2FaEnabled ?? u.is_2fa_enabled);
                            return (
                                <TableRow key={u.id}>
                                    <TableCell>{u.username}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                    <Tooltip title="Updates UI access. System-level privileges require Superuser approval." arrow placement="right" slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -15] } }] } }} >
                                        <FormControl size="small" sx={{ minWidth: 110 }}>
                                            <Select
                                            value={u.role || 'USER'}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            >
                                            <MenuItem value="USER">User</MenuItem>
                                            <MenuItem value="OWNER">Owner</MenuItem>
                                            <MenuItem value="ADMIN">Admin</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        {has2FA ? (
                                            <Chip label="On" color="success" size="small" />
                                        ) : (
                                            <Chip label="Off" size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                    <Tooltip title="Delete user">
                                        <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(u.id)}
                                        >
                                        <Icon.Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
            </Paper>
            )}
        </PageContainer>
  );
}


export default ManageUsersPage;