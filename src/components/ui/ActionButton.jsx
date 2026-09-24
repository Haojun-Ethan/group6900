import { Button, CircularProgress } from "@mui/material";


/**
 * Action button with loading state
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} [props.variant='primary']
 * @param {boolean} [props.loading=false]
 * @param {string} [props.loadingText]
 * @param {boolean} [props.disabled]
 * @param {() => void} [props.onClick]
 * @param {'button' | 'submit' | 'reset'} [props.type='button']
 * @param {boolean} [props.fullWidth=true]
 * @param {Object} [props.sx]
 */


function ActionButton ({
    children,
    variant='primary',
    loading = false,
    loadingText,
    disabled,
    onClick,
    type='button',
    fullWidth =true,
    sx,
})
{
    const variantMap = {
    primary: 'contained',
    secondary: 'outlined',
    danger: 'contained',
    ghost: 'text',
    };

    const muiVariant = variantMap[variant] || 'contained';

    const color = variant === 'danger' ? 'error' : 'primary';

    return(
        <Button type={type}
        variant={muiVariant}
        color={color}
        onClick={onClick}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        size="large"
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        sx={sx}>

        {loading && loadingText ? loadingText : children}
        </Button>        
    )
}

export default ActionButton;