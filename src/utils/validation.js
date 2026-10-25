export const todayISO = () => new Date().toISOString().slice(0, 10);
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const fmtDateTime = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

// Derives document / compliance status and review flags for an application from the shared state.
// These are automated PRELIMINARY indicators only — never a regulatory determination.
export function deriveApp(app, docs, checks, findings) {
  const mine = docs.filter((d) => d.appId === app.id);
  const missing = mine.some((d) => d.verification === 'Missing');
  const allVerified = mine.every((d) => d.verification === 'Verified');
  const docsStatus = missing ? 'Incomplete'
    : allVerified ? 'Verified'
    : mine.some((d) => ['Mismatch Detected', 'Expired'].includes(d.verification)) ? 'Mismatch Detected'
    : 'Verification Pending';
  const mc = checks.filter((c) => c.appId === app.id);
  const compliance = mc.some((c) => c.result === 'Not Satisfied') ? 'Deficient'
    : mc.some((c) => ['Insufficient Evidence', 'Pending Verification'].includes(c.result)) ? 'Under Review'
    : 'Compliant';
  const openFindings = findings.filter((f) => f.appId === app.id && f.reviewStatus === 'Open').length;
  return { ...app, docsStatus, compliance, openFindings, reviewRequired: openFindings > 0 };
}
