import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast.success(t('team.addedSuccess'));
      setForm({ firstName: '', lastName: '', email: '', role: 'staff' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add team member');
    }
  };

  const removeUser = async (id) => {
    if (!confirm(t('team.removeConfirm'))) return;
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
          <h1 className="text-xl font-bold text-ink">{t('team.title')}</h1>
          <p className="text-sm text-ink/60 mt-0.5">Manage staff access and permissions.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}><Plus size={16} /> {t('team.addTeamMember')}</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <Input label={t('team.firstNameLabel')} required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label={t('team.lastNameLabel')} required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <Input label={t('team.emailLabel')} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Select label={t('team.roleLabel')} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="staff">{t('team.roleStaff')}</option>
              <option value="manager">{t('team.roleManager')}</option>
            </Select>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
              <Button type="submit">{t('team.sendInvite')}</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <input
            className="flex-1 min-w-[200px] rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
            placeholder={t('team.searchPlaceholder')}
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="sm:w-48">
            <option value="">{t('team.allRoles')}</option>
            <option value="company_admin">{t('team.roleCompanyAdmin')}</option>
            <option value="manager">{t('team.roleManager')}</option>
            <option value="staff">{t('team.roleStaff')}</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-48">
            <option value="">{t('team.allStatuses')}</option>
            <option value="active">{t('team.statusActive')}</option>
            <option value="disabled">{t('team.statusDisabled')}</option>
            <option value="pending">{t('team.statusPending')}</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState icon={Users} title={t('team.noMembersMatch')} />
        ) : (
          <div className="divide-y divide-primary-50">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink flex items-center gap-2 flex-wrap">
                    {u.firstName} {u.lastName} {u.id === me.id && <span className="text-xs text-ink/40">(you)</span>}
                    {u.mustChangePassword && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <KeyRound size={11} /> {t('team.pendingFirstLoginBadge')}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-ink/50">
                    <span className="flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                    {u.phone && <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>}
                    <span className="flex items-center gap-1"><Clock size={11} /> {t('team.lastLogin')}: {timeAgo(u.lastLoginAt)}</span>
                    <span className="flex items-center gap-1"><CalendarDays size={11} /> Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    <span className={`flex items-center gap-1 ${u.twoFactorEnabled ? 'text-accent-dark' : ''}`}>
                      {u.twoFactorEnabled ? <ShieldCheck size={11} /> : <ShieldOff size={11} />} {u.twoFactorEnabled ? t('team.twoFaOn') : t('team.twoFaOff')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={u.role === 'company_admin' ? 'info' : 'default'}>
                    {u.role === 'company_admin' ? t('team.roleCompanyAdmin') : u.role === 'manager' ? t('team.roleManager') : t('team.roleStaff')}
                  </Badge>
                  <Badge tone={u.isActive ? 'success' : 'danger'}>{u.isActive ? t('team.statusActive') : t('team.statusDisabled')}</Badge>
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
