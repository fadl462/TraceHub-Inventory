import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import client from '../api/client';
import TraceHubMark from '../components/TraceHubMark';
import { Spinner } from '../components/ui';

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/blog-posts').then(({ data }) => setPosts(data.posts)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-ink/5 h-16 flex items-center px-6">
        <Link to="/"><TraceHubMark size={28} withWordmark /></Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium mb-8">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <h1 className="font-display text-3xl font-bold text-ink tracking-tight mb-2">Updates &amp; releases</h1>
        <p className="text-ink/60 mb-10">What's new on TraceHub Inventory.</p>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : (
          <div className="space-y-8">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="block p-6 rounded-2xl border border-ink/5 bg-white hover:shadow-card transition-shadow">
                <p className="flex items-center gap-1.5 text-xs text-ink/45 mb-2"><Calendar size={13} /> {formatDate(p.publishedAt)}</p>
                <h2 className="font-display font-semibold text-lg text-ink">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-sm text-ink/60 leading-relaxed">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
