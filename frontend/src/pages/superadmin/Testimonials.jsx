import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import client from '../../api/client';
import { Card, Input, Button, Spinner, EmptyState } from '../../components/ui';

const BLANK = { quote: '', authorName: '', authorRole: '', companyName: '', isPublished: true, sortOrder: 0 };

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/testimonials/all');
      setItems(data.testimonials);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const startNew = () => setDraft({ ...BLANK, sortOrder: items.length });
  const startEdit = (t) => setDraft({ ...t });

  const save = async () => {
    setSaving(true);
    try {
      if (draft.id) {
        await client.patch(`/testimonials/${draft.id}`, draft);
      } else {
        await client.post('/testimonials', draft);
      }
      toast.success('Testimonial saved');
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save testimonial');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await client.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const togglePublished = async (t) => {
    await client.patch(`/testimonials/${t.id}`, { isPublished: !t.isPublished });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Testimonials</h1>
          <p className="text-sm text-ink/60 mt-0.5">Shown on the homepage as social proof.</p>
        </div>
        {!draft && <Button onClick={startNew}><Plus size={16} /> New testimonial</Button>}
      </div>

      {draft && (
        <Card className="p-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/80">Quote</span>
            <textarea
              className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm text-ink focus-ring focus:border-secondary"
              rows={3}
              value={draft.quote}
              onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
            />
          </label>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Author name" value={draft.authorName} onChange={(e) => setDraft({ ...draft, authorName: e.target.value })} />
            <Input label="Role (optional)" value={draft.authorRole || ''} onChange={(e) => setDraft({ ...draft, authorRole: e.target.value })} />
            <Input label="Company (optional)" value={draft.companyName || ''} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !draft.quote || !draft.authorName}>{saving ? 'Saving...' : 'Save testimonial'}</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState title="No testimonials yet" description="Add your first customer quote to show it on the homepage." />
        ) : (
          <div className="divide-y divide-primary-50">
            {items.map((t) => (
              <div key={t.id} className="p-5 flex items-start gap-4">
                <GripVertical size={16} className="text-ink/20 mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink/80 italic">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-xs text-ink/50 mt-1.5">
                    {t.authorName}{t.authorRole ? `, ${t.authorRole}` : ''}{t.companyName ? ` \u2014 ${t.companyName}` : ''}
                  </p>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-ink/60 shrink-0">
                  <input type="checkbox" checked={t.isPublished} onChange={() => togglePublished(t)} /> Published
                </label>
                <button onClick={() => startEdit(t)} className="text-xs font-medium text-primary shrink-0">Edit</button>
                <button onClick={() => remove(t.id)} className="text-ink/40 hover:text-red-600 shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
