import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, FileText, UserSearch, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { DOC_OUTCOMES, VERIFICATION_METHODS } from '../data/mockDocuments.js';
import { FilterDropdown, Notice, PageHeader, SearchInput } from '../components/common/ui.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import VerificationTable from '../components/documents/VerificationTable.jsx';

export default function DocumentVerification() {
  const { db } = useApp();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [method, setMethod] = useState('All');
  const submitted = db.documents.filter((d) => d.verification !== 'Missing');
  const n = (f) => submitted.filter(f).length;
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return submitted.filter((d) => (!s || [d.id, d.appId, d.type, d.issuer].some((v) => v.toLowerCase().includes(s))) && (status === 'All' || d.verification === status) && (method === 'All' || d.method === method));
  }, [submitted, q, status, method]);

  return (
    <div>
      <PageHeader title="Document Verification" subtitle="Authenticate submitted documents against their issuing sources (simulated)." />
      <Notice tone="warn">Verification here is <strong>simulated locally</strong>. This prototype does not connect to AICTE databases or external issuing authorities. The interface is designed so authorized APIs and official verification services can be integrated later through a secure backend.</Notice>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-4">
        <StatCard label="Documents Submitted" value={submitted.length} icon={FileText} tone="navy" />
        <StatCard label="Verified" value={n((d) => d.verification === 'Verified')} icon={CheckCircle2} tone="ok" />
        <StatCard label="Manual Verification Needed" value={n((d) => d.verification === 'Manual Review Required')} icon={UserSearch} tone="warn" />
        <StatCard label="Verification Failures" value={n((d) => ['Mismatch Detected', 'Expired', 'Source Unavailable'].includes(d.verification))} icon={XCircle} tone="err" />
        <StatCard label="Pending Requests" value={n((d) => d.verification === 'Verification Pending')} icon={Clock} tone="brand" />
      </div>
      <div className="card p-4 mb-4 grid sm:grid-cols-3 gap-3">
        <div><label className="label">Search</label><SearchInput value={q} onChange={setQ} placeholder="Document, application, authority" /></div>
        <FilterDropdown label="Verification status" value={status} onChange={setStatus} options={DOC_OUTCOMES} />
        <FilterDropdown label="Verification method" value={method} onChange={setMethod} options={VERIFICATION_METHODS} />
      </div>
      <div className="card"><VerificationTable rows={rows} /></div>
    </div>
  );
}
