import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight, MessageCircleQuestion, Newspaper, Rocket, Boxes, Sparkles, ScanLine,
  ClipboardList, Trash2, ShieldCheck, BarChart3, CreditCard, Settings, LifeBuoy, BookOpen,
} from 'lucide-react';
import client from '../../api/client';
import RadarLocateVisual from '../../components/landing/RadarLocateVisual';
import { Spinner } from '../../components/ui';

const CATEGORY_META = {
  'Getting Started': { icon: Rocket, blurb: 'What TraceHub is, and how to get a workspace running fast.' },
  'Managing Assets': { icon: Boxes, blurb: 'Registering, categorizing, and organizing your equipment.' },
  'The Asset Intelligence Engine': { icon: Sparkles, blurb: 'The six AI engines running underneath every asset.' },
  'Tracking & Scanning': { icon: ScanLine, blurb: 'Checkpoints, QR codes, and location history.' },
  Assignments: { icon: ClipboardList, blurb: 'Handing equipment to people, with automatic reminders.' },
  'Disposal Workflow': { icon: Trash2, blurb: 'The six-stage approval process for retiring an asset.' },
  'Team & Security': { icon: ShieldCheck, blurb: 'Roles, invitations, 2FA, and the audit log.' },
  'Reports & Exporting': { icon: BarChart3, blurb: 'The Dashboard, Fleet Intelligence, and exporting data.' },
  'Billing & Subscriptions': { icon: CreditCard, blurb: 'Plans, trials, and managing your subscription.' },
  'For Super Admins': { icon: Settings, blurb: 'Running the platform: companies, CMS, email, payments.' },
  'Troubleshooting & FAQs': { icon: LifeBuoy, blurb: 'Common issues and honest answers.' },
  Reference: { icon: BookOpen, blurb: 'A glossary of every TraceHub-specific term.' },
};

export default function DocsHome() {
  const { openChat } = useOutletContext();
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    client.get('/docs').then(({ data }) => setCategories(data.categories)).catch(() => setCategories([]));
  }, []);

  return (
    <div>
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary overflow-hidden px-6 sm:px-10 py-16 sm:py-20">
        <div className="absolute -right-16 -top-10 w-72 h-72 opacity-40 pointer-events-none hidden md:block">
          <RadarLocateVisual />
        </div>
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">TraceHub Documentation</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">Everything you need to know, organized the way you actually work</h1>
          <p className="text-white/70 max-w-xl">Not a generic help center — every article here traces back to real, built functionality: the exact engine weights, the exact reminder timing, real worked examples throughout.</p>
        </div>
      </div>

      <div className="px-6 sm:px-10 py-14">
        <h2 className="font-display text-xl font-bold text-ink mb-6">Browse by category</h2>
        {categories === null ? (
          <div className="flex justify-center py-12"><Spinner size={24} /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const meta = CATEGORY_META[c.category] || { icon: BookOpen, blurb: '' };
              const Icon = meta.icon;
              const firstSlug = c.articles[0]?.slug;
              return (
                <Link
                  key={c.category} to={firstSlug ? `/docs/${firstSlug}` : '/docs'}
                  className="group flex flex-col p-5 rounded-2xl border border-ink/10 bg-white hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary shrink-0">
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink group-hover:text-primary transition-colors">{c.category}</h3>
                      <p className="text-xs text-ink/40">{c.articles.length} article{c.articles.length === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-ink/60 flex-1">{meta.blurb}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-primary text-white px-6 sm:px-10 py-14 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Don't have a TraceHub account yet?</h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto">Sign up and get started for free — every workspace starts with a 30-day trial, first 10 assets included, no card required.</p>
        <Link to="/register" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
          TRY TRACEHUB TODAY
        </Link>
      </div>

      <div className="px-6 sm:px-10 py-14">
        <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">Other resources</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <button
            onClick={openChat}
            className="text-left border border-ink/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="bg-primary-50/50 px-5 py-3 flex items-center gap-2 font-semibold text-primary text-sm">
              <MessageCircleQuestion size={16} /> AI ASSISTANT
            </div>
            <p className="p-5 text-sm text-ink/60">Click here — or the chat bubble in the corner — grounded in this same documentation, and, once logged in, your own live fleet data too.</p>
          </button>
          <Link
            to="/blog"
            className="text-left block border border-ink/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="bg-primary-50/50 px-5 py-3 flex items-center gap-2 font-semibold text-primary text-sm">
              <Newspaper size={16} /> BLOG &amp; UPDATES
            </div>
            <p className="p-5 text-sm text-ink/60">
              Read our latest posts for deeper dives into how the AI engines work and what's new on the platform.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
