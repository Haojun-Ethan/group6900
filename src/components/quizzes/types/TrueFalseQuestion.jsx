import { Stack, Paper, Typography, } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 *
 * Uses question.choices (2 choices: True, False) if present,
 * otherwise uses hardcoded True/False.
 *
 * @param {Object} props
 * @param {object} props.question
 * @param {string} props.value          - 'true' | 'false' | null
 * @param {(v: string) => void} props.onChange
 * @param {boolean} [props.disabled]
 */
function TrueFalseQuestion({ question, value, onChange, disabled = false }) {

    const useCustom = Array.isArray(question.choices) && question.choices.length === 2;   // Use custom True/False choices if provided 

    const options = useCustom ? question.choices.map((c) => ({ value: String(c.id), label: c.text }))  // use custom choices
        : [ { value: 'true',  label: 'True' },  { value: 'false', label: 'False' },
        ];



         return (
                
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                {options.map((opt) => {
                    const isSelected = value === opt.value;
                    const isTrue = opt.value === 'true' || opt.label.toLowerCase() === 'true';
                    const Icon = isTrue ? CheckCircleIcon : CancelIcon;

                    return (
                        <Paper key={opt.value} elevation={0} onClick={() => !disabled && onChange(opt.value)}
                            sx={{   //https://mui.com/system/getting-started/the-sx-prop/
                                flex: 1,
                                p: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1.5,
                                border: '2px solid',
                                borderColor: isSelected ? (isTrue ? 'success.main' : 'error.main') : 'divider',                                     // border color changes based on selection and true/false
                                backgroundColor: isSelected ? (isTrue ? 'rgba(76, 140, 90, 0.06)' : 'rgba(169, 68, 66, 0.06)') : '#fff',    // background color changes based on selection and true/false
                                cursor: disabled ? 'default' : 'pointer',       // cursor changes based on disabled state
                                transition: 'all 0.15s',                           // smooth transition for hover effect https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/transition
                                '&:hover': disabled ? {} : { borderColor: isTrue ? 'success.light' : 'error.light' },
                            }}
                        >
                            <Icon sx={{ fontSize: 32, color: isTrue ? 'success.main' : 'error.main' }} />
                            <Typography variant="h3" sx={{ fontWeight: 600 }}>
                            {opt.label}
                            </Typography>
                        </Paper>
                    );
            })}
            </Stack>
    );
}

export default TrueFalseQuestion;