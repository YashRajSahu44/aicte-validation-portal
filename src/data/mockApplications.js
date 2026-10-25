// ALL DATA IN THIS FILE IS SYNTHETIC — institutions, IDs and addresses are fictional demonstration records.
export const OFFICERS = ['Officer Demo-01', 'Officer Demo-02', 'Officer Demo-03', 'Officer Demo-04'];
export const APP_TYPES = ['EoA', 'New Programme', 'Intake Change', 'Programme Extension'];
export const STAGES = ['Application Submitted', 'Document Extraction', 'Record Validation', 'Source Verification', 'Compliance Review', 'Officer Review'];
export const APP_STATUSES = ['Verified', 'Pending Review', 'Incomplete', 'Mismatch Detected', 'Verification Pending', 'Officer Reviewed', 'Escalated for Inspection'];

const RAW = [
  ['Central Institute of Technology', 'EoA', 'Mismatch Detected', 'High', '2026-09-14', 3, 'Raipur'],
  ['National College of Engineering', 'New Programme', 'Pending Review', 'Medium', '2026-09-16', 4, 'Pune'],
  ['Regional Technical Institute', 'Intake Change', 'Incomplete', 'High', '2026-09-18', 1, 'Nagpur'],
  ['Institute of Applied Sciences', 'EoA', 'Verification Pending', 'Medium', '2026-09-20', 3, 'Jaipur'],
  ['State Engineering College', 'Programme Extension', 'Mismatch Detected', 'High', '2026-09-22', 4, 'Bhopal'],
  ['Western Institute of Management Studies', 'EoA', 'Verified', 'Low', '2026-09-23', 5, 'Surat'],
  ['Coastal College of Technology', 'Intake Change', 'Pending Review', 'Medium', '2026-09-25', 4, 'Kochi'],
  ['Northern Polytechnic Institute', 'New Programme', 'Incomplete', 'Medium', '2026-09-27', 2, 'Ludhiana'],
  ['Eastern Institute of Engineering', 'EoA', 'Verification Pending', 'High', '2026-09-29', 3, 'Bhubaneswar'],
  ['Heritage College of Pharmacy', 'Programme Extension', 'Pending Review', 'Low', '2026-10-01', 4, 'Lucknow'],
  ['Metropolitan School of Architecture', 'EoA', 'Verified', 'Low', '2026-10-03', 5, 'Hyderabad'],
  ['Valley Institute of Technology', 'Intake Change', 'Escalated for Inspection', 'Medium', '2026-10-05', 5, 'Dehradun'],
];
const PROG = ['B.E. Computer Engineering', 'B.E. Mechanical Engineering', 'B.E. Civil Engineering', 'B.Tech Information Technology', 'M.Tech Structural Engineering'];

export const mockApplications = RAW.map(([institution, type, status, priority, submitted, stage, city], i) => ({
  id: `AICTE-2026-${String(i + 1).padStart(3, '0')}`,
  institution, type, status, priority, submitted, stage,
  officer: OFFICERS[i % 4],
  remarks: [],
  info: {
    permanentId: `1-DEMO-${48210 + i * 17}`,
    address: `Synthetic Campus Road, ${city} (fictional address)`,
    programmes: PROG.slice(0, 2 + (i % 3)),
    intake: `${60 * (1 + (i % 3))} approved → ${60 * (1 + (i % 3)) + 30} requested`,
    previousApproval: i % 4 === 1 ? 'Approved 2025-26 with conditions' : 'Approved 2025-26',
    category: ['Private (Self-financing)', 'Government-aided', 'Private (Self-financing)'][i % 3],
  },
}));

export const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
export const MONTHLY = MONTHS.map((month, i) => ({
  month,
  EoA: [22, 30, 41, 38, 52, 64, 48][i],
  'New Programme': [8, 10, 14, 12, 18, 21, 15][i],
  'Intake Change': [12, 15, 19, 22, 27, 31, 24][i],
  'Programme Extension': [6, 9, 11, 10, 15, 17, 13][i],
  rate: [0.95, 0.93, 0.9, 0.88, 0.85, 0.78, 0.62][i],
}));

export const SEED_AUDIT = [
  ['2026-10-20T09:12:00Z', 'System (Simulated)', 'AICTE-2026-001', 'Application validation initiated', 'Applications', 'Success', 'Automated preliminary validation started.'],
  ['2026-10-20T09:14:00Z', 'System (Simulated)', 'AICTE-2026-001', 'Anomaly flag generated', 'Anomaly Detection', 'Success', 'Preliminary indicator: identifier mismatch.'],
  ['2026-10-21T11:02:00Z', 'Officer Demo-02', 'AICTE-2026-002', 'Document verification completed', 'Document Verification', 'Verified', 'Simulated verification of accreditation certificate.'],
  ['2026-10-21T14:40:00Z', 'Officer Demo-03', 'AICTE-2026-003', 'Additional evidence requested', 'Applications', 'Success', 'Requested signed undertaking from institution.'],
  ['2026-10-22T10:05:00Z', 'System (Simulated)', 'AICTE-2026-005', 'Anomaly flag generated', 'Anomaly Detection', 'Success', 'Preliminary indicator: inconsistent dates.'],
  ['2026-10-22T16:20:00Z', 'Officer Demo-04', 'AICTE-2026-004', 'Compliance checklist reviewed', 'Compliance Review', 'Success', 'Faculty information category reviewed.'],
  ['2026-10-23T09:30:00Z', 'Officer Demo-01', 'AICTE-2026-001', 'Officer added remarks', 'Applications', 'Success', 'Awaiting source verification of NOC.'],
  ['2026-10-23T12:10:00Z', 'Officer Demo-04', 'AICTE-2026-012', 'Escalated for inspection', 'Applications', 'Success', 'Intake change requires physical inspection.'],
  ['2026-10-24T10:45:00Z', 'System (Simulated)', 'AICTE-2026-008', 'Application validation initiated', 'Applications', 'Success', 'Missing documents identified.'],
  ['2026-10-24T15:00:00Z', 'Officer Demo-02', 'AICTE-2026-006', 'Document verification completed', 'Document Verification', 'Verified', 'All documents verified (simulated).'],
].map((r, i) => ({ id: `AUD-SEED-${i + 1}`, ts: r[0], user: r[1], appId: r[2], action: r[3], module: r[4], result: r[5], details: r[6] }));
