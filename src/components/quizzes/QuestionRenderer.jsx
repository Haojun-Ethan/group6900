import { Paper, Stack, Typography, Chip, Box } from '@mui/material';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from './types';

/**
 * QuestionRenderer component
 * @param {Object} props
 * @param {object} props.question           - Question object  
 * @param {any} props.answer                - Current answer  
 * @param {(v: any) => void} props.onChange - Change handler
 * @param {boolean} [props.disabled]        - Read-only mode  
 * @param {boolean} [props.showType]        - Show type badge  
 * @param {number} [props.index]            - Question number  
 */
function QuestionRenderer({
    question, answer, onChange,  disabled =false,  showType=true, index,
    }) {


        const TypeComponent = QUESTION_TYPES[question.question_type];

        if (!TypeComponent) {
            return (
                <Paper sx={{ p: 3 }}>

                    <Typography color="error">  Unknown question type: {question.question_type}  </Typography>
                </Paper>
            );
        }

        return (
            <Paper elevation={0}  sx={{ p: { xs: 2.5, sm: 3 },  borderRadius: 2,  border:'1px solid', borderColor: 'divider', }} >
                <Stack spacing={2}>

                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>  {/* // header, number, type, points */}
                        {typeof index === 'number' && (
                            <Chip label={`Q${index + 1}`}  size="small" color="primary" sx={{ fontWeight: 600 }} />
                        )}
                        
                        {showType && (
                            <Chip  label={QUESTION_TYPE_LABELS[question.question_type] || question.question_type}
                            size="small"  variant="outlined"  sx={{ fontSize: '0.7rem' }}  />
                        )}

                        {question.points != null && (
                            <Chip
                            label={`${question.points} pt${question.points === 1 ? '' : 's'}`}
                            size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                        )}
                    </Stack>

                    <Typography variant="h3" sx={{ lineHeight: 1.5 }}> {question.text} </Typography>  // question text


                    <Box>   //question text 
                        <TypeComponent question={ question}  value={ answer}  onChange={onChange } disabled={ disabled} />
                    </Box>
                </Stack>
            </Paper>
    );
}

export default QuestionRenderer;