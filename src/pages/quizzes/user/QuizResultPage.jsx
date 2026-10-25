import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Stack, Skeleton, Alert, Chip, Divider } from '@mui/material';
import * as quizzesApi from '../../../api/quizzes';
import { PageContainer, ActionButton, Icon } from '../../../components/ui';
import QuestionRenderer from '../../../components/quizzes/QuestionRenderer';
//import { MOCK_QUIZ_QUESTIONS } from '../_mockQuizData';

/*  delete 08-01
const MOCK_RESULT = {
  id: 999,
  score_percent: 80,
  passed: true,

  user_answers: {
    1: 11,          
    2: [21, 22],    
    3: 'true',     
    4: { 41: 41, 42: 42 }, 

  },
};
*/

function QuizResultPage() {
  const { id: moduleId, attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
    
        // future:const r = await quizzesApi.getAttempt(attemptId);
        // future: const qs = await quizzesApi.listQuestions(moduleId);
        /*const r = await new Promise((resolve) =>
          setTimeout(() => resolve(MOCK_RESULT), 400)
        );
        setResult(r);
        setQuestions(MOCK_QUIZ_QUESTIONS);
        08-01 */

        const [attemptResult, questionList] = await Promise.all([
          quizzesApi.getAttempt(attemptId),
          quizzesApi.listQuestions(moduleId),
        ]);

        if (!ignore) {
          setResult(attemptResult);
          setQuestions(Array.isArray(questionList) ? questionList : []);
        }
      } catch (err) {
        if (!ignore) {setError(err.message || 'Failed to load result');}
      } finally {
        if (!ignore) {setIsLoading(false);}
      }
    };
    load();

    return () => { ignore = true; };
  }, [moduleId, attemptId]);

  if (isLoading) {
    return (
      <PageContainer maxWidth="md">
        <Skeleton variant="rounded" height={160} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={200} />
      </PageContainer>
    );
  }

  if (error || !result) {
    return (
      <PageContainer maxWidth="md">
        <Alert severity="error">{error || 'Attempt result not found'}</Alert>
      </PageContainer>
    );
  }

  const {  scorePercent = 0, passed = false, userAnswers = {}  } = result;

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
              <Typography variant="h1" sx={{ color: '#fff', fontSize: '2rem' }}>
                {scorePercent}%
              </Typography>
            </Box>

            <Typography variant="h2" sx={{ color: passed ? 'success.main' : 'error.main' }}>
              {passed ? 'Passed' : 'Not Passed'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {passed
                ? 'Congratulations! You have completed this module.'
                : 'Review the sections and try again.'}
            </Typography>
          </Stack>
        </Paper>

        <Divider />

   
        <Typography variant="h2">Review</Typography>
        <Stack spacing={3}>
          {questions.map((q, idx) => (
            <Box key={q.id}>
              <Box sx={{ mb: 1 }}>
                <Chip
                  label={`Q${idx + 1} • ${userAnswers[q.id] != null ? 'Answered' : 'Skipped'}`}
                  size="small"
                  color={userAnswers[q.id] != null ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
              <QuestionRenderer
                question={q}
                answer={userAnswers[q.id]}
                onChange={() => {}}
                disabled
                index={idx}
              />
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 2 }}>
          <ActionButton
            fullWidth={false}
            variant="secondary"
            onClick={() => navigate(`/user/modules/${moduleId}/study`)}
          >
            Back to Study
          </ActionButton>
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