import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, FileWarning, ListChecks, SearchCheck, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { APP_TYPES, OFFICERS } from '../data/mockApplications.js';
import { RESULT_INFO } from '../data/mockFindings.js';
import { FilterDropdown, Notice, PageHeader } from '../components/common/ui.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import DataTable from '../components/common/DataTable.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import Modal, { ConfirmDialog } from '../components/common/Modal.jsx';

export default function ComplianceReview() {
  const { apps, checks, db, can, updateRule } = useApp();
  const [cat, setCat] = useState('All');
  const [type, setType] = useState('All');
  const [def, setDef] = useState('All');
  const [officer, setOfficer] = useState('All');
  const [sel, setSel] = useState(null);
  const [edit, setEdit] = useState(null);       // rule draft
  const [confirm, setConfirm] = useState(false);
  const appMap = useMemo(() => Object.fromEntries(apps.map((a) => [a.id, a])), [apps]);

  const rows = useMemo(() => checks.map((c) => ({ ...c, institution: appMap[c.appId].institution, appType: appMap[c.appId].type, officer: appMap[c.appId].officer }))
    .filter((c) => (cat === 'All' || c.category === cat) && (type === 'All' || c.appType === type) && (officer === 'All' || c.officer === officer) &&
      (def === 'All' || (def === 'Deficiency' ? c.result === 'Not Satisfied' : def === 'Needs evidence' ? ['Insufficient Evidence', 'Pending Verification'].includes(c.result) : c.result === 'Satisfied'))), [checks, appMap, cat, type, officer, def]);
  const detail = sel && checks.find((c) => c.id === sel);
  const rule = detail && db.rules.find((r) => r.id === detail.ruleId);

  const columns = [
    { key: 'appId', label: 'Application ID', render: (r) => <span className="font-medium text-navy">{r.appId}</span> },
    { key: 'institution', label: 'Institution' },
    { key: 'category', label: 'Compliance Category' },
    { key: 'requirement', label: 'Requirement' },
    { key: 'evidence', label: 'Evidence Available' },
    { key: 'result', label: 'Result', render: (r) => <StatusBadge value={r.result} /> },
    { key: 'reviewStatus', label: 'Officer Review Status', render: (r) => <StatusBadge value={r.reviewStatus} /> },
  ];
  const saveRule = () => {
    updateRule(edit.id, { requirement: edit.requirement, severity: edit.severity, enabled: edit.enabled }, { action: 'Validation rule updated', module: 'Compliance Review', details: `${edit.id}: ${edit.enabled ? 'enabled' : 'disabled'}, severity ${edit.severity}. (Demonstration rule)` });
    setConfirm(false); setEdit(null);
  };

  return (
    <div>
      <PageHeader title="Regulatory Compliance Review" subtitle="Checklist-driven preliminary compliance checks across applications." />
      <Notice tone="warn">Results are <strong>automated preliminary checks</strong>, distinct from final regulatory determinations, which rest with authorized AICTE officers. Rules are demonstration examples to be configured against the applicable AICTE Approval Process Handbook.</Notice>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard label="Applications Reviewed" value={apps.filter((a) => a.compliance !== 'Under Review' || a.status === 'Officer Reviewed').length} icon={ClipboardCheck} tone="navy" hint="Compliance checks complete" pct={100 * apps.filter((a) => a.compliance !== 'Under Review').length / apps.length} />
        <StatCard label="Compliant Checklist Items" value={checks.filter((c) => c.result === 'Satisfied').length} icon={ListChecks} tone="ok" />
        <StatCard label="Deficiencies Identified" value={checks.filter((c) => c.result === 'Not Satisfied').length} icon={FileWarning} tone="err" />
        <StatCard label="Needing Additional Evidence" value={checks.filter((c) => ['Insufficient Evidence', 'Pending Verification'].includes(c.result)).length} icon={SearchCheck} tone="warn" />
      </div>
      <div className="card p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <FilterDropdown label="Compliance category" value={cat} onChange={setCat} options={[...new Set(db.rules.map((r) => r.category))]} />
        <FilterDropdown label="Application type" value={type} onChange={setType} options={APP_TYPES} />
        <FilterDropdown label="Deficiency status" value={def} onChange={setDef} options={['Deficiency', 'Needs evidence', 'Satisfied']} />
        <FilterDropdown label="Assigned officer" value={officer} onChange={setOfficer} options={OFFICERS} />
      </div>
      <div className="card mb-6"><DataTable columns={columns} rows={rows} onRowClick={(r) => setSel(r.id)} pageSize={10} /></div>

      <section className="card">
        <div className="px-4 py-3 border-b border-line"><h2 className="font-semibold text-navy">Demonstration Validation Rules</h2><p className="text-xs text-muted">{can.editRules ? 'Edits update local demonstration state only. Disabled rules are excluded from checks.' : 'Only the Administrator role can edit rules (interface example; enforce on a backend in production).'}</p></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{['Rule ID', 'Category', 'Requirement', 'Severity', 'Enabled', ''].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>{db.rules.map((r) => (
            <tr key={r.id}><td className="td font-medium">{r.id}</td><td className="td">{r.category}</td><td className="td">{r.requirement}</td><td className="td"><StatusBadge value={r.severity} /></td><td className="td">{r.enabled ? 'Yes' : 'No'}</td>
              <td className="td"><button className="btn-outline btn-sm" disabled={!can.editRules} onClick={() => setEdit({ ...r })}><Pencil size={12} /> Edit</button></td></tr>))}</tbody></table></div>
      </section>

      {detail && (
        <Modal wide title={`Compliance detail — ${detail.id}`} onClose={() => setSel(null)} footer={<><Link className="btn-outline" to={`/applications/${detail.appId}`}>Open application</Link><button className="btn-primary" onClick={() => setSel(null)}>Close</button></>}>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><div className="label">Requirement description</div>{detail.requirement}</div>
            <div><div className="label">Configurable rule identifier</div>{detail.ruleId} <span className="text-muted text-xs">(severity: {rule?.severity})</span></div>
            <div><div className="label">Evidence submitted</div>{detail.evidence}</div>
            <div><div className="label">Validation result (preliminary)</div><StatusBadge value={detail.result} /></div>
            <div><div className="label">Explanation</div>{detail.explanation}</div>
            <div><div className="label">Recommended next action</div>{RESULT_INFO[detail.result].next}</div>
          </div>
          <p className="text-xs text-muted mt-4">Automated preliminary check — not a final regulatory determination.</p>
        </Modal>
      )}
      {edit && !confirm && (
        <Modal title={`Edit rule ${edit.id}`} onClose={() => setEdit(null)} footer={<><button className="btn-outline" onClick={() => setEdit(null)}>Cancel</button><button className="btn-primary" disabled={!edit.requirement.trim()} onClick={() => setConfirm(true)}>Save changes</button></>}>
          <label className="label" htmlFor="rq">Requirement</label><textarea id="rq" className="input mb-3" rows={3} value={edit.requirement} onChange={(e) => setEdit({ ...edit, requirement: e.target.value })} />
          <label className="label" htmlFor="sv">Severity</label><select id="sv" className="input mb-3" value={edit.severity} onChange={(e) => setEdit({ ...edit, severity: e.target.value })}>{['High', 'Medium', 'Low'].map((s) => <option key={s}>{s}</option>)}</select>
          <label className="flex items-center gap-2"><input type="checkbox" checked={edit.enabled} onChange={(e) => setEdit({ ...edit, enabled: e.target.checked })} /> Rule enabled</label>
        </Modal>
      )}
      {edit && confirm && <ConfirmDialog title="Confirm rule change" message="Rule changes alter the demonstration checks and will be recorded in the audit trail. Continue?" confirmLabel="Apply change" onCancel={() => setConfirm(false)} onConfirm={saveRule} />}
    </div>
  );
}
