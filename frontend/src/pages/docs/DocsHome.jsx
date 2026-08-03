import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, MessageCircleQuestion, Newspaper, Rocket, Boxes, Sparkles, ScanLine,
  ClipboardList, Trash2, ShieldCheck, BarChart3, CreditCard, Settings, LifeBuoy, BookOpen,
} from 'lucide-react';
import client from '../../api/client';
import RadarLocateVisual from '../../components/landing/RadarLocateVisual';
import { Spinner } from '../../components/ui';
import { useDocProgress } from '../../hooks/useDocProgress';

// Category names come back from the API already localized (e.g. "Getting
// Started" / "Bien démarrer" / "Primeros pasos" depending on the requested
// locale) - matching on the literal string broke as soon as a second
// language was added. This maps every known localized name variant to a
// single stable key, so the icon and the translated blurb both resolve
// correctly regardless of which language the category name arrived in.
const CATEGORY_NAME_TO_KEY = {
  'Getting Started': 'gettingStarted', 'Bien démarrer': 'gettingStarted', 'Primeros pasos': 'gettingStarted',
  'Managing Assets': 'managingAssets', 'Gérer les actifs': 'managingAssets', 'Gestionar activos': 'managingAssets',
  'The Asset Intelligence Engine': 'intelligenceEngine', "Le moteur d'intelligence des actifs": 'intelligenceEngine', 'El motor de inteligencia de activos': 'intelligenceEngine',
  'Tracking & Scanning': 'trackingScanning', 'Suivi et scan': 'trackingScanning', 'Seguimiento y escaneo': 'trackingScanning',
  Assignments: 'assignments', Affectations: 'assignments', Asignaciones: 'assignments',
  'Disposal Workflow': 'disposalWorkflow', 'Flux de mise au rebut': 'disposalWorkflow', 'Flujo de baja': 'disposalWorkflow',
  'Team & Security': 'teamSecurity', 'Équipe et sécurité': 'teamSecurity', 'Equipo y seguridad': 'teamSecurity',
  'Reports & Exporting': 'reportsExporting', 'Rapports et exportation': 'reportsExporting', 'Informes y exportación': 'reportsExporting',
  'Billing & Subscriptions': 'billing', 'Facturation et abonnements': 'billing', 'Facturación y suscripciones': 'billing',
  'For Super Admins': 'superAdmins', 'Pour les Super Admins': 'superAdmins', 'Para Super Admins': 'superAdmins',
  'Troubleshooting & FAQs': 'troubleshooting', 'Dépannage et FAQ': 'troubleshooting', 'Solución de problemas y FAQ': 'troubleshooting',
  Reference: 'reference', 'Référence': 'reference', 'Referencia': 'reference',
};

const CATEGORY_KEY_META = {
  gettingStarted: { icon: Rocket, blurbKey: 'catGettingStartedBlurb' },
  managingAssets: { icon: Boxes, blurbKey: 'catManagingAssetsBlurb' },
  intelligenceEngine: { icon: Sparkles, blurbKey: 'catIntelligenceEngineBlurb' },
  trackingScanning: { icon: ScanLine, blurbKey: 'catTrackingScanningBlurb' },
  assignments: { icon: ClipboardList, blurbKey: 'catAssignmentsBlurb' },
  disposalWorkflow: { icon: Trash2, blurbKey: 'catDisposalWorkflowBlurb' },
  teamSecurity: { icon: ShieldCheck, blurbKey: 'catTeamSecurityBlurb' },
  reportsExporting: { icon: BarChart3, blurbKey: 'catReportsExportingBlurb' },
  billing: { icon: CreditCard, blurbKey: 'catBillingBlurb' },
  superAdmins: { icon: Settings, blurbKey: 'catSuperAdminsBlurb' },
  troubleshooting: { icon: LifeBuoy, blurbKey: 'catTroubleshootingBlurb' },
  reference: { icon: BookOpen, blurbKey: 'catReferenceBlurb' },
};

