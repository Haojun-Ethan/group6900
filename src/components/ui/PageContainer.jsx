import { Box, Container } from "@mui/material";

/**
 * Page container with responsive padding
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'sm' |'md' |'lg'| 'xl'}[props.maxWidth='md']
 * @param {Object} [props.sx]
 */



function PageContainer({ children, maxWidth='md',sx}) {
    return(

        <Box sx={{
            minHeight: '100vh',
            backgroundColor:'background.default',
            py:{xs:3, sm:4, md:6},
            ...sx,
        }}
        ><Container maxWidth={maxWidth}>{children}</Container></Box>
    );
}


export default PageContainer;