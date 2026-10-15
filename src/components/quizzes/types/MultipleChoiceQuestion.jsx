import { Stack, Paper, Typography, Checkbox } from '@mui/material';

/**
 *
 * @param {Object} props
 * @param {object} props.question
 * @param {number[]} props.value        - Selected choice ids - important: this is an array of choice ids for multiple choice questions
 * @param {(v: number[]) => void} props.onChange
 * @param {boolean} [props.disabled]
 */
function MultipleChoiceQuestion({ question, value = [], onChange, disabled = false }) {
    const sorted = [...(question.choices || [])].sort((a, b) => a.order - b.order);

    const toggle = (choiceId) => {
        if (disabled) return;

        const next = value.includes(choiceId) ? value.filter((id) => id !== choiceId) : [...value, choiceId]; // toggle selection
        onChange(next);
    };

    return (
        <Stack spacing={1}>

            {sorted.map((choice) => {
                const isSelected = value.includes(choice.id);

                return (

                    <Paper
                        key={ choice.id}
                        elevation={0}
                        onClick={() =>toggle(choice.id ) }
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

                        <Checkbox checked={isSelected} disabled={disabled } size= "small" />

                        <Typography variant="body1">{choice.text}</Typography>
                    </Paper>
                );
            })}
        </Stack>
    );
}

export default MultipleChoiceQuestion;