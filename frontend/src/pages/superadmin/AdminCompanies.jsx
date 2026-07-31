import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import { Card, Badge, statusTone, Spinner, Select } from '../../components/ui';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/super-admin/companies');
      setCompanies(data.companies);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try {
      await client.patch(`/super-admin/companies/${id}/status`, { status });
      toast.success('Company status updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Companies</h1>
        <p className="text-sm text-ink/60 mt-0.5">All tenant workspaces on TraceHub Inventory.</p>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-50 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Assets</th>
                  <th className="px-5 py-3 font-medium">Users</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Change status</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-b border-primary-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{c.name}</p>
                      <p className="text-xs text-ink/50">{c.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-ink/70">{c.Subscriptions?.[0]?.SubscriptionPlan?.name || '—'}</td>
                    <td className="px-5 py-3 text-ink/70">{c.assetCount}</td>
                    <td className="px-5 py-3 text-ink/70">{c.userCount}</td>
                    <td className="px-5 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                    <td className="px-5 py-3">
                      <Select value={c.status} onChange={(e) => changeStatus(c.id, e.target.value)} className="!py-1.5 text-xs">
                        <option value="trial">Trial</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
