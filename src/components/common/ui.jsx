import { useEffect, useState } from 'react';
import { Info, Inbox, Loader2, Search } from 'lucide-react';

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h1 className="text-xl font-semibold text-navy">{title}</h1>
        {subtitle && <p className="text-muted mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 no-print">{actions}</div>}
    </div>
  );
}
export function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-2.5 top-2.5 text-muted" />
      <input aria-label={label} className="input pl-8" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
export function FilterDropdown({ label, value, onChange, options, allLabel = 'All' }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="All">{allLabel}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
export function EmptyState({ title = 'No records found', text, action }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4 text-muted">
      <Inbox size={28} className="mb-2" />
      <p className="font-medium text-ink">{title}</p>
      {text && <p className="mt-1 max-w-md">{text}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
export function LoadingState({ text = 'Loading…' }) {
  return <div className="flex items-center justify-center gap-2 py-16 text-muted" role="status"><Loader2 className="animate-spin" size={18} />{text}</div>;
}
export function Notice({ children, tone = 'info' }) {
  const t = tone === 'warn' ? 'bg-amber-50 border-amber-200 text-warn' : 'bg-sky-50 border-sky-200 text-brand';
  return <div className={`flex gap-2 border rounded px-3 py-2 text-xs mb-4 ${t}`}><Info size={15} className="shrink-0 mt-0.5" /><div>{children}</div></div>;
}
export function useFakeLoad(ms = 350) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), ms); return () => clearTimeout(t); }, [ms]);
  return loading;
}
export function Field({ label, children }) {
  return <div><div className="label">{label}</div><div>{children}</div></div>;
}
