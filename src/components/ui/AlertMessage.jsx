import { Alert } from "@mui/material";

/**
 * Alert message (error / success / info / warning)
 *
 * @param {Object} props
 * @param {'error' | 'warning' | 'info' | 'success'} props.type
 * @param {React.ReactNode} props.children
 * @param {Object} [props.sx]
 */


function AlertMessage ({type, children, sx}) {
    return(
        <Alert severity={type} sx={{borderRadius:1,...sx}}> {children}</Alert>
    );
}

export default AlertMessage;