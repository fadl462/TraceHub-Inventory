import { Link } from 'react-router-dom';
import TraceHubMark from '../TraceHubMark';
import { useAuth } from '../../context/AuthContext';

export default function SiteHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-ink/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/"><TraceHubMark size={30} withWordmark /></Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
          <Link to="/#how-it-works" className="hover:text-ink transition-colors">How it works</Link>
          <Link to="/#features" className="hover:text-ink transition-colors">Features</Link>
          <Link to="/#pricing" className="hover:text-ink transition-colors">Pricing</Link>
          <Link to="/blog" className="hover:text-ink transition-colors">Blog</Link>
        </nav>
        {user ? (
          <Link
            to={user.role === 'super_admin' ? '/admin' : '/dashboard'}
            className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Go to dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline text-sm font-medium text-ink/70 hover:text-ink transition-colors">Log in</Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Get started free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
