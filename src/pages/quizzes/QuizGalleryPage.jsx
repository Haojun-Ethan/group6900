import { Stack, Box, Typography, Divider } from '@mui/material';
//import { PageContainer, PageTitle } from '../../components/ui';
import { PageContainer, PageTitle } from '../../components/ui';

import QuestionRenderer from '../../components/quizzes/QuestionRenderer';
import { MOCK_QUIZ_QUESTIONS } from './_mockQuizData';

/**
 * Quiz Gallery Page /quiz-gallery
 *
 * Ref: MUI handbook
 * https://mui.com/material-ui/react-stack/
 * https://mui.com/material-ui/react-divider/
 */
function QuizGalleryPage() {
  return (
    <PageContainer maxWidth="lg">
      <PageTitle
        title="Question Types Gallery"
        subtitle="Every question type rendered standalone for design review."
      />

      <Box
        sx={{
          my: 3,
          p: 2,
          backgroundColor: 'rgba(59, 91, 140, 0.06)',
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> This page is for design review and QA.
          Answers are not saved. Interactions are local only.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Stack spacing={5}>
        {MOCK_QUIZ_QUESTIONS.map((question) => (
          <Box key={question.id}>
            {/* Type label above each card */}
            <Typography
              variant="h3"
              sx={{
                mb: 1.5,
                color: 'primary.main',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {question.question_type}
            </Typography>

            <QuestionRenderer
              question={question}
              answer={undefined}
              onChange={() => {}}
              showType={false}
            />
          </Box>
        ))}
      </Stack>
    </PageContainer>
  );
}

export default QuizGalleryPage;