import { useState } from 'react';
import { Eye, FileSearch, Flag, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import DataTable from '../common/DataTable.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import DocumentPreview from '../documents/DocumentPreview.jsx';
import VerifyModal from '../documents/VerificationResult.jsx';
import { fmtDate } from '../../utils/validation.js';

export default function DocumentTable({ app }) {
  const { db, can, updateDoc } = useApp();
  const [modal, setModal] = useState(null); // { mode, doc }
  const docs = db.documents.filter((d) => d.appId === app.id);
  const ro = !can.act ? 'Read-only role' : undefined;
  const current = modal && db.documents.find((d) => d.id === modal.doc.id);

  const columns = [
    { key: 'type', label: 'Document Name', render: (d) => <div><div className="font-medium">{d.type}</div><div className="text-[11px] text-muted">{d.id}</div></div> },
    { key: 'uploaded', label: 'Upload Date', render: (d) => fmtDate(d.uploaded) },
    { key: 'expiry', label: 'Expiry Date', render: (d) => fmtDate(d.expiry) },
    { key: 'extraction', label: 'Extraction Status', render: (d) => <StatusBadge value={d.extraction} /> },
    { key: 'verification', label: 'Authentication Status', render: (d) => <StatusBadge value={d.verification} /> },
    { key: 'actions', label: 'Actions', sortable: false, stop: true, render: (d) => (
      <div className="flex flex-wrap gap-1">
        <button className="btn-outline btn-sm" title="Preview Document" onClick={() => setModal({ mode: 'preview', doc: d })}><Eye size={13} /> Preview</button>
        <button className="btn-outline btn-sm" title="View Extracted Data" onClick={() => setModal({ mode: 'data', doc: d })}><FileSearch size={13} /> Data</button>
        <button className="btn-primary btn-sm" title={ro || 'Verify Document'} disabled={!can.act || d.verification === 'Missing'} onClick={() => setModal({ mode: 'verify', doc: d })}><ShieldCheck size={13} /> Verify</button>
        <button className="btn-outline btn-sm" title={ro || 'Mark for Manual Verification'} disabled={!can.act || d.verification === 'Missing' || d.manual}
          onClick={() => updateDoc(d.id, { verification: 'Manual Review Required', manual: true }, { action: 'Document marked for manual verification', module: 'Document Verification', appId: d.appId, details: `${d.id} (${d.type}) flagged for manual verification.` })}>
          <Flag size={13} /> Manual</button>
      </div>) },
  ];
  return (
    <div>
      <DataTable columns={columns} rows={docs} pageSize={10} />
      {modal?.mode === 'verify' && <VerifyModal doc={modal.doc} onClose={() => setModal(null)} />}
      {modal && modal.mode !== 'verify' && <DocumentPreview doc={current} app={app} mode={modal.mode} onClose={() => setModal(null)} />}
    </div>
  );
}
