import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, List, Clock, ArrowRight } from 'lucide-react';
import client from '../../api/client';
import { Spinner } from '../../components/ui';
import DifficultyBadge from '../../components/docs/DifficultyBadge';
import DepreciationCalculator from '../../components/docs/DepreciationCalculator';

function slugifyHeading(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Slugs that get a real, working interactive widget embedded above their
// content - deliberately a small, explicit list rather than a generic
// "content block" system, since only a couple of articles have a concept
// concrete enough (a real formula from the actual engine) to make an
// interactive tool honest rather than gimmicky.
const EMBEDDED_WIDGETS = {
  'smart-depreciation-engine': DepreciationCalculator,
};

export default function DocArticleView() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({
    status: 'loading', article: null, prev: null, next: null, related: [],
  });
  const [toc, setToc] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    setState({
      status: 'loading', article: null, prev: null, next: null, related: [],
    });
    setToc([]);
    window.scrollTo(0, 0);
    client.get(`/docs/slug/${slug}`, { params: { locale: i18n.language } })
      .then(({ data }) => setState({
        status: 'found', article: data.article, prev: data.prev, next: data.next, related: data.related || [],
      }))
      .catch(() => setState({
        status: 'notfound', article: null, prev: null, next: null, related: [],
      }));
  }, [slug, i18n.language]);

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
        <h1 className="text-xl font-bold text-ink">{t('docArticle.articleNotFound')}</h1>
        <Link to="/docs" className="mt-4 inline-block text-sm text-primary font-medium">{t('docArticle.backToDocumentation')}</Link>
      </div>
    );
  }

  const { article, prev, next, related } = state;
  const EmbeddedWidget = EMBEDDED_WIDGETS[article.slug];

  return (
    <div className="px-6 sm:px-10 py-10 flex gap-10 max-w-6xl">
      <div className="min-w-0 flex-1 max-w-3xl">
        <nav className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-3">
          <Link to="/docs" className="text-ink/40 hover:text-primary transition-colors">{t('footer.linkDocumentation')}</Link>
          <span className="text-ink/25">/</span>
          <span className="text-secondary-dark">{article.category}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-ink tracking-tight mb-3">{article.title}</h1>
        <div className="flex items-center flex-wrap gap-3 mb-6">
          <DifficultyBadge level={article.difficulty} />
          <span className="flex items-center gap-1 text-xs text-ink/40">
            <Clock size={12} /> {t('docsHome.minRead', { count: article.readingMinutes })}
          </span>
          {article.updatedAt && (
            <span className="text-xs text-ink/35">
              {t('docArticle.lastUpdated', {
                date: new Date(article.updatedAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }),
              })}
            </span>
          )}
        </div>

        {EmbeddedWidget && <EmbeddedWidget />}

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

        {related.length > 0 && (
          <div className="mt-8 pt-6 border-t border-ink/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-3">{t('docsHome.relatedArticles')}</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r.id} to={`/docs/${r.slug}`}
                  className="group flex items-center justify-between gap-2 p-3 rounded-xl border border-ink/10 hover:border-primary/30 hover:shadow-sm transition-all text-sm text-ink/70 hover:text-ink"
                >
                  {r.title}
                  <ArrowRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {toc.length > 1 && (
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 flex items-center gap-1.5 mb-3">
              <List size={13} /> {t('docArticle.onThisPage')}
            </p>
            <nav className="space-y-2 border-l-2 border-ink/10">
              {toc.map((h) => (
                <a
                  key={h.id} href={`#${h.id}`}
                  className="block pl-3 text-sm text-ink/60 hover:text-primary hover:border-primary transition-colors -ml-0.5 border-l-2 border-transparent"
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
