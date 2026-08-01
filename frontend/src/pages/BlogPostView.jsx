import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import client from '../api/client';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Spinner } from '../components/ui';

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostView() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    window.scrollTo(0, 0);
    client.get(`/blog-posts/slug/${slug}`)
      .then(({ data }) => { setPost(data.post); setStatus('found'); })
      .catch(() => setStatus('notfound'));
  }, [slug]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium mb-8 transition-colors">
          <ArrowLeft size={15} /> All updates
        </Link>
        {status === 'loading' && <div className="flex justify-center py-16"><Spinner size={28} /></div>}
        {status === 'notfound' && (
          <div className="text-center py-16">
            <h1 className="text-xl font-bold text-ink">Post not found</h1>
            <Link to="/blog" className="mt-3 inline-block text-sm text-primary font-medium">Back to all updates</Link>
          </div>
        )}
        {status === 'found' && post && (
          <article>
            <p className="flex items-center gap-1.5 text-xs font-medium text-ink/45 mb-4">
              <Calendar size={13} /> {formatDate(post.publishedAt)} <span className="text-ink/25">&middot;</span> {post.authorName}
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
                <ArrowLeft size={15} /> All updates
              </Link>
              <Link to="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Start free
              </Link>
            </div>
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
