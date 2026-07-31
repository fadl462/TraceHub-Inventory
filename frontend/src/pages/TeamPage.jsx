import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Users, Trash2 } from 'lucide-react';
import client from '../api/client';
import { Card, Button, Input, Select, Badge, EmptyState, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function TeamPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'staff' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/users');
      setUsers(data.users);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

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

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No team members yet" />
        ) : (
          <div className="divide-y divide-primary-50">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-ink">{u.firstName} {u.lastName} {u.id === me.id && <span className="text-xs text-ink/40">(you)</span>}</p>
                  <p className="text-xs text-ink/50">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
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
