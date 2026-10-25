import { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext.jsx';
import { Notice, PageHeader } from '../components/common/ui.jsx';
import { ConfirmDialog } from '../components/common/Modal.jsx';

const PERMS = [
  ['View applications, documents, reports', true, true, true],
  ['Run simulated verification, add remarks, request evidence', true, true, false],
  ['Escalate, mark as reviewed', true, true, false],
  ['Edit demonstration validation rules', true, false, false],
  ['Reset demonstration data', true, false, false],
  ['View audit trail (read-only for everyone)', true, true, true],
];

export default function Settings() {
  const { session, role, can, switchRole, resetDemo } = useApp();
  const [confirm, setConfirm] = useState(false);
  return (
    <div>
      <PageHeader title="Settings" subtitle="Profile, role-based interface examples and demonstration data." />
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="card p-4">
          <h2 className="font-semibold text-navy mb-3">Current session</h2>
          <div className="mb-3"><div className="label">Signed in as</div>{session.name}</div>
          <label className="label" htmlFor="r">Switch demo role</label>
          <select id="r" className="input mb-2" value={role} onChange={(e) => switchRole(e.target.value)}>{Object.keys(ROLES).map((r) => <option key={r}>{r}</option>)}</select>
          <p className="text-xs text-muted">Role switching exists only to demonstrate role-based interfaces. Real authorization must be enforced by a secure backend; frontend checks are not a security control.</p>
        </section>
        <section className="card p-4">
          <h2 className="font-semibold text-navy mb-3">Demonstration data</h2>
          <p className="mb-3 text-sm">Changes are stored in this browser’s localStorage (synthetic data and role only — no passwords or real documents). Reset restores the original seed data.</p>
          <button className="btn-danger" disabled={!can.reset} title={can.reset ? '' : 'Administrator only'} onClick={() => setConfirm(true)}>Reset demonstration data</button>
        </section>
        <section className="card lg:col-span-2">
          <div className="px-4 py-3 border-b border-line"><h2 className="font-semibold text-navy">Role permissions (interface examples)</h2></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="th">Capability</th>{Object.keys(ROLES).map((r) => <th key={r} className="th">{r}</th>)}</tr></thead>
            <tbody>{PERMS.map(([c, ...v]) => <tr key={c}><td className="td">{c}</td>{v.map((x, i) => <td key={i} className="td">{x ? 'Yes' : '—'}</td>)}</tr>)}</tbody></table></div>
        </section>
      </div>
      <div className="mt-4"><Notice>Responsible AI: automated findings are preliminary indicators with explanations; there is no automatic approval or rejection; consequential actions need human confirmation and are recorded in the audit trail.</Notice></div>
      {confirm && <ConfirmDialog title="Reset demonstration data" danger confirmLabel="Reset" message="All demo changes (remarks, verification results, rule edits, audit entries) will be reverted to the seed data. Continue?" onCancel={() => setConfirm(false)} onConfirm={() => { resetDemo(); setConfirm(false); }} />}
    </div>
  );
}
