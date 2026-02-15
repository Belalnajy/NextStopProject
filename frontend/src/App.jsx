import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

// Dashboard Imports
import DashboardLayout from './components/dashboard/layout/DashboardLayout';
import Overview from './components/dashboard/pages/Overview';
import Submissions from './components/dashboard/pages/Submissions';
import EmailSystem from './components/dashboard/pages/EmailSystem';
import Settings from './components/dashboard/pages/Settings';
import ApplicationDetails from './components/dashboard/pages/ApplicationDetails';

import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Admin Dashboard Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="submissions" element={<Submissions />} />
              <Route path="submissions/:id" element={<ApplicationDetails />} />
              <Route path="email" element={<EmailSystem />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
}
