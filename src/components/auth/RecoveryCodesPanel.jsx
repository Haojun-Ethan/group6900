import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { ActionButton, AlertMessage } from '../ui';

/** Shows freshly issued 2FA recovery codes once, with copy and download. */
function RecoveryCodesPanel({ codes }) {
    const [copied, setCopied] = useState(false);
    const text = codes.join('\n');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([`DefendEd recovery codes\nEach code works once.\n\n${text}\n`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'defended-recovery-codes.txt';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <AlertMessage type="warning">
                Save these recovery codes somewhere safe. If you lose your phone, each code lets you
                log in once. They won't be shown again.
            </AlertMessage>

            <Box
                component="ul"
                sx={{
                    m: 0, p: 2, listStyle: 'none', borderRadius: 1,
                    backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '1rem',
                    display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, textAlign: 'center',
                }}
            >
                {codes.map((code) => <li key={code}>{code}</li>)}
            </Box>

            <Stack direction="row" spacing={1}>
                <ActionButton variant="secondary" onClick={handleCopy}>
                    {copied ? 'Copied' : 'Copy codes'}
                </ActionButton>
                <ActionButton variant="secondary" onClick={handleDownload}>
                    Download .txt
                </ActionButton>
            </Stack>
        </Stack>
    );
}

export default RecoveryCodesPanel;
