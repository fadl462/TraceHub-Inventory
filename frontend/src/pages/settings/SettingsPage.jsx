import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Input, Select } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { company, refresh, user } = useAuth();
  const { t } = useTranslation();
  const [companyForm, setCompanyForm] = useState({ name: '', industry: '', currency: 'USD' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: '', fieldType: 'text' });
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  const start2fa = async () => {
    try {
      const { data } = await client.post('/users/me/2fa/setup');
      setQrDataUrl(data.qrDataUrl);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start 2FA setup');
    }
  };
  const verify2fa = async (e) => {
    e.preventDefault();
    try {
      await client.post('/users/me/2fa/verify', { token: twoFaCode });
      toast.success(t('settingsPage.twoFaEnabledToast'));
      setQrDataUrl(null);
      setTwoFaCode('');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid code');
    }
  };
  const disable2fa = async (e) => {
    e.preventDefault();
    try {
      await client.post('/users/me/2fa/disable', { password: disablePassword });
      toast.success(t('settingsPage.twoFaDisabledToast'));
      setDisablePassword('');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to disable 2FA');
    }
  };

  useEffect(() => {
    if (company) setCompanyForm({ name: company.name || '', industry: company.industry || '', currency: company.currency || 'USD' });
    client.get('/custom-fields').then(({ data }) => setFields(data.fields)).catch(() => {});
  }, [company]);

  const saveCompany = async (e) => {
    e.preventDefault();
    try {
      await client.patch('/company/me', companyForm);
      toast.success(t('settingsPage.companyUpdatedToast'));
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await client.post('/users/me/change-password', passwordForm);
      toast.success(t('settingsPage.passwordChangedToast'));
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    }
  };

  const addField = async (e) => {
    e.preventDefault();
    try {
      const { data } = await client.post('/custom-fields', newField);
      setFields((f) => [...f, data.field]);
      setNewField({ label: '', fieldType: 'text' });
      toast.success(t('settingsPage.fieldAddedToast'));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add field');
    }
  };

  const removeField = async (id) => {
    try {
      await client.delete(`/custom-fields/${id}`);
      setFields((f) => f.filter((x) => x.id !== id));
    } catch { toast.error('Failed to remove field'); }
  };

  const isAdmin = user?.role === 'company_admin';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{t('settingsPage.title')}</h1>
        <p className="text-sm text-ink/60 mt-0.5">Manage your workspace preferences.</p>
      </div>

      {isAdmin && (
        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-4">{t('settingsPage.companyProfile')}</h3>
          <form onSubmit={saveCompany} className="space-y-4">
            <Input label={t('settingsPage.companyNameLabel')} value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
            <Input label={t('settingsPage.industry')} value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })} />
            <Select label={t('settingsPage.currency')} value={companyForm.currency} onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}>
              <option value="GHS">GHS - Ghana Cedi</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="NGN">NGN - Nigerian Naira</option>
            </Select>
            <div className="flex justify-end"><Button type="submit">{t('settingsPage.saveChanges')}</Button></div>
          </form>
        </Card>
      )}

      {isAdmin && (
        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-1">{t('settingsPage.customAssetFields')}</h3>
          <p className="text-sm text-ink/60 mb-4">Add fields specific to your business (e.g. "Warranty expiry", "Fuel type").</p>
          <div className="space-y-2 mb-4">
            {fields.map((f) => (
              <div key={f.id} className="flex items-center justify-between text-sm border-b border-primary-50 pb-2">
                <span className="text-ink">{f.label} <span className="text-ink/40 text-xs">({f.fieldType})</span></span>
                <button onClick={() => removeField(f.id)} className="text-ink/40 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            ))}
            {fields.length === 0 && <p className="text-sm text-ink/40">{t('settingsPage.noCustomFieldsYet')}</p>}
          </div>
          <form onSubmit={addField} className="flex gap-2">
            <Input
              className="flex-1"
              placeholder={t('settingsPage.fieldLabelPlaceholder')}
              value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
            <Select
              value={newField.fieldType} onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
            >
              <option value="text">{t('settingsPage.fieldTypeText')}</option>
              <option value="number">{t('settingsPage.fieldTypeNumber')}</option>
              <option value="date">{t('settingsPage.fieldTypeDate')}</option>
              <option value="boolean">{t('settingsPage.fieldTypeBoolean')}</option>
            </Select>
            <Button type="submit"><Plus size={15} /></Button>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold text-ink mb-4">{t('settingsPage.changePassword')}</h3>
        <form onSubmit={changePassword} className="space-y-4 max-w-sm">
          <Input label={t('settingsPage.currentPassword')} type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          <Input label={t('settingsPage.newPassword')} type="password" required minLength={8} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          <Button type="submit">{t('settingsPage.updatePassword')}</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-ink mb-1 flex items-center gap-2">
          {user?.twoFactorEnabled ? <ShieldCheck size={17} className="text-accent-dark" /> : <ShieldOff size={17} className="text-ink/40" />}
          {t('settingsPage.twoFactorAuth')}
        </h3>
        <p className="text-sm text-ink/60 mb-4">
          {user?.twoFactorEnabled
            ? t('settingsPage.twoFaEnabledDesc')
            : t('settingsPage.twoFaDisabledDesc')}
        </p>
        {user?.twoFactorEnabled ? (
          <form onSubmit={disable2fa} className="max-w-sm space-y-3">
            <Input label={t('settingsPage.confirmPasswordToDisable')} type="password" required value={disablePassword} onChange={(e) => setDisablePassword(e.target.value)} />
            <Button type="submit" variant="danger">{t('settingsPage.disable2fa')}</Button>
          </form>
        ) : !qrDataUrl ? (
          <Button onClick={start2fa}><ShieldCheck size={16} /> Enable 2FA</Button>
        ) : (
          <form onSubmit={verify2fa} className="max-w-sm space-y-4">
            <img src={qrDataUrl} alt="2FA QR code" className="rounded-lg border border-primary-100" width={160} height={160} />
            <p className="text-xs text-ink/50">Scan with your authenticator app, then enter the 6-digit code.</p>
            <Input label={t('settingsPage.sixDigitCode')} required maxLength={6} value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)} />
            <Button type="submit">{t('settingsPage.verifyAndEnable')}</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
