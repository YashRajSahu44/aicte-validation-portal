import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { FINDING_CATEGORIES } from '../../data/mockFindings.js';
import { FilterDropdown } from '../common/ui.jsx';

function Finding({ f }) {
  const { can, updateFinding } = useApp();
  const [open, setOpen] = useState(false);
  const set = (reviewStatus) => updateFinding(f.id, { reviewStatus }, { action: `Validation finding marked "${reviewStatus}"`, module: 'Applications', appId: f.appId, details: `${f.id}: ${f.title}` });
  return (
    <li className="border-b border-line last:border-0">
      <button className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-page" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? <ChevronDown size={16} className="mt-0.5" /> : <ChevronRight size={16} className="mt-0.5" />}
        <div className="flex-1 min-w-0">
          <div className="font-medium">{f.title}</div>
          <div className="text-xs text-muted">{f.id} · {f.category}</div>
        </div>
        <StatusBadge value={f.severity} /><StatusBadge value={f.reviewStatus} />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-11 space-y-2 text-sm">
          <div><div className="label">Description</div>{f.description}</div>
          <div><div className="label">Evidence</div><div className="bg-page border border-line rounded p-2 text-xs">{f.evidence}</div></div>
          <div><div className="label">Recommended next step</div>{f.next}</div>
          <p className="text-xs text-muted">Automated preliminary indicator — not a conclusion. Officer review is required.</p>
          <div className="flex gap-2">
            <button className="btn-outline btn-sm" disabled={!can.act || f.reviewStatus === 'Under Review'} onClick={() => set('Under Review')}>Mark Under Review</button>
            <button className="btn-primary btn-sm" disabled={!can.act || f.reviewStatus === 'Resolved'} onClick={() => set('Resolved')}>Mark Resolved</button>
            {f.reviewStatus !== 'Open' && <button className="btn-outline btn-sm" disabled={!can.act} onClick={() => set('Open')}>Reopen</button>}
          </div>
        </div>
      )}
    </li>
  );
}

export default function ValidationFindings({ appId }) {
  const { db } = useApp();
  const [cat, setCat] = useState('All');
  const [sev, setSev] = useState('All');
  const list = db.findings.filter((f) => f.appId === appId && (cat === 'All' || f.category === cat) && (sev === 'All' || f.severity === sev));
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 max-w-md p-4"><FilterDropdown label="Category" value={cat} onChange={setCat} options={FINDING_CATEGORIES} /><FilterDropdown label="Severity" value={sev} onChange={setSev} options={['High', 'Medium', 'Low']} /></div>
      {list.length === 0 ? <p className="p-6 text-center text-muted">No findings match the selected filters.</p> : <ul className="border-t border-line">{list.map((f) => <Finding key={f.id} f={f} />)}</ul>}
    </div>
  );
}
