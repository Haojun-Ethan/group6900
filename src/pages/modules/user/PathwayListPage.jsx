

import { Paper, Typography, Grid, Chip, Alert, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageTitle, ActionButton } from "../../../components/ui";
import * as pathwaysApi from "../../../api/pathways";
import { useAuth } from "../../../hooks/useAuth";




function PathwayListPage() {
    const [pathways, setPathways] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            setIsLoading(true);
            setError('');

              
            try {
                const data = await pathwaysApi.listPathways();
                if (!ignore) setPathways(data || []);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load pathways');
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();

        return () => { ignore = true; }
    }, [user]);

    if (isLoading) {
        return  (
            <PageContainer>
                <Typography>Loading ...</Typography>
            </PageContainer>
        );
    }
    
    if (error) {
        return (
            <PageContainer> <Alert severity="error">{error}</Alert> </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: {xs:'column', sm:'row'}, justifyContent: 'space-between', alignItems: {xs:'flex-start', sm:'center'}, mb: 3 }}>
                <PageTitle title="Learning Pathways" subtitle="Complete a series of modules to master a topic."/> 

                {(user?.role === 'OWNER' || user?.role === 'ADMIN') && (
                        <ActionButton 
                            fullWidth={false} 
                            onClick={() => navigate('/owner/pathways/create')}
                        >
                            Create Pathway
                        </ActionButton>
                    )}
            </Box>

            {pathways.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No pathways available.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {pathways.map((p) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
                            <Paper elevation={0} sx={{p: 3, height: '100%', display: 'flex', flexDirection: 'column'}}>
                                <Typography variant="h3" sx={{ mb: 1 }}> {p.name} </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>{p.description}</Typography>
                                <Chip label={`${p.modules?.length || 0} Modules`} size="small" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start', mb: 2 }} />
                                <ActionButton fullWidth={false} onClick={() => navigate(`/pathways/${p.id}`)}> View Pathway </ActionButton>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </PageContainer>
    );
}

export default PathwayListPage;
                            