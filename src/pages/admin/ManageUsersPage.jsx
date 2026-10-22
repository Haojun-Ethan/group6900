import { useState, useEffect } from 'react';
import {  Paper,   Chip, IconButton, Tooltip, Box, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, FormControl, } from '@mui/material';
//import * as usersApi from '../../api/users';
import { PageContainer, PageTitle, Icon } from '../../components/ui';
import { MOCK_USERS } from '../modules/_mockData';
//import { setUser } from '../../utils/storage';



const DEMO_STATE = "normal"; // 'normal' | 'loading' | 'empty' | 'error'



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
                const data = await new Promise((r) =>
                    setTimeout(() => r(MOCK_USERS), 400)
                );
                if (!ignore) setUsers(data);
            } catch (err) {
                if (!ignore)  setError(err.message || 'Failed to load users');
            } finally {
                if(!ignore)  setIsLoading(false);
            }
        };
        load();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        let prev;
        setUsers((u) => { prev = u; return u.map((x) => (x.id === userId ? { ...x, role: newRole } : x)); });

        try {
            // future: await usersApi.updateUserRole(userId, newRole);
            await new Promise((r) => setTimeout(r, 300));

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
            await new Promise((r) => setTimeout(r, 300));
        } catch (err) {
            setUsers(prev);  // roll back 
            setError(err.message || 'Failed to delete user');
        }
    };

    const effectiveLoading = DEMO_STATE === 'loading' ? true : isLoading;
  const effectiveError = DEMO_STATE === 'error' ? 'Failed to load' : error;
    const effectiveUsers = DEMO_STATE === 'empty' ? [] : users;

    return (
        <PageContainer maxWidth="lg">
            <PageTitle title="Manage Users"  subtitle={`${effectiveUsers.length} user${effectiveUsers.length === 1 ? '' : 's'}`} />
            
             {effectiveError && (
                <Paper severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {effectiveError}
                </  Paper  >    
            )}

            {effectiveLoading ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>Loading... </ Paper>
            ) : effectiveUsers.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}> No users </ Paper>
            ) : (
                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {/* Horizontal scroll on mobile / 手机横向滚动 */}
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
                        {effectiveUsers.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                            <FormControl size="small" sx={{ minWidth: 110 }}>
                                <Select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                >
                                <MenuItem value="USER">User</MenuItem>
                                <MenuItem value="OWNER">Owner</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                </Select>
                            </FormControl>
                            </TableCell>
                            <TableCell>
                            {u.is_2fa_enabled ? (
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
                        ))}
                    </TableBody>
                    </Table>
                </Box>
                </Paper>
            )}
    </PageContainer>
  );
}

export default ManageUsersPage;