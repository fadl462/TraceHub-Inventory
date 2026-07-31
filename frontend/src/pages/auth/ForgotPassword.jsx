import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { Button, Input } from '../../components/ui';
import client from '../../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to reset it">
      {sent ? (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your inbox.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Email address" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-ink/60">
        <Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
