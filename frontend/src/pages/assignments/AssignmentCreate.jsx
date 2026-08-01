import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../../api/client';
import { Card, Button, Input, Select } from '../../components/ui';

export default function AssignmentCreate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [assets, setAssets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assigneeType, setAssigneeType] = useState('staff');
  const [isHire, setIsHire] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    assetId: params.get('assetId') || '', assignedToUserId: '', externalAssigneeName: '',
    externalAssigneeEmail: '', externalAssigneePhone: '', expectedReturnDate: '', purpose: '', notes: '',
    hireFeeAmount: '', hireFeeCurrency: 'USD',
  });

  useEffect(() => {
    client.get('/assets', { params: { status: 'available', pageSize: 100 } }).then(({ data }) => setAssets(data.assets));
    client.get('/users').then(({ data }) => setStaff(data.users));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (assigneeType === 'staff') {
        delete payload.externalAssigneeName; delete payload.externalAssigneeEmail; delete payload.externalAssigneePhone;
      } else {
        delete payload.assignedToUserId;
      }
      if (!isHire) { delete payload.hireFeeAmount; delete payload.hireFeeCurrency; }
      await client.post('/assignments', payload);
      toast.success('Asset assigned successfully');
      navigate('/assignments');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">New assignment</h1>
        <p className="text-sm text-ink/60 mt-0.5">Assign an available asset to a staff member or an outside party.</p>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="p-6 space-y-5">
          <Select label="Asset *" required value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}>
            <option value="">Select an available asset</option>
            {assets.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>)}
          </Select>

          <div className="flex gap-2">
            <button type="button" onClick={() => setAssigneeType('staff')} className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium ${assigneeType === 'staff' ? 'border-primary bg-primary-50 text-primary' : 'border-primary-100 text-ink/60'}`}>Staff member</button>
            <button type="button" onClick={() => setAssigneeType('external')} className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium ${assigneeType === 'external' ? 'border-primary bg-primary-50 text-primary' : 'border-primary-100 text-ink/60'}`}>Outsider</button>
          </div>

          {assigneeType === 'staff' ? (
            <Select label="Staff member *" required value={form.assignedToUserId} onChange={(e) => setForm({ ...form, assignedToUserId: e.target.value })}>
              <option value="">Select staff member</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.role})</option>)}
            </Select>
          ) : (
            <div className="space-y-4">
              <Input label="Full name *" required value={form.externalAssigneeName} onChange={(e) => setForm({ ...form, externalAssigneeName: e.target.value })} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Email" type="email" value={form.externalAssigneeEmail} onChange={(e) => setForm({ ...form, externalAssigneeEmail: e.target.value })} />
                <Input label="Phone" value={form.externalAssigneePhone} onChange={(e) => setForm({ ...form, externalAssigneePhone: e.target.value })} />
              </div>
            </div>
          )}

          <Input label="Expected return date" type="date" value={form.expectedReturnDate} onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })} />
          <Input label="Purpose" placeholder="e.g. Field survey work, equipment hire" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />

          <div className="rounded-lg border border-primary-100 p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={isHire} onChange={(e) => setIsHire(e.target.checked)} />
              This is a paid hire \u2014 track a fee and payment status
            </label>
            {isHire && (
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Hire fee amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.hireFeeAmount}
                  onChange={(e) => setForm({ ...form, hireFeeAmount: e.target.value })}
                />
                <Select label="Currency" value={form.hireFeeCurrency} onChange={(e) => setForm({ ...form, hireFeeCurrency: e.target.value })}>
                  <option value="USD">USD</option>
                  <option value="GHS">GHS</option>
                  <option value="EUR">EUR</option>
                  <option value="NGN">NGN</option>
                </Select>
              </div>
            )}
          </div>

          <p className="text-xs text-ink/50">Reminders will be sent automatically 3 days before and on the day of the expected return date, to the borrower and to company admins.</p>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Assigning...' : 'Assign asset'}</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
