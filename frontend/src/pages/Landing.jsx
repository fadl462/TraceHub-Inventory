import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine, Sparkles, ShieldCheck, BarChart3, CalendarClock, CreditCard,
  ArrowRight, Check, QrCode,
} from 'lucide-react';
import TraceHubMark from '../components/TraceHubMark';
import AiChatWidget from '../components/AiChatWidget';
import RadarLocateVisual from '../components/landing/RadarLocateVisual';
import ScanIllustration from '../components/landing/ScanIllustration';
import TrackedAssetsIllustration from '../components/landing/TrackedAssetsIllustration';
import SocialIcon from '../components/landing/SocialIcon';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const STEPS = [
  {
    n: '01',
    title: 'Register an asset',
    body: 'Add a name, price, and category. Brand, model, colour, or anything else specific to your business can be a custom field you define yourself.',
  },
  {
    n: '02',
    title: 'Get its disposal timeline instantly',
    body: 'The moment you enter a purchase price, the depreciation engine estimates scrap value, useful life, and today\u2019s book value \u2014 no spreadsheet required.',
  },
  {
    n: '03',
    title: 'Assign it and track it',
    body: 'Hand it to a teammate or an outside contact. Update its location with a phone camera scan at any checkpoint \u2014 no RFID, no GPS hardware.',
  },
  {
    n: '04',
    title: 'Get reminders, not surprises',
    body: 'Automatic alerts land three days before anything is due back, and again on the day \u2014 to both the borrower and whoever assigned it.',
  },
];

const FEATURES = [
  { icon: Sparkles, title: 'AI-driven depreciation', body: 'Category-aware scrap value and useful-life estimates, recalculated automatically whenever price or category changes.' },
  { icon: ScanLine, title: 'QR scan-based tracking', body: 'Every asset gets a scannable code. Check it in or out at a warehouse, branch, or job site from any phone.' },
  { icon: CalendarClock, title: 'Assignments & reminders', body: 'Assign to staff or outside contacts, with automatic return-date reminders so nothing goes missing quietly.' },
  { icon: ShieldCheck, title: 'Role-based access', body: 'Super Admin, Company Admin, Manager, and Staff each see exactly what their role needs \u2014 nothing more.' },
  { icon: BarChart3, title: 'Reports built in', body: 'Asset value, depreciation, location history, and team activity \u2014 without exporting to a separate BI tool.' },
  { icon: CreditCard, title: 'Local billing, built in', body: 'Subscriptions billed through Flutterwave, so payment works the way your business already pays for things.' },
];

const DEFAULT_CONTENT = {
  heroEyebrow: 'Asset & inventory management',
  heroHeadline: 'Know where every asset is, always.',
  heroSubheadline: 'Register equipment in seconds, let AI propose disposal timelines, assign gear to your team, and track it all with a simple scan \u2014 no hardware required.',
  heroCtaText: 'Start free \u2014 10 assets, 30 days',
  heroCtaLink: '/register',
  heroSecondaryCtaText: 'See how it works',
  footerDescription: 'Precision asset tracking, built for real operations.',
  footerCopyright: 'TraceHub Inventory. All rights reserved.',
};

const DEFAULT_PLANS = [
  { name: 'Trial', price: '$0', period: 'for 30 days', assets: '10 assets', users: '3 users', features: ['Reports & analytics'], highlight: false },
  { name: 'Basic', price: '$19', period: '/ month', assets: '100 assets', users: '5 users', features: ['Reports & analytics', 'QR code scanning'], highlight: false },
  { name: 'Pro', price: '$49', period: '/ month', assets: '1,000 assets', users: '25 users', features: ['Reports & analytics', 'QR code scanning', 'API access', 'Custom fields', 'Multi-location support'], highlight: true },
  { name: 'Enterprise', price: '$149', period: '/ month', assets: 'Unlimited assets', users: 'Unlimited users', features: ['Everything in Pro', 'Custom domain', 'Priority support'], highlight: false },
];

const FEATURE_LABELS = {
  reporting: 'Reports & analytics',
  qr_scanning: 'QR code scanning',
  api_access: 'API access',
  custom_fields: 'Custom fields',
  multi_location: 'Multi-location support',
  custom_domain: 'Custom domain',
  priority_support: 'Priority support',
};

