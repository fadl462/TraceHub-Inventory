import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../../api/client';
import TraceHubMark from '../TraceHubMark';
import SocialIcon from './SocialIcon';

const DEFAULT_CONTENT = {
  footerDescription: 'Precision asset tracking, built for real operations.',
  footerCopyright: 'TraceHub Inventory. All rights reserved.',
  footerNewsletterEnabled: true,
};

function NewsletterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const { data } = await client.post('/newsletter/subscribe', { email });
      setMessage(data.message);
      setStatus('done');
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.error || t('footer.somethingWentWrong'));
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xs">
      <p className="text-sm font-semibold text-white mb-2">{t('footer.stayInLoop')}</p>
      <p className="text-xs text-primary-100/50 mb-3">{t('footer.productUpdatesNoSpam')}</p>
      {status === 'done' ? (
        <p className="text-xs text-accent font-medium">{message}</p>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.emailPlaceholder')}
              className="flex-1 min-w-0 text-sm px-3 py-2 rounded-lg border border-ink/10 focus-ring focus:border-secondary"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="shrink-0 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? '...' : t('footer.join')}
            </button>
          </div>
          {status === 'error' && <p className="mt-2 text-xs text-red-300">{message}</p>}
        </>
      )}
    </form>
  );
}

// Footer links are Super-Admin-managed CMS content (stored in English, no
// per-language rows) - this maps the known default URLs to a translated
// label, falling back to whatever the database actually stores for
// anything a Super Admin has customized or added that isn't in this list.
const LINK_TRANSLATION_KEYS = {
  '/#features': 'linkFeatures', '/#pricing': 'linkPricing', '/#how-it-works': 'linkHowItWorks',
  '/docs': 'linkDocumentation', '/blog': 'linkBlog',
  '/pages/privacy-policy': 'linkPrivacyPolicy', '/pages/terms-of-service': 'linkTermsOfService', '/pages/cookie-policy': 'linkCookiePolicy',
};

export default function SiteFooter() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    client.get('/site-content', { params: { locale: i18n.language } }).then(({ data }) => setContent({ ...DEFAULT_CONTENT, ...data.content })).catch(() => {});
    client.get('/footer-links').then(({ data }) => setLinks(data.links || [])).catch(() => {});
  }, [i18n.language]);

  const linkLabel = (l) => (LINK_TRANSLATION_KEYS[l.url] ? t(`footer.${LINK_TRANSLATION_KEYS[l.url]}`) : l.label);
  const nav = links.filter((l) => l.group === 'nav');
  const legal = links.filter((l) => l.group === 'legal');
  const social = links.filter((l) => l.group === 'social');

  return (
    <footer className="bg-primary-800">
      <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <TraceHubMark size={24} withWordmark tone="white" animate={false} />
          {content.footerDescription && <p className="mt-3 text-sm text-primary-100/60 leading-relaxed">{content.footerDescription}</p>}
          {social.length > 0 && (
            <div className="mt-5 flex items-center gap-2">
              {social.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={l.label}
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <SocialIcon label={l.label} />
                </a>
              ))}
            </div>
          )}
        </div>

        {nav.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-200/50 mb-3">{t('footer.product')}</p>
            <ul className="space-y-2">
              {nav.map((l) => (
                <li key={l.id}><a href={l.url} className="text-sm text-primary-100/70 hover:text-white transition-colors">{linkLabel(l)}</a></li>
              ))}
            </ul>
          </div>
        )}

        {legal.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-200/50 mb-3">{t('footer.legal')}</p>
            <ul className="space-y-2">
              {legal.map((l) => (
                <li key={l.id}><a href={l.url} className="text-sm text-primary-100/70 hover:text-white transition-colors">{linkLabel(l)}</a></li>
              ))}
            </ul>
          </div>
        )}

        {content.footerNewsletterEnabled && (
          <div>
            <NewsletterForm />
          </div>
        )}
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="max-w-6xl mx-auto px-6 text-xs text-primary-200/50">&copy; {new Date().getFullYear()} {content.footerCopyright}</p>
      </div>
    </footer>
  );
}
