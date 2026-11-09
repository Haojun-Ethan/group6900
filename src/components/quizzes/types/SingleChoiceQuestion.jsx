import { Stack, Paper, Typography, Radio } from '@mui/material';

/** 07-01 
 *
 * @param {Object} props
 * @param {object} props.question
 * @param {number} props.value          - Selected choice id 
 * @param {(v: number) => void} props.onChange
 * @param {boolean} [props.disabled]
 */
function SingleChoiceQuestion({ question, value, onChange, disabled = false }) {
    const sorted = [...(question.choices || [])].sort((a, b) => a.order - b.order);

    return (
        <Stack spacing={1}>
        {sorted.map((choice) => {
            const isSelected = value === choice.id;
            return (
            <Paper
                key={choice.id}
                elevation={0}
                onClick={() => !disabled && onChange(choice.id)}
                sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    backgroundColor: isSelected ? 'rgba(59, 91, 140, 0.04)' : '#fff',
                    cursor: disabled ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': disabled ? {} : { borderColor: 'primary.light' },
                }}
            >
                <Radio checked={isSelected} disabled={disabled} size="small" />
                <Typography variant="body1">{choice.text}</Typography>
            </Paper>
            );
        })}
        </Stack>
    );
}

export default SingleChoiceQuestion;