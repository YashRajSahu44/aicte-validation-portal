import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Printer } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { APP_STATUSES, APP_TYPES, MONTHLY, MONTHS } from '../data/mockApplications.js';
import { DOC_OUTCOMES, VERIFICATION_METHODS } from '../data/mockDocuments.js';
import { FilterDropdown, LoadingState, Notice, PageHeader, useFakeLoad } from '../components/common/ui.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import { exportCSV } from '../utils/exportCSV.js';

const VERIFY_SECS = { 'QR code verification': 2.4, 'Digital signature validation': 3.1, 'Issuing-authority API': 4.8, 'Official portal': 6.2, 'Authorized digital repository': 5.0, 'Manual verification': 1260 };
const COLORS = ['#123B63', '#1D5B8F', '#E89B32', '#218653', '#B7791F', '#C0392B', '#667085'];

function Chart({ title, note, children, height = 240 }) {
  return (
    <section className="card">
      <div className="px-4 py-3 border-b border-line"><h2 className="font-semibold text-navy">{title}</h2>{note && <p className="text-xs text-muted">{note}</p>}</div>
      <div className="p-4" role="img" aria-label={title}><ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer></div>
    </section>
  );
}
const tick = { fontSize: 11, fill: '#667085' };
const counts = (arr, keys, f) => keys.map((k) => ({ name: k, value: arr.filter((x) => f(x) === k).length })).filter((d) => d.value > 0);

