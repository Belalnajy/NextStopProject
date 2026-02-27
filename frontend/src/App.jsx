import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';
import EligibilityPage from './pages/EligibilityPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePage from './pages/CookiePage';
import RefundPage from './pages/RefundPage';

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
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = i18n.language || 'en';
    const shortLng = lng.split('-')[0];
    document.documentElement.dir = shortLng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = shortLng;
  }, [i18n.language]);

  return (
    <AuthProvider>
      <SettingsProvider>
        <Toaster position="top-right" />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/eligibility" element={<EligibilityPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookie" element={<CookiePage />} />
            <Route path="/refund" element={<RefundPage />} />
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
