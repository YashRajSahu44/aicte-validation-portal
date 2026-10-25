import DataTable from '../common/DataTable.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { fmtDate, PRIORITY_RANK } from '../../utils/validation.js';

export default function ApplicationTable({ apps, onOpen, pageSize = 6 }) {
  const columns = [
    { key: 'id', label: 'Application ID', render: (r) => <span className="font-medium text-navy">{r.id}</span> },
    { key: 'institution', label: 'Institution Name' },
    { key: 'type', label: 'Application Type' },
    { key: 'submitted', label: 'Submission Date', render: (r) => fmtDate(r.submitted) },
    { key: 'status', label: 'Validation Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'priority', label: 'Priority', sortValue: (r) => PRIORITY_RANK[r.priority], render: (r) => <StatusBadge value={r.priority} /> },
    { key: 'action', label: 'Action', sortable: false, stop: true, render: (r) => <button className="btn-primary btn-sm" onClick={() => onOpen(r)}>Review</button> },
  ];
  return <DataTable columns={columns} rows={apps} onRowClick={onOpen} pageSize={pageSize} />;
}
