import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound, ShieldCheck, Check } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';
import TraceHubMark from '../components/TraceHubMark';

export default function SetPasswordScreen() {
  const { user, refresh, logout } = useAuth();
  const [step, setStep] = useState('password'); // 'password' | 'twofactor' | 'done'
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [verifying2fa, setVerifying2fa] = useState(false);

  const submitPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('New password must be at least 8 characters');
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match");
    setSubmitting(true);
    try {
      await client.post('/users/me/change-password', { currentPassword: tempPassword, newPassword });
      toast.success('Password set');
      setStep('twofactor');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to set password — check your temporary password');
    } finally {
      setSubmitting(false);
    }
  };

  const startTwoFactorSetup = async () => {
    try {
      const { data } = await client.post('/users/me/2fa/setup');
      setQrDataUrl(data.qrDataUrl);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start 2FA setup');
    }
  };

  const verifyTwoFactor = async (e) => {
    e.preventDefault();
    setVerifying2fa(true);
    try {
      await client.post('/users/me/2fa/verify', { token: twoFaCode });
      toast.success('Two-factor authentication enabled');
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid code — try again');
    } finally {
      setVerifying2fa(false);
    }
  };

  const finishWithoutTwoFactor = async () => { await refresh(); };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6"><TraceHubMark size={44} withWordmark /></div>

        {step === 'password' && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <KeyRound size={18} className="text-primary" />
              <h1 className="text-lg font-bold text-ink">Set your own password</h1>
            </div>
            <p className="text-sm text-ink/60 mb-6">
              Hi {user?.firstName}, welcome to {user?.companyId ? 'your workspace' : 'TraceHub'}. For security, you need to
              replace the temporary password you were given before you can use the system.
            </p>
            <form onSubmit={submitPassword} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/80">Temporary password (from your invite email)</span>
                <input
                  type="password" required value={tempPassword} onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/80">New password</span>
                <input
                  type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/80">Confirm new password</span>
                <input
                  type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
                />
              </label>
              <Button type="submit" disabled={submitting} className="w-full justify-center">{submitting ? 'Saving...' : 'Set password & continue'}</Button>
            </form>
            <button onClick={logout} className="w-full text-center text-xs text-ink/40 hover:text-ink/60 mt-4">Not you? Log out</button>
          </>
        )}

        {step === 'twofactor' && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-primary" />
              <h1 className="text-lg font-bold text-ink">Secure your account (recommended)</h1>
            </div>
            <p className="text-sm text-ink/60 mb-6">
              Add two-factor authentication so a password alone isn't enough to sign in as you. Takes under a minute with any
              authenticator app (Google Authenticator, Authy, 1Password, etc.).
            </p>
            {!qrDataUrl ? (
              <div className="space-y-3">
                <Button onClick={startTwoFactorSetup} className="w-full justify-center"><ShieldCheck size={16} /> Enable 2FA now</Button>
                <Button variant="outline" onClick={finishWithoutTwoFactor} className="w-full justify-center">Skip for now</Button>
                <p className="text-xs text-ink/40 text-center">You can turn this on later from Settings.</p>
              </div>
            ) : (
              <form onSubmit={verifyTwoFactor} className="space-y-4">
                <div className="flex justify-center">
                  <img src={qrDataUrl} alt="2FA QR code" className="rounded-lg border border-primary-100" width={180} height={180} />
                </div>
                <p className="text-xs text-ink/50 text-center">Scan this with your authenticator app, then enter the 6-digit code it shows.</p>
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} required
                  placeholder="123456" value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)}
                  className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm text-center tracking-[0.3em] font-mono focus-ring focus:border-secondary"
                />
                <Button type="submit" disabled={verifying2fa} className="w-full justify-center">{verifying2fa ? 'Verifying...' : 'Verify & finish'}</Button>
              </form>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
