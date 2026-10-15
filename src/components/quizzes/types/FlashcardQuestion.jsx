import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

/**
 * Flashcard question 
 * Interaction: click card → 3D flip; click again → flip back

 *
 * Ref: https://3dtransforms.desandro.com/card-flip
 *
 * @param {Object} props
 * @param {object} props.question
 * @param {boolean} [props.disabled]
 */
function FlashcardQuestion({ question, disabled = false }) {
    const [flipped, setFlipped] = useState(false);

    return (

        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tap the card to reveal the answer.
            </Typography>

            <Box
                onClick={() => !disabled && setFlipped((f) => !f)}
                sx={{
                perspective: '1000px',
                cursor: disabled ? 'default' : 'pointer',
                maxWidth: 480,
                mx: 'auto',
                height: 240,
                }} >

                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.6s',
                            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }} >

                        {/*  ======= Front ======  */}
                        <Paper
                            elevation={0}
                            sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            backfaceVisibility: 'hidden',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            textAlign: 'center',
                            }} >

                            <Typography variant="h3" sx={{ fontWeight: 600 }}> {question.text} </Typography>

                        </Paper>

                        {/* ========Back====== */}
                        <Paper
                            elevation={0}
                            sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',    //====== Flip the back side
                            border: '2px solid',
                            borderColor: 'success.main',
                            backgroundColor: 'rgba(76, 140, 90, 0.04)',  //=== different background color for back side
                            textAlign: 'center',
                            }} >
                            <Typography variant="body1" sx={{ fontWeight: 500 }}> {question.explanation || 'No answer provided'} </Typography>
                         </Paper>
                    </Box>
                </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button variant="text"  size="small" startIcon={<ReplayIcon />} onClick={() => setFlipped((f) => !f)} disabled={disabled} sx={{ textTransform: 'none' }} >
                    {flipped ? 'Show question' : 'Show answer'}
                </Button>
            </Box>
        </Box>
    );
}

export default FlashcardQuestion;



/* 
import ReactCardFlip from 'react-card-flip';  // only supports react 18
function FlashcardQuestion({ question, disabled = false }) {
    const [flipped, setFlipped] = useState(false);


    return (
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
                <Paper onClick={() => !disabled && setFlipped(true)}
                    sx={{
                        height: 240, p: 3, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid', borderColor: 'primary.main', textAlign: 'center',
                    }} >

                    <Typography variant="h3">{question.text}</Typography>
                </Paper>

                <Paper onClick={() => !disabled && setFlipped(false)}
                    sx={{
                        height: 240, p: 3, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid', borderColor: 'success.main',
                        backgroundColor: 'rgba(76, 140, 90, 0.04)', textAlign: 'center',
                    }} >

                    <Typography variant="body1">{question.explanation}</Typography>
                </Paper>


            </ReactCardFlip>
        </Box>
    );
}

export default FlashcardQuestion;
*/