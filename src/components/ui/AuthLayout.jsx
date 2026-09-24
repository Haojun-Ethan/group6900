import { Box, Paper } from "@mui/material";
import PageTitle from "./PageTitle";

/**
 * Layout for auth pages (login / register / 2FA)

 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children
 */



function AuthLayout({title, subtitle, children}) {
    return(
        <Box
            sx={{
                minHeight:'100vh',
                display:'flex',
                alignItems:'center',
                justifyContent: 'center',
                backgroundColor:'Background.default',
                px:{xs:2, sm:3},
                py:{xs:3, sm:4},
            }}
        >
            <Paper elevation={0}
            sx={{
                width:'100%',
                maxWith:{xs:'100%',sm:420  },
                p:{xs:2.5,sm:3,md:4},
                borderRadius:2,
            }}
            >
                <PageTitle title={title} subtitle={subtitle}/>
                {children}
            </Paper>
        </Box>
    );
}

export default AuthLayout;