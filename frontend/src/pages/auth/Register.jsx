import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { Button, Input, Select } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '', accountType: 'company', firstName: '', lastName: '', email: '', phone: '', password: '',
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Workspace created! Your 30-day free trial (10 assets) has started.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your workspace" subtitle="First 10 assets are free for 30 days &mdash; no card required">
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label="Account type" value={form.accountType}
          onChange={(e) => setForm({ ...form, accountType: e.target.value })}
        >
          <option value="company">Company / Organization</option>
          <option value="individual">Individual</option>
        </Select>
        <Input
          label={form.accountType === 'individual' ? 'Your name / workspace label' : 'Company name'}
          required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <Input label="Email address" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input
          label="Password" type="password" required minLength={8}
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating workspace...' : 'Start free trial'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}
