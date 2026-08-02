import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, User, Box, X } from 'lucide-react';
import client from '../../api/client';

export default function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults(null); return; }
    const handle = setTimeout(() => {
      client.get('/super-admin/search', { params: { q: query } }).then(({ data }) => {
        setResults(data);
        setOpen(true);
      });
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const hasResults = results && (results.companies.length + results.users.length + results.assets.length > 0);

  const goToCompany = (id) => { navigate(`/admin/companies/${id}`); setOpen(false); setQuery(''); };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Search companies, users, assets..."
          aria-label="Global search"
          className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-primary-100 focus-ring focus:border-secondary bg-white"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults(null); }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && results && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-primary-100 max-h-96 overflow-y-auto z-50">
          {!hasResults ? (
            <p className="px-4 py-6 text-sm text-ink/50 text-center">No matches for "{query}"</p>
          ) : (
            <>
              {results.companies.length > 0 && (
                <div className="py-2">
                  <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink/40">Companies</p>
                  {results.companies.map((c) => (
                    <button key={c.id} onClick={() => goToCompany(c.id)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-primary-50 text-left">
                      <Building2 size={15} className="text-link shrink-0" />
                      <span className="text-ink">{c.name}</span>
                      <span className="text-xs text-ink/40 ml-auto">{c.status}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.users.length > 0 && (
                <div className="py-2 border-t border-primary-50">
                  <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink/40">Users</p>
                  {results.users.map((u) => (
                    <button key={u.id} onClick={() => goToCompany(u.companyId)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-primary-50 text-left">
                      <User size={15} className="text-secondary shrink-0" />
                      <span className="text-ink">{u.firstName} {u.lastName}</span>
                      <span className="text-xs text-ink/40 ml-auto">{u.email}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.assets.length > 0 && (
                <div className="py-2 border-t border-primary-50">
                  <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink/40">Assets</p>
                  {results.assets.map((a) => (
                    <button key={a.id} onClick={() => goToCompany(a.companyId)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-primary-50 text-left">
                      <Box size={15} className="text-accent-dark shrink-0" />
                      <span className="text-ink">{a.name}</span>
                      <span className="text-xs text-ink/40 font-mono ml-auto">{a.assetTag}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
