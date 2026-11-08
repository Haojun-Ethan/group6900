import { Chip } from '@mui/material';
import { COMPLIANCE_STATUS } from '../../config/complianceStatus';

/** Enrollment compliance status chip: Overdue / Due Soon / Pending / Compliant. */
function ComplianceChip({ status, size = 'small' }) {
  const { color, label } = COMPLIANCE_STATUS[status] || { color: 'default', label: status || 'Unknown' };
  return <Chip label={label} color={color} size={size} sx={{ fontWeight: 600, fontSize: '0.7rem' }} />;
}

export default ComplianceChip;
