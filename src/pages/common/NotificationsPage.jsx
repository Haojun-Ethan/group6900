import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Stack, Box, Typography, IconButton, Tooltip, Skeleton, Alert, Button } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

import * as notificationsApi from '../../api/notifications';
import { PageContainer, PageTitle, EmptyState, ActionButton, Icon } from '../../components/ui';

const formatWhen = (iso) => {
    const date = new Date(iso);
    const minutes = Math.round((Date.now() - date.getTime()) / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (minutes < 60 * 24) return `${Math.round(minutes / 60)} h ago`;
    return date.toLocaleDateString();
};

function NotificationsPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                const data = await notificationsApi.listNotifications();
                if (!ignore) setItems(data || []);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load notifications');
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();
        return () => { ignore = true; };
    }, []);

    const unread = items.filter((n) => !n.isRead).length;

    const markLocally = (ids) =>
        setItems((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n)));

    const handleOpen = async (n) => {
        if (!n.isRead) {
            markLocally([n.id]);
            try { await notificationsApi.markRead(n.id); } catch { /* the badge corrects itself on the next count */ }
        }
        if (n.link) navigate(n.link);
    };

    const handleMarkAll = async () => {
        markLocally(items.map((n) => n.id));
        try {
            await notificationsApi.markAllRead();
        } catch (err) {
            setError(err.message || 'Failed to mark notifications as read');
        }
    };

    const handleDismiss = async (e, id) => {
        e.stopPropagation();
        const previous = items;
        setItems((prev) => prev.filter((n) => n.id !== id));
        try {
            await notificationsApi.dismiss(id);
        } catch (err) {
            setItems(previous);
            setError(err.message || 'Failed to dismiss notification');
        }
    };

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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                    <PageTitle
                        title="Notifications"
                        subtitle={unread > 0 ? `${unread} unread` : 'Updates about your modules, enrolments and account security.'}
                    />
                    {unread > 0 && <Button onClick={handleMarkAll}>Mark all as read</Button>}
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                {isLoading ? (
                    <Stack spacing={1.5}>
                        {[1, 2, 3].map((n) => <Skeleton key={n} variant="rounded" height={72} />)}
                    </Stack>
                ) : items.length === 0 ? (
                    <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <EmptyState
                            title="You're all caught up"
                            subtitle="You'll see a notification here when you're assigned training or something changes on your account."
                        />
                    </Paper>
                ) : (
                    <Stack spacing={1.5}>
                        {items.map((n) => (
                            <Paper
                                key={n.id}
                                elevation={0}
                                onClick={() => handleOpen(n)}
                                sx={{
                                    p: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start', borderRadius: 2,
                                    border: '1px solid', borderColor: n.isRead ? 'divider' : 'primary.light',
                                    backgroundColor: n.isRead ? 'background.paper' : 'rgba(59, 91, 140, 0.04)',
                                    cursor: n.link || !n.isRead ? 'pointer' : 'default',
                                }}
                            >
                                <CircleIcon sx={{ fontSize: 10, mt: 0.9, color: n.isRead ? 'transparent' : 'primary.main' }} />

                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                        <Typography variant="body1" fontWeight={n.isRead ? 500 : 700}>{n.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                            {formatWhen(n.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{n.message}</Typography>
                                </Box>

                                <Tooltip title="Dismiss">
                                    <IconButton size="small" onClick={(e) => handleDismiss(e, n.id)} aria-label="Dismiss notification">
                                        <Icon.Close fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Stack>
        </PageContainer>
    );
}

export default NotificationsPage;
