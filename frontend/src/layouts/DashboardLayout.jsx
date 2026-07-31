import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Boxes, Users, MapPin, ClipboardList, BarChart3,
  Settings, Bell, LogOut, Menu, X, ScanLine, CreditCard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import TraceHubMark from '../components/TraceHubMark';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['company_admin', 'manager', 'staff'] },
  { to: '/assets', label: 'Assets', icon: Boxes, roles: ['company_admin', 'manager', 'staff'] },
  { to: '/scan', label: 'Scan', icon: ScanLine, roles: ['company_admin', 'manager', 'staff'] },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList, roles: ['company_admin', 'manager', 'staff'] },
  { to: '/locations', label: 'Locations', icon: MapPin, roles: ['company_admin', 'manager'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['company_admin', 'manager'] },
  { to: '/team', label: 'Team', icon: Users, roles: ['company_admin', 'manager'] },
  { to: '/billing', label: 'Billing', icon: CreditCard, roles: ['company_admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['company_admin', 'manager', 'staff'] },
];

export default function DashboardLayout() {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    client.get('/notifications').then(({ data }) => {
      if (active) { setNotifications(data.notifications); setUnreadCount(data.unreadCount); }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const markAllRead = async () => {
    await client.post('/notifications/read-all');
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const items = NAV_ITEMS.filter((i) => !user || i.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static z-30 inset-y-0 left-0 w-64 bg-primary-800 text-white flex flex-col transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <TraceHubMark size={28} withWordmark tone="white" />
          <button className="ml-auto lg:hidden text-white/70" onClick={() => setMobileOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-white/10 text-white' : 'text-primary-100/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-primary-800 text-xs shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="truncate text-xs text-primary-200/70 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button onClick={logout} title="Log out" className="text-primary-200/70 hover:text-white">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-primary-100 flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-10">
          <button className="lg:hidden text-ink/70" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{company?.name}</p>
            {company?.status === 'trial' && <p className="text-xs text-secondary-dark">Free trial active</p>}
          </div>
          <div className="relative">
            <button onClick={() => setNotifOpen((o) => !o)} className="relative text-ink/60 hover:text-ink p-2 rounded-full hover:bg-primary-50">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-lg border border-primary-100 z-20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-primary-50">
                  <span className="text-sm font-semibold">Notifications</span>
                  <button onClick={markAllRead} className="text-xs text-secondary hover:underline">Mark all read</button>
                </div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-ink/50 text-center">No notifications yet</p>
                ) : notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 border-b border-primary-50 last:border-0 ${!n.isRead ? 'bg-primary-50/50' : ''}`}>
                    <p className="text-sm font-medium text-ink">{n.title}</p>
                    <p className="text-xs text-ink/60 mt-0.5">{n.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