function formatPlan(p) {
  return {
    name: p.name,
    price: Number(p.priceMonthly) === 0 ? '$0' : `$${p.priceMonthly}`,
    period: p.code === 'trial' ? 'for 30 days' : '/ month',
    assets: p.assetLimit === -1 ? 'Unlimited assets' : `${p.assetLimit.toLocaleString()} assets`,
    users: p.userLimit === -1 ? 'Unlimited users' : `${p.userLimit} users`,
    features: (p.features || []).map((f) => FEATURE_LABELS[f] || f),
    highlight: p.code === 'pro',
  };
}

function NavBar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-ink/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <TraceHubMark size={30} withWordmark />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
          <a href="#how-it-works" className="hover:text-ink transition-colors">How it works</a>
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a>
        </nav>
        {user ? (
          <Link
            to={user.role === 'super_admin' ? '/admin' : '/dashboard'}
            className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Go to dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline text-sm font-medium text-ink/70 hover:text-ink transition-colors">Log in</Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Get started free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero({ content }) {
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
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent" /> No card required</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent" /> Live in minutes</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent" /> No RFID or GPS hardware</span>
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
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-bold text-ink tracking-tight">From purchase to disposal, in four steps</h2>
        <p className="mt-3 text-ink/60 leading-relaxed">
          The same flow whether you&rsquo;re tracking three laptops or three thousand pieces of
          industrial equipment across multiple sites.
        </p>
      </div>
      <div className="mt-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-x-14 gap-y-16 items-center">
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
          {STEPS.map((s) => (
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
  return (
    <section className="bg-primary-50 py-20">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-widest uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <Sparkles size={13} /> Depreciation engine
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold text-ink tracking-tight">
            Real numbers, the moment you register an asset
          </h2>
          <p className="mt-4 text-ink/60 leading-relaxed max-w-md">
            Every category carries a useful-life and scrap-value profile. Enter a purchase price
            and TraceHub does the arithmetic &mdash; no separate depreciation spreadsheet to maintain.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-ink/5 p-8 font-mono text-sm">
          <div className="flex justify-between text-ink/50 pb-3 border-b border-ink/10">
            <span>Asset</span><span>Dell Latitude 5420</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">Purchase price</span><span className="text-ink font-medium">$500.00</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">Category useful life</span><span className="text-ink font-medium">5 years</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">Estimated scrap value</span><span className="text-ink font-medium">$50.00</span>
          </div>
          <div className="flex justify-between py-3 border-b border-ink/10">
            <span className="text-ink/50">Annual depreciation</span><span className="text-ink font-medium">$90.00 / yr</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-ink/70 font-medium">Book value after 3 years</span>
            <span className="text-accent-dark font-bold text-base">$230.00</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-bold text-ink tracking-tight">Everything an operations team needs</h2>
        <p className="mt-3 text-ink/60 leading-relaxed">
          Nothing here is a bolt-on. Every module shares the same asset record, the same permissions, the same audit trail.
        </p>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, body }) => (
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
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div className="order-2 lg:order-1 bg-white rounded-3xl border border-ink/5 shadow-card p-10">
          <TrackedAssetsIllustration />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="font-display text-3xl font-bold text-ink tracking-tight">
            Built for how operations teams actually work
          </h2>
          <p className="mt-4 text-ink/60 leading-relaxed max-w-md">
            No RFID readers to install, no GPS units to budget for. A checkpoint is just a name
            &mdash; a warehouse, a branch, a job site &mdash; and a scan is just a phone camera.
          </p>
          <ul className="mt-7 space-y-3">
            {[
              'Any asset category, with fields your business actually uses',
              'Works the moment a phone can open a browser \u2014 no app install',
              'Every scan, assignment, and edit lands in one audit trail',
            ].map((item) => (
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
  return (
    <section id="pricing" className="relative bg-primary-800 py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">Pricing that scales with your asset count</h2>
          <p className="mt-3 text-primary-100/70 leading-relaxed">
            Every plan includes the full depreciation engine, QR-based tracking, and reporting. Higher tiers add room and reach.
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
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-mono font-semibold tracking-wide uppercase text-primary-900 bg-accent px-3 py-1 rounded-full shadow-sm">
                  Most popular
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
                Get started
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
  if (!items || items.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-bold text-ink tracking-tight">What teams say after switching</h2>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {items.map((t) => (
          <div key={t.id} className="p-6 rounded-2xl border border-ink/5 bg-white">
            <p className="text-sm text-ink/70 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold text-ink">{t.authorName}</p>
            <p className="text-xs text-ink/50">
              {t.authorRole}{t.authorRole && t.companyName ? ' \u2014 ' : ''}{t.companyName}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AiAssistantSection({ faqs, onOpenChat }) {
  const prompts = (faqs || []).slice(0, 3).map((f) => f.question);
  return (
    <section className="bg-primary-50 py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-widest uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          <Sparkles size={13} /> AI assistant
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold text-ink tracking-tight">Have a question? Just ask.</h2>
        <p className="mt-3 text-ink/60 leading-relaxed max-w-md mx-auto">
          Skip the FAQ scavenger hunt \u2014 our AI assistant knows TraceHub inside out and answers in seconds.
        </p>
        <button
          onClick={onOpenChat}
          className="mt-7 inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Sparkles size={17} /> Chat with the assistant
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
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24 text-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10 rounded-[2.5rem] mx-6"
        style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(77,163,255,0.10), transparent)' }}
      />
      <QrCode className="mx-auto text-primary" size={32} />
      <h2 className="mt-5 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
        Ready to know where everything is?
      </h2>
      <p className="mt-3 text-ink/60 max-w-md mx-auto">
        Set up your workspace in a couple of minutes. No card required to start.
      </p>
      <Link
        to={content.heroCtaLink || '/register'}
        className="mt-8 inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-primary-600 transition-colors"
      >
        Create your workspace
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
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
      setMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xs">
      <p className="text-sm font-semibold text-ink mb-2">Stay in the loop</p>
      <p className="text-xs text-ink/50 mb-3">Product updates, occasionally. No spam.</p>
      {status === 'done' ? (
        <p className="text-xs text-accent-dark font-medium">{message}</p>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 min-w-0 text-sm px-3 py-2 rounded-lg border border-ink/10 focus-ring focus:border-secondary"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="shrink-0 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? '...' : 'Join'}
            </button>
          </div>
          {status === 'error' && <p className="mt-2 text-xs text-red-600">{message}</p>}
        </>
      )}
    </form>
  );
}

function Footer({ content, links }) {
  const nav = (links || []).filter((l) => l.group === 'nav');
  const legal = (links || []).filter((l) => l.group === 'legal');
  const social = (links || []).filter((l) => l.group === 'social');

  return (
    <footer className="border-t border-ink/5 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <TraceHubMark size={24} withWordmark animate={false} />
          {content.footerDescription && <p className="mt-3 text-sm text-ink/50 leading-relaxed">{content.footerDescription}</p>}
          {social.length > 0 && (
            <div className="mt-5 flex items-center gap-2">
              {social.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={l.label}
                  className="w-9 h-9 rounded-full bg-primary-50 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <SocialIcon label={l.label} />
                </a>
              ))}
            </div>
          )}
        </div>

        {nav.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-3">Product</p>
            <ul className="space-y-2">
              {nav.map((l) => (
                <li key={l.id}><a href={l.url} className="text-sm text-ink/60 hover:text-ink transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>
        )}

        {legal.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-3">Legal</p>
            <ul className="space-y-2">
              {legal.map((l) => (
                <li key={l.id}><a href={l.url} className="text-sm text-ink/60 hover:text-ink transition-colors">{l.label}</a></li>
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
      <div className="border-t border-ink/5 py-5">
        <p className="max-w-6xl mx-auto px-6 text-xs text-ink/45">&copy; {new Date().getFullYear()} {content.footerCopyright}</p>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    client.get('/site-content').then(({ data }) => setContent(data.content)).catch(() => {});
    client.get('/plans').then(({ data }) => {
      if (data.plans?.length) setPlans(data.plans.map(formatPlan));
    }).catch(() => {});
    client.get('/testimonials').then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => {});
    client.get('/faqs').then(({ data }) => setFaqs(data.faqs || [])).catch(() => {});
    client.get('/footer-links').then(({ data }) => setFooterLinks(data.links || [])).catch(() => {});
  }, []);

  return (
    <div className="bg-surface">
      <NavBar />
      <Hero content={content} />
      <HowItWorks />
      <DepreciationProof />
      <Features />
      <TrackedOperations />
      <Pricing plans={plans} />
      <Testimonials items={testimonials} />
      <AiAssistantSection faqs={faqs} onOpenChat={() => setChatOpen(true)} />
      <FinalCTA content={content} />
      <Footer content={content} links={footerLinks} />
      <AiChatWidget quickPrompts={faqs.slice(0, 5).map((f) => f.question)} isOpen={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
