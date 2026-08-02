import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import client from '../api/client';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Spinner } from '../components/ui';

export default function CmsPageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    window.scrollTo(0, 0);
    client.get(`/cms-pages/slug/${slug}`)
      .then(({ data }) => { setPage(data.page); setStatus('found'); })
      .catch(() => setStatus('notfound'));
  }, [slug]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
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
          <>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium mb-8 transition-colors">
              <ArrowLeft size={15} /> Back to home
            </Link>
            <article className="bg-white rounded-2xl border border-ink/5 shadow-card p-8 sm:p-12">
              <h1 className="font-display text-3xl font-bold text-ink tracking-tight mb-8">{page.title}</h1>
              {/* eslint-disable-next-line react/no-danger */}
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.bodyHtml || '' }} />
            </article>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
