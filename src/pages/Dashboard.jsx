import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ClipboardCheck, Clock, FileQuestion, FileText, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { MONTHLY, APP_TYPES } from '../data/mockApplications.js';
import { PageHeader, LoadingState, Notice, useFakeLoad } from '../components/common/ui.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import ApplicationTable from '../components/dashboard/ApplicationTable.jsx';
import ProcessingChart from '../components/dashboard/ProcessingChart.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import { PRIORITY_RANK } from '../utils/validation.js';

export default function Dashboard() {
  const { apps, db } = useApp();
  const nav = useNavigate();
  const loading = useFakeLoad();
  if (loading) return <LoadingState text="Loading dashboard…" />;

  const total = apps.length, docs = db.documents.length;
  const count = (f) => apps.filter(f).length;
  const cards = [
    { label: 'Total Applications', value: total, icon: FileText, tone: 'navy', pct: 100, hint: 'All received this cycle', to: '/applications' },
    { label: 'Pending Review', value: count((a) => a.status === 'Pending Review'), icon: Clock, tone: 'warn', pct: (count((a) => a.status === 'Pending Review') / total) * 100, hint: 'of applications', to: '/applications' },
    { label: 'Documents Verified', value: db.documents.filter((d) => d.verification === 'Verified').length, icon: ShieldCheck, tone: 'ok', pct: (db.documents.filter((d) => d.verification === 'Verified').length / docs) * 100, hint: `of ${docs} documents`, to: '/document-verification' },
    { label: 'Missing Documents', value: db.documents.filter((d) => d.verification === 'Missing').length, icon: FileQuestion, tone: 'err', pct: (db.documents.filter((d) => d.verification === 'Missing').length / docs) * 100, hint: 'of expected documents', to: '/applications' },
    { label: 'Anomalies Flagged', value: db.anomalies.length, icon: AlertTriangle, tone: 'warn', pct: (db.anomalies.filter((a) => a.status !== 'Reviewed').length / db.anomalies.length) * 100, hint: 'not yet reviewed (preliminary)', to: '/anomaly-detection' },
    { label: 'Compliance Review Required', value: count((a) => a.compliance !== 'Compliant'), icon: ClipboardCheck, tone: 'brand', pct: (count((a) => a.compliance !== 'Compliant') / total) * 100, hint: 'of applications', to: '/compliance-review' },
  ];
  const chart = MONTHLY.map((m) => { const rec = APP_TYPES.reduce((s, t) => s + m[t], 0); const proc = Math.round(rec * m.rate); return { month: m.month, Processed: proc, Pending: rec - proc }; });
  const attention = apps.filter((a) => !['Verified', 'Officer Reviewed'].includes(a.status)).sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  const open = (a) => nav(`/applications/${a.id}`);

  return (
    <div>
      <PageHeader title="Application Validation Dashboard" subtitle="Monitor application status, document verification, and regulatory compliance." />
      <Notice>All institution names, application IDs and counts on this portal are synthetic demonstration data.</Notice>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
        {cards.map((c) => <StatCard key={c.label} {...c} onClick={() => nav(c.to)} />)}
      </div>
      <section className="card mb-5">
        <div className="px-4 py-3 border-b border-line"><h2 className="font-semibold text-navy">Application Processing Overview</h2><p className="text-xs text-muted">Monthly application volume by processing status (simulated metrics).</p></div>
        <div className="p-4"><ProcessingChart data={chart} /></div>
      </section>
      <div className="grid xl:grid-cols-3 gap-5">
        <section className="card xl:col-span-2">
          <div className="px-4 py-3 border-b border-line"><h2 className="font-semibold text-navy">Applications Requiring Attention</h2><p className="text-xs text-muted">Select a row to open the review workspace.</p></div>
          <ApplicationTable apps={attention} onOpen={open} />
        </section>
        <section className="card">
          <div className="px-4 py-3 border-b border-line"><h2 className="font-semibold text-navy">Recent Activity</h2></div>
          <RecentActivity items={db.audit.slice(0, 7)} />
        </section>
      </div>
    </div>
  );
}
