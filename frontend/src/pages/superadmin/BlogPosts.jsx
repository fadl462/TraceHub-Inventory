import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import { Card, Input, Button, Spinner, EmptyState, Badge } from '../../components/ui';

const BLANK = { title: '', slug: '', excerpt: '', bodyHtml: '', coverImageUrl: '', authorName: 'TraceHub Team', isPublished: true };

export default function BlogPosts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/blog-posts/all');
      setItems(data.posts);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (draft.id) await client.patch(`/blog-posts/${draft.id}`, draft);
      else await client.post('/blog-posts', draft);
      toast.success('Post saved');
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save post');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    await client.delete(`/blog-posts/${id}`);
    toast.success('Post deleted');
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Blog / updates</h1>
          <p className="text-sm text-ink/60 mt-0.5">Product news shown at /blog.</p>
        </div>
        {!draft && <Button onClick={() => setDraft({ ...BLANK })}><Plus size={16} /> New post</Button>}
      </div>

      {draft && (
        <Card className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <Input
              label="URL slug (optional — derived from title if left blank)"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            />
          </div>
          <Input label="Excerpt (shown in the list view)" value={draft.excerpt || ''} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink/80">Post content (HTML)</span>
            <textarea
              className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm text-ink font-mono focus-ring focus:border-secondary"
              rows={8}
              value={draft.bodyHtml || ''}
              onChange={(e) => setDraft({ ...draft, bodyHtml: e.target.value })}
            />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Cover image URL (optional)" value={draft.coverImageUrl || ''} onChange={(e) => setDraft({ ...draft, coverImageUrl: e.target.value })} />
            <Input label="Author name" value={draft.authorName || ''} onChange={(e) => setDraft({ ...draft, authorName: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={draft.isPublished} onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })} /> Published
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !draft.title}>{saving ? 'Saving...' : 'Save post'}</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState title="No posts yet" description="Publish your first product update." />
        ) : (
          <div className="divide-y divide-primary-50">
            {items.map((p) => (
              <div key={p.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{p.title}</p>
                  <p className="text-xs text-ink/50">/blog/{p.slug} · {new Date(p.publishedAt).toLocaleDateString()}</p>
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
