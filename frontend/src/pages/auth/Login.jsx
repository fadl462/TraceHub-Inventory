import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.firstName}`);
      const returnTo = searchParams.get('returnTo');
      if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
        navigate(returnTo);
      } else {
        navigate(user.role === 'super_admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label={t('auth.emailLabel')} type="email" required autoFocus
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label={t('auth.passwordLabel')} type="password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-secondary hover:underline">{t('auth.forgotPassword')}</Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? `${t('common.loading')}` : t('auth.loginButton')}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        {t('auth.newToTraceHub')} <Link to="/register" className="font-semibold text-primary hover:underline">{t('auth.createWorkspace')}</Link>
      </p>
    </AuthLayout>
  );
}
