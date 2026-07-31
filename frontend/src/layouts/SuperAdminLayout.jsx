import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Building2, LogOut, FileText, MessageSquareQuote, HelpCircle,
  Link2, Files, CreditCard, Tag, Palette, ShieldCheck, Mail, Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TraceHubMark from '../components/TraceHubMark';

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
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-64 bg-primary-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
          <Link to="/" title="Back to homepage">
            <TraceHubMark size={36} withWordmark tone="white" />
          </Link>
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
                    className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/10 text-white' : 'text-primary-100/80 hover:bg-white/5'}`}
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
            <button onClick={logout} className="text-primary-200/70 hover:text-white"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
