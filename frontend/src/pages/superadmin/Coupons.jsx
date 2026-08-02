import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import { Card, Input, Select, Button, Spinner, Badge, EmptyState } from '../../components/ui';

const BLANK = { code: '', name: '', discountType: 'percentage', discountValue: 10, usageLimit: '', isActive: true };

export default function Coupons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/coupons');
      setItems(data.coupons);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...draft, usageLimit: draft.usageLimit === '' ? null : Number(draft.usageLimit) };
      if (draft.id) await client.patch(`/coupons/${draft.id}`, payload);
      else await client.post('/coupons', payload);
      toast.success('Coupon saved');
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save coupon');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await client.delete(`/coupons/${id}`);
    toast.success('Coupon deleted');
    load();
  };

  const previewDiscount = (c) => (c.discountType === 'percentage' ? `${c.discountValue}% off` : `$${c.discountValue} off`);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Coupons</h1>
          <p className="text-sm text-ink/60 mt-0.5">Discount codes for seasonal offers, partner deals, or onboarding campaigns.</p>
        </div>
        {!draft && <Button onClick={() => setDraft({ ...BLANK })}><Plus size={16} /> New coupon</Button>}
      </div>

      {draft && (
        <Card className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Coupon code"
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
              disabled={!!draft.id}
            />
            <Input label="Internal name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Select label="Discount type" value={draft.discountType} onChange={(e) => setDraft({ ...draft, discountType: e.target.value })}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </Select>
            <Input
              label={draft.discountType === 'percentage' ? 'Discount (%)' : 'Discount ($)'}
              type="number"
              value={draft.discountValue}
              onChange={(e) => setDraft({ ...draft, discountValue: Number(e.target.value) })}
            />
            <Input
              label="Usage limit (blank = unlimited)"
              type="number"
              value={draft.usageLimit}
              onChange={(e) => setDraft({ ...draft, usageLimit: e.target.value })}
            />
          </div>
          <p className="text-xs text-ink/50">
            Preview: a $49 plan with this coupon becomes{' '}
            <strong className="text-ink">
              ${draft.discountType === 'percentage'
                ? (49 - 49 * (draft.discountValue / 100)).toFixed(2)
                : Math.max(0, 49 - draft.discountValue).toFixed(2)}
            </strong>
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !draft.code || !draft.name}>{saving ? 'Saving...' : 'Save coupon'}</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState title="No coupons yet" description="Create a discount code for a promotion or partner deal." />
        ) : (
          <div className="divide-y divide-primary-50">
            {items.map((c) => (
              <div key={c.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-semibold text-ink">{c.code}</p>
                  <p className="text-xs text-ink/50">{c.name} — {previewDiscount(c)} · used {c.timesUsed}{c.usageLimit ? `/${c.usageLimit}` : ''} times</p>
                </div>
                <Badge tone={c.isActive ? 'success' : 'default'}>{c.isActive ? 'Active' : 'Inactive'}</Badge>
                <button onClick={() => setDraft({ ...c, usageLimit: c.usageLimit ?? '' })} className="text-xs font-medium text-link shrink-0">Edit</button>
                <button onClick={() => remove(c.id)} className="text-ink/40 hover:text-red-600 shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
