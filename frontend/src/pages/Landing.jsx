import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ScanLine, Sparkles, ShieldCheck, BarChart3, CalendarClock, CreditCard,
  ArrowRight, Check, QrCode,
} from 'lucide-react';
import TraceHubMark from '../components/TraceHubMark';
import AiChatWidget from '../components/AiChatWidget';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import RadarLocateVisual from '../components/landing/RadarLocateVisual';
import ScanIllustration from '../components/landing/ScanIllustration';
import TrackedAssetsIllustration from '../components/landing/TrackedAssetsIllustration';
import client from '../api/client';

const DEFAULT_CONTENT = {
  heroEyebrow: 'Asset & inventory management',
  heroHeadline: 'Know where every asset is, always.',
  heroSubheadline: 'Register equipment in seconds, let AI propose disposal timelines, assign gear to your team, and track it all with a simple scan — no hardware required.',
  heroCtaText: 'Start free — 10 assets, 30 days',
  heroCtaLink: '/register',
  heroSecondaryCtaText: 'See how it works',
  footerDescription: 'Precision asset tracking, built for real operations.',
  footerCopyright: 'TraceHub Inventory. All rights reserved.',
};

// Plan feature codes -> translation keys (server sends stable codes like
// 'reporting', 'qr_scanning' - only the DEFAULT_PLANS fallback below and the
// live /plans response both resolve through this same map).
const FEATURE_KEYS = {
  reporting: 'featReporting', qr_scanning: 'featQrScanning', api_access: 'featApiAccess',
  custom_fields: 'featCustomFields', multi_location: 'featMultiLocation',
  custom_domain: 'featCustomDomain', priority_support: 'featPrioritySupport',
};

// Plan codes -> translation keys, for the default four tiers. A Super Admin
// could rename these to anything (they're editable business data, same as
// footer links or blog posts) - only the known default codes get a
// translated display name; anything else falls back to whatever name is
// actually stored, since forcing a translation onto a custom plan name
// would be wrong.
const PLAN_NAME_KEYS = { trial: 'planTrial', basic: 'planBasic', pro: 'planPro', enterprise: 'planEnterprise' };

function formatPlan(p, t) {
  return {
    name: PLAN_NAME_KEYS[p.code] ? t(`landing.${PLAN_NAME_KEYS[p.code]}`) : p.name,
    price: Number(p.priceMonthly) === 0 ? '$0' : `$${p.priceMonthly}`,
    period: p.code === 'trial' ? t('landing.for30Days') : t('landing.perMonth'),
    assets: p.assetLimit === -1 ? t('landing.unlimitedAssets') : t('landing.assetsCount', { count: p.assetLimit }),
    users: p.userLimit === -1 ? t('landing.unlimitedUsers') : t('landing.usersCount', { count: p.userLimit }),
    features: (p.features || []).map((f) => (FEATURE_KEYS[f] ? t(`landing.${FEATURE_KEYS[f]}`) : f)),
    highlight: p.code === 'pro',
  };
}

function defaultPlans(t) {
  return [
    { name: t('landing.planTrial'), price: '$0', period: t('landing.for30Days'), assets: t('landing.assetsCount', { count: 10 }), users: t('landing.usersCount', { count: 3 }), features: [t('landing.featReporting')], highlight: false },
    { name: t('landing.planBasic'), price: '$19', period: t('landing.perMonth'), assets: t('landing.assetsCount', { count: 100 }), users: t('landing.usersCount', { count: 5 }), features: [t('landing.featReporting'), t('landing.featQrScanning')], highlight: false },
    { name: t('landing.planPro'), price: '$49', period: t('landing.perMonth'), assets: t('landing.assetsCount', { count: 1000 }), users: t('landing.usersCount', { count: 25 }), features: [t('landing.featReporting'), t('landing.featQrScanning'), t('landing.featApiAccess'), t('landing.featCustomFields'), t('landing.featMultiLocation')], highlight: true },
    { name: t('landing.planEnterprise'), price: '$149', period: t('landing.perMonth'), assets: t('landing.unlimitedAssets'), users: t('landing.unlimitedUsers'), features: [t('landing.featEverythingInPro'), t('landing.featCustomDomain'), t('landing.featPrioritySupport')], highlight: false },
  ];
}

