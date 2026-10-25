import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppLayout() {
  const { session } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  if (!session) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenu={() => setOpen(true)} />
        <div className="bg-amber-50 border-b border-saffron/40 text-warn text-xs px-4 md:px-6 py-1.5 no-print">
          <strong>DEMONSTRATION PROTOTYPE</strong> — all institutions, documents and records are synthetic. This is not an official AICTE system and is not connected to any real database.
        </div>
        <main className="p-4 md:p-6 flex-1"><Outlet /></main>
        <footer className="px-6 py-3 text-xs text-muted border-t border-line bg-white">Prototype for demonstration. Automated findings are preliminary indicators; all regulatory decisions rest with authorized officers.</footer>
      </div>
    </div>
  );
}
