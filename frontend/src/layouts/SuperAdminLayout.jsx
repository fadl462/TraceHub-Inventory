import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Building2, LogOut, FileText, MessageSquareQuote, HelpCircle,
  Link2, Files, CreditCard, Tag, Palette, ShieldCheck, Mail, Wallet, Newspaper, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TraceHubMark from '../components/TraceHubMark';
import { useScrollToTop } from '../hooks/useScrollToTop';
import AiChatWidget from '../components/AiChatWidget';
import GlobalSearchBar from '../components/superadmin/GlobalSearchBar';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

const NAV_GROUPS = [
  {
    label: 'Platform',
    items: [
      { to: '/admin', end: true, icon: LayoutDashboard, label: 'Platform overview' },
      { to: '/admin/companies', icon: Building2, label: 'Companies' },
    ],
  },
  {
    label: 'Homepage content',
    items: [
      { to: '/admin/content', icon: FileText, label: 'Hero & login copy' },
      { to: '/admin/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
      { to: '/admin/faqs', icon: HelpCircle, label: 'FAQ' },
      { to: '/admin/footer-links', icon: Link2, label: 'Footer links' },
      { to: '/admin/pages', icon: Files, label: 'Custom pages' },
      { to: '/admin/blog', icon: Newspaper, label: 'Blog / updates' },
    ],
  },
  {
    label: 'Monetization',
    items: [
      { to: '/admin/plans', icon: CreditCard, label: 'Plans' },
      { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/branding', icon: Palette, label: 'Branding' },
      { to: '/admin/security', icon: ShieldCheck, label: 'Account & security' },
      { to: '/admin/email', icon: Mail, label: 'Email / SMTP' },
      { to: '/admin/payments', icon: Wallet, label: 'Payments' },
    ],
  },
];

export default function SuperAdminLayout() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const mainRef = useScrollToTop();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="th-app-shell h-screen flex" data-theme={theme}>
      <aside className={`fixed lg:static z-30 inset-y-0 left-0 w-64 bg-primary-900 text-white flex flex-col transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
          <Link to="/" title="Back to homepage">
            <TraceHubMark size={36} withWordmark tone="white" />
          </Link>
          <button className="ml-auto lg:hidden text-white/70" onClick={() => setMobileOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-200/50">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(({ to, end, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/10 text-white' : 'text-[#D1E1F3]/80 hover:bg-white/5'}`}
                  >
                    <Icon size={17} /> {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-primary-200/70">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <main ref={mainRef} className="flex-1 flex flex-col overflow-y-auto min-w-0">
        <div
          className="sticky top-0 z-30 backdrop-blur border-b px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4"
          style={{ background: 'rgb(var(--th-page-bg) / 0.9)', borderColor: 'rgb(var(--th-border) / 0.5)' }}
        >
          <button className="lg:hidden text-ink/70 shrink-0" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
          <GlobalSearchBar />
          <div className="ml-auto"><ThemeSwitcher /></div>
          <button onClick={logout} title="Log out" aria-label="Log out" className="text-ink/60 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
            <LogOut size={19} />
          </button>
        </div>
        <div className="flex-1 p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
      <AiChatWidget />
    </div>
  );
}
