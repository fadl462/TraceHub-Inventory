import { useState } from 'react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button } from '../../components/ui';

export default function Security() {
  const { user, refresh: refreshUser } = useAuth();
  const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);

  const [twoFA, setTwoFA] = useState({ qrDataUrl: null, secret: null, code: '' });
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await client.patch('/users/me/profile', profile);
      await refreshUser?.();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally { setSavingProfile(false); }
  };

  const changePassword = async () => {
    if (pw.newPassword !== pw.confirmPassword) return toast.error('New passwords do not match');
    setSavingPw(true);
    try {
      await client.post('/users/me/change-password', { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success('Password changed');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  const start2FASetup = async () => {
    setEnabling2FA(true);
    try {
      const { data } = await client.post('/users/me/2fa/setup');
      setTwoFA({ qrDataUrl: data.qrDataUrl, secret: data.secret, code: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start 2FA setup');
      setEnabling2FA(false);
    }
  };

  const confirm2FA = async () => {
    try {
      await client.post('/users/me/2fa/verify', { token: twoFA.code });
      toast.success('Two-factor authentication enabled');
      setTwoFA({ qrDataUrl: null, secret: null, code: '' });
      setEnabling2FA(false);
      await refreshUser?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid code');
    }
  };

  const disable2FA = async () => {
    try {
      await client.post('/users/me/2fa/disable', { password: disablePassword });
      toast.success('Two-factor authentication disabled');
      setDisablePassword('');
      await refreshUser?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to disable 2FA');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Account &amp; security</h1>
        <p className="text-sm text-ink/60 mt-0.5">Your Super Admin profile and login security.</p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="First name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
          <Input label="Last name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
        </div>
        <Input label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        <Input label="Email" value={user?.email || ''} disabled />
        <div className="flex justify-end">
          <Button onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save profile'}</Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Change password</h2>
        <Input label="Current password" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="New password" type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <Input label="Confirm new password" type="password" value={pw.confirmPassword} onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })} />
        </div>
        <div className="flex justify-end">
          <Button onClick={changePassword} disabled={savingPw || !pw.currentPassword || !pw.newPassword}>
            {savingPw ? 'Saving...' : 'Change password'}
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-ink">Two-factor authentication</h2>
        {user?.twoFactorEnabled ? (
          <>
            <p className="text-sm text-ink/60">2FA is currently <strong className="text-accent-dark">enabled</strong> on your account.</p>
            <Input label="Enter your password to disable 2FA" type="password" value={disablePassword} onChange={(e) => setDisablePassword(e.target.value)} />
            <div className="flex justify-end">
              <Button variant="danger" onClick={disable2FA} disabled={!disablePassword}>Disable 2FA</Button>
            </div>
          </>
        ) : twoFA.qrDataUrl ? (
          <>
            <p className="text-sm text-ink/60">Scan this with Google Authenticator, Microsoft Authenticator, or any TOTP app, then enter the 6-digit code it shows.</p>
            <img src={twoFA.qrDataUrl} alt="2FA QR code" className="w-40 h-40" />
            <p className="text-xs font-mono text-ink/50">Manual entry key: {twoFA.secret}</p>
            <Input label="6-digit code" value={twoFA.code} onChange={(e) => setTwoFA({ ...twoFA, code: e.target.value })} maxLength={6} />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setTwoFA({ qrDataUrl: null, secret: null, code: '' }); setEnabling2FA(false); }}>Cancel</Button>
              <Button onClick={confirm2FA} disabled={twoFA.code.length !== 6}>Confirm &amp; enable</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-ink/60">Add an extra layer of security to your login with an authenticator app.</p>
            <Button onClick={start2FASetup} disabled={enabling2FA}>Set up 2FA</Button>
          </>
        )}
      </Card>
    </div>
  );
}
