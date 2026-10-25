import { mockApplications } from './mockApplications';
// SYNTHETIC documents. "simulated" is the predefined result returned by the local verification simulation.
export const DOC_TYPES = [
  { name: 'Affidavit / Undertaking', issuer: 'Applicant Institution', method: 'Digital signature validation' },
  { name: 'Accreditation Certificate', issuer: 'Accreditation Body (Demo)', method: 'Issuing-authority API' },
  { name: 'NOC / Permission', issuer: 'State Authority (Demo)', method: 'Official portal' },
  { name: 'Faculty Records', issuer: 'Institution HR (Demo)', method: 'Manual verification' },
  { name: 'Infrastructure Documents', issuer: 'Local Body (Demo)', method: 'QR code verification' },
  { name: 'Previous Approval Records', issuer: 'AICTE Records (Demo)', method: 'Authorized digital repository' },
  { name: 'TER Payment Proof', issuer: 'Payment Gateway (Demo)', method: 'Official portal' },
];
export const VERIFICATION_METHODS = [...new Set(DOC_TYPES.map((d) => d.method))];
export const DOC_OUTCOMES = ['Verified', 'Mismatch Detected', 'Expired', 'Verification Pending', 'Source Unavailable', 'Manual Review Required'];

const VS = ['Verified', 'Verified', 'Verification Pending', 'Verified', 'Mismatch Detected', 'Verified', 'Expired', 'Manual Review Required', 'Source Unavailable', 'Verified'];
const fix = (v, j) => (v === 'Expired' && j !== 1 && j !== 2 ? 'Mismatch Detected' : v);

export const mockDocuments = mockApplications.flatMap((a, i) =>
  DOC_TYPES.map((d, j) => {
    const missing = a.status === 'Incomplete' && j === (i % 2 === 0 ? 0 : 2);
    const allOk = a.status === 'Verified';
    const verification = missing ? 'Missing' : allOk ? 'Verified' : fix(VS[(i * 7 + j * 3) % 10], j);
    const simulated = missing ? 'Missing' : allOk || verification === 'Verified' ? 'Verified' : fix(VS[(i * 7 + j * 3 + 4) % 10], j);
    const day = String(1 + ((i * 3 + j * 2) % 27)).padStart(2, '0');
    return {
      id: `DOC-${String(i * 7 + j + 1).padStart(4, '0')}`,
      appId: a.id, type: d.name, issuer: d.issuer, method: d.method,
      uploaded: missing ? null : `2026-09-${day}`,
      expiry: j === 1 || j === 2 ? (verification === 'Expired' ? '2026-06-30' : '2027-12-31') : null,
      extraction: missing ? 'Not Available' : verification === 'Verification Pending' ? 'In Progress' : verification === 'Manual Review Required' ? 'Partial' : 'Completed',
      verification, simulated,
      lastChecked: missing || verification === 'Verification Pending' ? null : `2026-10-${String(1 + ((i + j) % 24)).padStart(2, '0')}`,
      manual: false,
    };
  })
);
