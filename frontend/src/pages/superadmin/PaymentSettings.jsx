import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import { Card, Input, Select, Button, Spinner, Badge } from '../../components/ui';

export default function PaymentSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    client.get('/platform-settings/payments').then(({ data }) => setForm({ ...data, flwSecretKey: '', flwEncryptionKey: '' })).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await client.patch('/platform-settings/payments', form);
      toast.success('Payment settings saved');
      const { data } = await client.get('/platform-settings/payments');
      setForm({ ...data, flwSecretKey: '', flwEncryptionKey: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save payment settings');
    } finally { setSaving(false); }
  };

  const runTest = async () => {
    setTesting(true);
    try {
      const { data } = await client.post('/platform-settings/payments/test');
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Test transaction failed');
    } finally { setTesting(false); }
  };

  if (loading || !form) return <div className="flex justify-center py-16"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Payments</h1>
        <p className="text-sm text-ink/60 mt-0.5">Flutterwave powers subscription checkout and renewals.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Select label="Mode" value={form.flwMode} onChange={(e) => setForm({ ...form, flwMode: e.target.value })} className="flex-1">
            <option value="sandbox">Sandbox (testing)</option>
            <option value="live">Live</option>
          </Select>
          <Badge tone={form.flwMode === 'live' ? 'success' : 'warning'}>{form.flwMode === 'live' ? 'LIVE' : 'SANDBOX'}</Badge>
        </div>
        <Input label="Public key" value={form.flwPublicKey || ''} onChange={(e) => setForm({ ...form, flwPublicKey: e.target.value })} />
        <Input
          label={form.hasSecretKey ? `Secret key (currently set: ${form.flwSecretKeyMasked})` : 'Secret key'}
          type="password"
          placeholder={form.hasSecretKey ? 'Leave blank to keep current key' : ''}
          value={form.flwSecretKey}
          onChange={(e) => setForm({ ...form, flwSecretKey: e.target.value })}
        />
        <Input
          label={form.hasEncryptionKey ? 'Encryption key (currently set)' : 'Encryption key'}
          type="password"
          placeholder={form.hasEncryptionKey ? 'Leave blank to keep current key' : ''}
          value={form.flwEncryptionKey}
          onChange={(e) => setForm({ ...form, flwEncryptionKey: e.target.value })}
        />
        <p className="text-xs text-ink/45">
          Keys are encrypted before being stored. Find these in your Flutterwave dashboard under Settings &gt; API Keys.
        </p>
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save payment settings'}</Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Test the connection</h2>
        <p className="text-sm text-ink/60">
          Initiates a real $1 test checkout session against your saved keys \u2014 confirms the API keys are valid without charging anyone
          (nothing completes unless you finish the checkout yourself).
        </p>
        <Button onClick={runTest} disabled={testing} variant="outline">{testing ? 'Testing...' : 'Run test transaction'}</Button>
      </Card>
    </div>
  );
}
