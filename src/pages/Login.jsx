import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, FileCheck2, Lock, ScanSearch, UserCheck } from 'lucide-react';
import { useApp, ROLES } from '../context/AppContext.jsx';

// Synthetic demo credentials — displayed on screen on purpose; no real credentials are used or stored.
const DEMO_ID = 'demo.officer';
const DEMO_PW = 'Demo@1234';

export default function Login() {
  const { session, login } = useApp();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [role, setRole] = useState('Reviewing Officer');
  const [error, setError] = useState('');
  if (session) return <Navigate to="/dashboard" replace />;

  const submit = (e) => {
    e.preventDefault();
    if (id.trim() === DEMO_ID && pw === DEMO_PW) { login(role, remember); nav('/dashboard'); }
    else setError('Invalid demo credentials. Use the demo-access button or the synthetic credentials shown below.');
  };
  const points = [
    [FileCheck2, 'Completeness checks', 'Identifies missing or expired documents in submitted applications.'],
    [ScanSearch, 'Inconsistency indicators', 'Highlights mismatches for officer attention, with the evidence and explanation.'],
    [UserCheck, 'Human oversight', 'Every consequential action is taken by an authorized officer and recorded in the audit trail.'],
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 bg-white">
          <form onSubmit={submit} className="w-full max-w-sm" noValidate>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 border border-dashed border-muted rounded flex items-center justify-center text-[10px] text-muted text-center leading-tight p-1">Official logo area (reserved)</div>
              <div><div className="font-semibold text-navy">All India Council for Technical Education</div><div className="text-xs text-muted">Regulation Bureau</div></div>
            </div>
            <h1 className="text-xl font-semibold text-navy">Application Validation & Compliance System</h1>
            <p className="text-muted mb-5">Regulatory Verification and Decision Support Portal</p>

            <div className="mb-3 border border-saffron/50 bg-amber-50 rounded p-2 text-xs text-warn">
              <strong>Demo login.</strong> Synthetic credentials — ID: <code>{DEMO_ID}</code>, Password: <code>{DEMO_PW}</code>
            </div>
            {error && <div role="alert" className="mb-3 border border-red-200 bg-red-50 text-err rounded p-2 text-xs">{error}</div>}

            <label className="label" htmlFor="uid">Email or Employee ID</label>
            <input id="uid" className="input mb-3" value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" />
            <label className="label" htmlFor="pw">Password</label>
            <div className="relative mb-3">
              <input id="pw" type={show ? 'text' : 'password'} className="input pr-9" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
              <button type="button" className="absolute right-2 top-2 text-muted" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
            <label className="label" htmlFor="role">Demo role</label>
            <select id="role" className="input mb-3" value={role} onChange={(e) => setRole(e.target.value)}>{Object.keys(ROLES).map((r) => <option key={r}>{r}</option>)}</select>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); setError('Password reset is not available in the demo.'); }} className="text-brand underline text-xs">Forgot password?</a>
            </div>
            <button className="btn-primary w-full mb-2" type="submit">Sign In</button>
            <button type="button" className="btn-outline w-full" onClick={() => { login(role, remember); nav('/dashboard'); }}>Demo access (no credentials)</button>
            <p className="flex gap-2 text-xs text-muted mt-5"><Lock size={14} className="shrink-0" /> Authorized personnel only. Activity is logged. Never share your credentials. Roles shown here are interface examples; production access control must be enforced by a secure backend.</p>
          </form>
        </div>
        <div className="bg-navy text-white p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-1">Decision support for application review</h2>
          <p className="text-white/70 mb-6 max-w-md">Supports Extension of Approval (EoA) and related application reviews by organising documents, findings and compliance checklists in one workspace.</p>
          <ul className="space-y-4 max-w-md">
            {points.map(([Icon, t, d]) => (
              <li key={t} className="flex gap-3"><Icon className="text-saffron shrink-0" size={20} /><div><div className="font-medium">{t}</div><div className="text-white/70 text-xs">{d}</div></div></li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-white/60 max-w-md border-t border-white/20 pt-3">Prototype built for demonstration (Problem Statement 26261). It is not an officially deployed AICTE system and uses synthetic data only.</p>
        </div>
      </div>
      <footer className="text-center text-xs text-muted py-3 border-t border-line bg-white">© 2026 Demonstration prototype · Application Validation & Compliance System · Synthetic data only</footer>
    </div>
  );
}
