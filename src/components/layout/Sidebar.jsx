import { NavLink } from 'react-router-dom';
import { AlertTriangle, BarChart3, ClipboardCheck, FileText, History, LayoutDashboard, Settings, ShieldCheck, X } from 'lucide-react';

export const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/document-verification', label: 'Document Verification', icon: ShieldCheck },
  { to: '/anomaly-detection', label: 'Anomaly Detection', icon: AlertTriangle },
  { to: '/compliance-review', label: 'Compliance Review', icon: ClipboardCheck },
  { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/audit-trail', label: 'Audit Trail', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-navy text-white flex flex-col transform transition-transform md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
          <div className="leading-tight">
            <div className="font-semibold tracking-wide">AICTE</div>
            <div className="text-[11px] text-white/70">Validation & Compliance (Demo)</div>
          </div>
          <button className="md:hidden p-1" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 py-3" aria-label="Primary">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm border-l-4 ${isActive ? 'bg-white/10 border-saffron font-medium' : 'border-transparent text-white/80 hover:bg-white/5'}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 text-[11px] text-white/60 border-t border-white/10">Synthetic demonstration data. Decisions remain with authorized officers.</div>
      </aside>
    </>
  );
}
