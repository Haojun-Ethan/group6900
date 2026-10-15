import {
  Paper, Box, Typography, Stack, IconButton, Tooltip, Chip,
} from '@mui/material';
import { Icon } from '../ui';

/**
 * Section list for a module
 * MUI handbook - List
 * https://mui.com/material-ui/react-list/
 *
 * @param {Object} props
 * @param {Array} props.sections - Section array 
 * @param {boolean} [props.completedIds] - IDs marked complete / 已完成的章节 ID
 * @param {(sectionId: number) => void} [props.onMarkComplete] - Callback / 标记完成的回调
 * @param {boolean} [props.readOnly] - Read-only mode 
 */
function SectionList({
  sections = [],
  completedIds = [],
  onMarkComplete,
  readOnly = false,
}) {
  if (sections.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">No sections yet</Typography>
      </Box>
    );
  }

  // Sort by order
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <Stack spacing={1.5}>
      {sorted.map((section, idx) => {
        const isCompleted = completedIds.includes(section.id);
        return (
          <Paper
            key={section.id} // Paper is a MUI component that provides a background and elevation
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            {/* Sequence number  */}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCompleted ? 'success.main' : 'primary.light',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {isCompleted ? '✓' : idx + 1}
            </Box>

            {/* Content  内容部分  考虑长文 */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {section.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {section.body}
              </Typography>
            </Box>

            {/* Actions  */}
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              {isCompleted && (
                <Chip
                  label="Done"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              )}
              {!readOnly && !isCompleted && onMarkComplete && (
                <Tooltip title="Mark as complete">
                  <IconButton
                    size="small"
                    onClick={() => onMarkComplete(section.id)}
                  >
                    <Icon.CheckCircle fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}

export default SectionList;