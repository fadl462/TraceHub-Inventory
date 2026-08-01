import { Link, useLocation, useNavigate } from 'react-router-dom';
import TraceHubMark from '../TraceHubMark';
import { useAuth } from '../../context/AuthContext';

const SECTIONS = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
];

export default function SiteHeader() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onLanding = pathname === '/';

  // From another page, go home first, then scroll to the section once the
  // landing page has actually mounted (avoids relying on URL hash fragments,
  // which triggered an HTTP 404 through this environment's proxy).
  const goToSection = (id) => (e) => {
    if (onLanding) return; // let the plain <a href="#id"> handle it natively
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-ink/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/"><TraceHubMark size={30} withWordmark /></Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={goToSection(s.id)} className="hover:text-ink transition-colors">
              {s.label}
            </a>
          ))}
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
