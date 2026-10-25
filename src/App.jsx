import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Applications from './pages/Applications.jsx';
import ApplicationDetails from './pages/ApplicationDetails.jsx';
import DocumentVerification from './pages/DocumentVerification.jsx';
import AnomalyDetection from './pages/AnomalyDetection.jsx';
import ComplianceReview from './pages/ComplianceReview.jsx';
import Reports from './pages/Reports.jsx';
import AuditTrail from './pages/AuditTrail.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:id" element={<ApplicationDetails />} />
            <Route path="/document-verification" element={<DocumentVerification />} />
            <Route path="/anomaly-detection" element={<AnomalyDetection />} />
            <Route path="/compliance-review" element={<ComplianceReview />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
