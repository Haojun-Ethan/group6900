import { useLocation } from "react-router-dom"
import { PageContainer, PageTitle } from "../../components/ui";
import { Paper, Stack, Typography } from "@mui/material";




function PlaceholderPage() {
    const location=useLocation();
    return(
        <PageContainer maxWidth="md">
            <Paper elevation={0} sx={{P:{xs:2.5, sm:3, md:4 },borderRadius:2}}>
                <Stack spacing={2}>
                    <PageTitle title="Coming soon" subtitle={'This page is under construction with ${loacation.pathname}'} />
                    <Typography variant="body2" color="text.secondary">
                        The route is registered. The page will display.
                    </Typography>
                </Stack>
            </Paper>
        </PageContainer>
    )
}

export default PlaceholderPage;