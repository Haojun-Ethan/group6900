import { Chip } from '@mui/material';

/**
 * Module status badge 
 * DRAFT | PUBLISHED | ARCHIVED
 */
const STATUS_MAP = {
  DRAFT:     { color: 'warning', label: 'Draft' },
  PUBLISHED: { color: 'success', label: 'Published' },
  ARCHIVED:  { color: 'default', label: 'Archived' },
};

function StatusBadge({ status, size = 'small' }) {
  const { color, label } = STATUS_MAP[status] || STATUS_MAP.ARCHIVED;
  return (
    <Chip
      label={label}
      color={color}
      size={size}
      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
    />
  );
}

export default StatusBadge;