import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Stack, Skeleton, Alert } from '@mui/material';
import * as quizzesApi from '../../../api/quizzes';
import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';
import QuizViewer from '../../../components/quizzes/QuizViewer';

/**
 * Turn QuizViewer's answers ({ [questionId]: choiceId | choiceId[] }) into the backend's format:
 * [{ question, choices: [choiceId, ...] }], with an entry for every question served.
 */
const toSubmission = (questions, answers) =>
    questions.map((q) => {
        const answer = answers[q.id];
        let choices = [];

        if (Array.isArray(answer)) choices = answer;
        else if (answer != null) choices = [answer];

        return { question: q.id, choices: choices.map(Number) };
    });

function TakeQuizPage() {
    const { id: moduleId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Starting the page starts (or resumes) an attempt. The backend picks and shuffles the questions,
    // and never sends the correct answers.
    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setIsLoading(true);
            setError('');

            try {
                const data = await quizzesApi.startAttempt(moduleId);
                if (!ignore) setAttempt(data);
            } catch (err) {
                // 403: not enrolled or no attempts left. 400: no questions yet. 404: module not published.
                if (!ignore) setError(err.message || 'Failed to start the quiz');
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();
        return () => { ignore = true; };
    }, [moduleId]);

    const questions = attempt?.questions || [];

    // Errors are thrown so QuizViewer shows them next to the submit button.
    const handleSubmit = async (answers) => {
        const result = await quizzesApi.submitAttempt(attempt.id, toSubmission(questions, answers));

        // The results the backend returns don't include the choice texts, so keep the questions
        // and answers for the review page.
        const review = { questions, answers };
        try {
            sessionStorage.setItem(`quiz_review_${result.id}`, JSON.stringify(review));
        } catch { /* storage full or blocked: the review just shows less detail */ }

        navigate(`/user/modules/${moduleId}/quiz/result/${result.id}`, {
            state: { attempt: result, ...review },
        });
    };

    const backToStudy = (
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
    );

    if (isLoading) {
        return (
            <PageContainer maxWidth="md">
                <Skeleton variant="text" width={180} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} />
            </PageContainer>
        );
    }

    if (error || !attempt) {
        return (
            <PageContainer maxWidth="md">
                <Stack spacing={3}>
                    {backToStudy}
                    <Alert severity="error">{error || 'Failed to start the quiz'}</Alert>
                </Stack>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="md">
            <Stack spacing={3}>
                {backToStudy}

                <PageTitle
                    title={attempt.moduleTitle ? `${attempt.moduleTitle} Quiz` : 'Module Quiz'}
                    subtitle={`${questions.length} question${questions.length === 1 ? '' : 's'} · Pass mark ${attempt.passMark}%`}
                />

                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(192, 138, 62, 0.08)' }}>
                    <Typography variant="body2" color="text.secondary">
                        Answer all questions, then click Submit. Your score will be shown on the next page.
                        {attempt.expiresAt && (
                            <>
                                {' '}Submit by <strong>{new Date(attempt.expiresAt).toLocaleTimeString()}</strong>.
                                Late submissions are recorded as a fail.
                            </>
                        )}
                    </Typography>
                </Paper>

                <QuizViewer questions={questions} onSubmit={handleSubmit} />
            </Stack>
        </PageContainer>
    );
}

export default TakeQuizPage;
