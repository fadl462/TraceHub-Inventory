import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './ui';
import SetPasswordScreen from '../pages/SetPasswordScreen';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword) return <SetPasswordScreen />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'super_admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}
