import { fmtDateTime } from '../../utils/validation.js';
import StatusBadge from '../common/StatusBadge.jsx';
export default function RecentActivity({ items }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((a) => (
        <li key={a.id} className="px-4 py-2.5">
          <div className="flex justify-between gap-2"><span className="font-medium">{a.action}</span><StatusBadge value={a.result} /></div>
          <div className="text-xs text-muted">{a.appId !== '—' ? `${a.appId} · ` : ''}{a.module} · {a.user} · {fmtDateTime(a.ts)}</div>
        </li>
      ))}
    </ul>
  );
}
