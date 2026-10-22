import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Grid, Skeleton, Alert, Chip, Typography, Paper, Stack, LinearProgress, Box } from '@mui/material';
import { PageContainer, PageTitle, ActionButton, EmptyState,  } from '../../../components/ui';
import { MOCK_ENROLLED_MODULES } from '../_mockData';


const DEMO_STATE = 'normal'; // 'normal' | 'loading' | 'empty' | 'error'

/* Enrollment status badge  */
const STATUS_MAP = {
  PENDING:   { color: 'default', label: 'Pending' },
  COMPLIANT: { color: 'success', label: 'Compliant' },
  DUE_SOON:  { color: 'warning', label: 'Due Soon' },
  OVERDUE:   { color: 'error',   label: 'Overdue' },
};

/*My modules page (learner views)   */
function MyModulesPage() {
    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
        setIsLoading(true);
        setError('');
        try {

            // future :  const data = await enrollmentsApi.listMyEnrollments();
            const data = await new Promise((r) =>
            setTimeout(() => r(MOCK_ENROLLED_MODULES), 400)
            );
            setEnrollments(data);
        } catch (err) {
            setError(err.message || 'Failed to load enrollments');
        } finally {
            setIsLoading(false);
        }
        };
        load();
    }, []);

    const effectiveLoading = DEMO_STATE === 'loading' ? true : isLoading;

    const effectiveError = DEMO_STATE === 'error' ? 'Failed to load' : error;
    const effectiveEnrollments = DEMO_STATE === 'empty' ? [] : enrollments;

    if (effectiveLoading) {
        return (
        <PageContainer maxWidth="lg">
            <PageTitle title="My Modules" />
            <Grid container spacing={{ xs: 2, md: 3 }}>
            {[1, 2].map((n) => (
                <Grid item xs={12} sm={6} md={4} key={n}>
                <Skeleton variant="rounded" height={180} />
                </Grid>
            ))}
            </Grid>
        </PageContainer>
        );
    }

    if (effectiveError) {
        return (
        <PageContainer maxWidth="lg">
            <PageTitle title="My Modules" />
            <Alert severity="error">{effectiveError}</Alert>
        </PageContainer>
        );
    }

    if (effectiveEnrollments.length === 0) {
        return (
        <PageContainer maxWidth="lg">
            <PageTitle title="My Modules" subtitle="Courses you're enrolled in." />
            <EmptyState
            title="No enrollments yet"
            subtitle="Browse the module catalog and enroll to get started."
            action={
                <ActionButton
                fullWidth={false}
                onClick={() => navigate('/modules')}
                >
                Browse Modules
                </ActionButton>
            }
            />
        </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="lg">
        <PageTitle
            title="My Modules"
            subtitle={`${effectiveEnrollments.length} enrolled course${effectiveEnrollments.length === 1 ? '' : 's'}`}
        />

        <Grid container spacing={{ xs: 2, md: 3 }}>
            {effectiveEnrollments.map((e) => {
            const status = STATUS_MAP[e.status] || STATUS_MAP.PENDING;
            const progress = e.progress || { completed: 0, total: 1 };

            const percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

            return (
                <Grid item xs={12} sm={6} md={4} key={e.id}>
                    <Paper
                        elevation={0}
                        sx={{
                        p: 2.5,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        }}
                        onClick={() => navigate(`/user/modules/${e.module}/study`)}
                    >

                    <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>

                            <Chip
                                label={status.label}
                                color={status.color}
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                            />


                            <Chip
                                label={e.source}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                            />

                    </Stack>

                    <Typography variant="h3" sx={{ mb: 1 }}>{e.module_title}</Typography>

                    {e.due_at && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Due {new Date(e.due_at).toLocaleDateString()}
                        </Typography>
                    )}

                    <Box sx={{ mt: 'auto', pt: 1 }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                        Progress
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            {progress.completed} / {progress.total}
                        </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={percent} />
                    </Box>
                </Paper>
                </Grid>
            );
            })}
        </Grid>
        </PageContainer>
    );
}



export default MyModulesPage;