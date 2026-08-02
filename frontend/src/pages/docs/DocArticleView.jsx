import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import client from '../../api/client';
import { Spinner } from '../../components/ui';

function slugifyHeading(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function DocArticleView() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', article: null, prev: null, next: null });
  const [toc, setToc] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    setState({ status: 'loading', article: null, prev: null, next: null });
    setToc([]);
    window.scrollTo(0, 0);
    client.get(`/docs/slug/${slug}`)
      .then(({ data }) => setState({ status: 'found', article: data.article, prev: data.prev, next: data.next }))
      .catch(() => setState({ status: 'notfound', article: null, prev: null, next: null }));
  }, [slug]);

  // Build a real "On this page" mini table-of-contents from the article's own
  // h3 headings, assigning each one an anchor id so the links actually jump
  // to that section - genuinely more helpful for a long article than a
  // plain prev/next footer alone.
  useEffect(() => {
    if (state.status !== 'found' || !contentRef.current) return;
    const headings = Array.from(contentRef.current.querySelectorAll('h3'));
    const entries = headings.map((h) => {
      const id = slugifyHeading(h.textContent);
      h.id = id;
      return { id, text: h.textContent };
    });
    setToc(entries);
  }, [state]);

  if (state.status === 'loading') {
    return <div className="flex justify-center py-24"><Spinner size={28} /></div>;
  }
  if (state.status === 'notfound') {
    return (
      <div className="text-center py-24 px-6">
        <h1 className="text-xl font-bold text-ink">Article not found</h1>
        <Link to="/docs" className="mt-4 inline-block text-sm text-primary font-medium">Back to documentation</Link>
      </div>
    );
  }

  const { article, prev, next } = state;

  return (
    <div className="px-6 sm:px-10 py-10 flex gap-10 max-w-6xl">
      <div className="min-w-0 flex-1 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary-dark mb-2">{article.category}</p>
        <h1 className="font-display text-3xl font-bold text-ink tracking-tight mb-6">{article.title}</h1>
        {/* eslint-disable-next-line react/no-danger */}
        <div ref={contentRef} className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />

        <div className="mt-12 pt-6 border-t border-ink/10 flex items-center justify-between gap-4">
          {prev ? (
            <Link to={`/docs/${prev.slug}`} className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-primary transition-colors">
              <ChevronLeft size={16} /> {prev.title}
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/docs/${next.slug}`} className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-primary transition-colors text-right ml-auto">
              {next.title} <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {toc.length > 1 && (
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 flex items-center gap-1.5 mb-3">
              <List size={13} /> On this page
            </p>
            <nav className="space-y-2 border-l-2 border-ink/10">
              {toc.map((t) => (
                <a
                  key={t.id} href={`#${t.id}`}
                  className="block pl-3 text-sm text-ink/60 hover:text-primary hover:border-primary transition-colors -ml-0.5 border-l-2 border-transparent"
                >
                  {t.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
