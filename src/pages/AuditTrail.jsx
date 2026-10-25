import { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { FilterDropdown, Notice, PageHeader, SearchInput } from '../components/common/ui.jsx';
import DataTable from '../components/common/DataTable.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { fmtDateTime } from '../utils/validation.js';

export default function AuditTrail() {
  const { db } = useApp();
  const [q, setQ] = useState('');
  const [app, setApp] = useState('');
  const [user, setUser] = useState('All');
  const [mod, setMod] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const users = [...new Set(db.audit.map((a) => a.user))];
  const mods = [...new Set(db.audit.map((a) => a.module))];
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase(), ap = app.trim().toLowerCase();
    return db.audit.filter((a) => (!s || `${a.action} ${a.details}`.toLowerCase().includes(s)) && (!ap || a.appId.toLowerCase().includes(ap)) &&
      (user === 'All' || a.user === user) && (mod === 'All' || a.module === mod) && (!from || a.ts.slice(0, 10) >= from) && (!to || a.ts.slice(0, 10) <= to));
  }, [db.audit, q, app, user, mod, from, to]);
  const columns = [
    { key: 'ts', label: 'Timestamp', render: (r) => <span className="whitespace-nowrap">{fmtDateTime(r.ts)}</span> },
    { key: 'user', label: 'User' },
    { key: 'appId', label: 'Application ID' },
    { key: 'action', label: 'Action Performed' },
    { key: 'module', label: 'Module' },
    { key: 'result', label: 'Result', render: (r) => <StatusBadge value={r.result} /> },
    { key: 'details', label: 'Details', render: (r) => <span className="text-xs">{r.details}</span> },
  ];
  return (
    <div>
      <PageHeader title="Audit Trail" subtitle="Chronological, read-only record of system and officer actions." />
      <Notice><span className="inline-flex items-center gap-1"><Lock size={12} /> Read-only.</span> Entries are generated automatically by actions in this prototype and cannot be edited or deleted from the interface.</Notice>
      <div className="card p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="xl:col-span-2"><label className="label">Search actions</label><SearchInput value={q} onChange={setQ} placeholder="Action or details" /></div>
        <div><label className="label">Application ID</label><input className="input" value={app} onChange={(e) => setApp(e.target.value)} placeholder="AICTE-2026-…" /></div>
        <FilterDropdown label="User" value={user} onChange={setUser} options={users} />
        <FilterDropdown label="Module" value={mod} onChange={setMod} options={mods} />
        <div className="grid grid-cols-2 gap-2"><div><label className="label">From</label><input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} /></div><div><label className="label">To</label><input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} /></div></div>
      </div>
      <div className="card"><DataTable columns={columns} rows={rows} pageSize={12} initialSort={{ key: 'ts', dir: 'desc' }} /></div>
    </div>
  );
}