export default function DocsHome() {
  const { openChat } = useOutletContext();
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState(null);
  const { readSlugs, loaded: progressLoaded, isSynced } = useDocProgress();

  useEffect(() => {
    client.get('/docs', { params: { locale: i18n.language } }).then(({ data }) => setCategories(data.categories)).catch(() => setCategories([]));
  }, [i18n.language]);

  return (
    <div>
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary overflow-hidden px-6 sm:px-10 py-16 sm:py-20">
        <div className="absolute -right-16 -top-10 w-72 h-72 opacity-40 pointer-events-none hidden md:block">
          <RadarLocateVisual />
        </div>
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">{t('docsHome.tagline')}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">{t('docsHome.heroTitle')}</h1>
          <p className="text-white/70 max-w-xl">{t('docsHome.heroSubtitle')}</p>
        </div>
      </div>

      <div className="px-6 sm:px-10 py-14">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="font-display text-xl font-bold text-ink">{t('docsHome.browseByCategory')}</h2>
          {progressLoaded && readSlugs.size > 0 && (
            <p className="text-xs text-ink/40">{isSynced ? t('docsHome.syncedToAccount') : t('docsHome.savedOnThisDevice')}</p>
          )}
        </div>
        {categories === null ? (
          <div className="flex justify-center py-12"><Spinner size={24} /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const key = CATEGORY_NAME_TO_KEY[c.category];
              const meta = CATEGORY_KEY_META[key] || { icon: BookOpen, blurbKey: null };
              const Icon = meta.icon;
              const firstSlug = c.articles[0]?.slug;
              return (
                <Link
                  key={c.category} to={firstSlug ? `/docs/${firstSlug}` : '/docs'}
                  className="group flex flex-col p-5 rounded-2xl border border-ink/10 bg-white hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary shrink-0">
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink group-hover:text-primary transition-colors">{c.category}</h3>
                      <p className="text-xs text-ink/40">
                        {c.articles.length}{c.articles.length === 1 ? t('docsHome.articleSingular') : t('docsHome.articlePlural')}
                        {c.totalReadingMinutes > 0 && <> &middot; {t('docsHome.totalReadTime', { count: c.totalReadingMinutes })}</>}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-ink/60 flex-1">{meta.blurbKey ? t(`docsHome.${meta.blurbKey}`) : ''}</p>
                  {progressLoaded && (() => {
                    const readCount = c.articles.filter((a) => readSlugs.has(a.slug)).length;
                    if (readCount === 0) return null;
                    const pct = Math.round((readCount / c.articles.length) * 100);
                    return (
                      <div className="mt-3">
                        <div className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
                          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-ink/40 mt-1">{pct}% {t('docsHome.complete')}</p>
                      </div>
                    );
                  })()}
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('docsHome.browse')} <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-primary text-white px-6 sm:px-10 py-14 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">{t('docsHome.ctaTitle')}</h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto">{t('docsHome.ctaSubtitle')}</p>
        <Link to="/register" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
          {t('docsHome.ctaButton')}
        </Link>
      </div>

      <div className="px-6 sm:px-10 py-14">
        <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">{t('docsHome.otherResources')}</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <button
            onClick={openChat}
            className="text-left border border-ink/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="bg-primary-50/50 px-5 py-3 flex items-center gap-2 font-semibold text-primary text-sm">
              <MessageCircleQuestion size={16} /> {t('docsHome.aiAssistantPanel')}
            </div>
            <p className="p-5 text-sm text-ink/60">{t('docsHome.aiAssistantDesc')}</p>
          </button>
          <Link
            to="/blog"
            className="text-left block border border-ink/10 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="bg-primary-50/50 px-5 py-3 flex items-center gap-2 font-semibold text-primary text-sm">
              <Newspaper size={16} /> {t('docsHome.blogUpdatesPanel')}
            </div>
            <p className="p-5 text-sm text-ink/60">
              {t('docsHome.blogUpdatesDesc')}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
