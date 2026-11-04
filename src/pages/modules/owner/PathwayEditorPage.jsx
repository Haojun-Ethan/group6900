import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Paper, TextField, Autocomplete, Alert } from '@mui/material';
// import our custom ui
import { PageContainer, PageTitle, ActionButton, Icon } from '../../../components/ui';
import * as pathwaysApi from '../../../api/pathways';
import * as modulesApi from '../../../api/modules';

function PathwayEditorPage() {
    const { id } = useParams( );  
    const navigate = useNavigate();
    const isEdit = !!id; // if id exists,   editing it

    const [form, setForm] = useState({
        name: '',
        description: '',
    });
    
    

    const [selectedModules, setSelectedModules] = useState([]);
     
    const [allModules, setAllModules] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let ignore = false;
        const loadData = async () => {
            setIsLoading(true);
            setError('');
            try {
                // always load all modules for the autocomplete
                const mods = await modulesApi.listModules();
                if (!ignore) setAllModules(mods || []);

                 
                if (isEdit) {

                    const pathData = await pathwaysApi.getPathway(id);

                    if (!ignore && pathData) {
                        setForm({
                            name: pathData.name || '',
                            description: pathData.description || ''
                        });
                        // mapping the selected modules
                         
                        if (pathData.modules) {
                            
                            const currentSelected = pathData.modules.map(link => {
                                return mods.find(m => Number(m.id) === Number(link.module));
                            }).filter(Boolean); 
                            
                            setSelectedModules(currentSelected);
                        }
                    }
                }
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load data');
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };
        loadData();
        return () => { ignore = true; };
    }, [id, isEdit]);

    const handleSave = async () => {
        if (!form.name.trim()) {
            setError('Pathway name is required');
            return;
        }

        setIsSaving(true);
        setError('');
        setSuccess('');

         
        const moduleIds = selectedModules.map(m => m.id);
        const payload = {
            name: form.name,
            description: form.description,
            module_ids: moduleIds,  
        };

        try {
            if (isEdit) {
                await pathwaysApi.updatePathway(id, payload);
                setSuccess('Pathway updated successfully');
            } else {
                await pathwaysApi.createPathway(payload);
                setSuccess('Pathway created successfully');
            }
 
            setTimeout(() => navigate('/pathways'), 1500);
        } catch (err) {
            setError(err.message || 'Failed to save pathway');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer maxWidth="md">
                <Typography>Loading editor...</Typography>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="md">
            <Stack spacing={3}>
                <Box>
                    <ActionButton variant="ghost" fullWidth={false} onClick={() => navigate('/pathways')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon.ArrowBack fontSize="small" /> Back to Pathways
                        </Box>
                    </ActionButton>
                </Box>

                <PageTitle 
                    title={isEdit ? 'Edit Pathway' : 'Create Pathway'} 
                    subtitle="Group modules into a structured learning track."
                    />

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Stack spacing={3}>
                        <TextField  label="Pathway Name"  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}   fullWidth  disabled={isSaving} />

                        <TextField   label="Description"   value={form.description}   onChange={(e) => setForm({ ...form, description: e.target.value })}  fullWidth  multiline  rows={3}  disabled={isSaving} />

                        <Autocomplete
                            multiple
                            options={allModules}
                            getOptionLabel={(option) => option.title || 'Unknown Module'}
                            value={selectedModules}
                            onChange={(event, newValue) => { setSelectedModules(newValue); }}

                            renderInput={(params) => (
                                <TextField  {...params}  label="Select Modules (in order)"   placeholder="Add modules"   />
                            )}

                            disabled={isSaving}
                        />

                        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                            <ActionButton 
                                fullWidth={false} 
                                onClick={handleSave} 
                                loading={isSaving} 
                                loadingText="Saving..."
                            >
                                {isEdit ? 'Update Pathway' : 'Create Pathway'}
                            </ActionButton>
                        </Box>
                         </Stack>
                    </Paper>

            </Stack>
        </PageContainer>
    );
}

export default PathwayEditorPage;