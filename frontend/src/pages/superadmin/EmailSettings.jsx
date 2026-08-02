import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import { Card, Input, Select, Button, Spinner } from '../../components/ui';

export default function EmailSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    client.get('/platform-settings/smtp').then(({ data }) => setForm({ ...data, smtpPassword: '' })).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await client.patch('/platform-settings/smtp', form);
      toast.success('SMTP settings saved');
      const { data } = await client.get('/platform-settings/smtp');
      setForm({ ...data, smtpPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save SMTP settings');
    } finally { setSaving(false); }
  };

  const sendTest = async () => {
    if (!testEmail) return;
    setTesting(true);
    try {
      await client.post('/platform-settings/smtp/test', { toEmail: testEmail });
      toast.success(`Test email sent to ${testEmail}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Test email failed');
    } finally { setTesting(false); }
  };

  if (loading || !form) return <div className="flex justify-center py-16"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Email &amp; SMTP</h1>
        <p className="text-sm text-ink/60 mt-0.5">Powers password resets, assignment reminders, and onboarding emails.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="SMTP host" placeholder="smtp.gmail.com" value={form.smtpHost || ''} onChange={(e) => setForm({ ...form, smtpHost: e.target.value })} />
          <Input label="Port" type="number" placeholder="587" value={form.smtpPort || ''} onChange={(e) => setForm({ ...form, smtpPort: Number(e.target.value) })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Sender email / username" value={form.smtpUser || ''} onChange={(e) => setForm({ ...form, smtpUser: e.target.value })} />
          <Input label="Sender display name" value={form.smtpSenderName || ''} onChange={(e) => setForm({ ...form, smtpSenderName: e.target.value })} />
        </div>
        <Input
          label={form.hasPassword ? `Password (currently set: ${form.smtpPasswordMasked})` : 'Password'}
          type="password"
          placeholder={form.hasPassword ? 'Leave blank to keep current password' : ''}
          value={form.smtpPassword}
          onChange={(e) => setForm({ ...form, smtpPassword: e.target.value })}
        />
        <Select label="Connection security" value={form.smtpSecure ? 'true' : 'false'} onChange={(e) => setForm({ ...form, smtpSecure: e.target.value === 'true' })}>
          <option value="false">STARTTLS (port 587, most common)</option>
          <option value="true">SSL/TLS (port 465)</option>
        </Select>
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save SMTP settings'}</Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Send a test email</h2>
        <div className="flex gap-3">
          <Input placeholder="you@example.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="flex-1" />
          <Button onClick={sendTest} disabled={testing || !testEmail} variant="outline">{testing ? 'Sending...' : 'Send test'}</Button>
        </div>
        <p className="text-xs text-ink/45">Uses whatever SMTP settings are currently saved — save your changes above first if you’ve edited them.</p>
      </Card>
    </div>
  );
}
