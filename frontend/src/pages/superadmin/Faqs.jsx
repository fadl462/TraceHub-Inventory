import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import { Card, Input, Button, Spinner, EmptyState } from '../../components/ui';

const BLANK = { question: '', answer: '', isPublished: true, sortOrder: 0 };

export default function Faqs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/faqs/all');
      setItems(data.faqs);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const startNew = () => setDraft({ ...BLANK, sortOrder: items.length });

  const save = async () => {
    setSaving(true);
    try {
      if (draft.id) await client.patch(`/faqs/${draft.id}`, draft);
      else await client.post('/faqs', draft);
      toast.success('FAQ saved');
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save FAQ');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this FAQ entry?')) return;
    await client.delete(`/faqs/${id}`);
    toast.success('FAQ deleted');
    load();
  };

  const togglePublished = async (f) => {
    await client.patch(`/faqs/${f.id}`, { isPublished: !f.isPublished });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">FAQ</h1>
          <p className="text-sm text-ink/60 mt-0.5">Frequently asked questions shown on the homepage.</p>
        </div>
        {!draft && <Button onClick={startNew}><Plus size={16} /> New FAQ</Button>}
      </div>

      {draft && (
        <Card className="p-6 space-y-4">
          <Input label="Question" value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/80">Answer</span>
            <textarea
              className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm text-ink focus-ring focus:border-secondary"
              rows={4}
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !draft.question || !draft.answer}>{saving ? 'Saving...' : 'Save FAQ'}</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState title="No FAQ entries yet" description="Add your first question and answer." />
        ) : (
          <div className="divide-y divide-primary-50">
            {items.map((f) => (
              <div key={f.id} className="p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{f.question}</p>
                  <p className="text-xs text-ink/60 mt-1 line-clamp-2">{f.answer}</p>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-ink/60 shrink-0">
                  <input type="checkbox" checked={f.isPublished} onChange={() => togglePublished(f)} /> Published
                </label>
                <button onClick={() => setDraft({ ...f })} className="text-xs font-medium text-link shrink-0">Edit</button>
                <button onClick={() => remove(f.id)} className="text-ink/40 hover:text-red-600 shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
