# AICTE — Application Validation & Compliance System (Demo Prototype)

Frontend-only prototype for Smart India Hackathon, Problem Statement 26261.
React + JavaScript (JSX) · Vite · React Router · Tailwind CSS · Lucide React · Recharts.

**All institutions, documents, findings and metrics are synthetic. This is not an official AICTE system and is not connected to any real database or issuing authority.**

## Run
```bash
npm install
npm run dev
```
Open the printed local URL. Demo login: ID `demo.officer`, password `Demo@1234` (or press "Demo access").

## Demo flow
Login → Dashboard → open an application → Documents (preview / extracted data / Verify) → Validation Findings → Compliance Review → add remarks / request evidence / mark reviewed / escalate → Audit Trail.

## Notes
- State lives in `src/context/AppContext.jsx` and persists to localStorage (synthetic data + role only). Settings → Reset restores seed data.
- Roles (Administrator, Reviewing Officer, Read-Only Auditor) are UI examples; enforce authorization on a backend in production.
- Verification is simulated locally; integrate authorized APIs via a secure backend later.
- No automatic approval or rejection exists by design; findings are preliminary indicators.
