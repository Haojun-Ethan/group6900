import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Stack, Skeleton, Alert, Chip, Divider } from '@mui/material';
import * as quizzesApi from '../../../api/quizzes';
import { PageContainer, ActionButton, Icon } from '../../../components/ui';
import QuestionRenderer from '../../../components/quizzes/QuestionRenderer';

/** The questions and answers TakeQuizPage kept, so the review can show the choice texts. */
const loadReview = (state, attemptId) => {
  if (state?.questions) return { questions: state.questions, answers: state.answers || {} };

  try {
    const raw = sessionStorage.getItem(`quiz_review_${attemptId}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  return { questions: [], answers: {} };
};

function QuizResultPage() {
  const { id: moduleId, attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [attempt, setAttempt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const review = loadReview(location.state, attemptId);
  const lateMessage = location.state?.attempt?.message;

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      // Use the graded attempt passed from the quiz page; otherwise (refresh, shared link) fetch it.
      const passed = location.state?.attempt;
      if (passed && String(passed.id) === String(attemptId)) {
        setAttempt(passed);
        setIsLoading(false);
        return;
      }

      try {
        const data = await quizzesApi.getAttempt(attemptId);
        if (!ignore) setAttempt(data);
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load the result');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();
    return () => { ignore = true; };
  }, [attemptId, location.state]);

  if (isLoading) {
    return (
      <PageContainer maxWidth="md">
        <Skeleton variant="rounded" height={160} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={200} />
      </PageContainer>
    );
  }

  if (error || !attempt) {
    return (
      <PageContainer maxWidth="md">
        <Alert severity="error">{error || 'Attempt result not found'}</Alert>
      </PageContainer>
    );
  }

  if (!attempt.submittedAt) {
    return (
      <PageContainer maxWidth="md">
        <Stack spacing={2}>
          <Alert severity="info">This attempt hasn't been submitted yet.</Alert>
          <ActionButton fullWidth={false} onClick={() => navigate(`/user/modules/${moduleId}/quiz`)}>
            Continue Quiz
          </ActionButton>
        </Stack>
      </PageContainer>
    );
  }

  const { scorePercent = 0, passed = false, passMark, results = [] } = attempt;

  // Results come back in the order the questions were served; check the text in case they don't match.
  const questionFor = (result, index) => {
    const byIndex = review.questions[index];
    if (byIndex && byIndex.text === result.question) return byIndex;
    return review.questions.find((q) => q.text === result.question);
  };

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={3}>

        <Box>
          <ActionButton
            variant="ghost"
            fullWidth={false}
            onClick={() => navigate(`/user/modules/${moduleId}/study`)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon.ArrowBack fontSize="small" />
              Back to Study
            </Box>
          </ActionButton>
        </Box>

        {lateMessage && <Alert severity="warning">{lateMessage}</Alert>}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: passed ? 'rgba(76, 140, 90, 0.08)' : 'rgba(169, 68, 66, 0.08)',
            border: '2px solid',
            borderColor: passed ? 'success.main' : 'error.main',
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 96, height: 96, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: passed ? 'success.main' : 'error.main',
                color: '#fff',
              }}
            >
              <Typography variant="h1" sx={{ color: '#fff', fontSize: '1.75rem' }}>
                {Math.round(Number(scorePercent))}%
              </Typography>
            </Box>

            <Typography variant="h2" sx={{ color: passed ? 'success.main' : 'error.main' }}>
              {passed ? 'Passed' : 'Not Passed'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {passMark != null && `Pass mark ${passMark}%. `}
              {passed
                ? 'Congratulations! You have completed this module.'
                : 'Review the sections and try again.'}
            </Typography>
          </Stack>
        </Paper>

        <Divider />

        <Typography variant="h2">Review</Typography>
        <Stack spacing={3}>
          {results.map((r, idx) => {
            const question = questionFor(r, idx);
            const selected = r.selectedChoices || [];
            const answer = question?.questionType === 'SINGLE' ? selected[0] : selected;

            return (
              <Box key={idx}>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    label={`Q${idx + 1} • ${r.isCorrect ? 'Correct' : 'Wrong'}`}
                    size="small"
                    color={r.isCorrect ? 'success' : 'error'}
                    variant="outlined"
                  />
                  <Chip label={`${r.pointsAwarded} pt${r.pointsAwarded === 1 ? '' : 's'}`} size="small" variant="outlined" />
                </Stack>

                {question ? (
                  <QuestionRenderer question={question} answer={answer} onChange={() => {}} disabled index={idx} />
                ) : (
                  // No saved review data (e.g. opened in a new tab): show the question text only.
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h3" sx={{ lineHeight: 1.5 }}>{r.question}</Typography>
                  </Paper>
                )}

                {r.explanation && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, pl: 1 }}>
                    {r.explanation}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 2 }}>
          {!passed && (
            <ActionButton
              fullWidth={false}
              variant="secondary"
              onClick={() => navigate(`/user/modules/${moduleId}/quiz`)}
            >
              Try Again
            </ActionButton>
          )}
          <ActionButton
            fullWidth={false}
            onClick={() => navigate('/user/modules')}
          >
            My Modules
          </ActionButton>
        </Stack>
      </Stack>
    </PageContainer>
  );
}

export default QuizResultPage;
