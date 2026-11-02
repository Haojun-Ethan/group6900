import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Stack, Box, Alert } from '@mui/material';
import apiClient from '../../../api/client';
import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';

function PathwayDetailPage() {
    const [pathway, setPathway] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await apiClient.get(`/pathways/${id}/`);
                if (!ignore) setPathway(data || null);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load pathways');
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();
        
        return () => { ignore = true; }
    }, [id]);

    if (isLoading) {
        return (
            <PageContainer>
                <Typography>Loading ...</Typography>
            </PageContainer>
        );
    }

    if (!pathway) {
        return (
            <PageContainer>
                <Alert severity="error ">Pathways not found.</Alert>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Alert severity="error">{error}</Alert>
            </PageContainer>
        );
    }   
    return (
        <PageContainer maxWidth="md">
            <Stack spacing={3   }>
                <Box>
                    <ActionButton variant="ghost" fullWidth="false" onClick={() => navigate('/pathways')} >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon.ArrowBack fontSize='small' /> Back to Pathways
                        </Box>
                    </ActionButton>
                </Box>

                <PageTitle title={pathway.name} subtitle={pathway.description} />

                <Typography variant='h3' sx={{ mt: 2 }}>Modules in this Pathway</Typography>

                <Stack spacing={2}> {pathway.module?.map((link, index ) => (
                    <Paper key={index.id} elevation={0} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {index + 1}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant='h4'>{link.module_title}</Typography>
                            <Typography variant='body2' color='text.secondary'>{link.description}</Typography>
                        </Box>
                        <ActionButton fullWidth={false} onClick={() => navigate(`/modules/${link.module}`)}>View Module</ActionButton>
                    </Paper>
                ))} 
                </Stack>
            </Stack>
        </PageContainer>
    );
}

export default PathwayDetailPage;