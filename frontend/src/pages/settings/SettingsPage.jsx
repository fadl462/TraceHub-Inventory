import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Input, Select } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { company, refresh, user } = useAuth();
  const [companyForm, setCompanyForm] = useState({ name: '', industry: '', currency: 'USD' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: '', fieldType: 'text' });

  useEffect(() => {
    if (company) setCompanyForm({ name: company.name || '', industry: company.industry || '', currency: company.currency || 'USD' });
    client.get('/custom-fields').then(({ data }) => setFields(data.fields)).catch(() => {});
  }, [company]);

  const saveCompany = async (e) => {
    e.preventDefault();
    try {
      await client.patch('/company/me', companyForm);
      toast.success('Company settings updated');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await client.post('/users/me/change-password', passwordForm);
      toast.success('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    }
  };

  const addField = async (e) => {
    e.preventDefault();
    try {
      const { data } = await client.post('/custom-fields', newField);
      setFields((f) => [...f, data.field]);
      setNewField({ label: '', fieldType: 'text' });
      toast.success('Custom field added');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add field');
    }
  };

  const removeField = async (id) => {
    try {
      await client.delete(`/custom-fields/${id}`);
      setFields((f) => f.filter((x) => x.id !== id));
    } catch { toast.error('Failed to remove field'); }
  };

  const isAdmin = user?.role === 'company_admin';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-ink/60 mt-0.5">Manage your workspace preferences.</p>
      </div>

      {isAdmin && (
        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-4">Company profile</h3>
          <form onSubmit={saveCompany} className="space-y-4">
            <Input label="Company name" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
            <Input label="Industry" value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })} />
            <Select label="Currency" value={companyForm.currency} onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}>
              <option value="GHS">GHS - Ghana Cedi</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="NGN">NGN - Nigerian Naira</option>
            </Select>
            <div className="flex justify-end"><Button type="submit">Save changes</Button></div>
          </form>
        </Card>
      )}

      {isAdmin && (
        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-1">Custom asset fields</h3>
          <p className="text-sm text-ink/60 mb-4">Add fields specific to your business (e.g. "Warranty expiry", "Fuel type").</p>
          <div className="space-y-2 mb-4">
            {fields.map((f) => (
              <div key={f.id} className="flex items-center justify-between text-sm border-b border-primary-50 pb-2">
                <span className="text-ink">{f.label} <span className="text-ink/40 text-xs">({f.fieldType})</span></span>
                <button onClick={() => removeField(f.id)} className="text-ink/40 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            ))}
            {fields.length === 0 && <p className="text-sm text-ink/40">No custom fields yet.</p>}
          </div>
          <form onSubmit={addField} className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Field label (e.g. Warranty Expiry)"
              value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
            <Select
              value={newField.fieldType} onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Yes/No</option>
            </Select>
            <Button type="submit"><Plus size={15} /></Button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold text-ink mb-4">Change password</h3>
        <form onSubmit={changePassword} className="space-y-4 max-w-sm">
          <Input label="Current password" type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          <Input label="New password" type="password" required minLength={8} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          <Button type="submit">Update password</Button>
        </form>
      </Card>
    </div>
  );
}
