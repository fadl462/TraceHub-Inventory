import { useEffect, useState } from 'react';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import client from '../api/client';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Spinner } from '../components/ui';

export default function DocsLayout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    client.get('/docs').then(({ data }) => {
      setCategories(data.categories);
      // The category containing the current article (if any) starts expanded;
      // otherwise the first category does, so the sidebar is never fully collapsed.
      const initial = {};
      data.categories.forEach((c, i) => {
        initial[c.category] = slug ? c.articles.some((a) => a.slug === slug) : i === 0;
      });
      setOpenCategories(initial);
    }).catch(() => setCategories([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-expand whichever category contains the article currently being viewed,
  // in case it was collapsed or the person arrived via a direct link/search result.
  useEffect(() => {
    if (!categories || !slug) return;
    const owner = categories.find((c) => c.articles.some((a) => a.slug === slug));
    if (owner) setOpenCategories((o) => ({ ...o, [owner.category]: true }));
  }, [categories, slug]);

  useEffect(() => {
    if (search.trim().length < 2) { setSearchResults(null); return; }
    const t = setTimeout(() => {
      client.get('/docs/search', { params: { q: search.trim() } }).then(({ data }) => setSearchResults(data.results)).catch(() => {});
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
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documentation..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-ink/10 focus-ring focus:border-secondary"
        />
        {searchResults !== null && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-ink/10 shadow-lg max-h-72 overflow-y-auto">
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
        <nav className="space-y-1">
          {categories.map((c) => (
            <div key={c.category} className="border-b border-ink/5 pb-1 mb-1 last:border-0">
              <button
                onClick={() => toggleCategory(c.category)}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-ink hover:text-primary transition-colors"
              >
                {c.category}
                {openCategories[c.category] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {openCategories[c.category] && (
                <div className="pl-2 pb-1 space-y-0.5">
                  {c.articles.map((a) => (
                    <Link
                      key={a.id} to={`/docs/${a.slug}`} onClick={() => setMobileNavOpen(false)}
                      className={`block py-1.5 px-2 text-sm rounded-md transition-colors ${
                        slug === a.slug ? 'bg-primary-50 text-primary font-medium' : 'text-ink/60 hover:text-ink hover:bg-primary-50/50'
                      }`}
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />
      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 bg-primary text-white rounded-full p-3 shadow-lg"
          aria-label="Open documentation navigation"
        >
          <Menu size={20} />
        </button>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-5 overflow-y-auto">
              <button onClick={() => setMobileNavOpen(false)} className="mb-4 text-ink/50"><X size={20} /></button>
              {sidebarContent}
            </div>
          </div>
        )}

        <aside className="hidden lg:block w-72 shrink-0 border-r border-ink/5 px-5 py-8">
          {sidebarContent}
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
