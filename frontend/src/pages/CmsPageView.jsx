import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import client from '../api/client';
import TraceHubMark from '../components/TraceHubMark';
import { Spinner } from '../components/ui';

export default function CmsPageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | found | notfound

  useEffect(() => {
    setStatus('loading');
    client.get(`/cms-pages/slug/${slug}`)
      .then(({ data }) => { setPage(data.page); setStatus('found'); })
      .catch(() => setStatus('notfound'));
  }, [slug]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-ink/5 h-16 flex items-center px-6">
        <Link to="/"><TraceHubMark size={28} withWordmark /></Link>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-16">
        {status === 'loading' && <div className="flex justify-center py-16"><Spinner size={28} /></div>}
        {status === 'notfound' && (
          <div className="text-center py-16">
            <h1 className="text-xl font-bold text-ink">Page not found</h1>
            <Link to="/" className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary font-medium">
              <ArrowLeft size={15} /> Back to home
            </Link>
          </div>
        )}
        {status === 'found' && page && (
          <article>
            <h1 className="font-display text-3xl font-bold text-ink tracking-tight mb-8">{page.title}</h1>
            {/* eslint-disable-next-line react/no-danger */}
            <div className="prose prose-sm max-w-none text-ink/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: page.bodyHtml || '' }} />
          </article>
        )}
      </main>
    </div>
  );
}
