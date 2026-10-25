import Modal from '../common/Modal.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { fmtDate } from '../../utils/validation.js';

export function extractFields(doc, app) {
  return [
    ['Document number', `DEMO-${doc.id.slice(4)}`, '98%'],
    ['Issued to', app.institution, '97%'],
    ['Institution ID', app.info.permanentId, '95%'],
    ['Issuing authority', doc.issuer, '94%'],
    ['Upload date', fmtDate(doc.uploaded), '99%'],
    ['Valid till', doc.expiry ? fmtDate(doc.expiry) : 'Not stated', doc.expiry ? '93%' : '—'],
  ];
}

// mode: 'preview' | 'data'. Previews are synthetic placeholders; personal identifiers are masked.
export default function DocumentPreview({ doc, app, mode, onClose }) {
  const fields = extractFields(doc, app);
  return (
    <Modal title={mode === 'data' ? `Extracted data — ${doc.id}` : `Preview — ${doc.id}`} onClose={onClose} wide footer={<button className="btn-outline" onClick={onClose}>Close</button>}>
      <div className="flex items-center justify-between mb-3"><div><div className="font-medium">{doc.type}</div><div className="text-xs text-muted">{app.id} · {app.institution}</div></div><StatusBadge value={doc.verification} /></div>
      {doc.verification === 'Missing' ? <p className="text-err">This document has not been submitted.</p> : mode === 'preview' ? (
        <div className="relative border border-line rounded bg-page p-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-3xl font-bold text-muted/20 -rotate-12 text-center">SYNTHETIC SAMPLE — NOT A REAL DOCUMENT</span></div>
          <div className="relative bg-white border border-line p-5 font-mono text-xs space-y-2 max-w-md mx-auto">
            <div className="font-bold text-sm">{doc.type.toUpperCase()}</div>
            <div className="h-px bg-line" />
            <div>Issued to: {app.institution}</div>
            <div>Reference: DEMO-{doc.id.slice(4)}</div>
            <div>Authorised signatory: <span className="bg-ink text-ink select-none rounded px-1">XXXXXXXXXX</span> <span className="text-muted">(masked)</span></div>
            <div>Contact: <span className="bg-ink text-ink select-none rounded px-1">XXXXXXXXXX</span> <span className="text-muted">(masked)</span></div>
            <div className="h-10 border border-dashed border-muted rounded flex items-center justify-center text-muted">[ signature / seal placeholder ]</div>
          </div>
          <p className="relative text-[11px] text-muted mt-3 text-center">Personal identifiers are masked in previews. No real documents are stored in this prototype.</p>
        </div>
      ) : (
        <table className="w-full text-sm border border-line">
          <thead><tr><th className="th">Field</th><th className="th">Extracted value</th><th className="th">Confidence (simulated)</th></tr></thead>
          <tbody>{fields.map(([f, v, c]) => <tr key={f}><td className="td font-medium">{f}</td><td className="td">{v}</td><td className="td">{c}</td></tr>)}</tbody>
        </table>
      )}
    </Modal>
  );
}
