import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Link } from '@mui/material';
import { ActionButton, AlertMessage, FormField } from '../ui';
import { filterCode, validateCode } from '../../utils/codeValidation';

/**
 * Asks for the password plus a second factor (authenticator code or a recovery code) before a
 * sensitive 2FA change. The backend checks both.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.confirmLabel
 * @param {boolean} [props.danger]      red confirm button
 * @param {() => void} props.onClose
 * @param {(c: {password: string, otp?: string, recoveryCode?: string}) => Promise<void>} props.onConfirm
 *        throw to show an error and keep the dialog open
 */
function ConfirmIdentityDialog({ open, title, description, confirmLabel, danger = false, onClose, onConfirm }) {
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [useRecovery, setUseRecovery] = useState(false);
    const [error, setError] = useState('');
    const [isBusy, setIsBusy] = useState(false);

    const reset = () => {
        setPassword('');
        setCode('');
        setUseRecovery(false);
        setError('');
    };

    const close = () => {
        if (isBusy) return;
        reset();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password) return setError('Enter your password');

        if (useRecovery) {
            if (!code.trim()) return setError('Enter one of your recovery codes');
        } else {
            const codeError = validateCode(code);
            if (codeError) return setError(codeError);
        }

        setIsBusy(true);
        try {
            await onConfirm(useRecovery ? { password, recoveryCode: code.trim() } : { password, otp: code });
            reset();
        } catch (err) {
            setError(err.message || 'Could not confirm your identity');
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ pt: 1 }}>
                        <Typography variant="body2" color="text.secondary">{description}</Typography>

                        {error && <AlertMessage type="error">{error}</AlertMessage>}

                        <FormField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            disabled={isBusy}
                        />

                        <FormField
                            label={useRecovery ? 'Recovery code' : '6-digit code from your authenticator app'}
                            value={code}
                            onChange={(e) => setCode(useRecovery ? e.target.value : filterCode(e.target.value))}
                            autoComplete={useRecovery ? 'off' : 'one-time-code'}
                            disabled={isBusy}
                            inputProps={useRecovery ? { maxLength: 32 } : { inputMode: 'numeric', maxLength: 6 }}
                        />

                        <Link component="button" type="button" underline="hover" sx={{ alignSelf: 'flex-start' }}
                            onClick={() => { setUseRecovery((v) => !v); setCode(''); setError(''); }}>
                            {useRecovery ? 'Use my authenticator app instead' : 'Use a recovery code instead'}
                        </Link>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={close} disabled={isBusy}>Cancel</Button>
                    <ActionButton type="submit" fullWidth={false} loading={isBusy} loadingText="Checking..."
                        variant={danger ? 'danger' : 'primary'}>
                        {confirmLabel}
                    </ActionButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ConfirmIdentityDialog;
