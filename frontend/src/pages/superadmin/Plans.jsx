import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import client from '../../api/client';
import { Card, Input, Button, Spinner, Badge, EmptyState } from '../../components/ui';

const BLANK = {
  name: '', code: '', description: '', assetLimit: 100, userLimit: 5,
  priceMonthly: 0, priceAnnual: 0, currency: 'USD', isActive: true, sortOrder: 0,
};

export default function Plans() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/plans');
      setItems(data.plans);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (draft.id) await client.patch(`/plans/${draft.id}`, draft);
      else await client.post('/plans', draft);
      toast.success('Plan saved');
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save plan');
    } finally { setSaving(false); }
  };

  const deactivate = async (id) => {
    if (!confirm('Deactivate this plan? Existing subscribers keep it, but it won’t be offered to new sign-ups.')) return;
    await client.delete(`/plans/${id}`);
    toast.success('Plan deactivated');
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Subscription plans</h1>
          <p className="text-sm text-ink/60 mt-0.5">Manage every tier from Free Trial to Enterprise.</p>
        </div>
        {!draft && <Button onClick={() => setDraft({ ...BLANK, sortOrder: items.length })}><Plus size={16} /> New plan</Button>}
      </div>

      {draft && (
        <Card className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Plan name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <Input
              label="Code (unique, no spaces)"
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              disabled={!!draft.id}
            />
          </div>
          <Input label="Short description" value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <div className="grid sm:grid-cols-4 gap-4">
            <Input label="Price / month" type="number" value={draft.priceMonthly} onChange={(e) => setDraft({ ...draft, priceMonthly: Number(e.target.value) })} />
            <Input label="Price / year" type="number" value={draft.priceAnnual} onChange={(e) => setDraft({ ...draft, priceAnnual: Number(e.target.value) })} />
            <Input label="Asset limit (-1 = unlimited)" type="number" value={draft.assetLimit} onChange={(e) => setDraft({ ...draft, assetLimit: Number(e.target.value) })} />
            <Input label="User limit (-1 = unlimited)" type="number" value={draft.userLimit} onChange={(e) => setDraft({ ...draft, userLimit: Number(e.target.value) })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !draft.name || !draft.code}>{saving ? 'Saving...' : 'Save plan'}</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState title="No plans configured" description="Create your first subscription tier." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-50 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Assets</th>
                  <th className="px-5 py-3 font-medium">Users</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-primary-50 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-ink/50">{p.description}</p>
                    </td>
                    <td className="px-5 py-3 text-ink/70">${p.priceMonthly}/mo</td>
                    <td className="px-5 py-3 text-ink/70">{p.assetLimit === -1 ? 'Unlimited' : p.assetLimit}</td>
                    <td className="px-5 py-3 text-ink/70">{p.userLimit === -1 ? 'Unlimited' : p.userLimit}</td>
                    <td className="px-5 py-3"><Badge tone={p.isActive ? 'success' : 'default'}>{p.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-5 py-3 text-right space-x-3">
                      <button onClick={() => setDraft({ ...p })} className="text-xs font-medium text-link">Edit</button>
                      {p.isActive && <button onClick={() => deactivate(p.id)} className="text-xs font-medium text-red-600">Deactivate</button>}
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