function Hero({ content }) {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-primary-800">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block text-xs font-mono font-medium tracking-widest uppercase text-secondary-light bg-white/10 px-3 py-1.5 rounded-full mb-6">
            {content.heroEyebrow}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.08] tracking-tight">
            {content.heroHeadline}
          </h1>
          <p className="mt-5 text-lg text-primary-100/80 leading-relaxed max-w-lg">
            {content.heroSubheadline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={content.heroCtaLink || '/register'}
              className="inline-flex items-center gap-2 bg-accent text-primary-900 font-semibold px-6 py-3.5 rounded-lg hover:bg-accent-dark hover:text-white transition-colors"
            >
              {content.heroCtaText}
              <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-white/85 font-medium px-2 py-3.5 hover:text-white transition-colors"
            >
              {content.heroSecondaryCtaText}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-primary-100/60 font-medium">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent" /> {t('landing.noCardRequired')}</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent" /> {t('landing.liveInMinutes')}</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent" /> {t('landing.noRfidGps')}</span>
          </div>
        </div>
        {content.heroImageUrl ? (
          <img src={content.heroImageUrl} alt="" className="w-full h-auto max-w-[460px] mx-auto rounded-2xl" />
        ) : (
          <RadarLocateVisual />
        )}
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { n: '01', title: t('landing.step1Title'), body: t('landing.step1Body') },
    { n: '02', title: t('landing.step2Title'), body: t('landing.step2Body') },
    { n: '03', title: t('landing.step3Title'), body: t('landing.step3Body') },
    { n: '04', title: t('landing.step4Title'), body: t('landing.step4Body') },
  ];
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-bold text-ink tracking-tight">{t('landing.howItWorksTitle')}</h2>
        <p className="mt-3 text-ink/60 leading-relaxed">
          {t('landing.howItWorksSubtitle')}
        </p>
      </div>
      <div className="mt-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-x-14 gap-y-16 items-center">
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-5">
              <span className="font-mono text-sm font-medium text-secondary shrink-0 pt-1">{s.n}</span>
              <div>
                <h3 className="font-display font-semibold text-lg text-ink">{s.title}</h3>
                <p className="mt-2 text-ink/60 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-primary-50 rounded-3xl p-8">
          <ScanIllustration />
        </div>
      </div>
    </section>
  );
}

