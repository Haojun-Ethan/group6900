/*  important, 07-01  */

 
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Stack, Box, Typography, Tabs, Tab, Alert, Divider, Chip, } from '@mui/material';
import * as modulesApi from '../../../api/modules';
import {   PageContainer, PageTitle, FormField, ActionButton, Icon , } from '../../../components/ui';
import SectionManager from '../../../components/modules/SectionManager';
import ScheduleEditor from '../../../components/modules/ScheduleEditor';
//import { MOCK_MODULE_DETAIL } from '../_mockData';

//const DEMO_STATE = 'normal';    // 'normal' | 'loading'

/**
 * create/edit module form page
 *
 * Route:
 *   /owner/modules/create
 *   /owner/modules/:id/edit
 */
function ModuleFormPage() {
    const { id } = useParams();

    const navigate = useNavigate();
    const isEdit = !!id;

    const [tab, setTab] = useState(0);
    const [module, setModule] = useState(null);

    const [form, setForm] = useState({
        title: '',
        summary: '',
        description: '',
        category: '',
        passMark: 80,              // 0-100
        estimatedMinutes: 30,      // Estimated study time 预计学习时间
        selfEnrollAllowed: true,
    });


    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Load module for edit 
    useEffect(() => {
        if (!isEdit) return;            // only load when editing
        let ignore = false;
        const load = async () => {
            setIsLoading(true);     // show loading state
            setError('');

            try {
                // temporary
                // const data = await modulesApi.getModule(id);

                const data = await modulesApi.getModule(id); /* new Promise((r) =>
                setTimeout(() => r(MOCK_MODULE_DETAIL), 400)
                );
                */

                if (!ignore) {
                setModule(data);

                    setForm({ 
                        title: data.title || '',
                        summary: data.summary || '',
                        description: data.description || '',
                        category: data.category || '',
                        passMark: data.passMark ?? 80,
                        estimatedMinutes: data.estimatedMinutes ?? 30,
                        selfEnrollAllowed: data.selfEnrollAllowed ?? true,
                    });
                 }
            } catch (err) {
                if (!ignore) {setError(err.message || 'Failed to load module');}
            } finally {
                if (!ignore) {setIsLoading(false);}
            }
        };
        load();
        return () => { ignore = true; };
    }, [id, isEdit]);

    const updateField = (name, value) =>
        setForm((prev) => ({ ...prev, [name]: value}));

    const handleSaveBasic = async () => {       // save basic info
        setError('');
        setSuccess('');

        if (!form.title.trim()) {           // simple validation: title is required

            setError('Title is required');
            setTab(0);          // switch to basic info tab
            return;
        }

        setIsSaving(true);
        try {
            if (isEdit) {

                // future: await modulesApi.updateModule(id, form);
                //await new Promise((r) => setTimeout(r, 400));
                await modulesApi.updateModule(id, form);
                setSuccess('Module updated' );
            } else {

                // future:      const created = await modulesApi.createModule(form);
                // future ：     navigate(`/owner/modules/${created.id}/edit`);

                const created = await modulesApi.createModule(form); /*new Promise((r) =>
                setTimeout(() => r({ id: 999  }),  400)
                );
                */

                navigate(`/owner/modules/${created.id}/edit`, { replace: true });
            }


        } catch (err) {
            setError(err.message || 'Failed to save');
        } finally {
            setIsSaving(false);
        }
    };


    const handlePublish = async () => {     // publish module

        if (!isEdit) return;    // only for edit mode

        setError('');
        setSuccess(''); // important - clear previous messages 


        try {

        // future : await modulesApi.updateModule(id, { status: 'PUBLISHED' });
        await modulesApi.updateModule(id, { status: 'PUBLISHED' });
        //await new Promise((r) => setTimeout(r, 400));

        setModule((prev) => ({ ...prev, status: 'PUBLISHED' }));    // update local state to reflect published status
        
        setSuccess('Module published');     // show success message
        } catch (err) {
        setError(err.message || 'Failed to publish');
        }
    };


    if (isLoading ) {    // Showwing state 
        return (
            <PageContainer maxWidth="lg">
                <Typography>  Loading... </Typography>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="lg" >
        <Stack spacing={3}>
            <Box>
            <ActionButton variant="ghost" fullWidth={false}  onClick={() => navigate('/owner/modules')} >
                <Box sx={{ display:  'flex', alignItems: 'center', gap: 1 }}>
                    <Icon.ArrowBack fontSize="small"  />
                    Back
                </Box>
            </ActionButton>
            </Box>

            <PageTitle
            title={isEdit ? 'Edit Module' : 'Create Module'}
            subtitle={  isEdit ? `Editing: ${module?.title}` : 'Fill in the basics, then add sections and a schedule.'  }  
            />

            {error && <Alert severity="error">{error}</Alert>}

            {success && <Alert severity="success">{success}</Alert>}

            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>

            <Tabs value={tab} onChange={(e, v) => setTab(v)}  sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}  >
                <Tab label="Basic Info" />
                <Tab label="Sections" disabled={!isEdit}/>
                <Tab label="Schedule" disabled={!isEdit} />
            </Tabs>

            <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                 {/* ===  Tab 0:  Basic Info ===== */}
                {tab === 0 && (
                <Stack spacing={2.5}>
                    {isEdit && module?.status && (
                    <Box> <Chip label={module.status}  color={module.status === 'PUBLISHED' ? 'success' : 'warning'}  size="small"/> </Box>
                    )}

                    <FormField  label="Title" value={form.title}  onChange={(e) =>updateField('title', e.target.value)} disabled={isSaving} />

                    <FormField label="Summary"      value={form.summary}      onChange={(e)=> updateField('summary' , e.target.value)}     disabled={isSaving} inputProps={{ maxLength: 200 }}/>

                    <FormField label="Description"  value={form.description}  onChange={(e) => updateField('description', e.target.value)} disabled={isSaving}  inputProps={{ multiline: true, rows: 5 }}
                    />

                    <FormField label="Category"     value={form.category}       onChange={(e)=> updateField('category', e.target.value)}    disabled={isSaving}/>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormField label="Pass Mark (%)" type="number" value={form.passMark} onChange={(e) => updateField('passMark', Number(e.target.value))} disabled={isSaving} inputProps={{ min: 0, max: 100 }}  />
                    
                    <FormField label="Estimated Minutes" type="number"  value={form.estimatedMinutes} onChange={(e) => updateField('estimatedMinutes', Number(e.target.value))} disabled={isSaving} inputProps={{ min: 1 }}  />
                </Stack>

                <Box>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox"  checked={form.self_enroll_allowed} onChange={(e) => updateField('self_enroll_allowed', e.target.checked)} disabled={isSaving}  />
                        Allow self-enrollment
                    </label>
                </Box>

                    <Divider sx={{ my: 1 }} />

                    <Stack direction="row" spacing={2}>
                    <ActionButton fullWidth={false} onClick={handleSaveBasic}  loading={isSaving} >
                        {isEdit ? 'Save Changes' : 'Create Module'}
                    </ActionButton>

                    {isEdit && module?.status === 'DRAFT' && (
                        <ActionButton variant="secondary" fullWidth={false} onClick={handlePublish} >
                        Publish
                        </ActionButton>
                    )}
                    </Stack>
                </Stack>
                )}

                {/* ===== Tab 1: Sections == */}
                {tab === 1 && isEdit && (
                    <SectionManager moduleId={id} initialSections={module?.sections || [] } />
                )}

                {/* ===== Tab 2: Schedule  == */}
                {tab === 2 && isEdit && (
                    <ScheduleEditor moduleId={id} initialSchedule={module?.schedule}  />
                )}
            </Box>
            </Paper>


        </Stack>
        </PageContainer>
    );
}



export default ModuleFormPage;