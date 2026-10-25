import { RotateCcw } from 'lucide-react';
import { FilterDropdown, SearchInput } from '../common/ui.jsx';
import { APP_STATUSES, APP_TYPES } from '../../data/mockApplications.js';

export const EMPTY_FILTERS = { q: '', type: 'All', status: 'All', priority: 'All', from: '', to: '', review: false };

export default function ApplicationFilters({ filters, setFilters }) {
  const set = (k) => (v) => setFilters((f) => ({ ...f, [k]: v }));
  return (
    <div className="card p-4 mb-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2"><label className="label">Search</label><SearchInput value={filters.q} onChange={set('q')} placeholder="Application ID or institution name" /></div>
        <FilterDropdown label="Application type" value={filters.type} onChange={set('type')} options={APP_TYPES} />
        <FilterDropdown label="Verification status" value={filters.status} onChange={set('status')} options={APP_STATUSES} />
        <FilterDropdown label="Priority" value={filters.priority} onChange={set('priority')} options={['High', 'Medium', 'Low']} />
        <div><label className="label">Submitted from</label><input type="date" className="input" value={filters.from} onChange={(e) => set('from')(e.target.value)} /></div>
        <div><label className="label">Submitted to</label><input type="date" className="input" value={filters.to} onChange={(e) => set('to')(e.target.value)} /></div>
        <div className="flex items-end justify-between gap-2">
          <label className="flex items-center gap-2 pb-2"><input type="checkbox" checked={filters.review} onChange={(e) => set('review')(e.target.checked)} /> Review required only</label>
          <button className="btn-outline" onClick={() => setFilters(EMPTY_FILTERS)}><RotateCcw size={14} /> Reset</button>
        </div>
      </div>
    </div>
  );
}
