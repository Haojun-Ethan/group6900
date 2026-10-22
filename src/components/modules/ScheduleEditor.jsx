import { useState } from 'react';
import { Stack,Box, Alert, MenuItem,  FormControl, InputLabel, Select,  } from '@mui/material';
import { FormField,  ActionButton } from '../ui';
import { MOCK_SCHEDULE, FREQUENCY_CHOICES } from '../../pages/modules/_mockData';

/* Schedule editor for a module 课程周期  */
function ScheduleEditor({ /* future:moduleId, */ initialSchedule }) {
    const [form, setForm] = useState(
        initialSchedule || MOCK_SCHEDULE || {
        frequency: 'ANNUAL',
        custom_interval_days: null,
        initial_due_days: 30,
        reminder_days_before: 7,
        overdue_reminder_days: 3,
        is_active: true,
        }
    );

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const updateField = (name, value) =>
        setForm((prev) => ({ ...prev, [name]: value }));

    const handleSave = async () => {
        setError('');
        setSuccess('');

        if (form.frequency === 'CUSTOM' && !form.custom_interval_days) {
            setError('Custom interval days required when frequency is CUSTOM');
            return;
        }

        setIsSaving(true);

        try {

        // future: await schedulesApi.setSchedule(moduleId, form);

        await new Promise((r) =>  setTimeout(r, 400));

        setSuccess('Schedule saved');
        } catch (err) {
            setError(err.message || 'Failed to save schedule');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Stack spacing={2.5}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select value={form.frequency} label="Frequency"  onChange={(e) => updateField('frequency', e.target.value)} >

                    {FREQUENCY_CHOICES.map((f) => (
                        <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            {form.frequency === 'CUSTOM' && (
                <FormField
                    label="Custom Interval (days)"
                    type="number"
                    value={form.custom_interval_days || ''}
                    onChange={(e) => updateField('custom_interval_days', Number(e.target.value))}
                    inputProps={{ min: 1 }}
                />
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormField
                    label="Initial Due (days)"
                    type="number"
                    value={form.initial_due_days}
                    onChange={(e) => updateField('initial_due_days' , Number(e.target.value))}
                    inputProps={{ min: 1 }}
                />

                <FormField
                    label="Reminder Before (days)"
                    type="number"
                    value={form.reminder_days_before}
                    onChange={(e) => updateField('reminder_days_before', Number(e.target.value))}
                    inputProps={{ min: 0 }}
                />


                <FormField
                    label="Overdue Reminder (days)"
                    type="number"
                    value={form.overdue_reminder_days}
                    onChange={(e) => updateField( 'overdue_reminder_days',  Number(e.target.value))}
                    inputProps={{ min: 0 }}
                />
            </Stack>

            <Box>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox"  checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} />

                    Schedule is active
                </label>
            </Box>

            <ActionButton fullWidth={false }  onClick= {handleSave}  loading={isSaving} >
                 Save Schedule
            </ActionButton>

        </Stack>
    );
    
}



export default ScheduleEditor;