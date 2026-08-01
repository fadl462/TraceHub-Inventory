import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import client from '../api/client';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Spinner } from '../components/ui';

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    client.get('/blog-posts')
      .then(({ data }) => setPosts(data.posts))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary-dark mb-3">Updates</p>
        <h1 className="font-display text-4xl font-bold text-ink tracking-tight mb-2">Updates &amp; releases</h1>
        <p className="text-ink/60 mb-12">What's new on TraceHub Inventory.</p>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-sm text-ink/60">Couldn't load posts right now \u2014 please refresh the page.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-ink/60">No posts published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((p, i) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className={`group block rounded-2xl border border-ink/5 bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden ${i === 0 ? 'sm:grid sm:grid-cols-2' : ''}`}
              >
                {p.coverImageUrl && (
                  <div className={`overflow-hidden ${i === 0 ? 'h-full min-h-[220px]' : 'h-48'}`}>
                    <img src={p.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  </div>
                )}
                <div className="p-7 flex flex-col justify-center">
                  <p className="flex items-center gap-1.5 text-xs text-ink/45 mb-2"><Calendar size={13} /> {formatDate(p.publishedAt)}</p>
                  <h2 className={`font-display font-semibold text-ink group-hover:text-primary transition-colors ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-sm text-ink/60 leading-relaxed">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
