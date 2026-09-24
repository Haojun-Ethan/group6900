import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { ActionButton, PageTitle } from "../../components/ui";

function NotFoundPage() {
    const navigate=useNavigate();
    return (
        <Box
        sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            px: 2,
        }}
        >
        <Stack spacing={2} alignItems="center">
            <PageTitle title="404" subtitle="Page not found" />
            <ActionButton fullWidth={false} onClick={() => navigate('/')}>
            Go Home
            </ActionButton>
        </Stack>
        </Box>
    );
}

export default NotFoundPage;

/*
        <div>
            <h1>
                404 - Page Not Found 
            </h1>
            <Link to="/">Back to Home</Link>
        </div>
*/