export default function Reports() {
  const { apps, db, logAudit } = useApp();
  const loading = useFakeLoad();
  const [from, setFrom] = useState('Apr');
  const [to, setTo] = useState('Oct');
  const [type, setType] = useState('All');
  if (loading) return <LoadingState text="Preparing report…" />;

  const mi = (m) => MONTHS.indexOf(m);
  const types = type === 'All' ? APP_TYPES : [type];
  const series = MONTHLY.filter((m) => mi(m.month) >= mi(from) && mi(m.month) <= mi(to)).map((m) => ({ month: m.month, Received: types.reduce((s, t) => s + m[t], 0) }));
  const fApps = apps.filter((a) => type === 'All' || a.type === type);
  const ids = new Set(fApps.map((a) => a.id));
  const status = counts(fApps, APP_STATUSES, (a) => a.status);
  const outcomes = counts(db.documents.filter((d) => ids.has(d.appId)), [...DOC_OUTCOMES, 'Missing'], (d) => d.verification);
  const defMap = {}; db.findings.filter((f) => ids.has(f.appId)).forEach((f) => { defMap[f.title] = (defMap[f.title] || 0) + 1; });
  const defs = Object.entries(defMap).map(([name, value]) => ({ name: name.length > 28 ? name.slice(0, 26) + '…' : name, value })).sort((a, b) => b.value - a.value);
  const times = VERIFICATION_METHODS.map((m) => ({ name: m.replace(' verification', ''), Seconds: VERIFY_SECS[m] }));
  const automated = times.filter((t) => t.name !== 'Manual').map((t) => t.Seconds);
  const avg = (automated.reduce((a, b) => a + b, 0) / automated.length).toFixed(1);
  const insp = fApps.filter((a) => a.status === 'Escalated for Inspection');

  const doExport = () => {
    exportCSV('report-demo.csv', [
      ...series.map((s) => ({ Section: 'Applications received', Item: s.month, Value: s.Received })),
      ...status.map((s) => ({ Section: 'Applications by status', Item: s.name, Value: s.value })),
      ...outcomes.map((s) => ({ Section: 'Document verification outcomes', Item: s.name, Value: s.value })),
      ...defs.map((s) => ({ Section: 'Frequent deficiencies', Item: s.name, Value: s.value })),
    ]);
    logAudit({ action: 'Report exported (CSV)', module: 'Reports', details: `Range ${from}–${to}, category ${type}. Synthetic metrics.` });
  };

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Summary of application processing, verification and deficiencies." actions={<>
        <button className="btn-outline" onClick={doExport}><Download size={15} /> Export CSV</button>
        <button className="btn-outline" onClick={() => { logAudit({ action: 'Report printed', module: 'Reports', details: 'Print dialog opened.' }); window.print(); }}><Printer size={15} /> Print Report</button></>} />
      <Notice>All figures are <strong>synthetic and simulated</strong> for demonstration. Verification times are illustrative, not measurements of any real system.</Notice>
      <div className="card p-4 mb-4 grid sm:grid-cols-3 gap-3 no-print">
        <div><label className="label" htmlFor="rf">From month</label><select id="rf" className="input" value={from} onChange={(e) => setFrom(e.target.value)}>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select></div>
        <div><label className="label" htmlFor="rt">To month</label><select id="rt" className="input" value={to} onChange={(e) => setTo(e.target.value)}>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select></div>
        <FilterDropdown label="Application category" value={type} onChange={setType} options={APP_TYPES} />
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <StatCard label="Applications in view" value={fApps.length} tone="navy" />
        <StatCard label="Avg. simulated verification time (automated)" value={`${avg} s`} tone="brand" />
        <StatCard label="Applications requiring inspection" value={insp.length} tone="err" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Chart title="Applications received over time" note="Simulated monthly volumes">
          {series.length ? <LineChart data={series}><CartesianGrid strokeDasharray="3 3" stroke="#DCE2E8" /><XAxis dataKey="month" tick={tick} /><YAxis tick={tick} /><Tooltip /><Line type="monotone" dataKey="Received" stroke="#123B63" strokeWidth={2} /></LineChart> : <div className="text-muted p-6">Select a valid month range.</div>}
        </Chart>
        <Chart title="Applications by status">
          <BarChart data={status} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" stroke="#DCE2E8" /><XAxis type="number" allowDecimals={false} tick={tick} /><YAxis type="category" dataKey="name" width={130} tick={tick} /><Tooltip /><Bar dataKey="value" name="Applications">{status.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart>
        </Chart>
        <Chart title="Document verification outcomes">
          <BarChart data={outcomes}><CartesianGrid strokeDasharray="3 3" stroke="#DCE2E8" /><XAxis dataKey="name" tick={{ ...tick, fontSize: 10 }} interval={0} /><YAxis allowDecimals={false} tick={tick} /><Tooltip /><Bar dataKey="value" name="Documents" fill="#1D5B8F" /></BarChart>
        </Chart>
        <Chart title="Most frequent deficiencies (open and reviewed findings)">
          <BarChart data={defs} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" stroke="#DCE2E8" /><XAxis type="number" allowDecimals={false} tick={tick} /><YAxis type="category" dataKey="name" width={170} tick={tick} /><Tooltip /><Bar dataKey="value" name="Findings" fill="#E89B32" /></BarChart>
        </Chart>
        <Chart title="Average simulated verification time by method" note="Seconds (illustrative). Manual verification is shown in minutes below.">
          <BarChart data={times.filter((t) => t.name !== 'Manual')}><CartesianGrid strokeDasharray="3 3" stroke="#DCE2E8" /><XAxis dataKey="name" tick={{ ...tick, fontSize: 10 }} interval={0} /><YAxis tick={tick} /><Tooltip /><Legend /><Bar dataKey="Seconds" fill="#123B63" /></BarChart>
        </Chart>
        <section className="card">
          <div className="px-4 py-3 border-b border-line"><h2 className="font-semibold text-navy">Applications requiring inspection</h2></div>
          <div className="p-4 text-sm">
            {insp.length === 0 ? <p className="text-muted">No applications have been escalated for inspection in this view.</p> : <ul className="space-y-2">{insp.map((a) => <li key={a.id}><Link className="text-brand underline" to={`/applications/${a.id}`}>{a.id}</Link> — {a.institution} ({a.type})</li>)}</ul>}
            <p className="text-xs text-muted mt-3">Manual verification (simulated average): about {Math.round(VERIFY_SECS['Manual verification'] / 60)} minutes.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
