/** Enrollment compliance statuses, as computed by the backend's EnrollmentSerializer, in display order. */
export const COMPLIANCE_STATUS = {
  OVERDUE:   { color: 'error',   label: 'Overdue' },
  DUE_SOON:  { color: 'warning', label: 'Due Soon' },
  PENDING:   { color: 'default', label: 'Pending' },
  COMPLIANT: { color: 'success', label: 'Compliant' },
};
