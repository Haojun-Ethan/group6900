import { Typography, Box } from "@mui/material";

/**
 * Page title with optional subtitle
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {Object} [props.sx]
 */

function PageTitle({title,subtitle,sx}){
    return(
        <Box sx={sx}>
            <Typography variant="h1" component="h1" gutterBottom>{title}</Typography>
            {subtitle && (<Typography variant="body2" color="text.secondary" sx={{ mb:3}}>{subtitle}</Typography>)}
        </Box>
    )
}

export default PageTitle;