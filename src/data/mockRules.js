// DEMONSTRATION rules only. Must be configured against the applicable AICTE Approval Process Handbook and authorized instructions.
export const mockRules = [
  { id: 'RULE-INS-01', category: 'Institutional documents', requirement: 'Signed affidavit / undertaking is submitted with the application', severity: 'High', enabled: true },
  { id: 'RULE-FAC-01', category: 'Faculty information', requirement: 'Faculty records are consistent with the institutional record', severity: 'Medium', enabled: true },
  { id: 'RULE-PRG-01', category: 'Approved programmes and intake', requirement: 'Requested intake relates to a previously approved programme', severity: 'High', enabled: true },
  { id: 'RULE-INF-01', category: 'Infrastructure evidence', requirement: 'Infrastructure documents are submitted and current', severity: 'Medium', enabled: true },
  { id: 'RULE-ACC-01', category: 'Accreditation and certification', requirement: 'Accreditation / certification is valid on the submission date', severity: 'High', enabled: true },
  { id: 'RULE-FEE-01', category: 'Fee and payment records', requirement: 'TER payment proof is submitted and legible', severity: 'Low', enabled: true },
];
