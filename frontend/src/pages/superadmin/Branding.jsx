import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import { Card, Input, Button, Spinner } from '../../components/ui';

export default function Branding() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client.get('/platform-settings/branding').then(({ data }) => setForm(data)).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await client.patch('/platform-settings/branding', form);
      setForm(data);
      toast.success('Branding saved \u2014 reflected across the platform');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save branding');
    } finally { setSaving(false); }
  };

  if (loading || !form) return <div className="flex justify-center py-16"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Branding</h1>
        <p className="text-sm text-ink/60 mt-0.5">How TraceHub looks and feels across the platform.</p>
      </div>

      <Card className="p-6 space-y-4">
        <Input label="App name" value={form.appName || ''} onChange={(e) => setForm({ ...form, appName: e.target.value })} />
        <Input
          label="Light-background logo URL"
          placeholder="https://..."
          value={form.logoLightUrl || ''}
          onChange={(e) => setForm({ ...form, logoLightUrl: e.target.value })}
        />
        <Input
          label="Dark-background logo URL"
          placeholder="https://..."
          value={form.logoDarkUrl || ''}
          onChange={(e) => setForm({ ...form, logoDarkUrl: e.target.value })}
        />
        <Input
          label="Favicon URL"
          placeholder="https://..."
          value={form.faviconUrl || ''}
          onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
        />
        <p className="text-xs text-ink/45">
          Paste a hosted image URL for each. There\u2019s no file upload yet \u2014 upload the image
          somewhere (e.g. your own storage or a CDN) and link to it here.
        </p>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save branding'}</Button>
      </div>
    </div>
  );
}
