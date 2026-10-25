const TONE = { navy: ['border-l-navy', 'text-navy'], brand: ['border-l-brand', 'text-brand'], ok: ['border-l-ok', 'text-ok'], warn: ['border-l-warn', 'text-warn'], err: ['border-l-err', 'text-err'] };
export default function StatCard({ label, value, icon: Icon, tone = 'navy', pct, hint, onClick }) {
  const [border, text] = TONE[tone];
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={`card border-l-4 ${border} p-4 text-left w-full ${onClick ? 'hover:bg-page' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted font-medium">{label}</div>
        {Icon && <Icon size={18} className={text} />}
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {pct != null && (
        <div className={`mt-2 ${text}`}>
          <div className="h-1.5 bg-page rounded"><div className="h-1.5 rounded bg-current" style={{ width: `${Math.min(100, pct)}%` }} /></div>
          {hint && <div className="text-[11px] text-muted mt-1">{hint}</div>}
        </div>
      )}
    </Tag>
  );
}
