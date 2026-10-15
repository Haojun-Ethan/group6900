import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Paper, Stack, Box, Typography, Skeleton, Alert, Button, Divider,} from '@mui/material';
//import * as modulesApi from '../../../api/modules';
//import * as enrollmentsApi from '../../../api/enrollments';
import { PageContainer, ActionButton,  Icon } from '../../../components/ui';
import SectionList from '../../../components/modules/SectionList';
import {MOCK_MODULE_DETAIL, MOCK_COMPLETED_SECTION_IDS,} from '../_mockData';



const DEMO_STATE = 'normal'; // 'normal' | 'loading' | 'error'


function StudyPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [completedIds, setCompletedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
        setIsLoading(true);
        setError('');
        try {
            // future: const data = await modulesApi.getModule(id);
            // future: const progress = await enrollmentsApi.listSectionProgress(id);
            const data = await new Promise((r) =>
            setTimeout(() => r(MOCK_MODULE_DETAIL), 400)
            );

            setModule(data);
            setCompletedIds(MOCK_COMPLETED_SECTION_IDS);
        } catch (err) {
            setError(err.message || 'Failed to load module');
        } finally {
            setIsLoading(false);
        }
        };
        load();
    }, [id]);

    /**  Mark a section as complete 标记章节完成 */
    const handleMarkComplete = async (sectionId) => {
 
        //   React handbook - Optimistic UI  
        // Hook: useOptimistic
        //  https://react.dev/reference/react/useOptimistic


        setCompletedIds((prev) => [...prev, sectionId]);

        try {
        // 未来: await enrollmentsApi.markSectionComplete(sectionId);
        await new Promise((r) => setTimeout(r, 300));
        } catch (err) {
        // 失败回滚 / Rollback on failure
        setCompletedIds((prev) => prev.filter((id) => id !== sectionId));
        setError(err.message || 'Failed to mark complete');
        }
    };

    const effectiveLoading = DEMO_STATE === 'loading' ? true :isLoading;

    const effectiveError = DEMO_STATE === 'error' ? 'Failed to load':error;

    if (effectiveLoading) {
        return (
            <PageContainer maxWidth="md">
                <Skeleton variant="rounded" height={100} sx={{ mb: 3 }} />
                <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={80} />
            </PageContainer>
        );
    }


    if (effectiveError) {
        return (
            <PageContainer maxWidth="md">
                <Alert severity="error">{effectiveError}</Alert>
            </PageContainer>
        );
    }


    if (!module) {
        return (
            <PageContainer maxWidth="md">
                <Alert severity="warning">Module not found</Alert>
            </PageContainer>
        );
    }

    const total = module.sections?.length || 0;
    const completed = completedIds.length;

    const percent = total> 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <PageContainer maxWidth="md">
        <Stack spacing={3}>
         
            <Box>    {/* Back / 返回 */}
                <Button startIcon={<Icon.ArrowBack />}  onClick={() => navigate('/user/modules')} sx={{ textTransform: 'none' }} >
                    Back to My Modules
                </Button>
            </Box>

            {/* Header */}
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>

            <Stack spacing={1.5}>
                <Typography variant="h1">{module.title}</Typography>

                {module.summary && (
                    <Typography variant="body2" color="text.secondary">  {module.summary}  </Typography>
                )}

                <Divider sx={{ my: 1 }} />
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>

                        <Typography variant="body2" color="text.secondary"> Progress  </Typography>

                        <Typography variant="body2" color="text.secondary">  {completed} / {total} ({percent}%) </Typography>

                    </Box>

                    <Box
                        sx={{
                        height: 6,
                        backgroundColor: 'divider',
                        borderRadius: 3,
                        overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: `${percent}%`,
                                backgroundColor: 'primary.main',
                                transition: 'width 0.3s ease',
                            }}
                        />
                    </Box>
                </Box>
            </Stack>
            </Paper>

            {/* Sections */}
            <Box>
                <Typography variant="h2" sx={{ mb: 2 }}>  Sections  </Typography>
                
                <SectionList sections={module.sections} completedIds={completedIds}  onMarkComplete={handleMarkComplete} />
            </Box>

            {/* Continue button (optional)   */}
            {percent === 100 && (
                <Paper
                    elevation={0}
                    sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: 'success.main',
                    color: '#fff',
                    }}
                >
                <Stack spacing={1} alignItems="center">
                    <Icon.CheckCircle sx={{ fontSize: 48 }} />
                    <Typography variant="h3">All sections complete</Typography>
                    <Typography variant="h3">
                        {percent === 100 && (
                            <Paper  elevation={0}sx={{p: 3,borderRadius: 2, textAlign: 'center', backgroundColor: 'success.main',color: '#fff',}}>
                                <Stack spacing={2} alignItems="center">
                                    <Icon.CheckCircle sx={{ fontSize: 48 }} />
                                    <Typography variant="h3">All sections complete</Typography>
                                    
                                    <Typography variant="body2"> You're ready to take the quiz.</Typography>
                                
                                    <ActionButton fullWidth={false}  onClick={() => navigate(`/user/modules/${id}/quiz`)}> Start Quiz </ActionButton >
                                </Stack>
                            </Paper>
                        )}
                    </Typography>
                    <Typography variant="body2" >  Ready for the quiz? (Coming soon) </Typography >
                </Stack>
            </Paper>

            )}

        </Stack>
        </PageContainer>
    );
}

export default StudyPage;