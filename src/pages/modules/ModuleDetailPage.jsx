import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Box, Typography, Stack, Skeleton, Alert, Chip, Divider, Button,
} from '@mui/material';
//import * as modulesApi from '../../api/modules';
//import * as enrollmentsApi from '../../api/enrollments';
import { PageContainer, ActionButton, Icon } from '../../components/ui';
import StatusBadge from '../../components/modules/StatusBadge';
import SectionList from '../../components/modules/SectionList';
import { MOCK_MODULE_DETAIL, MOCK_MY_ENROLLMENTS } from './_mockData';

/*  用于静态设计阶段快速切换三态  */
const DEMO_STATE = 'normal'; // 'normal' | 'loading' | 'error' | 'notfound'

/* Module detail page  */
function ModuleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ★ Load module + my enrollment
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
    
        // future: const data = await modulesApi.getModule(id);
        //       const enrollments = await enrollmentsApi.listMyEnrollments();

        const data = await new Promise((r) =>
          setTimeout(() => r(MOCK_MODULE_DETAIL), 400)
        );
        const enrollments = MOCK_MY_ENROLLMENTS;

        setModule(data);
        setEnrollment(
          enrollments.find((e) => String(e.module) === String(id)) || null
        );
      } catch (err) {
        setError(err.message || 'Failed to load module');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  // ★ DEMO_STATE 强制切换
  const effectiveLoading = DEMO_STATE === 'loading' ? true : isLoading;
  const effectiveError = DEMO_STATE === 'error' ? 'Failed to load' : error;
  const effectiveNotFound = DEMO_STATE === 'notfound' ? true : false;

  // ===== Render states  =====

  if (effectiveLoading) {
    return (
      <PageContainer maxWidth="lg">
        <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={240} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={80} />
      </PageContainer>
    );
  }

  if (effectiveError) {
    return (
      <PageContainer maxWidth="lg">
        <Alert severity="error">{effectiveError}</Alert>
      </PageContainer>
    );
  }

  if (effectiveNotFound || !module) {
    return (
      <PageContainer maxWidth="lg">
        <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
          <Typography variant="h1">404</Typography>
          <Typography variant="body1" color="text.secondary">
            Module not found
          </Typography>
          <ActionButton onClick={() => navigate('/modules')} fullWidth={false}>
            Back to Modules
          </ActionButton>
        </Stack>
      </PageContainer>
    );
  }

 
  const isEnrolled = !!enrollment;

  return (
    <PageContainer maxWidth="lg">
      <Stack spacing={3}>
        {/* Back link, easy error handling */}
        <Box>
          <Button
            startIcon={<Icon.ArrowBack />}
            onClick={() => navigate('/modules')}
            sx={{ textTransform: 'none' }}
          >
            Back to Modules
          </Button>
        </Box>

        {/* Header card   */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: 2 }}>
          <Stack spacing={2}>
            {/* Status + category   */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <StatusBadge status={module.status} />
              {module.category && (
                <Chip
                  label={module.category}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Stack>

            {/* Title   */}

            <Typography variant="h1">{module.title}</Typography>

            {/* Summary  */ }
            {module.summary && (
              <Typography variant="body1" color="text.secondary">
                {module.summary} 

              </Typography>
            )}
 
            {/* Meta row  */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ flexWrap: 'wrap', color: 'text.secondary' }}
            >
              {module.estimated_minutes && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Icon.School fontSize="small" />

                  <Typography variant="body2">
                    {module.estimated_minutes} min
                  </Typography>

                </Stack>
              )}
              <Typography variant="body2">Pass: {module.pass_mark}%</Typography>

              <Typography variant="body2">
                By {module.created_by?.username}
              </Typography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            {/* Description  */}
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}> {module.description} </Typography>

            {/* Action */}
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              {isEnrolled ? (
                <>
                    <Chip
                        label={`Enrolled (${enrollment.status})`}
                        color="success"
                        sx={{ fontWeight: 600 }}
                    />


                    <ActionButton
                        fullWidth={false}
                        variant="secondary"
                        onClick={() => navigate(`/user/modules/${module.id}/study`)}
                    >
                        Start Learning
                    </ActionButton>

                </>
              ) : (
                module.status === 'PUBLISHED' &&
                module.self_enroll_allowed && (
                  <ActionButton fullWidth={false}>
                    Enroll
                  </ActionButton>
                )
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* Sections */}
        <Box>
            <Typography variant="h2" sx={{ mb: 2 }}>
                Sections ({module.sections?.length || 0})
            </Typography>

          <SectionList sections={module.sections} readOnly />

        </Box>
      </Stack>
    </PageContainer>
  );
}

export default ModuleDetailPage;