import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockApplications, SEED_AUDIT } from '../data/mockApplications';
import { mockDocuments } from '../data/mockDocuments';
import { mockFindings, mockChecklist, mockAnomalies, OUTCOME_INFO } from '../data/mockFindings';
import { mockRules } from '../data/mockRules';
import { deriveApp, todayISO } from '../utils/validation';

const DB_KEY = 'aicte-demo-state-v1';      // synthetic demo data only
const SESSION_KEY = 'aicte-demo-session';   // role + display name only — never credentials

export const ROLES = {
  Administrator: { name: 'Admin Demo User' },
  'Reviewing Officer': { name: 'Officer Demo-01' },
  'Read-Only Auditor': { name: 'Auditor Demo User' },
};

const seed = () => JSON.parse(JSON.stringify({
  applications: mockApplications, documents: mockDocuments, findings: mockFindings,
  checklist: mockChecklist, anomalies: mockAnomalies, rules: mockRules, audit: SEED_AUDIT, readNotifs: [],
}));
const loadDb = () => { try { const s = localStorage.getItem(DB_KEY); if (s) return JSON.parse(s); } catch { /* ignore */ } return seed(); };
const loadSession = () => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [db, setDb] = useState(loadDb);
  const [session, setSession] = useState(loadSession);

  useEffect(() => { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { /* storage full */ } }, [db]);

  const userName = session?.name || 'System';
  const mkAudit = (e) => ({ id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: new Date().toISOString(), user: userName, appId: '—', result: 'Success', details: '', ...e });
  const mutate = (fn, entry) => setDb((s) => { const n = fn(s); return entry ? { ...n, audit: [mkAudit(entry), ...n.audit] } : n; });
  const upd = (key) => (id, patch, entry) => mutate((s) => ({ ...s, [key]: s[key].map((x) => (x.id === id ? { ...x, ...patch } : x)) }), entry);

  // Role-based UI examples ONLY. Real deployments must enforce authorization on a secure backend.
  const role = session?.role;
  const can = { act: role === 'Administrator' || role === 'Reviewing Officer', editRules: role === 'Administrator', reset: role === 'Administrator' };

  const login = (r, remember) => {
    const s = { role: r, name: ROLES[r].name };
    (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
    setDb((d) => ({ ...d, audit: [{ id: `AUD-${Date.now()}`, ts: new Date().toISOString(), user: s.name, appId: '—', action: 'Demo login', module: 'Authentication', result: 'Success', details: `Signed in as ${r} (demo).` }, ...d.audit] }));
  };
  const switchRole = (r) => {
    const s = { role: r, name: ROLES[r].name };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  };
  const logout = () => {
    mutate((s) => s, { action: 'Demo logout', module: 'Authentication', details: `${role} signed out.` });
    sessionStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_KEY); setSession(null);
  };

  const rulesOn = useMemo(() => new Set(db.rules.filter((r) => r.enabled).map((r) => r.id)), [db.rules]);
  const checks = useMemo(() => db.checklist.filter((c) => rulesOn.has(c.ruleId)), [db.checklist, rulesOn]);
  const apps = useMemo(() => db.applications.map((a) => deriveApp(a, db.documents, checks, db.findings)), [db.applications, db.documents, checks, db.findings]);

  const notifications = useMemo(() => {
    const L = [];
    const add = (arr, mk) => arr.slice(0, 4).forEach((x) => L.push(mk(x)));
    add(db.documents.filter((d) => d.verification === 'Missing'), (d) => ({ id: `n-miss-${d.id}`, kind: 'Missing document', text: `${d.appId}: ${d.type} not submitted`, link: `/applications/${d.appId}` }));
    add(db.documents.filter((d) => d.verification === 'Expired'), (d) => ({ id: `n-exp-${d.id}`, kind: 'Expired certificate', text: `${d.appId}: ${d.type} validity has passed`, link: `/applications/${d.appId}` }));
    add(db.documents.filter((d) => d.verification === 'Verification Pending'), (d) => ({ id: `n-pend-${d.id}`, kind: 'Pending verification', text: `${d.id} (${d.appId}) awaiting verification`, link: '/document-verification' }));
    add(db.anomalies.filter((a) => a.status === 'Pending Investigation'), (a) => ({ id: `n-an-${a.id}`, kind: 'New anomaly flag', text: `${a.id}: ${a.type} on ${a.appId} (preliminary)`, link: '/anomaly-detection' }));
    add(apps.filter((a) => a.status === 'Pending Review'), (a) => ({ id: `n-rev-${a.id}`, kind: 'Awaiting officer review', text: `${a.id} — ${a.institution}`, link: `/applications/${a.id}` }));
    return L.map((n) => ({ ...n, read: db.readNotifs.includes(n.id) }));
  }, [db.documents, db.anomalies, db.readNotifs, apps]);

  const officerActions = {
    remark: { action: 'Officer added remarks', status: null },
    evidence: { action: 'Additional evidence requested', status: 'Incomplete' },
    reviewed: { action: 'Application marked as reviewed (no approval/rejection implied)', status: 'Officer Reviewed' },
    escalate: { action: 'Escalated for inspection', status: 'Escalated for Inspection' },
  };
  const officerAction = (appId, kind, text) => {
    const cfg = officerActions[kind];
    mutate((s) => ({
      ...s,
      applications: s.applications.map((a) => a.id === appId
        ? { ...a, status: cfg.status || a.status, remarks: [{ ts: new Date().toISOString(), user: userName, kind, text }, ...a.remarks] } : a),
    }), { action: cfg.action, module: 'Applications', appId, details: text || '—' });
  };

  const verifyDoc = (docId) => new Promise((resolve) => {
    const d = db.documents.find((x) => x.id === docId);
    setTimeout(() => {
      const status = d.simulated;
      const explanation = OUTCOME_INFO[status]?.text || 'No result available.';
      mutate((s) => ({ ...s, documents: s.documents.map((x) => (x.id === docId ? { ...x, verification: status, lastChecked: todayISO() } : x)) }),
        { action: 'Document verification completed', module: 'Document Verification', appId: d.appId, result: status, details: `${d.id} (${d.type}) via ${d.method}: ${explanation}` });
      resolve({ status, explanation, method: d.method, checkedAt: new Date().toISOString() });
    }, 1600);
  });

  const value = {
    session, role, can, login, logout, switchRole, db, apps, checks, notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markRead: (id) => setDb((s) => (s.readNotifs.includes(id) ? s : { ...s, readNotifs: [...s.readNotifs, id] })),
    markAllRead: () => setDb((s) => ({ ...s, readNotifs: notifications.map((n) => n.id) })),
    logAudit: (e) => mutate((s) => s, e),
    updateDoc: upd('documents'), updateFinding: upd('findings'), updateChecklist: upd('checklist'),
    updateAnomaly: upd('anomalies'), updateRule: upd('rules'),
    officerAction, verifyDoc,
    resetDemo: () => { setDb({ ...seed(), audit: [mkAudit({ action: 'Demonstration data reset', module: 'Settings', details: 'All demo data restored to seed state.' }), ...SEED_AUDIT] }); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
