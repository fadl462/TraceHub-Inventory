import { useEffect, useState } from 'react';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search, ChevronDown, ChevronUp, Menu, X, Rocket, Boxes, Sparkles, ScanLine,
  ClipboardList, Trash2, ShieldCheck, BarChart3, CreditCard, Settings, LifeBuoy, BookOpen, Home, Check,
} from 'lucide-react';
import client from '../api/client';
import TraceHubMark from '../components/TraceHubMark';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AiChatWidget from '../components/AiChatWidget';
import { useDocProgress } from '../hooks/useDocProgress';
import { useAuth } from '../context/AuthContext';
import { Spinner, Button } from '../components/ui';

const CATEGORY_ICONS = {
  'Getting Started': Rocket,
  'Managing Assets': Boxes,
  'The Asset Intelligence Engine': Sparkles,
  'Tracking & Scanning': ScanLine,
  Assignments: ClipboardList,
  'Disposal Workflow': Trash2,
  'Team & Security': ShieldCheck,
  'Reports & Exporting': BarChart3,
  'Billing & Subscriptions': CreditCard,
  'For Super Admins': Settings,
  'Troubleshooting & FAQs': LifeBuoy,
  Reference: BookOpen,
};

export default function DocsLayout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { readSlugs } = useDocProgress();
  const [categories, setCategories] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    client.get('/docs', { params: { locale: i18n.language } }).then(({ data }) => {
      setCategories(data.categories);
      const initial = {};
      data.categories.forEach((c, i) => {
        initial[c.category] = slug ? c.articles.some((a) => a.slug === slug) : i === 0;
      });
      setOpenCategories(initial);
    }).catch(() => setCategories([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  useEffect(() => {
    if (!categories || !slug) return;
    const owner = categories.find((c) => c.articles.some((a) => a.slug === slug));
    if (owner) setOpenCategories((o) => ({ ...o, [owner.category]: true }));
  }, [categories, slug]);

  useEffect(() => {
    if (search.trim().length < 2) { setSearchResults(null); return; }
    const t = setTimeout(() => {
      client.get('/docs/search', { params: { q: search.trim(), locale: i18n.language } }).then(({ data }) => setSearchResults(data.results)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const toggleCategory = (cat) => setOpenCategories((o) => ({ ...o, [cat]: !o[cat] }));

  const goToResult = (articleSlug) => {
    setSearch('');
    setSearchResults(null);
    setMobileNavOpen(false);
    navigate(`/docs/${articleSlug}`);
  };

  const sidebarContent = (
    <>
      <Link
        to="/docs" onClick={() => setMobileNavOpen(false)}
        className="flex items-center gap-2.5 py-2 mb-3 text-sm font-semibold text-white hover:text-secondary transition-colors"
      >
        <Home size={16} className="text-secondary" /> {t('docsLayout.documentationHome')}
      </Link>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t('docsLayout.searchPlaceholder')}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary focus:bg-white/15 transition-colors"
        />
        {searchResults !== null && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-72 overflow-y-auto">
            {searchResults.length === 0 ? (
              <p className="text-xs text-ink/50 p-3">No matching articles.</p>
            ) : searchResults.map((r) => (
              <button
                key={r.id} onClick={() => goToResult(r.slug)}
                className="w-full text-left px-3 py-2 hover:bg-primary-50/60 border-b border-ink/5 last:border-0"
              >
                <p className="text-sm font-medium text-ink">{r.title}</p>
                <p className="text-xs text-ink/40">{r.category}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {categories === null ? (
        <div className="flex justify-center py-8"><Spinner size={20} /></div>
      ) : (
        <nav className="space-y-0.5">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.category] || BookOpen;
            const readCount = c.articles.filter((a) => readSlugs.has(a.slug)).length;
            return (
              <div key={c.category}>
                <button
                  onClick={() => toggleCategory(c.category)}
                  className="w-full flex items-center gap-2.5 py-2.5 text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  <Icon size={16} className="text-secondary shrink-0" />
                  <span className="flex-1 text-left">{c.category}</span>
                  {readCount > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                        readCount === c.articles.length ? 'bg-accent/25 text-accent' : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {readCount}/{c.articles.length}
                    </span>
                  )}
                  {openCategories[c.category] ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                </button>
                {openCategories[c.category] && (
                  <div className="pl-7 pb-2 space-y-0.5">
                    {c.articles.map((a) => (
                      <Link
                        key={a.id} to={`/docs/${a.slug}`} onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center gap-1.5 py-1.5 px-2.5 text-sm rounded-md transition-colors ${
                          slug === a.slug ? 'bg-secondary/20 text-secondary font-medium' : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                        }`}
                      >
                        {readSlugs.has(a.slug) && <Check size={12} className="text-accent shrink-0" />}
                        <span className="truncate">{a.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Docs-specific top bar - shares the exact same max-width container as the
          sidebar/content below, so the logo always lines up with the sidebar's
          left edge regardless of viewport width (the marketing SiteHeader uses a
          different max-width, which is what caused the misalignment before). */}
      <header className="sticky top-0 z-40 bg-primary-900 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={() => setMobileNavOpen(true)} className="lg:hidden text-white/70"><Menu size={20} /></button>
          <Link to="/" className="flex items-center shrink-0">
            <TraceHubMark size={30} withWordmark tone="white" />
          </Link>
          <span className="hidden sm:inline text-white/30 text-sm">|</span>
          <Link to="/docs" className="hidden sm:inline text-white/60 hover:text-white text-sm font-medium transition-colors">{t('footer.linkDocumentation')}</Link>
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher dark />
            {user ? (
              <Link to={user.role === 'super_admin' ? '/admin' : '/dashboard'}>
                <Button variant="accent">{t('common.goToDashboard')}</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors">{t('common.login')}</Link>
                <Link to="/register"><Button variant="accent">{t('common.getStartedFree')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] mx-auto w-full flex">
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-primary-900 p-5 overflow-y-auto">
              <button onClick={() => setMobileNavOpen(false)} className="mb-4 text-white/50"><X size={20} /></button>
              {sidebarContent}
            </div>
          </div>
        )}

        <aside className="hidden lg:block w-72 shrink-0 bg-primary-900 px-5 py-6 min-h-[calc(100vh-4rem)]">
          {sidebarContent}
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet context={{ openChat: () => setChatOpen(true) }} />
        </main>
      </div>

      <AiChatWidget isOpen={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
