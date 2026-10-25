import { useState } from 'react';
import StatusBadge from '../common/StatusBadge.jsx';
import { Notice } from '../common/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';

function Row({ c }) {
  const { can, updateChecklist } = useApp();
  const [remarks, setRemarks] = useState(c.remarks);
  const audit = (what) => ({ action: 'Compliance checklist reviewed', module: 'Compliance Review', appId: c.appId, details: `${c.ruleId} (${c.category}): ${what}` });
  return (
    <tr>
      <td className="td min-w-[180px]"><div className="font-medium">{c.requirement}</div><div className="text-[11px] text-muted">{c.ruleId}</div></td>
      <td className="td">{c.evidence}</td>
      <td className="td"><StatusBadge value={c.result} /></td>
      <td className="td min-w-[200px] text-xs">{c.explanation}</td>
      <td className="td min-w-[180px]">
        <input className="input" aria-label={`Officer remarks for ${c.ruleId}`} value={remarks} disabled={!can.act} placeholder="Add remarks" onChange={(e) => setRemarks(e.target.value)}
          onBlur={() => remarks !== c.remarks && updateChecklist(c.id, { remarks }, audit('officer remarks updated'))} />
      </td>
      <td className="td">
        <select className="input" aria-label={`Review status for ${c.ruleId}`} value={c.reviewStatus} disabled={!can.act}
          onChange={(e) => updateChecklist(c.id, { reviewStatus: e.target.value }, audit(`review status set to ${e.target.value}`))}>
          {['Pending', 'Reviewed', 'Needs Evidence'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </td>
    </tr>
  );
}

export default function ComplianceChecklist({ appId }) {
  const { checks } = useApp();
  const items = checks.filter((c) => c.appId === appId);
  const cats = [...new Set(items.map((i) => i.category))];
  return (
    <div className="p-4">
      <Notice tone="warn">Requirements shown are <strong>demonstration examples</strong> and must be configured against the applicable AICTE Approval Process Handbook and authorized instructions. Results are automated preliminary checks, not final regulatory determinations.</Notice>
      {items.length === 0 && <p className="text-muted">No active rules apply to this application.</p>}
      {cats.map((cat) => (
        <div key={cat} className="mb-4">
          <h3 className="font-semibold text-navy mb-1">{cat}</h3>
          <div className="overflow-x-auto border border-line rounded">
            <table className="w-full text-sm">
              <thead><tr>{['Requirement', 'Submitted evidence', 'Validation result', 'Explanation', 'Officer remarks', 'Review status'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
              <tbody>{items.filter((i) => i.category === cat).map((c) => <Row key={c.id} c={c} />)}</tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
