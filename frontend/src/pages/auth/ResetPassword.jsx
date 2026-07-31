import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { Button, Input } from '../../components/ui';
import client from '../../api/client';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/auth/reset-password', {
        uid: params.get('uid'), token: params.get('token'), newPassword,
      });
      toast.success('Password reset. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password for your account">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="New password" type="password" required minLength={8} autoFocus
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        <Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
