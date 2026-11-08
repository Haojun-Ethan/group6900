import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Stack, Box, Typography, Alert, Skeleton, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import * as quizzesApi from '../../../api/quizzes';
import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';

/**
 * Owners: one learner's quiz attempt, question by question. The attempt's results give the learner's
 * choice ids; the owner's question bank supplies the choice texts and which ones are correct.
 */
function AttemptReviewPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const data = await quizzesApi.getAttempt(attemptId);
        // Questions edited or deleted since the attempt may not match; the review still shows the result.
        const bank = await quizzesApi.listQuestions(data.module).catch(() => []);
        if (!ignore) {
          setAttempt(data);
          setQuestions(bank || []);
        }
      } catch (err) {
        if (!ignore) setError(err.status === 404 ? 'Attempt not found, or not in a module you manage.' : (err.message || 'Failed to load the attempt'));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();
    return () => { ignore = true; };
  }, [attemptId]);

  const back = (
    <Box>
      <ActionButton variant="ghost" fullWidth={false} onClick={() => navigate('/owner/gradebook')}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon.ArrowBack fontSize="small" /> Back to Gradebook
        </Box>
      </ActionButton>
    </Box>
  );

  if (isLoading) {
    return (
      <PageContainer maxWidth="md">
        <Skeleton variant="rounded" height={140} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={200} />
      </PageContainer>
    );
  }

  if (error || !attempt) {
    return (
      <PageContainer maxWidth="md">
        <Stack spacing={3}>{back}<Alert severity="error">{error || 'Attempt not found'}</Alert></Stack>
      </PageContainer>
    );
  }

  const submitted = Boolean(attempt.submittedAt);
  const byText = new Map(questions.map((q) => [q.text, q]));

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={3}>
        {back}

        <PageTitle
          title={`${attempt.username} · ${attempt.moduleTitle}`}
          subtitle={submitted
            ? `Submitted ${new Date(attempt.submittedAt).toLocaleString()}`
            : `Started ${new Date(attempt.startedAt).toLocaleString()} · not submitted yet`}
        />

        {submitted ? (
          <Paper elevation={0} sx={{
            p: 3, borderRadius: 2, border: '2px solid',
            borderColor: attempt.passed ? 'success.main' : 'error.main',
            display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap',
          }}>
            <Typography variant="h1" sx={{ color: attempt.passed ? 'success.main' : 'error.main' }}>
              {Math.round(Number(attempt.scorePercent))}%
            </Typography>
            <Box>
              <Typography variant="h3">{attempt.passed ? 'Passed' : 'Not passed'}</Typography>
              <Typography variant="body2" color="text.secondary">Pass mark {attempt.passMark}%</Typography>
            </Box>
          </Paper>
        ) : (
          <Alert severity="info">This attempt is still in progress, so there are no results yet.</Alert>
        )}

        {(attempt.results || []).map((r, idx) => {
          const question = byText.get(r.question);
          const selected = new Set(r.selectedChoices || []);

          return (
            <Paper key={idx} elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1}>
                  <Chip label={`Q${idx + 1}`} size="small" color="primary" />
                  <Chip label={r.isCorrect ? 'Correct' : 'Wrong'} size="small" variant="outlined"
                    color={r.isCorrect ? 'success' : 'error'} />
                  <Chip label={`${r.pointsAwarded} pt${r.pointsAwarded === 1 ? '' : 's'}`} size="small" variant="outlined" />
                </Stack>

                <Typography variant="h3" sx={{ lineHeight: 1.5 }}>{r.question}</Typography>

                {question ? (
                  <Stack spacing={0.75}>
                    {[...question.choices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((c) => {
                      const picked = selected.has(c.id);
                      return (
                        <Box key={c.id} sx={{
                          display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1,
                          border: '1px solid', borderColor: picked ? (c.isCorrect ? 'success.main' : 'error.main') : 'divider',
                          backgroundColor: c.isCorrect ? 'rgba(76, 140, 90, 0.06)' : 'transparent',
                        }}>
                          {c.isCorrect
                            ? <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />
                            : <CloseIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>{c.text}</Typography>
                          {picked && <Chip label="Learner's answer" size="small" />}
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    This question has been changed since the attempt, so the choices can't be shown.
                    The learner picked {selected.size} option{selected.size === 1 ? '' : 's'}.
                  </Typography>
                )}

                {r.explanation && (
                  <Typography variant="body2" color="text.secondary">{r.explanation}</Typography>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </PageContainer>
  );
}

export default AttemptReviewPage;
