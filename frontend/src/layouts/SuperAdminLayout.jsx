import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TraceHubMark from '../components/TraceHubMark';

export default function SuperAdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-64 bg-primary-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <TraceHubMark size={28} withWordmark tone="white" />
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/10 text-white' : 'text-primary-100/80 hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Platform overview
          </NavLink>
          <NavLink to="/admin/companies" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/10 text-white' : 'text-primary-100/80 hover:bg-white/5'}`}>
            <Building2 size={18} /> Companies
          </NavLink>
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-primary-200/70">Super Admin</p>
            </div>
            <button onClick={logout} className="text-primary-200/70 hover:text-white"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
