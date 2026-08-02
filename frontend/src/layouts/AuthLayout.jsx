import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import TraceHubMark from '../components/TraceHubMark';
import client from '../api/client';

const DEFAULTS = {
  loginTagline: 'Know where every asset is, always.',
  heroSubheadline: 'Register equipment in seconds, let AI propose disposal timelines, assign gear to your team, and track it all with a simple scan — no hardware required.',
  loginHighlight1: 'Your first 10 assets are free',
  loginHighlight2: 'No hardware, no setup fees',
  footerCopyright: 'TraceHub Inventory. All rights reserved.',
};

export default function AuthLayout({ children, title, subtitle }) {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    client.get('/site-content').then(({ data }) => setContent({ ...DEFAULTS, ...data.content })).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-surface">
      <div className="hidden lg:flex flex-col justify-between bg-primary-800 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <Link to="/" className="relative z-10 w-fit">
          <TraceHubMark size={56} withWordmark tone="white" />
        </Link>
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">{content.loginTagline}</h2>
          <p className="mt-4 text-primary-100/90 text-sm leading-relaxed">{content.heroSubheadline}</p>
          <div className="mt-6 space-y-2">
            {content.loginHighlight1 && (
              <p className="flex items-center gap-2 text-sm text-primary-100/90"><Check size={15} className="text-accent" /> {content.loginHighlight1}</p>
            )}
            {content.loginHighlight2 && (
              <p className="flex items-center gap-2 text-sm text-primary-100/90"><Check size={15} className="text-accent" /> {content.loginHighlight2}</p>
            )}
          </div>
        </div>
        <div className="relative z-10 text-xs text-primary-200/70">© {new Date().getFullYear()} {content.footerCopyright}</div>
      </div>
      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="lg:hidden">
              <TraceHubMark size={40} withWordmark />
            </Link>
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-ink transition-colors"
            >
              <ArrowLeft size={15} /> Back to home
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
