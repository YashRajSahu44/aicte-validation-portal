import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Check, CheckCircle2, FilePlus2, MessageSquarePlus, Siren } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { STAGES } from '../data/mockApplications.js';
import { EmptyState, Field, Notice } from '../components/common/ui.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import Modal, { ConfirmDialog } from '../components/common/Modal.jsx';
import DocumentTable from '../components/applications/DocumentTable.jsx';
import ValidationFindings from '../components/applications/ValidationFinding.jsx';
import ComplianceChecklist from '../components/applications/ComplianceChecklist.jsx';
import { fmtDate, fmtDateTime } from '../utils/validation.js';

const TABS = [['info', 'Application Information'], ['docs', 'Documents'], ['findings', 'Validation Findings'], ['compliance', 'Compliance Review']];
const KIND_LABEL = { remark: 'Remark', evidence: 'Evidence requested', reviewed: 'Marked reviewed', escalate: 'Escalated' };

export default function ApplicationDetails() {
  const { id } = useParams();
  const { apps, db, can, officerAction } = useApp();
  const [tab, setTab] = useState('info');
  const [modal, setModal] = useState(null); // 'remark' | 'evidence' | 'reviewed' | 'escalate'
  const [text, setText] = useState('');
  const app = apps.find((a) => a.id === id);

  if (!app) return <EmptyState title="Application not found" text={`No application with ID "${id}" exists in the demonstration data.`} action={<Link className="btn-primary" to="/applications">Back to Applications</Link>} />;

  const stage = app.status === 'Officer Reviewed' ? STAGES.length : app.stage;
  const openFindings = app.openFindings;
  const close = () => { setModal(null); setText(''); };
  const submit = () => { officerAction(app.id, modal, text.trim()); close(); };
  const need = modal === 'remark' || modal === 'evidence' || modal === 'escalate';
  const cfg = {
    remark: ['Add Review Remarks', 'Save Remarks', 'Enter remarks for the review record.'],
    evidence: ['Request Additional Documents', 'Send Request', 'Describe the documents or evidence required from the institution.'],
    reviewed: ['Mark as Reviewed', 'Confirm', 'Optional note for the record.'],
    escalate: ['Escalate for Inspection', 'Escalate', 'State the reason for escalation.'],
  };

  return (
    <div>
      <Link to="/applications" className="inline-flex items-center gap-1 text-brand text-xs mb-2"><ArrowLeft size={13} /> Back to Applications</Link>
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-xl font-semibold text-navy">{app.id}</h1>
            <div className="text-muted">{app.institution}</div>
          </div>
          <div className="flex items-center gap-2">
            {app.reviewRequired && <span className="inline-flex items-center gap-1 text-xs font-semibold text-err bg-red-50 border border-red-200 rounded px-2 py-1"><AlertCircle size={13} /> Review Required — {openFindings} open finding(s)</span>}
            <StatusBadge value={app.status} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Application type">{app.type}</Field>
          <Field label="Submission date">{fmtDate(app.submitted)}</Field>
          <Field label="Assigned officer">{app.officer}</Field>
          <Field label="Priority"><StatusBadge value={app.priority} /></Field>
        </div>
      </div>

      <ol className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-6 gap-3" aria-label="Validation progress">
        {STAGES.map((s, i) => {
          const done = i < stage, cur = i === stage;
          return (
            <li key={s} className="flex md:flex-col items-center md:text-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border shrink-0 ${done ? 'bg-ok text-white border-ok' : cur ? 'bg-saffron text-white border-saffron' : 'bg-white text-muted border-line'}`}>{done ? <Check size={14} /> : i + 1}</span>
              <span className={`text-xs ${cur ? 'font-semibold text-ink' : 'text-muted'}`}>{s}{cur && <span className="block text-[10px] text-warn">In progress</span>}</span>
            </li>
          );
        })}
      </ol>

      <div className="card mb-4">
        <div role="tablist" className="flex overflow-x-auto border-b border-line">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 ${tab === k ? 'border-saffron text-navy font-semibold' : 'border-transparent text-muted hover:text-ink'}`}>
              {l}{k === 'findings' && openFindings > 0 && <span className="ml-1.5 text-[11px] bg-err text-white rounded-full px-1.5">{openFindings}</span>}
            </button>
          ))}
        </div>
        <div role="tabpanel">
          {tab === 'info' && (
            <div className="p-4 grid sm:grid-cols-2 gap-4">
              <Field label="Institution name">{app.institution}</Field>
              <Field label="AICTE Permanent ID (synthetic)">{app.info.permanentId}</Field>
              <Field label="Institution address">{app.info.address}</Field>
              <Field label="Application category">{app.info.category}</Field>
              <Field label="Approved programmes"><ul className="list-disc pl-4">{app.info.programmes.map((p) => <li key={p}>{p}</li>)}</ul></Field>
              <Field label="Requested intake (synthetic)">{app.info.intake}</Field>
              <Field label="Previous approval status">{app.info.previousApproval}</Field>
            </div>
          )}
          {tab === 'docs' && <DocumentTable app={app} />}
          {tab === 'findings' && <ValidationFindings appId={app.id} />}
          {tab === 'compliance' && <ComplianceChecklist appId={app.id} />}
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h2 className="font-semibold text-navy mb-1">Officer Actions</h2>
        <Notice>No approval or rejection is generated automatically. These actions record officer review steps and create audit entries; consequential decisions remain with authorized officers.</Notice>
        <div className="flex flex-wrap gap-2">
          <button className="btn-outline" disabled={!can.act} title={can.act ? '' : 'Read-only role'} onClick={() => setModal('evidence')}><FilePlus2 size={15} /> Request Additional Documents</button>
          <button className="btn-outline" disabled={!can.act} onClick={() => setModal('remark')}><MessageSquarePlus size={15} /> Add Review Remarks</button>
          <button className="btn-primary" disabled={!can.act} onClick={() => setModal('reviewed')}><CheckCircle2 size={15} /> Mark as Reviewed</button>
          <button className="btn-danger" disabled={!can.act} onClick={() => setModal('escalate')}><Siren size={15} /> Escalate for Inspection</button>
        </div>
        {!can.act && <p className="text-xs text-muted mt-2">Your role (Read-Only Auditor) can view but not perform review actions.</p>}
        <h3 className="font-medium mt-5 mb-2">Review history</h3>
        {app.remarks.length === 0 ? <p className="text-muted text-sm">No officer remarks yet.</p> : (
          <ul className="space-y-2">{app.remarks.map((r, i) => (
            <li key={i} className="border border-line rounded p-2 text-sm"><div className="text-xs text-muted">{KIND_LABEL[r.kind]} · {r.user} · {fmtDateTime(r.ts)}</div>{r.text || '—'}</li>
          ))}</ul>
        )}
        <p className="text-xs text-muted mt-3">Audit entries for this application: {db.audit.filter((a) => a.appId === app.id).length} · <Link className="text-brand underline" to="/audit-trail">View audit trail</Link></p>
      </div>

      {modal && (modal === 'reviewed' || modal === 'escalate') ? (
        <ConfirmDialog title={cfg[modal][0]} confirmLabel={cfg[modal][1]} danger={modal === 'escalate'} disabled={modal === 'escalate' && !text.trim()} onCancel={close} onConfirm={submit}
          message={modal === 'reviewed'
            ? `Mark ${app.id} as reviewed? This records that an officer has reviewed the application${openFindings ? ` (${openFindings} finding(s) are still open)` : ''}. It does not approve or reject the application.`
            : `Escalate ${app.id} for inspection? This is a restricted action and will be recorded in the audit trail.`}>
          <textarea className="input" rows={3} placeholder={cfg[modal][2]} value={text} onChange={(e) => setText(e.target.value)} aria-label="Note" />
        </ConfirmDialog>
      ) : modal && (
        <Modal title={cfg[modal][0]} onClose={close} footer={<><button className="btn-outline" onClick={close}>Cancel</button><button className="btn-primary" disabled={need && !text.trim()} onClick={submit}>{cfg[modal][1]}</button></>}>
          <textarea className="input" rows={4} placeholder={cfg[modal][2]} value={text} onChange={(e) => setText(e.target.value)} aria-label="Details" autoFocus />
          {modal === 'evidence' && <p className="text-xs text-muted mt-2">Application status will change to “Incomplete” until the evidence is received. No message is actually sent in this prototype.</p>}
        </Modal>
      )}
    </div>
  );
}
