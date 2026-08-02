import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import { Card, Input, Button, Spinner, EmptyState, Badge } from '../../components/ui';

const BLANK = { title: '', slug: '', bodyHtml: '', showInNav: false, showInFooter: true, isPublished: true, sortOrder: 0 };

export default function CmsPages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/cms-pages/all');
      setItems(data.pages);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (draft.id) await client.patch(`/cms-pages/${draft.id}`, draft);
      else await client.post('/cms-pages', draft);
      toast.success('Page saved');
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save page');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this page?')) return;
    await client.delete(`/cms-pages/${id}`);
    toast.success('Page deleted');
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Custom pages</h1>
          <p className="text-sm text-ink/60 mt-0.5">
            Support, privacy, or terms pages \u2014 published at /pages/[slug], with no code changes needed.
          </p>
        </div>
        {!draft && <Button onClick={() => setDraft({ ...BLANK, sortOrder: items.length })}><Plus size={16} /> New page</Button>}
      </div>

      {draft && (
        <Card className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <Input
              label="URL slug (optional \u2014 derived from title if left blank)"
              placeholder="privacy-policy"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/80">Page content (HTML)</span>
            <textarea
              className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm text-ink font-mono focus-ring focus:border-secondary"
              rows={8}
              value={draft.bodyHtml || ''}
              onChange={(e) => setDraft({ ...draft, bodyHtml: e.target.value })}
            />
          </label>
          <div className="flex flex-wrap gap-5 text-sm text-ink/70">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.showInNav} onChange={(e) => setDraft({ ...draft, showInNav: e.target.checked })} /> Show in top navigation
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.showInFooter} onChange={(e) => setDraft({ ...draft, showInFooter: e.target.checked })} /> Show in footer
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.isPublished} onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })} /> Published
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !draft.title}>{saving ? 'Saving...' : 'Save page'}</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState title="No custom pages yet" description="Create a privacy policy, terms page, or support page." />
        ) : (
          <div className="divide-y divide-primary-50">
            {items.map((p) => (
              <div key={p.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{p.title}</p>
                  <p className="text-xs text-ink/50">/pages/{p.slug}</p>
                </div>
                {!p.isPublished && <Badge tone="warning">Draft</Badge>}
                <button onClick={() => setDraft({ ...p })} className="text-xs font-medium text-link shrink-0">Edit</button>
                <button onClick={() => remove(p.id)} className="text-ink/40 hover:text-red-600 shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
