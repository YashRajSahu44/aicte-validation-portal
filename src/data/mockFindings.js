import { mockApplications } from './mockApplications';
import { mockRules } from './mockRules';
import { DOC_TYPES } from './mockDocuments';
// SYNTHETIC findings. Every automated finding is a preliminary indicator requiring human review.

export const FINDING_TEMPLATES = [
  { category: 'Documents', severity: 'High', title: 'Missing required undertaking', description: 'The affidavit / undertaking expected for this application type was not located in the submission.', evidence: 'Document checklist marks "Affidavit / Undertaking" as mandatory; no matching upload was found.', next: 'Request the institution to upload the signed undertaking.' },
  { category: 'Validity', severity: 'Medium', title: 'Certificate expiry date has passed', description: 'A submitted certificate shows a validity date earlier than the submission date.', evidence: 'Extracted field "Valid till" = 30-06-2026; submission date is later.', next: 'Request a renewed certificate or a valid extension letter.' },
  { category: 'Faculty', severity: 'Medium', title: 'Faculty count differs from the submitted institutional record', description: 'The number of faculty in the uploaded register differs from the number stated in the application form.', evidence: 'Faculty register lists 42 entries; application form states 47.', next: 'Ask the institution to reconcile the faculty figures and submit a corrected register.' },
  { category: 'Authenticity', severity: 'Low', title: 'Duplicate document detected', description: 'Two uploads share identical content, which may be an upload error.', evidence: 'Identical content fingerprint on two uploaded files (synthetic).', next: 'Confirm with the institution whether both uploads are intended.' },
  { category: 'Identity', severity: 'High', title: 'Institution identifier mismatch', description: 'The institution identifier on a document differs from the identifier in the application.', evidence: 'Application ID field: 1-DEMO-48210; document field: 1-DEMO-48201.', next: 'Verify the identifier against the authorized source and request clarification.' },
];

export const mockFindings = mockApplications.flatMap((a, i) => {
  if (a.status === 'Verified') return [];
  const start = a.status === 'Incomplete' ? 0 : a.status === 'Mismatch Detected' ? 4 : i % 5;
  const count = 1 + (i % 3);
  return Array.from({ length: count }, (_, n) => ({
    ...FINDING_TEMPLATES[(start + n) % 5],
    id: `FND-${String(i + 1).padStart(2, '0')}${n + 1}`,
    appId: a.id, reviewStatus: 'Open',
  }));
});

export const FINDING_CATEGORIES = [...new Set(FINDING_TEMPLATES.map((f) => f.category))];

export const RESULTS = ['Satisfied', 'Not Satisfied', 'Insufficient Evidence', 'Pending Verification', 'Not Applicable'];
export const RESULT_INFO = {
  'Satisfied': { text: 'Submitted evidence matches the requirement (preliminary automated check).', next: 'No action needed beyond routine officer confirmation.' },
  'Not Satisfied': { text: 'Submitted evidence does not meet the requirement; see linked validation findings.', next: 'Request corrected documents or clarification from the institution.' },
  'Insufficient Evidence': { text: 'Evidence was submitted but is incomplete or not machine-readable for an automated check.', next: 'Request additional evidence or perform manual verification.' },
  'Pending Verification': { text: 'Awaiting source verification of the supporting documents.', next: 'Complete document verification, then re-review this item.' },
  'Not Applicable': { text: 'Requirement is not applicable to this application type.', next: 'None. Officer may confirm applicability.' },
};
const RPAT = ['Satisfied', 'Satisfied', 'Not Satisfied', 'Satisfied', 'Insufficient Evidence', 'Pending Verification', 'Satisfied', 'Not Applicable'];
const EVID = ['Signed undertaking (PDF)', 'Faculty register and appointment letters', 'Approved intake letter 2025-26', 'Building plan and fire safety certificate', 'Accreditation certificate', 'TER payment receipt'];

