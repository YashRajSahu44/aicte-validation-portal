import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Download } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { PageHeader, LoadingState, useFakeLoad } from '../components/common/ui.jsx';
import ApplicationFilters, { EMPTY_FILTERS } from '../components/applications/ApplicationFilters.jsx';
import DataTable from '../components/common/DataTable.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { exportCSV } from '../utils/exportCSV.js';
import { fmtDate } from '../utils/validation.js';

export default function Applications() {
  const { apps, logAudit } = useApp();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, q: sp.get('q') || '' });
  const loading = useFakeLoad(300);
  useEffect(() => { setFilters((f) => ({ ...f, q: sp.get('q') || '' })); }, [sp]);

  const rows = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return apps.filter((a) =>
      (!q || a.id.toLowerCase().includes(q) || a.institution.toLowerCase().includes(q)) &&
      (filters.type === 'All' || a.type === filters.type) &&
      (filters.status === 'All' || a.status === filters.status) &&
      (filters.priority === 'All' || a.priority === filters.priority) &&
      (!filters.from || a.submitted >= filters.from) && (!filters.to || a.submitted <= filters.to) &&
      (!filters.review || a.reviewRequired));
  }, [apps, filters]);

  if (loading) return <LoadingState text="Loading applications…" />;
  const columns = [
    { key: 'id', label: 'Application ID', render: (r) => (
      <div><span className="font-medium text-navy">{r.id}</span>
        {r.reviewRequired && <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-err bg-red-50 border border-red-200 rounded px-1.5 py-0.5"><AlertCircle size={11} /> Review Required ({r.openFindings})</div>}
      </div>) },
    { key: 'institution', label: 'Institution Name' },
    { key: 'type', label: 'Application Type' },
    { key: 'submitted', label: 'Submitted On', render: (r) => fmtDate(r.submitted) },
    { key: 'docsStatus', label: 'Documents Status', render: (r) => <StatusBadge value={r.docsStatus} /> },
    { key: 'compliance', label: 'Compliance Status', render: (r) => <StatusBadge value={r.compliance} /> },
    { key: 'status', label: 'Overall Validation Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'officer', label: 'Assigned Officer' },
    { key: 'view', label: 'Action', sortable: false, stop: true, render: (r) => <button className="btn-primary btn-sm" onClick={() => nav(`/applications/${r.id}`)}>View Details</button> },
  ];
  const doExport = () => {
    exportCSV('applications-demo.csv', rows.map((a) => ({ 'Application ID': a.id, Institution: a.institution, Type: a.type, 'Submitted On': a.submitted, 'Documents Status': a.docsStatus, 'Compliance Status': a.compliance, 'Validation Status': a.status, 'Assigned Officer': a.officer, 'Review Required': a.reviewRequired ? 'Yes' : 'No' })));
    logAudit({ action: 'Applications list exported (CSV)', module: 'Applications', details: `${rows.length} synthetic records exported.` });
  };

  return (
    <div>
      <PageHeader title="Applications" subtitle="Search, filter and open applications for review (synthetic demonstration records)."
        actions={<button className="btn-outline" onClick={doExport} disabled={!rows.length}><Download size={15} /> Export CSV</button>} />
      <ApplicationFilters filters={filters} setFilters={setFilters} />
      <div className="card"><DataTable columns={columns} rows={rows} onRowClick={(r) => nav(`/applications/${r.id}`)} pageSize={8} initialSort={{ key: 'id', dir: 'asc' }} /></div>
    </div>
  );
}
