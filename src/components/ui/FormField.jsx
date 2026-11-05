import { TextField } from "@mui/material";



function FormField ( {
    label,
    value,
    onChange,
    type = 'text',
    error,
    disabled,
    placeholder,
    autoComplete,
    inputRef,
    inputProps,
    sx,
    multiline,
    rows,
    helperText,
})
{
    return (
        <TextField 
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            error= {!!error}
            helperText={error || helperText}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputRef={inputRef}
            multiline={multiline}
            rows={rows}
            fullWidth
            variant="outlined"
            {...(inputProps ? { inputProps } : {})}
            sx={sx}
            />
    );
}

export default FormField;