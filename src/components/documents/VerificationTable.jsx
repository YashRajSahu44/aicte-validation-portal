import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import DataTable from '../common/DataTable.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import VerifyModal from './VerificationResult.jsx';
import { fmtDate } from '../../utils/validation.js';

export default function VerificationTable({ rows }) {
  const { can } = useApp();
  const [doc, setDoc] = useState(null);
  const columns = [
    { key: 'id', label: 'Document ID', render: (d) => <span className="font-medium text-navy">{d.id}</span> },
    { key: 'appId', label: 'Application ID' },
    { key: 'type', label: 'Document Type' },
    { key: 'issuer', label: 'Issuing Authority' },
    { key: 'method', label: 'Verification Method' },
    { key: 'verification', label: 'Verification Status', render: (d) => <StatusBadge value={d.verification} /> },
    { key: 'lastChecked', label: 'Last Checked', render: (d) => fmtDate(d.lastChecked) },
    { key: 'action', label: 'Action', sortable: false, render: (d) => (
      <button className="btn-primary btn-sm" disabled={!can.act || d.verification === 'Missing'} title={!can.act ? 'Read-only role' : d.verification === 'Missing' ? 'Document not submitted' : 'Run simulated verification'} onClick={() => setDoc(d)}><ShieldCheck size={13} /> Verify</button>) },
  ];
  return (<>
    <DataTable columns={columns} rows={rows} pageSize={10} />
    {doc && <VerifyModal doc={doc} onClose={() => setDoc(null)} />}
  </>);
}
