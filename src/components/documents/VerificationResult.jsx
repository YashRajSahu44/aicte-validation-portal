import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { fmtDateTime } from '../../utils/validation.js';

// Simulated verification. No real database or external issuing authority is contacted.
export default function VerifyModal({ doc, onClose }) {
  const { verifyDoc } = useApp();
  const [state, setState] = useState({ phase: 'processing' });
  useEffect(() => {
    let live = true;
    verifyDoc(doc.id).then((r) => live && setState({ phase: 'done', ...r })).catch(() => live && setState({ phase: 'error' }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal title={`Verify document ${doc.id}`} onClose={onClose} footer={<button className="btn-outline" onClick={onClose} disabled={state.phase === 'processing'}>Close</button>}>
      <dl className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div><dt className="label">Document</dt><dd>{doc.type}</dd></div>
        <div><dt className="label">Application</dt><dd>{doc.appId}</dd></div>
        <div><dt className="label">Issuing authority</dt><dd>{doc.issuer}</dd></div>
        <div><dt className="label">Method</dt><dd>{doc.method}</dd></div>
      </dl>
      {state.phase === 'processing' && <div className="flex items-center gap-2 text-muted py-4" role="status"><Loader2 className="animate-spin" size={18} /> Running simulated verification via “{doc.method}”…</div>}
      {state.phase === 'error' && <div role="alert" className="text-err">Verification could not be completed. Please retry.</div>}
      {state.phase === 'done' && (
        <div className="border border-line rounded p-3">
          <div className="flex items-center justify-between mb-2"><span className="font-semibold">Result</span><StatusBadge value={state.status} /></div>
          <p>{state.explanation}</p>
          <p className="text-xs text-muted mt-2">Checked {fmtDateTime(state.checkedAt)} · Recorded in audit trail.</p>
        </div>
      )}
      <p className="flex gap-2 text-xs text-muted mt-4"><ShieldAlert size={14} className="shrink-0" /> Simulated result for demonstration. In production, this step would call authorized APIs through a secure backend, and a human officer would review the outcome.</p>
    </Modal>
  );
}
