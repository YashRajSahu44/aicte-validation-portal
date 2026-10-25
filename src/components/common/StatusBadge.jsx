const G = 'bg-green-50 text-ok border-green-200';
const A = 'bg-amber-50 text-warn border-amber-200';
const R = 'bg-red-50 text-err border-red-200';
const B = 'bg-sky-50 text-brand border-sky-200';
const N = 'bg-gray-100 text-muted border-line';
const MAP = {
  Verified: G, Satisfied: G, Compliant: G, Reviewed: G, Success: G, Completed: G, Resolved: G, Low: N,
  'Pending Review': A, 'Verification Pending': A, 'Pending Verification': A, Pending: A, 'Under Review': A, Medium: A,
  'Pending Investigation': A, 'Evidence Requested': A, 'In Progress': A, 'Insufficient Evidence': A, 'Manual Review Required': A, Partial: A, Open: A,
  Incomplete: R, 'Mismatch Detected': R, 'Not Satisfied': R, Deficient: R, High: R, Expired: R, Missing: R, 'Source Unavailable': R, Failed: R,
  'Officer Reviewed': B, Escalated: B, 'Escalated for Inspection': B, 'Not Applicable': N, 'Not Available': N,
};
export default function StatusBadge({ value, className = '' }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded border text-xs font-medium ${MAP[value] || N} ${className}`}>
      {value}
    </span>
  );
}
