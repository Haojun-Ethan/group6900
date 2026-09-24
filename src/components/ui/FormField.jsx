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
})
{
    return (
        <TextField 
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            error= {!!error}
            helperText={error}
            disable={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            inputProps={inputProps}
            sx={sx}
            />
    );
}

export default FormField;