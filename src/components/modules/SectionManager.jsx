/*  07-01 https://react.dev/learn/adding-interactivity */

import { useState } from 'react';
import { Stack, Box, Typography, Paper, IconButton, Tooltip, Alert,  } from '@mui/material';
import { FormField, ActionButton, Icon } from '../ui';
import EmptyState from '../ui/EmptyState';
import * as sectionsApi from '../../api/sections';
/**
 * Section manager - add/edit/delete sections inline  -> 新增/编辑/删除
 *
 * @param {Object} props
 * @param {number|string} props.moduleId
 * @param {Array} props.initialSections
 */
function SectionManager({ moduleId, initialSections = [] }) {

    const [sections, setSections] = useState(initialSections);
    const [editingId, setEditingId] = useState(null);
     const [error, setError] = useState('');
     const [isSaving, setIsSaving] = useState(false);    /* 08-01 */

    const [draft, setDraft] = useState({ title: '', body: '', order: 1 });
   

    const isCreating = editingId === 'new';     // true， if creating a new section


    const startCreate = () => {         // Start creating a new section
        setEditingId('new');
        setDraft({ title: '', body: '',  order: sections.length + 1 });
    };

    const startEdit = (section) => {    //Start editing an existing section
        setEditingId(section.id);
        setDraft({title: section.title,  body:section.body, order:section.order});
    };

    const cancel = () => {              //Cancel creating & editing

        setEditingId(null);
        setDraft({ title: '', body: '', order: 1 });
        setError('');
    };


    const handleSave = async () => {    // Save new or existing section 
        
        if (!draft.title.trim()) {

        setError('Title is required');
        return;
        }

        setIsSaving(true);   /* 08-01 */
        setError('');

        try {
        if (isCreating) {

            // future: const created = await sectionsApi.createSection({ module: moduleId, ...draft });
            /*const created = { id: Date.now(), module: moduleId, ...draft };
            await new Promise((r) => setTimeout(r, 300));
            */
            const created = await sectionsApi.createSection({
                    module: moduleId,
                    title: draft.title,
                    body: draft.body,
                    order: draft.order,
                });
            setSections((prev) => [...prev, created]);
        } else {

            // future: await sectionsApi.updateSection(editingId, draft);
            /*await new Promise((r) => setTimeout(r, 300)); */
            const updated = await sectionsApi.updateSection(editingId, {
                    title: draft.title,
                    body: draft.body,
                    order: draft.order,
                });
            setSections((prev) =>           // Update the section in the list
            prev.map((s) => (s.id === editingId ? updated : s))      //https://react.dev/learn/updating-arrays-in-state
            );
        }
        cancel();
        } catch (err) {
        setError(err.message || 'Failed to save section');
        } finally {
            setIsSaving(false);
        }
    };

    /*  Delete section   */
    const handleDelete = async (sectionId) => {

        if (!window.confirm('Delete this section?')) return;
        
        const prev = sections;
        setSections((items) => items.filter((s) => s.id !== sectionId));

        try {

        // future: await sectionsApi.deleteSection(sectionId);
        /*await new Promise((r) => setTimeout(r, 300));*/
        await sectionsApi.deleteSection(sectionId);

        } catch (err) {
            setSections(prev);
            setError(err.message || 'Failed to delete');
        }
    };

    return (
        <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3"> Sections ({sections.length}) </Typography>

            {!isCreating && (
                <ActionButton fullWidth={false} variant="secondary" onClick={startCreate}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon.Add fontSize="small" /> Add Section  </Box>
                </ActionButton>
            )}
        </Box>


        {isCreating && (    // creating  form
            <Paper elevation={0} sx={{ p: 2, border: '2px solid', borderColor: 'primary.main' }}>
                <Stack spacing={2}>
                    <FormField  label="Title"   value={draft.title} onChange={(e) => setDraft((d) => ({ ...d,  title:e.target.value }))}  disabled={isSaving} />
                    <FormField  label="Body"    value={draft.body}  onChange={( e) => setDraft((d) => ({ ...d, body: e.target.value }))}                            inputProps={{ multiline: true, rows: 4 }} disabled={isSaving}   />
                    <FormField  label="Order"   type="number"   value={draft.order} onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) }))}    inputProps={{ min: 1 }}  disabled={isSaving} />
                    <Stack direction="row" spacing={1}>
                        <ActionButton fullWidth={false} onClick={handleSave} loading={isSaving}>Save</ActionButton>
                        <ActionButton fullWidth={false} variant="ghost" onClick={cancel} disabled={isSaving} >Cancel </ActionButton>
                    </Stack>
                </Stack>

            </Paper>
        )}


        {sections.length === 0 && !isCreating ? (  // existing sections

            <EmptyState title="No sections yet" subtitle="Add your first section to start building the module." />
        ) : (
                <Stack spacing={1.5}>
                {[...sections].sort((a,b) => a.order - b.order).map((section ) => {
                    const isEditing = editingId === section.id;

                    return (
                    <Paper key={section.id} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }} >

                {isEditing ? (
                <Stack spacing={2}>
                    
                    
                    <FormField label="Title"    value={draft.title}     onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}  disabled={isSaving}  />
                    <FormField label="Body"     value={draft.body}      onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} inputProps={{ multiline: true, rows: 4 }}  disabled={isSaving} />
                    <FormField label="Order" type="number"  value={draft.order} onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) }))}   inputProps={{ min:1}} disabled={isSaving}  />


                    <Stack direction="row" spacing={1}>
                        <ActionButton fullWidth={false} onClick={handleSave} loading={isSaving}>Save</ActionButton>
                        <ActionButton fullWidth={false} variant="ghost" onClick={cancel}  disabled={isSaving}  >Cancel</ActionButton>
                    </Stack>
                </Stack>
                ) : (

                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box

                        sx={{
                            width: 28, height: 28, borderRadius: '50%',
                            backgroundColor: 'primary.light', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
                        }} >
                    
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h4" sx={{ mb: 0.5 }}>{section.title}</Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: '-webkit-box', WebkitLineClamp: 2 , WebkitBoxOrient:'vertical', overflow: 'hidden',  } } >

                            {section.body}

                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => startEdit(section)}>
                                <Icon.Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>


                        <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(section.id)}>
                                <Icon.Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>

                    </Stack>
                </Stack>
                )}
            </Paper>
             );

            })}
            </Stack>


        )}

        </Stack>
    );
}



export default SectionManager;