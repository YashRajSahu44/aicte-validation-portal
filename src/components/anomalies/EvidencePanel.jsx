import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { ANOMALY_INFO } from '../../data/mockFindings.js';
import Modal, { ConfirmDialog } from '../common/Modal.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { Notice } from '../common/ui.jsx';
import { fmtDateTime } from '../../utils/validation.js';

export default function EvidencePanel({ flagId, onClose }) {
  const { db, can, updateAnomaly } = useApp();
  const a = db.anomalies.find((x) => x.id === flagId);
  const [remark, setRemark] = useState('');
  const [confirm, setConfirm] = useState(false);
  const info = ANOMALY_INFO[a.type];

  const act = (status, action, extra = {}) => updateAnomaly(a.id, { status, ...extra }, { action, module: 'Anomaly Detection', appId: a.appId, details: `${a.id} (${a.type}) — ${status}` });
  const addRemark = () => {
    updateAnomaly(a.id, { remarks: [{ ts: new Date().toISOString(), text: remark.trim() }, ...(a.remarks || [])] }, { action: 'Officer added remarks', module: 'Anomaly Detection', appId: a.appId, details: `${a.id}: ${remark.trim()}` });
    setRemark('');
  };
  return (
    <Modal wide title={`Evidence — ${a.id}`} onClose={onClose} footer={<button className="btn-outline" onClick={onClose}>Close</button>}>
      <Notice tone="warn"><strong>Preliminary indicator only.</strong> This is not proof of fraud or misconduct. Differences can arise from scanning, data entry or format conversion and require officer review.</Notice>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-medium">{a.type}</span><StatusBadge value={a.severity} /><StatusBadge value={a.status} />
        <span className="text-xs text-muted">{a.appId} · {a.document}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="label">Highlighted synthetic evidence</div>
          <div className="border border-dashed border-muted rounded p-3 bg-page font-mono text-xs space-y-1">
            <div className="text-muted">SYNTHETIC EXCERPT — NOT A REAL DOCUMENT</div>
            {info.fields.map(([f, , o], i) => <div key={f}>{f}: {i === 0 ? <mark className="bg-amber-200 px-1">{o}</mark> : o}</div>)}
          </div>
        </div>
        <div>
          <div className="label">Explanation of the discrepancy</div><p className="mb-2">{info.explain}</p>
          <div className="label">Suggested verification action</div><p>{info.action}</p>
        </div>
      </div>
      <table className="w-full text-sm border border-line mb-4">
        <thead><tr><th className="th">Extracted field</th><th className="th">Expected value</th><th className="th">Observed value</th></tr></thead>
        <tbody>{info.fields.map(([f, e, o]) => <tr key={f}><td className="td font-medium">{f}</td><td className="td">{e}</td><td className="td text-warn">{o}</td></tr>)}</tbody>
      </table>
      <div className="flex flex-wrap gap-2 mb-4">
        <button className="btn-primary" disabled={!can.act || a.status === 'Reviewed'} onClick={() => act('Reviewed', 'Anomaly flag marked as reviewed')}>Mark as Reviewed</button>
        <button className="btn-outline" disabled={!can.act || a.status === 'Evidence Requested'} onClick={() => act('Evidence Requested', 'Additional evidence requested')}>Request Additional Evidence</button>
        <button className="btn-danger" disabled={!can.act || a.status === 'Escalated'} onClick={() => setConfirm(true)}>Escalate for Manual Verification</button>
      </div>
      <div className="label">Officer remarks</div>
      <div className="flex gap-2 mb-2"><input className="input" disabled={!can.act} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Add officer remarks" aria-label="Officer remarks" /><button className="btn-outline" disabled={!can.act || !remark.trim()} onClick={addRemark}>Add</button></div>
      <ul className="text-sm space-y-1">{(a.remarks || []).map((r, i) => <li key={i} className="border border-line rounded p-2"><span className="text-xs text-muted">{fmtDateTime(r.ts)} · </span>{r.text}</li>)}</ul>
      {confirm && <ConfirmDialog title="Escalate for manual verification" danger confirmLabel="Escalate" message={`Escalate ${a.id} for manual verification? This restricted action will be recorded in the audit trail.`} onCancel={() => setConfirm(false)} onConfirm={() => { act('Escalated', 'Escalated for manual verification'); setConfirm(false); }} />}
    </Modal>
  );
}