function DepreciationProof() {
  const { t } = useTranslation();
  return (
    <section className="bg-primary-50 py-20">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-widest uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <Sparkles size={13} /> {t('landing.depreciationEngineTag')}
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold text-ink tracking-tight">
            {t('landing.depreciationProofTitle')}
          </h2>
          <p className="mt-4 text-ink/60 leading-relaxed max-w-md">
            {t('landing.depreciationProofSubtitle')}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-ink/5 p-8 font-mono text-sm">
          <div className="flex justify-between text-ink/50 pb-3 border-b border-ink/10">
            <span>{t('landing.demoAsset')}</span><span>Dell Latitude 5420</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">{t('landing.demoPurchasePrice')}</span><span className="text-ink font-medium">$500.00</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">{t('landing.demoCategoryUsefulLife')}</span><span className="text-ink font-medium">5 {t('landing.demoYears')}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">{t('landing.demoEstimatedScrapValue')}</span><span className="text-ink font-medium">$50.00</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">{t('landing.demoAnnualDepreciation')}</span><span className="text-ink font-medium">$90.00 {t('landing.demoPerYear')}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-ink/70 font-medium">{t('landing.demoBookValueAfter3Years')}</span>
            <span className="text-accent-dark font-bold text-base">$230.00</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useTranslation();
  const features = [
    { icon: Sparkles, title: t('landing.feature1Title'), body: t('landing.feature1Body') },
    { icon: ScanLine, title: t('landing.feature2Title'), body: t('landing.feature2Body') },
    { icon: CalendarClock, title: t('landing.feature3Title'), body: t('landing.feature3Body') },
    { icon: ShieldCheck, title: t('landing.feature4Title'), body: t('landing.feature4Body') },
    { icon: BarChart3, title: t('landing.feature5Title'), body: t('landing.feature5Body') },
    { icon: CreditCard, title: t('landing.feature6Title'), body: t('landing.feature6Body') },
  ];
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-bold text-ink tracking-tight">{t('landing.featuresTitle')}</h2>
        <p className="mt-3 text-ink/60 leading-relaxed">
          {t('landing.featuresSubtitle')}
        </p>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="p-6 rounded-2xl border border-ink/5 bg-white hover:shadow-card hover:-translate-y-1 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-primary">
              <Icon size={21} />
            </div>
            <h3 className="mt-4 font-display font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-ink/60 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrackedOperations() {
  const { t } = useTranslation();
  const bullets = [t('landing.trackedBullet1'), t('landing.trackedBullet2'), t('landing.trackedBullet3')];
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div className="order-2 lg:order-1 bg-white rounded-3xl border border-ink/5 shadow-card p-10">
          <TrackedAssetsIllustration />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="font-display text-3xl font-bold text-ink tracking-tight">
            {t('landing.trackedOpsTitle')}
          </h2>
          <p className="mt-4 text-ink/60 leading-relaxed max-w-md">
            {t('landing.trackedOpsSubtitle')}
          </p>
          <ul className="mt-7 space-y-3">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink/70">
                <Check size={16} className="text-accent-dark mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Pricing({ plans }) {
  const { t } = useTranslation();
  return (
    <section id="pricing" className="relative bg-primary-800 py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">{t('landing.pricingTitle')}</h2>
          <p className="mt-3 text-primary-100/70 leading-relaxed">
            {t('landing.pricingSubtitle')}
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl flex flex-col transition-transform duration-200 hover:-translate-y-1.5 ${
                p.highlight ? 'bg-white ring-2 ring-accent shadow-2xl shadow-black/30 lg:scale-105' : 'bg-white/[0.06] ring-1 ring-white/10'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-mono font-semibold tracking-wide uppercase text-primary-900 bg-accent px-3 py-1 rounded-full shadow-sm">
                  {t('landing.mostPopular')}
                </span>
              )}
              <div className="p-6 pb-5">
                <h3 className={`font-display font-semibold text-lg ${p.highlight ? 'text-ink' : 'text-white'}`}>{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`font-display text-3xl font-bold ${p.highlight ? 'text-ink' : 'text-white'}`}>{p.price}</span>
                  <span className={`text-xs ${p.highlight ? 'text-ink/50' : 'text-primary-100/60'}`}>{p.period}</span>
                </div>
              </div>

              <div className={`h-px mx-6 ${p.highlight ? 'bg-ink/10' : 'bg-white/10'}`} />

              <div className="p-6 pt-5 flex-1 flex flex-col">
                <ul className={`space-y-2.5 text-sm flex-1 ${p.highlight ? 'text-ink/70' : 'text-primary-100/80'}`}>
                  <li className="flex items-center gap-2 font-medium"><Check size={15} className={p.highlight ? 'text-accent-dark' : 'text-accent'} />{p.assets}</li>
                  <li className="flex items-center gap-2 font-medium"><Check size={15} className={p.highlight ? 'text-accent-dark' : 'text-accent'} />{p.users}</li>
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><Check size={15} className={p.highlight ? 'text-accent-dark' : 'text-accent'} />{f}</li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`mt-6 text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                    p.highlight ? 'bg-primary text-white hover:bg-primary-600' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                {t('landing.getStarted')}
              </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ items }) {
  const { t } = useTranslation();
  if (!items || items.length === 0) return null;
  // Duplicated once so the track can loop seamlessly at translateX(-50%) -
  // the marquee CSS lives in index.css (.th-marquee-track).
  const looped = [...items, ...items];
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold text-ink tracking-tight">{t('landing.testimonialsTitle')}</h2>
        </div>
      </div>
      <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="th-marquee-track flex gap-6 w-max px-6">
          {looped.map((t2, i) => (
            <div key={`${t2.id}-${i}`} className="p-6 rounded-2xl border border-ink/5 bg-white w-80 shrink-0">
              <p className="text-sm text-ink/70 leading-relaxed">&ldquo;{t2.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-ink">{t2.authorName}</p>
              <p className="text-xs text-ink/50">
                {t2.authorRole}{t2.authorRole && t2.companyName ? ' — ' : ''}{t2.companyName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiAssistantSection({ faqs, onOpenChat }) {
  const { t } = useTranslation();
  const prompts = (faqs || []).slice(0, 3).map((f) => f.question);
  return (
    <section className="bg-primary-50 py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-widest uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          <Sparkles size={13} /> {t('landing.aiAssistantTag')}
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold text-ink tracking-tight">{t('landing.aiAssistantTitle')}</h2>
        <p className="mt-3 text-ink/60 leading-relaxed max-w-md mx-auto">
          {t('landing.aiAssistantSubtitle')}
        </p>
        <button
          onClick={onOpenChat}
          className="mt-7 inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Sparkles size={17} /> {t('landing.chatWithAssistant')}
        </button>
        {prompts.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {prompts.map((q) => (
              <button
                key={q}
                onClick={onOpenChat}
                className="text-xs font-medium text-ink/60 bg-white border border-ink/10 hover:border-primary/30 px-3 py-1.5 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FinalCTA({ content }) {
  const { t } = useTranslation();
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24 text-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10 rounded-[2.5rem] mx-6"
        style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(77,163,255,0.10), transparent)' }}
      />
      <QrCode className="mx-auto text-primary" size={32} />
      <h2 className="mt-5 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
        {t('landing.finalCtaTitle')}
      </h2>
      <p className="mt-3 text-ink/60 max-w-md mx-auto">
        {t('landing.finalCtaSubtitle')}
      </p>
      <Link
        to={content.heroCtaLink || '/register'}
        className="mt-8 inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-primary-600 transition-colors"
      >
        {t('landing.createWorkspace')}
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [rawPlans, setRawPlans] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    client.get('/site-content', { params: { locale: i18n.language } }).then(({ data }) => setContent(data.content)).catch(() => {});
    client.get('/testimonials', { params: { locale: i18n.language } }).then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => {});
    client.get('/faqs', { params: { locale: i18n.language } }).then(({ data }) => setFaqs(data.faqs || [])).catch(() => {});
  }, [i18n.language]);

  useEffect(() => {
    client.get('/plans').then(({ data }) => {
      if (data.plans?.length) setRawPlans(data.plans);
    }).catch(() => {});
  }, []);

  // Computed at render time (not stored pre-formatted) so plan names/labels
  // stay correctly translated if the language changes after the initial
  // fetch, rather than being frozen in whatever language was active when
  // the API call first resolved.
  const displayPlans = rawPlans ? rawPlans.map((p) => formatPlan(p, t)) : defaultPlans(t);

  return (
    <div className="bg-surface">
      <SiteHeader />
      <Hero content={content} />
      <HowItWorks />
      <DepreciationProof />
      <Features />
      <TrackedOperations />
      <Pricing plans={displayPlans} />
      <Testimonials items={testimonials} />
      <AiAssistantSection faqs={faqs} onOpenChat={() => setChatOpen(true)} />
      <FinalCTA content={content} />
      <SiteFooter />
      <AiChatWidget quickPrompts={faqs.slice(0, 5).map((f) => f.question)} isOpen={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
