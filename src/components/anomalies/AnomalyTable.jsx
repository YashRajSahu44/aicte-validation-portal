import DataTable from '../common/DataTable.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { fmtDate, PRIORITY_RANK } from '../../utils/validation.js';

export default function AnomalyTable({ rows, onOpen }) {
  const columns = [
    { key: 'id', label: 'Flag ID', render: (r) => <span className="font-medium text-navy">{r.id}</span> },
    { key: 'appId', label: 'Application ID' },
    { key: 'document', label: 'Document' },
    { key: 'type', label: 'Anomaly Type', render: (r) => <span>{r.type} <span className="text-[11px] text-muted">(indicator)</span></span> },
    { key: 'severity', label: 'Severity', sortValue: (r) => PRIORITY_RANK[r.severity], render: (r) => <StatusBadge value={r.severity} /> },
    { key: 'detected', label: 'Detection Date', render: (r) => fmtDate(r.detected) },
    { key: 'status', label: 'Review Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'a', label: 'Action', sortable: false, stop: true, render: (r) => <button className="btn-primary btn-sm" onClick={() => onOpen(r)}>View Evidence</button> },
  ];
  return <DataTable columns={columns} rows={rows} onRowClick={onOpen} pageSize={8} />;
}
