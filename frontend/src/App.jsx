import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Spinner } from './components/ui';

// Route-level code splitting: previously every page (including the public
// marketing homepage) was bundled into one ~2.3MB chunk that also pulled in
// jsPDF, PptxGenJS, Leaflet, and html2canvas - libraries only the
// authenticated app actually uses. An anonymous visitor to the homepage
// was paying that entire download before seeing anything. Each import()
// below becomes its own chunk, loaded only when its route is actually
// visited.
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Landing = lazy(() => import('./pages/Landing'));
const ScanRedirect = lazy(() => import('./pages/ScanRedirect'));
const CmsPageView = lazy(() => import('./pages/CmsPageView'));
const Blog = lazy(() => import('./pages/Blog'));
const DocsLayout = lazy(() => import('./layouts/DocsLayout'));
const DocsHome = lazy(() => import('./pages/docs/DocsHome'));
const DocArticleView = lazy(() => import('./pages/docs/DocArticleView'));
const BlogPostView = lazy(() => import('./pages/BlogPostView'));

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AssetsList = lazy(() => import('./pages/assets/AssetsList'));
const AssetCreate = lazy(() => import('./pages/assets/AssetCreate'));
const AssetDetail = lazy(() => import('./pages/assets/AssetDetail'));
const ScanPage = lazy(() => import('./pages/assets/ScanPage'));
const AssignmentsList = lazy(() => import('./pages/assignments/AssignmentsList'));
const DisposalCases = lazy(() => import('./pages/disposal/DisposalCases'));
const AssignmentCreate = lazy(() => import('./pages/assignments/AssignmentCreate'));
const LocationsPage = lazy(() => import('./pages/locations/LocationsPage'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const BillingPage = lazy(() => import('./pages/settings/BillingPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));

const SuperAdminLayout = lazy(() => import('./layouts/SuperAdminLayout'));
const AdminOverview = lazy(() => import('./pages/superadmin/AdminOverview'));
const AdminCompanies = lazy(() => import('./pages/superadmin/AdminCompanies'));
const CompanyDetail = lazy(() => import('./pages/superadmin/CompanyDetail'));
const AuditLogPage = lazy(() => import('./pages/superadmin/AuditLogPage'));
const ContentEditor = lazy(() => import('./pages/superadmin/ContentEditor'));
const Testimonials = lazy(() => import('./pages/superadmin/Testimonials'));
const Faqs = lazy(() => import('./pages/superadmin/Faqs'));
const FooterLinks = lazy(() => import('./pages/superadmin/FooterLinks'));
const CmsPages = lazy(() => import('./pages/superadmin/CmsPages'));
const BlogPosts = lazy(() => import('./pages/superadmin/BlogPosts'));
const Plans = lazy(() => import('./pages/superadmin/Plans'));
const Coupons = lazy(() => import('./pages/superadmin/Coupons'));
const Branding = lazy(() => import('./pages/superadmin/Branding'));
const Security = lazy(() => import('./pages/superadmin/Security'));
const EmailSettings = lazy(() => import('./pages/superadmin/EmailSettings'));
const PaymentSettings = lazy(() => import('./pages/superadmin/PaymentSettings'));

const COMPANY_ROLES = ['company_admin', 'manager', 'staff'];

function RouteFallback() {
  return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px' } }} />
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pages/:slug" element={<CmsPageView />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<DocsHome />} />
            <Route path=":slug" element={<DocArticleView />} />
          </Route>
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
        </Suspense>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
