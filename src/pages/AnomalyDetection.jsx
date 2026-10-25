import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Flag, Search } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { ANOMALY_TYPES } from '../data/mockFindings.js';
import { FilterDropdown, Notice, PageHeader, SearchInput } from '../components/common/ui.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import AnomalyTable from '../components/anomalies/AnomalyTable.jsx';
import EvidencePanel from '../components/anomalies/EvidencePanel.jsx';

export default function AnomalyDetection() {
  const { db } = useApp();
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [sev, setSev] = useState('All');
  const [open, setOpen] = useState(null);
  const A = db.anomalies;
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return A.filter((a) => (!s || a.id.toLowerCase().includes(s) || a.appId.toLowerCase().includes(s)) && (type === 'All' || a.type === type) && (sev === 'All' || a.severity === sev));
  }, [A, q, type, sev]);
  return (
    <div>
      <PageHeader title="AI Anomaly Detection" subtitle="Review potential document anomalies identified by automated checks." />
      <Notice tone="warn">Every flag is a <strong>preliminary indicator, not proof of fraud or misconduct</strong>. Flags support — and never replace — officer judgement. No application is rejected or approved on the basis of a flag.</Notice>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total Flags" value={A.length} icon={Flag} tone="navy" />
        <StatCard label="High-Priority Flags" value={A.filter((a) => a.severity === 'High').length} icon={AlertTriangle} tone="err" />
        <StatCard label="Pending Investigation" value={A.filter((a) => a.status === 'Pending Investigation').length} icon={Search} tone="warn" />
        <StatCard label="Reviewed Findings" value={A.filter((a) => a.status === 'Reviewed').length} icon={CheckCircle2} tone="ok" />
      </div>
      <div className="card p-4 mb-4 grid sm:grid-cols-3 gap-3">
        <div><label className="label">Search</label><SearchInput value={q} onChange={setQ} placeholder="Flag or application ID" /></div>
        <FilterDropdown label="Anomaly type" value={type} onChange={setType} options={ANOMALY_TYPES} />
        <FilterDropdown label="Severity" value={sev} onChange={setSev} options={['High', 'Medium', 'Low']} />
      </div>
      <div className="card"><AnomalyTable rows={rows} onOpen={(r) => setOpen(r.id)} /></div>
      {open && <EvidencePanel flagId={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
