import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Landing from './pages/Landing';
import ScanRedirect from './pages/ScanRedirect';
import CmsPageView from './pages/CmsPageView';
import Blog from './pages/Blog';
import BlogPostView from './pages/BlogPostView';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AssetsList from './pages/assets/AssetsList';
import AssetCreate from './pages/assets/AssetCreate';
import AssetDetail from './pages/assets/AssetDetail';
import ScanPage from './pages/assets/ScanPage';
import AssignmentsList from './pages/assignments/AssignmentsList';
import DisposalCases from './pages/disposal/DisposalCases';
import AssignmentCreate from './pages/assignments/AssignmentCreate';
import LocationsPage from './pages/locations/LocationsPage';
import ReportsPage from './pages/reports/ReportsPage';
import TeamPage from './pages/TeamPage';
import BillingPage from './pages/settings/BillingPage';
import SettingsPage from './pages/settings/SettingsPage';

import SuperAdminLayout from './layouts/SuperAdminLayout';
import AdminOverview from './pages/superadmin/AdminOverview';
import AdminCompanies from './pages/superadmin/AdminCompanies';
import CompanyDetail from './pages/superadmin/CompanyDetail';
import AuditLogPage from './pages/superadmin/AuditLogPage';
import ContentEditor from './pages/superadmin/ContentEditor';
import Testimonials from './pages/superadmin/Testimonials';
import Faqs from './pages/superadmin/Faqs';
import FooterLinks from './pages/superadmin/FooterLinks';
import CmsPages from './pages/superadmin/CmsPages';
import BlogPosts from './pages/superadmin/BlogPosts';
import Plans from './pages/superadmin/Plans';
import Coupons from './pages/superadmin/Coupons';
import Branding from './pages/superadmin/Branding';
import Security from './pages/superadmin/Security';
import EmailSettings from './pages/superadmin/EmailSettings';
import PaymentSettings from './pages/superadmin/PaymentSettings';

const COMPANY_ROLES = ['company_admin', 'manager', 'staff'];

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px' } }} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pages/:slug" element={<CmsPageView />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/scan/:token" element={<ScanRedirect />} />

          <Route element={<ProtectedRoute roles={COMPANY_ROLES}><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="assets" element={<AssetsList />} />
            <Route path="assets/new" element={<AssetCreate />} />
            <Route path="assets/:id" element={<AssetDetail />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="assignments" element={<AssignmentsList />} />
            <Route path="assignments/new" element={<AssignmentCreate />} />
            <Route path="disposal-cases" element={<DisposalCases />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute roles={['super_admin']}><SuperAdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="companies/:id" element={<CompanyDetail />} />
            <Route path="audit-log" element={<AuditLogPage />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="footer-links" element={<FooterLinks />} />
            <Route path="pages" element={<CmsPages />} />
            <Route path="blog" element={<BlogPosts />} />
            <Route path="plans" element={<Plans />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="branding" element={<Branding />} />
            <Route path="security" element={<Security />} />
            <Route path="email" element={<EmailSettings />} />
            <Route path="payments" element={<PaymentSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
