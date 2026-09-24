import { useAuth } from "../../hooks/useAuth";
import { Box, Paper, Stack } from "@mui/material";
import { PageContainer, PageTitle,  ActionButton} from "../../components/ui";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
    <PageContainer maxWidth="md">
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Stack spacing={2.5}>
            <PageTitle
             title={`Welcome, ${user?.username || 'User'}`}
             subtitle="You are logged in."
            />
            <Box sx={{display:'flex', gap:2, flexWrap:'wrap'}} />
            <ActionButton variant="secondary" fullWidth={false} onClick={()=> navigate('/account')}> 
            Account 
            </ActionButton>


          <div>
            <ActionButton variant="secondary" fullWidth={false} onClick={logout}>
              Logout
            </ActionButton>
          </div>
        </Stack>
      </Paper>
    </PageContainer>
    );
}

export default Homepage;


/* Mui --- 6-01
        <div>
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Roles: {user.roles.join(', ')}</p>
            <button onClick={logout}>Logout</button>
        </div>
*/