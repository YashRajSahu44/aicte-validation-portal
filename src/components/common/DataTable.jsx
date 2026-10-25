import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from './ui.jsx';

// columns: [{ key, label, render?, sortValue?, sortable?, stop? }]  (stop: clicks inside the cell don't trigger onRowClick)
export default function DataTable({ columns, rows, rowKey = 'id', onRowClick, pageSize = 8, emptyText = 'No records match the selected filters.', initialSort }) {
  const [sort, setSort] = useState(initialSort || null);
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [rows.length]);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = (r) => (col?.sortValue ? col.sortValue(r) : r[sort.key]);
    return [...rows].sort((a, b) => {
      const x = get(a), y = get(b);
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''));
      return sort.dir === 'asc' ? c : -c;
    });
  }, [rows, sort, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const cur = Math.min(page, pages);
  const slice = sorted.slice((cur - 1) * pageSize, cur * pageSize);
  const toggle = (key) => setSort((s) => (s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }));

  if (!rows.length) return <EmptyState text={emptyText} />;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="th" aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  {c.sortable === false ? c.label : (
                    <button className="inline-flex items-center gap-1 uppercase tracking-wide font-semibold" onClick={() => toggle(c.key)}>
                      {c.label}
                      {sort?.key === c.key && (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r[rowKey]} className={onRowClick ? 'hover:bg-page cursor-pointer' : ''}
                  onClick={() => onRowClick?.(r)} tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onRowClick?.(r)}>
                {columns.map((c) => (
                  <td key={c.key} className="td" onClick={c.stop ? (e) => e.stopPropagation() : undefined}>
                    {c.render ? c.render(r) : r[c.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted border-t border-line no-print">
        <span>Showing {(cur - 1) * pageSize + 1}–{Math.min(cur * pageSize, sorted.length)} of {sorted.length}</span>
        <div className="flex items-center gap-2">
          <button className="btn-outline btn-sm" disabled={cur <= 1} onClick={() => setPage(cur - 1)} aria-label="Previous page"><ChevronLeft size={14} /></button>
          <span>Page {cur} of {pages}</span>
          <button className="btn-outline btn-sm" disabled={cur >= pages} onClick={() => setPage(cur + 1)} aria-label="Next page"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
