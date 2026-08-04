import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import client from '../api/client';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Spinner } from '../components/ui';

function formatDate(d, locale) {
  return new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    client.get('/blog-posts', { params: { locale: i18n.language } })
      .then(({ data }) => setPosts(data.posts))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary-dark mb-3">{t('blogPage.updates')}</p>
        <h1 className="font-display text-4xl font-bold text-ink tracking-tight mb-2">{t('blogPage.updatesAndReleases')}</h1>
        <p className="text-ink/60 mb-12">{t('blogPage.whatsNew')}</p>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-sm text-ink/60">{t('blogPage.couldntLoadPosts')}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-ink/60">{t('blogPage.noPostsYet')}</p>
          </div>
        ) : (
          <>
            {/* The newest post gets a larger, distinct treatment - a flat
                grid of equal-weight cards makes everything look equally
                (un)important, which does nothing to pull a first-time
                visitor toward the strongest piece of content. */}
            {featured && (
              <Link
                to={`/blog/${featured.slug}`}
                className="group grid md:grid-cols-2 gap-0 rounded-2xl border border-ink/5 bg-white hover:shadow-xl transition-all duration-200 overflow-hidden mb-10"
              >
                <div className="h-56 md:h-full overflow-hidden bg-primary-50">
                  {featured.coverImageUrl && (
                    <img src={featured.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="flex items-center gap-3 text-xs text-ink/45 mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDate(featured.publishedAt, i18n.language)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {t('docsHome.minRead', { count: featured.readingMinutes })}</span>
                  </p>
                  <h2 className="font-display font-bold text-2xl text-ink group-hover:text-primary transition-colors leading-snug">{featured.title}</h2>
                  {featured.excerpt && <p className="mt-3 text-ink/60 leading-relaxed">{featured.excerpt}</p>}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-5">
                    {t('blogPage.keepReading')} <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-ink/5 bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                  >
                    <div className="overflow-hidden h-44 bg-primary-50">
                      {p.coverImageUrl && (
                        <img src={p.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="flex items-center gap-3 text-xs text-ink/45 mb-2">
                        <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(p.publishedAt, i18n.language)}</span>
                        <span className="flex items-center gap-1"><Clock size={13} /> {t('docsHome.minRead', { count: p.readingMinutes })}</span>
                      </p>
                      <h2 className="font-display font-semibold text-lg text-ink group-hover:text-primary transition-colors">{p.title}</h2>
                      {p.excerpt && <p className="mt-2 text-sm text-ink/60 leading-relaxed flex-1">{p.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
