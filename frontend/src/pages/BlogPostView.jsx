import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import client from '../api/client';
import TraceHubMark from '../components/TraceHubMark';
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
    client.get(`/blog-posts/slug/${slug}`)
      .then(({ data }) => { setPost(data.post); setStatus('found'); })
      .catch(() => setStatus('notfound'));
  }, [slug]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-ink/5 h-16 flex items-center px-6">
        <Link to="/"><TraceHubMark size={28} withWordmark /></Link>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium mb-8">
          <ArrowLeft size={15} /> All updates
        </Link>
        {status === 'loading' && <div className="flex justify-center py-16"><Spinner size={28} /></div>}
        {status === 'notfound' && <h1 className="text-xl font-bold text-ink">Post not found</h1>}
        {status === 'found' && post && (
          <article>
            <p className="flex items-center gap-1.5 text-xs text-ink/45 mb-3"><Calendar size={13} /> {formatDate(post.publishedAt)} &middot; {post.authorName}</p>
            <h1 className="font-display text-3xl font-bold text-ink tracking-tight mb-8">{post.title}</h1>
            {post.coverImageUrl && <img src={post.coverImageUrl} alt="" className="w-full rounded-2xl mb-8" />}
            {/* eslint-disable-next-line react/no-danger */}
            <div className="prose prose-sm max-w-none text-ink/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.bodyHtml || '' }} />
          </article>
        )}
      </main>
    </div>
  );
}
