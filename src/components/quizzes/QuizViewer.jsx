import { useMemo, useState } from 'react';
import { Stack, Box, Typography, Paper, Divider } from '@mui/material';
import QuestionRenderer from './QuestionRenderer';
import {ActionButton, AlertMessage} from '../ui';
//import { Try } from '@mui/icons-material';

/**
 * @param {Object} props
 * @param {Array} props.questions       - List of question objects
 * @param {(answers: object) => void} [props.onSubmit] - Submit handler (optional)
 * @param {boolean} [props.readOnly]
 * @param {boolean} [props.showType]
 * @param {boolean} [props.showNumbers=true]
 * @param {boolean} [props.showSubmitButton=true]
 */
function QuizViewer({
    questions,
    onSubmit, 

    readOnly = false,
    showType = true,
    showNumbers = true,

    showDebug = false,   /* add 07-02 */
    }) {

        const [answers, setAnswers] = useState({});         // { [questionId]: answer }

        const [isSubmitting, setIsSubmitting]= useState(false);
        const [error, setError ] = useState('');

        const handleChange = (questionId, value) => {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
        };

        const unanswered=useMemo( ( ) => { 
            return questions.filter( (q) =>{
                const a=answers[q.id];
                if(a==null) return true;

                if(Array.isArray(a)) return a.length===0;

                if ( typeof a === 'object')    return Object.keys(a).length===0;

                return false;
            } );
        }, [questions,answers]);

        const handleSubmit = async ( ) => {             /* change 07-02 */
            if (!onSubmit) return;
            setError('');

            if(unanswered.length >0){
                setError(`You have ${unanswered.length} unanswered question${unanswered.length===1 ? '': 's'}.`);
                return;
            }
        

            setIsSubmitting(true);
        
            try { await onSubmit(answers);}
                catch (err) {
                    setError(err.message || 'Submit failed');
                } finally {
                    setIsSubmitting(false);
                }
        };

    return (
        <Stack spacing={3}>
        {questions.map((q, idx) => (
            <Box key={q.id}>
            <QuestionRenderer
                question={q}
                answer={answers[q.id]}
                onChange={(v) => handleChange(q.id, v)}
                disabled={readOnly}
                showType={showType}
                index={showNumbers ? idx : undefined}
            />
            </Box>
        ))}

                {/* add 07-02 */}
        {showDebug && (
            <Box sx={{ p: 2, backgroundColor: '#f5f5f7', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}> DEBUG: answers </Typography>
                <pre style={{ margin: 0, fontSize: 12 }}> {JSON.stringify(answers, null, 2)} </pre>
            </Box>
        )}

        {/* change 07-02 */}
        {!readOnly && onSubmit && (  

            <>
            <Divider />
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                    <Stack spacing={2}>

                        {error && <AlertMessage type="error">{error}</AlertMessage>}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {unanswered.length === 0 ? 'All questions answered' : `${unanswered.length} question${unanswered.length===1 ? '' : 's'} unanswered`}
                        </Typography>

                        <ActionButton fullWidth={false} onClick={handleSubmit} loading={isSubmitting} loadingText="Submitting..." disabled={unanswered.length > 0} >
                            Submit Quiz
                        </ActionButton>
                    </Box>
                    </Stack>
                </Paper>
            </>
        )}
        </Stack>
    );
}

export default QuizViewer;


/* 07-01

        {!readOnly && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f7', borderRadius: 1 }}>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    DEBUG: current answers
                </Typography>

                <pre style={{ margin: 0, fontSize: 12 }}>
                    {JSON.stringify(answers, null, 2)}
                </pre>
            </Box>

        )}

*/