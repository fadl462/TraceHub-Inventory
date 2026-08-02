import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import { Card, Input, Button, Spinner } from '../../components/ui';

export default function ContentEditor() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client.get('/site-content').then(({ data }) => setForm(data.content)).finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await client.patch('/site-content', form);
      setForm(data.content);
      toast.success('Homepage content saved');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading || !form) return <div className="flex justify-center py-16"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Homepage &amp; login content</h1>
        <p className="text-sm text-ink/60 mt-0.5">
          Edit the copy shown on the public landing page and login screen — no code changes needed.
          Changes go live immediately after saving.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Hero section</h2>
        <Input label="Eyebrow label" value={form.heroEyebrow || ''} onChange={set('heroEyebrow')} />
        <Input label="Main headline" value={form.heroHeadline || ''} onChange={set('heroHeadline')} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Subheadline</span>
          <textarea
            className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm text-ink focus-ring focus:border-secondary"
            rows={3}
            value={form.heroSubheadline || ''}
            onChange={set('heroSubheadline')}
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Primary CTA text" value={form.heroCtaText || ''} onChange={set('heroCtaText')} />
          <Input label="Primary CTA link" value={form.heroCtaLink || ''} onChange={set('heroCtaLink')} />
        </div>
        <Input label="Secondary CTA text" value={form.heroSecondaryCtaText || ''} onChange={set('heroSecondaryCtaText')} />
        <Input
          label="Hero image URL (optional)"
          placeholder="https://..."
          value={form.heroImageUrl || ''}
          onChange={set('heroImageUrl')}
        />
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Login &amp; register pages</h2>
        <Input label="Tagline" value={form.loginTagline || ''} onChange={set('loginTagline')} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Highlight 1" value={form.loginHighlight1 || ''} onChange={set('loginHighlight1')} />
          <Input label="Highlight 2" value={form.loginHighlight2 || ''} onChange={set('loginHighlight2')} />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Footer</h2>
        <Input label="Description line" value={form.footerDescription || ''} onChange={set('footerDescription')} />
        <Input label="Copyright statement" value={form.footerCopyright || ''} onChange={set('footerCopyright')} />
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
      </div>
    </div>
  );
}
