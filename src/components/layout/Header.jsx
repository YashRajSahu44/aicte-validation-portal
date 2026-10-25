import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings as Cog, UserCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ConfirmDialog } from '../common/Modal.jsx';

export default function Header({ onMenu }) {
  const { session, unreadCount, notifications, markRead, markAllRead, logout } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [panel, setPanel] = useState(null); // 'notif' | 'user'
  const [confirm, setConfirm] = useState(false);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  const search = (e) => { e.preventDefault(); nav(`/applications?q=${encodeURIComponent(q.trim())}`); };
  const open = (n) => { markRead(n.id); setPanel(null); nav(n.link); };

  return (
    <header className="bg-white border-b border-line h-14 flex items-center gap-3 px-3 md:px-6 sticky top-0 z-20">
      <button className="md:hidden p-1.5 rounded hover:bg-page" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="hidden lg:block leading-tight">
        <div className="font-semibold text-navy">Application Validation & Compliance System</div>
        <div className="text-[11px] text-muted">Regulatory Verification and Decision Support Portal</div>
      </div>
      <form onSubmit={search} className="relative flex-1 max-w-md ml-auto lg:ml-6" role="search">
        <Search size={15} className="absolute left-2.5 top-2.5 text-muted" />
        <input className="input pl-8" aria-label="Search applications" placeholder="Search application ID or institution" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>
      <div className="hidden md:block text-xs text-muted whitespace-nowrap">{today}</div>

      <div className="relative">
        <button className="relative p-2 rounded hover:bg-page" aria-label={`Notifications, ${unreadCount} unread`} onClick={() => setPanel(panel === 'notif' ? null : 'notif')}>
          <Bell size={19} />
          {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-err text-white text-[10px] flex items-center justify-center">{unreadCount}</span>}
        </button>
        {panel === 'notif' && (
          <>
            <button className="fixed inset-0 cursor-default" aria-label="Close" onClick={() => setPanel(null)} />
            <div className="absolute right-0 mt-1 w-80 max-w-[92vw] card shadow-lg z-10">
              <div className="flex justify-between items-center px-3 py-2 border-b border-line">
                <span className="font-semibold text-navy">Notifications</span>
                <button className="text-xs text-brand underline" onClick={markAllRead}>Mark all read</button>
              </div>
              <ul className="max-h-96 overflow-y-auto divide-y divide-line">
                {notifications.length === 0 && <li className="p-4 text-muted text-center">No notifications</li>}
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button className={`w-full text-left px-3 py-2 hover:bg-page ${n.read ? 'opacity-60' : ''}`} onClick={() => open(n)}>
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-warn">{n.kind}</div>
                      <div>{n.text}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button className="flex items-center gap-2 p-1.5 rounded hover:bg-page" onClick={() => setPanel(panel === 'user' ? null : 'user')} aria-label="User menu">
          <UserCircle size={24} className="text-navy" />
          <span className="hidden sm:block text-left leading-tight">
            <span className="block text-xs font-medium">{session.name}</span>
            <span className="block text-[11px] text-muted">{session.role}</span>
          </span>
          <ChevronDown size={14} />
        </button>
        {panel === 'user' && (
          <>
            <button className="fixed inset-0 cursor-default" aria-label="Close" onClick={() => setPanel(null)} />
            <div className="absolute right-0 mt-1 w-52 card shadow-lg z-10 py-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-page" onClick={() => { setPanel(null); nav('/settings'); }}><Cog size={15} /> Settings</button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-page text-err" onClick={() => { setPanel(null); setConfirm(true); }}><LogOut size={15} /> Sign out</button>
            </div>
          </>
        )}
      </div>
      {confirm && <ConfirmDialog title="Sign out" message="Sign out of the demo portal? Demonstration data stays saved in this browser." confirmLabel="Sign out" onCancel={() => setConfirm(false)} onConfirm={() => { logout(); nav('/'); }} />}
    </header>
  );
}
