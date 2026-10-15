import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Stack, Skeleton, Alert } from '@mui/material';
//import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';
import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';
import QuizViewer from '../../../components/quizzes/QuizViewer';
import { MOCK_QUIZ_QUESTIONS } from '../_mockQuizData';

const DEMO_STATE = 'normal'; // 'normal' | 'loading' | 'error'


function TakeQuizPage() {
    const { id: moduleId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [isLoading,  setIsLoading]=useState(true);
    const [error,setError] =useState('');

    useEffect(() => {
        const load = async () => {
        setIsLoading(true);
        setError('');
        try {

            // future: const data = await quizzesApi.listQuestions(moduleId);
            const data = await new Promise((r) =>
            setTimeout(() => r(MOCK_QUIZ_QUESTIONS), 400)
            );
            setQuestions(data);
        } catch (err) {
            setError(err.message || 'Failed to load quiz');
        } finally {
            setIsLoading(false);
        }
        };
        load();
    }, [moduleId]);

    /**
     * Submit handler - placeholder
     * 提交处理 - 占位
     *
     * When backend is ready:
     *   const attempt = await quizzesApi.startQuiz(moduleId);
     *   const result = await quizzesApi.submitQuiz(attempt.id, answers);
     *   navigate(`/user/modules/${moduleId}/quiz/result/${result.id}`);
     */
    const handleSubmit = async () => {
        // Simulate network delay /mocnk
        await new Promise((r) => setTimeout(r, 600));
        
        //templete
        navigate(`/user/modules/${moduleId}/quiz/result/999`);
    };

    const effectiveLoading = DEMO_STATE === 'loading' ? true : isLoading;

    const effectiveError = DEMO_STATE === 'error' ? 'Failed to load quiz' : error;

    if (effectiveLoading) {
        return (
            <PageContainer maxWidth="md">
                <Skeleton variant="text" width={180} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} />
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

    return (
        <PageContainer maxWidth="md">
        <Stack spacing={3}>
            {/* Back */}
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

            <PageTitle title="Module Quiz"  subtitle={`${questions.length} question${questions.length === 1 ? '' : 's'}`}
            />

            <Paper elevation={0} sx ={ { p: 2, borderRadius: 2,backgroundColor: 'rgba(192, 138, 62, 0.08)' }}>
                <Typography variant="body2" color="text.secondary">
                    Answer all questions, then click Submit. Your score will be shown on the next page.
                </Typography>
            </Paper>

            <QuizViewer
                questions={questions}
                onSubmit={handleSubmit}
            />
    </Stack>
        </PageContainer>


    );
}

export default TakeQuizPage;