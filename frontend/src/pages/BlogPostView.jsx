import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import client from '../api/client';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Spinner, Button } from '../components/ui';

function formatDate(d, locale) {
  return new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

function timeAgo(d, t, locale) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return t('blogPage.today');
  if (days === 1) return t('blogPage.yesterday');
  if (days < 30) return t('blogPage.daysAgo', { count: days });
  return formatDate(d, locale);
}

export default function BlogPostView() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading');
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ authorName: '', authorEmail: '', body: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const articleRef = useRef(null);

  // A real reading-progress bar, computed from actual scroll position
  // against the article's own height (not a canned animation) - a small,
  // low-cost nudge to keep reading rather than bouncing partway through.
  useEffect(() => {
    const onScroll = () => {
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const scrolled = -rect.top;
      setReadProgress(total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [status]);

  const loadComments = () => {
    client.get(`/blog-posts/slug/${slug}/comments`).then(({ data }) => setComments(data.comments)).catch(() => {});
  };

  useEffect(() => {
    setStatus('loading');
    window.scrollTo(0, 0);
    client.get(`/blog-posts/slug/${slug}`, { params: { locale: i18n.language } })
      .then(({ data }) => { setPost(data.post); setRelated(data.related || []); setStatus('found'); loadComments(); })
      .catch(() => setStatus('notfound'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, i18n.language]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentForm.authorName.trim() || !commentForm.body.trim()) {
      toast.error(t('blogPage.nameAndCommentRequired'));
      return;
    }
    setSubmittingComment(true);
    try {
      await client.post(`/blog-posts/slug/${slug}/comments`, { ...commentForm, locale: i18n.language });
      toast.success(t('blogPage.thanksForContributing'));
      setCommentForm({ authorName: '', authorEmail: '', body: '' });
      loadComments();
    } catch (err) {
      toast.error(err.response?.data?.error || t('blogPage.failedToPostComment'));
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteHeader />
      {status === 'found' && (
        <div className="sticky top-0 z-30 h-1 bg-ink/5">
          <div className="h-full bg-primary transition-[width] duration-100" style={{ width: `${readProgress}%` }} />
        </div>
      )}
      <main className="flex-1 max-w-5xl mx-auto px-6 sm:px-10 py-16 w-full">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium mb-8 transition-colors">
          <ArrowLeft size={15} /> {t('blogPage.allUpdates')}
        </Link>
        {status === 'loading' && <div className="flex justify-center py-16"><Spinner size={28} /></div>}
        {status === 'notfound' && (
          <div className="text-center py-16">
            <h1 className="text-xl font-bold text-ink">{t('blogPage.postNotFound')}</h1>
            <Link to="/blog" className="mt-3 inline-block text-sm text-primary font-medium">{t('blogPage.backToAllUpdates')}</Link>
          </div>
        )}
        {status === 'found' && post && (
          <article ref={articleRef}>
            <p className="flex items-center gap-1.5 text-xs font-medium text-ink/45 mb-4">
              <Calendar size={13} /> {formatDate(post.publishedAt, i18n.language)} <span className="text-ink/25">&middot;</span> {post.authorName}
              <span className="text-ink/25">&middot;</span> <Clock size={13} /> {t('docsHome.minRead', { count: post.readingMinutes })}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-tight mb-8">{post.title}</h1>
            {post.coverImageUrl && (
              <img src={post.coverImageUrl} alt="" className="w-full rounded-2xl mb-10 shadow-card" />
            )}
            {/* eslint-disable-next-line react/no-danger */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml || '' }}
            />
            <div className="mt-16 pt-8 border-t border-ink/5 flex items-center justify-between">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:text-primary-600 transition-colors">
                <ArrowLeft size={15} /> {t('blogPage.allUpdates')}
              </Link>
              <Link to="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                {t('blogPage.startFree')}
              </Link>
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-4">{t('blogPage.keepReading')}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.id} to={`/blog/${r.slug}`}
                      className="group flex gap-4 p-4 rounded-xl border border-ink/10 hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      {r.coverImageUrl && (
                        <img src={r.coverImageUrl} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-ink group-hover:text-primary transition-colors leading-snug">{r.title}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {t('blogPage.keepReading')} <ArrowRight size={11} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16 pt-10 border-t border-ink/5">
              <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2 mb-6">
                <MessageSquare size={19} /> {t('blogPage.contributionsComments')} {comments.length > 0 && <span className="text-ink/40 font-normal text-base">({comments.length})</span>}
              </h2>

              <form onSubmit={submitComment} className="rounded-2xl border border-ink/10 bg-white p-6 mb-8 space-y-3">
                <p className="text-sm font-medium text-ink">{t('blogPage.addThoughts')}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    className="rounded-lg border border-ink/10 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
                    placeholder={t('blogPage.namePlaceholder')} required
                    value={commentForm.authorName} onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                  />
                  <input
                    className="rounded-lg border border-ink/10 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
                    placeholder={t('blogPage.emailPlaceholder')} type="email"
                    value={commentForm.authorEmail} onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                  />
                </div>
                <textarea
                  className="w-full rounded-lg border border-ink/10 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary resize-none"
                  rows={4} placeholder={t('blogPage.shareThoughtsPlaceholder')} required maxLength={3000}
                  value={commentForm.body} onChange={(e) => setCommentForm({ ...commentForm, body: e.target.value })}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={submittingComment}>{submittingComment ? t('blogPage.posting') : t('blogPage.postComment')}</Button>
                </div>
              </form>

              {comments.length === 0 ? (
                <p className="text-sm text-ink/50 text-center py-6">{t('blogPage.noCommentsYet')}</p>
              ) : (
                <div className="space-y-5">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary-50 text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                        {c.authorName.trim()[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-semibold text-sm text-ink">{c.authorName}</p>
                          <p className="text-xs text-ink/40">{timeAgo(c.createdAt, t, i18n.language)}</p>
                        </div>
                        <p className="text-sm text-ink/70 leading-relaxed mt-0.5 whitespace-pre-wrap">{c.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
