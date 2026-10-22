import { Box, Typography, Stack } from '@mui/material';

/**
 * Empty state placeholder
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle] 
 * @param {React.ReactNode} [props.action] - Optional action button   /可选操作按钮
 */
function EmptyState({ title, subtitle, action }) {
  return (
    <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" color="text.primary">
          {title}
        </Typography>
        {subtitle && <Typography variant="body2">{subtitle}</Typography>}
        {action}
      </Stack>
    </Box>
  );
}

export default EmptyState;