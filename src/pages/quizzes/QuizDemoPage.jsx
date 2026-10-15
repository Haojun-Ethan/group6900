import { Box, Typography, Divider } from '@mui/material';
import { PageContainer, PageTitle } from '../../components/ui';
import QuizViewer from '../../components/quizzes/QuizViewer';
import { MOCK_QUIZ_QUESTIONS } from './_mockQuizData';

/**
 * Quiz demo page - static showcase of all question types
 *
 * No API calls. No submit. Pure UI.
 */
function QuizDemoPage() {

        return (
            <PageContainer maxWidth="md">
                <PageTitle title ="Quiz Demo"  subtitle="Static preview of all question types. No data is submitted."  />

                <Box sx={{ my: 2, p: 2, backgroundColor: 'rgba(59, 91, 140, 0.06)', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> This is a static demo. Interactions work locally but answers are not saved. Current answers are shown at the bottom for debugging.
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />  

                <QuizViewer questions={MOCK_QUIZ_QUESTIONS} />
            </PageContainer>
    );
}

export default QuizDemoPage;