export const mockChecklist = mockApplications.flatMap((a, i) =>
  mockRules.map((r, c) => {
    const result = a.status === 'Verified' ? (c === 5 && i % 2 ? 'Not Applicable' : 'Satisfied') : RPAT[(i * 5 + c * 2) % 8];
    return {
      id: `CHK-${String(i + 1).padStart(2, '0')}-${c + 1}`,
      appId: a.id, ruleId: r.id, category: r.category, requirement: r.requirement,
      evidence: result === 'Not Applicable' ? '—' : EVID[c],
      result, explanation: RESULT_INFO[result].text, remarks: '', reviewStatus: 'Pending',
    };
  })
);

export const OUTCOME_INFO = {
  'Verified': { text: 'Document details matched the (simulated) issuing-authority record.' },
  'Mismatch Detected': { text: 'One or more extracted fields did not match the (simulated) source record. This is a preliminary indicator; manual confirmation is recommended.' },
  'Expired': { text: 'The document validity date has passed according to the (simulated) source record.' },
  'Verification Pending': { text: 'The (simulated) source has accepted the request but has not returned a result yet.' },
  'Source Unavailable': { text: 'The (simulated) verification source could not be reached. Retry later or verify manually.' },
  'Manual Review Required': { text: 'Automated checks were inconclusive. An officer should verify this document manually.' },
};

export const ANOMALY_TYPES = ['Duplicate document', 'Inconsistent dates', 'Identifier mismatch', 'Metadata inconsistency', 'Possible image alteration', 'Cross-document inconsistency'];
export const ANOMALY_INFO = {
  'Duplicate document': { fields: [['Content fingerprint', 'Unique per document', 'Identical to another upload (a41f…)'], ['Upload count', '1', '2']], explain: 'Two uploads have identical content. This often results from accidental re-uploads.', action: 'Ask the institution whether both uploads are intended.' },
  'Inconsistent dates': { fields: [['Issue date', 'Earlier than valid-till date', '12-08-2026 (later than valid-till)'], ['Valid till', '31-12-2027', '30-06-2026']], explain: 'Issue and validity dates are not in a plausible order. This may be a data-entry or extraction issue.', action: 'Verify dates against the issuing authority.' },
  'Identifier mismatch': { fields: [['Institution ID', '1-DEMO-48210', '1-DEMO-48201'], ['Issued to', 'Application institution name', 'Name matches']], explain: 'The identifier on the document differs from the application. Transcription differences are possible.', action: 'Check the identifier against the authorized source.' },
  'Metadata inconsistency': { fields: [['File created', 'On/before upload date', '2027-01-04 (after upload date)'], ['Producer software', 'Consistent across pages', 'Differs between pages']], explain: 'File metadata is internally inconsistent. Metadata can change through routine scanning or conversion.', action: 'Request the original document or an alternate copy.' },
  'Possible image alteration': { fields: [['Seal region', 'Uniform compression', 'Compression differs in one region'], ['Signature region', 'Consistent resolution', 'Resolution differs']], explain: 'Image regions show differing characteristics. This can occur with re-scanning and is not proof of alteration.', action: 'Request a fresh scan and verify via the issuing authority.' },
  'Cross-document inconsistency': { fields: [['Programme name', 'Same in all documents', 'Differs between NOC and application'], ['Intake figure', '60', '90']], explain: 'Values differ between two submitted documents.', action: 'Ask the institution to clarify and resubmit corrected documents.' },
};
const ASTAT = ['Pending Investigation', 'Pending Investigation', 'Reviewed', 'Evidence Requested', 'Pending Investigation', 'Escalated'];
export const mockAnomalies = Array.from({ length: 14 }, (_, i) => ({
  id: `FLG-${1001 + i}`,
  appId: mockApplications[(i * 5 + 1) % 12].id,
  document: DOC_TYPES[(i * 3) % 7].name,
  type: ANOMALY_TYPES[i % 6],
  severity: ['High', 'Medium', 'Low'][(i * 2 + 1) % 3],
  detected: `2026-10-${String(1 + i).padStart(2, '0')}`,
  status: ASTAT[i % 6],
  remarks: [],
}));
