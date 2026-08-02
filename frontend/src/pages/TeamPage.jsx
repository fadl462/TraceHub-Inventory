import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Users, Trash2, Phone, Mail, Clock, ShieldCheck, ShieldOff, CalendarDays, KeyRound } from 'lucide-react';
import client from '../api/client';
import { Card, Button, Input, Select, Badge, EmptyState, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

export default function TeamPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'staff' });
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/users');
      setUsers(data.users);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (statusFilter === 'active' && !u.isActive) return false;
    if (statusFilter === 'disabled' && u.isActive) return false;
    if (statusFilter === 'pending' && !u.mustChangePassword) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!`${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/users', form);
      toast.success('Team member added. A temporary password was emailed to them.');
      setForm({ firstName: '', lastName: '', email: '', role: 'staff' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add team member');
    }
  };

  const removeUser = async (id) => {
    if (!confirm('Remove this team member?')) return;
    try {
      await client.delete(`/users/${id}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove');
    }
  };

  const toggleActive = async (u) => {
    try {
      await client.patch(`/users/${u.id}`, { isActive: !u.isActive });
      load();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Team</h1>
          <p className="text-sm text-ink/60 mt-0.5">Manage staff access and permissions.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}><Plus size={16} /> Add team member</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <Input label="First name *" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Last name *" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <Input label="Email *" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </Select>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Send invite</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <input
            className="flex-1 min-w-[200px] rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
            placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="sm:w-48">
            <option value="">All roles</option>
            <option value="company_admin">Company admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-48">
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
            <option value="pending">Pending first login</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState icon={Users} title="No team members match these filters" />
        ) : (
          <div className="divide-y divide-primary-50">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink flex items-center gap-2 flex-wrap">
                    {u.firstName} {u.lastName} {u.id === me.id && <span className="text-xs text-ink/40">(you)</span>}
                    {u.mustChangePassword && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <KeyRound size={11} /> Pending first login
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-ink/50">
                    <span className="flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                    {u.phone && <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>}
                    <span className="flex items-center gap-1"><Clock size={11} /> Last login: {timeAgo(u.lastLoginAt)}</span>
                    <span className="flex items-center gap-1"><CalendarDays size={11} /> Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    <span className={`flex items-center gap-1 ${u.twoFactorEnabled ? 'text-accent-dark' : ''}`}>
                      {u.twoFactorEnabled ? <ShieldCheck size={11} /> : <ShieldOff size={11} />} 2FA {u.twoFactorEnabled ? 'on' : 'off'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={u.role === 'company_admin' ? 'info' : 'default'}>{u.role.replace('_', ' ')}</Badge>
                  <Badge tone={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Disabled'}</Badge>
                  {u.id !== me.id && (
                    <>
                      <button onClick={() => toggleActive(u)} className="text-xs text-secondary hover:underline">{u.isActive ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => removeUser(u.id)} className="text-ink/40 hover:text-red-600"><Trash2 size={15} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
