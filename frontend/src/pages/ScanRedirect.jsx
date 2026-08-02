import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui';

/**
 * This is the actual URL encoded into every printed/displayed asset QR code
 * (see backend/src/utils/qrTag.js: `${CLIENT_URL}/scan/${qrToken}`). Scanning
 * the tag with an ordinary phone camera app opens this URL directly - it was
 * previously unrouted entirely, so real-world scanning silently bounced to
 * the marketing homepage with the token discarded.
 *
 * Not logged in -> send to login, remembering where to come back to.
 * Logged in -> hand off to the in-app scanner pre-loaded with this token.
 */
export default function ScanRedirect() {
  const { token } = useParams();
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
  if (!user) return <Navigate to={`/login?returnTo=${encodeURIComponent(`/scan/${token}`)}`} replace />;
  if (user.role === 'super_admin') return <Navigate to="/admin" replace />;
  return <Navigate to={`/scan?token=${encodeURIComponent(token)}`} replace />;
}
