import { Box, Container } from "@mui/material";

/**
 * Page container with responsive padding
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'sm' |'md' |'lg'| 'xl'}[props.maxWidth='md']
 * @param {Object} [props.sx]
 */



function PageContainer({ children, maxWidth='md', sx, className }) {
    return(

        <Box sx={{
            minheight: '100vh',
            backgroundColor:'Background.default',
            py:{xs:3, sm:4, md:6},
            ...sx,
        }}
        className={className}
        ><Container maxWidth={maxWidth}>{children}</Container></Box>
    );
}


export default PageContainer;