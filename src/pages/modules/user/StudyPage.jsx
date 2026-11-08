import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Paper, Stack, Box, Typography, Skeleton, Alert, Button, Divider, LinearProgress,
    List, ListItemButton, ListItemIcon, ListItemText, TextField, MenuItem,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import * as modulesApi from '../../../api/modules';
import * as enrollmentsApi from '../../../api/enrollments';
import * as sectionsApi from '../../../api/sections';
import { PageContainer, ActionButton, Icon } from '../../../components/ui';
import SectionContent from '../../../components/modules/SectionContent';

/**
 * Study a module one section per page. ?section=N (1-based) is the page shown, so a refresh or a
 * shared link opens the same section. Moving on with "Next" marks the section complete.
 */
function StudyPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [module, setModule] = useState(null);
    const [completedIds, setCompletedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                // /sections/?module= also says which sections this user has already completed.
                const [data, sections] = await Promise.all([
                    modulesApi.getModule(id),
                    sectionsApi.listSections(id),
                ]);

                if (!ignore) {
                    setModule(data);
                    setCompletedIds((sections || []).filter((s) => s.completed).map((s) => s.id));
                }
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load module');
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();
        return () => { ignore = true; };
    }, [id]);

    const sections = useMemo(
        () => [...(module?.sections || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        [module]
    );

    // Which page to show: ?section=N if valid, otherwise the first section not yet completed.
    const requested = Number(searchParams.get('section'));
    const firstUnread = Math.max(0, sections.findIndex((s) => !completedIds.includes(s.id)));
    const index = requested >= 1 && requested <= sections.length ? requested - 1 : firstUnread;
    const section = sections[index];

    const goTo = (newIndex) => {
        setSearchParams({ section: String(newIndex + 1) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const markComplete = async (sectionId) => {
        if (completedIds.includes(sectionId)) return true;

        setCompletedIds((prev) => [...prev, sectionId]);      // show it straight away
        try {
            await enrollmentsApi.markSectionComplete(sectionId);
            return true;
        } catch (err) {
            setCompletedIds((prev) => prev.filter((x) => x !== sectionId));   // roll back
            setError(err.message || 'Failed to save your progress');
            return false;
        }
    };

    const handleNext = async () => {
        setError('');
        setIsSaving(true);
        const saved = await markComplete(section.id);
        setIsSaving(false);
        if (saved && index < sections.length - 1) goTo(index + 1);
    };

    if (isLoading) {
        return (
            <PageContainer maxWidth="lg">
                <Skeleton variant="rounded" height={90} sx={{ mb: 3 }} />
                <Skeleton variant="rounded" height={400} />
            </PageContainer>
        );
    }

    if (!module) {
        return (
            <PageContainer maxWidth="md">
                <Alert severity="error">{error || 'Module not found'}</Alert>
            </PageContainer>
        );
    }

    const total = sections.length;
    const done = sections.filter((s) => completedIds.includes(s.id)).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    const isLast = index === total - 1;
    const allDone = total > 0 && done === total;
    const currentDone = section && completedIds.includes(section.id);

    return (
        <PageContainer maxWidth="lg">
            <Stack spacing={3}>
                <Box>
                    <Button startIcon={<Icon.ArrowBack />} onClick={() => navigate('/user/modules')} sx={{ textTransform: 'none' }}>
                        Back to My Modules
                    </Button>
                </Box>

                {/* Module header and progress */}
                <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
                    <Typography variant="h1" sx={{ mb: 1 }}>{module.title}</Typography>
                    {module.summary && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{module.summary}</Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Progress</Typography>
                        <Typography variant="body2" color="text.secondary">{done} / {total} sections ({percent}%)</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={percent} sx={{ height: 6, borderRadius: 3 }} />
                </Paper>

                {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

                {total === 0 ? (
                    <Alert severity="info">This module has no sections yet.</Alert>
                ) : (
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>

                        {/* Section list (wide screens) */}
                        <Paper elevation={0} sx={{
                            display: { xs: 'none', md: 'block' }, width: 280, flexShrink: 0, borderRadius: 2,
                            position: 'sticky', top: 88, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto',
                        }}>
                            <Typography variant="overline" sx={{ px: 2, pt: 1.5, display: 'block', color: 'text.secondary' }}>
                                Sections
                            </Typography>
                            <List dense>
                                {sections.map((s, i) => (
                                    <ListItemButton key={s.id} selected={i === index} onClick={() => goTo(i)}>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            {completedIds.includes(s.id)
                                                ? <CheckCircleIcon fontSize="small" color="success" />
                                                : <RadioButtonUncheckedIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
                                        </ListItemIcon>
                                        <ListItemText primary={s.title} primaryTypographyProps={{ variant: 'body2', fontWeight: i === index ? 600 : 400 }} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>

                        {/* The current section */}
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            {/* Section picker (narrow screens) */}
                            <TextField
                                select size="small" fullWidth label="Section" value={index}
                                onChange={(e) => goTo(Number(e.target.value))}
                                sx={{ display: { xs: 'flex', md: 'none' }, mb: 2 }}
                            >
                                {sections.map((s, i) => (
                                    <MenuItem key={s.id} value={i}>
                                        {completedIds.includes(s.id) ? '✓ ' : ''}{s.title}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 2 }}>
                                <Typography variant="overline" color="text.secondary">
                                    Section {index + 1} of {total}
                                </Typography>
                                <Typography variant="h2" sx={{ mb: 3 }}>{section.title}</Typography>

                                <SectionContent text={section.body} />

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        startIcon={<Icon.ArrowBack />}
                                        disabled={index === 0}
                                        onClick={() => goTo(index - 1)}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Previous
                                    </Button>

                                    {isLast ? (
                                        !currentDone && (
                                            <ActionButton fullWidth={false} loading={isSaving} onClick={handleNext}>
                                                Mark as complete
                                            </ActionButton>
                                        )
                                    ) : (
                                        <ActionButton fullWidth={false} loading={isSaving} onClick={handleNext}>
                                            {currentDone ? 'Next' : 'Complete and continue'}
                                        </ActionButton>
                                    )}
                                </Box>
                            </Paper>

                            {allDone && isLast && (
                                <Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: 2, textAlign: 'center', backgroundColor: 'success.main', color: '#fff' }}>
                                    <Stack spacing={2} alignItems="center">
                                        <Icon.CheckCircle sx={{ fontSize: 48 }} />
                                        <Typography variant="h3">All sections complete</Typography>
                                        <Typography variant="body2">You're ready to take the knowledge check.</Typography>
                                        <ActionButton fullWidth={false} variant="secondary"
                                            sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#f0f0f0' } }}
                                            onClick={() => navigate(`/user/modules/${id}/quiz`)}>
                                            Start Quiz
                                        </ActionButton>
                                    </Stack>
                                </Paper>
                            )}

                            {allDone && !isLast && (
                                <Alert severity="success" sx={{ mt: 3 }}
                                    action={<Button color="inherit" size="small" onClick={() => navigate(`/user/modules/${id}/quiz`)}>Start Quiz</Button>}>
                                    You've completed every section.
                                </Alert>
                            )}
                        </Box>
                    </Box>
                )}
            </Stack>
        </PageContainer>
    );
}

export default StudyPage;
