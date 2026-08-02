import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import { Card, Input, Select, Button, Spinner, EmptyState } from '../../components/ui';

const BLANK = { label: '', url: '', group: 'nav', isPublished: true, sortOrder: 0 };
const GROUP_LABELS = { nav: 'Navigation', legal: 'Legal', social: 'Social media' };

export default function FooterLinks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/footer-links/all');
      setItems(data.links);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (draft.id) await client.patch(`/footer-links/${draft.id}`, draft);
      else await client.post('/footer-links', draft);
      toast.success('Footer link saved');
      setDraft(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save link');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this footer link?')) return;
    await client.delete(`/footer-links/${id}`);
    toast.success('Link deleted');
    load();
  };

  const grouped = items.reduce((acc, l) => {
    (acc[l.group] = acc[l.group] || []).push(l);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Footer links</h1>
          <p className="text-sm text-ink/60 mt-0.5">Navigation, legal, and social links shown in the homepage footer.</p>
        </div>
        {!draft && <Button onClick={() => setDraft({ ...BLANK, sortOrder: items.length })}><Plus size={16} /> New link</Button>}
      </div>

      {draft && (
        <Card className="p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Label" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
            <Input label="URL" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
            <Select label="Group" value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })}>
              <option value="nav">Navigation</option>
              <option value="legal">Legal</option>
              <option value="social">Social media</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !draft.label || !draft.url}>{saving ? 'Saving...' : 'Save link'}</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : items.length === 0 ? (
        <Card><EmptyState title="No footer links yet" description="Add navigation, legal, or social links." /></Card>
      ) : (
        Object.entries(grouped).map(([group, links]) => (
          <Card key={group} className="overflow-hidden">
            <div className="px-5 py-3 border-b border-primary-50 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {GROUP_LABELS[group] || group}
            </div>
            <div className="divide-y divide-primary-50">
              {links.map((l) => (
                <div key={l.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{l.label}</p>
                    <p className="text-xs text-ink/50 truncate">{l.url}</p>
                  </div>
                  <button onClick={() => setDraft({ ...l })} className="text-xs font-medium text-link shrink-0">Edit</button>
                  <button onClick={() => remove(l.id)} className="text-ink/40 hover:text-red-600 shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
