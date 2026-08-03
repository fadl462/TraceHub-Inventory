import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Boxes, ClipboardList, AlertTriangle, TrendingDown, Plus, ScanLine, Sparkles, Mail, Phone, Calendar, Download, FileText, Presentation, Gauge } from 'lucide-react';
import client from '../api/client';
import { Card, Button, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { exportToCsv } from '../utils/exportCsv';
import { exportToPdf } from '../utils/exportPdf';
import { exportToPptx } from '../utils/exportPptx';

function Stat({ icon: Icon, label, value, tone = 'primary', to }) {
  const tones = {
    primary: 'bg-primary-50 text-link', accent: 'bg-green-50 text-accent-dark',
    warning: 'bg-amber-50 text-amber-600', danger: 'bg-red-50 text-red-600',
  };
  const content = (
    <Card className="p-5 flex items-center gap-4 h-full hover:shadow-card hover:-translate-y-0.5 transition-all duration-150">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink leading-none">{value}</p>
        <p className="text-xs text-ink/60 mt-1">{label}</p>
      </div>
    </Card>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function WelcomeInsightBanner({ overview }) {
  const { user, company } = useAuth();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/reports/ai-insights').then(({ data }) => setInsight(data)).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const hasUrgent = (overview?.overdueAssignments || 0) > 0 || (overview?.upcomingDisposals || 0) > 0;

  return (
    <Card noThemeBg className="p-6 bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '28px 28px',
      }}
      />
      <div className="relative flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white/70">{greeting}, {user?.firstName} — here's what's happening with {company?.name}</p>
          {loading ? (
            <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse mt-2" />
          ) : (
            <p className="mt-1.5 text-lg text-white leading-relaxed">{insight?.insight}</p>
          )}
          {hasUrgent && (
            <div className="mt-3 flex flex-wrap gap-2">
              {overview.overdueAssignments > 0 && (
                <Link to="/assignments" className="text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full">
                  {overview.overdueAssignments} overdue return{overview.overdueAssignments === 1 ? '' : 's'} \u2192
                </Link>
              )}
              {overview.upcomingDisposals > 0 && (
                <Link to="/assets" className="text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full">
                  {overview.upcomingDisposals} nearing disposal \u2192
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { company } = useAuth();
  const { t } = useTranslation();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    client.get('/reports/overview').then(({ data }) => setOverview(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;

  const subtitle = `${company?.name || ''} · Generated ${new Date().toLocaleDateString()}`;

  const buildDashboardSections = async () => {
    const [{ data: intel }, { data: assign }, { data: insights }] = await Promise.all([
      client.get('/reports/intelligence-overview'),
      client.get('/reports/assignment-tracking'),
      client.get('/reports/fleet-insights'),
    ]);
    return [
      {
        heading: 'Fleet overview',
        columns: ['Metric', 'Value'],
        rows: [
          ['Total assets', overview?.assetCounts.total ?? 0],
          ['Active assignments', overview?.activeAssignments ?? 0],
          ['Overdue returns', overview?.overdueAssignments ?? 0],
          ['Healthy assets', intel.healthyCount], ['Critical assets', intel.criticalCount],
          ['Near disposal', intel.nearDisposalCount], ['Due maintenance', intel.dueMaintenanceCount],
          ['Replacement budget needed', `${company?.currency || 'USD'} ${Number(intel.replacementBudget).toLocaleString()}`],
        ],
      },
      {
        heading: 'Assets currently assigned',
        columns: ['Asset', 'Assigned to', 'Contact', 'Due', 'Status'],
        rows: assign.assignments.map((a) => [
          a.asset?.name || '', a.assigneeName, [a.contactEmail, a.contactPhone].filter(Boolean).join(' / ') || '—',
          a.expectedReturnDate || '—', a.isOverdue ? `${a.daysOverdue}d overdue` : `${a.daysHeld}d held`,
        ]),
      },
      {
        heading: 'AI Insights',
        columns: ['Insight'],
        rows: insights.insights.map((i) => [i.text]),
      },
    ];
  };

  const handleExportDashboardPdf = async () => {
    setExporting(true);
    try {
      const sections = await buildDashboardSections();
      exportToPdf('tracehub-dashboard-summary', 'Dashboard Summary', subtitle, sections);
    } finally { setExporting(false); }
  };
  const handleExportDashboardPptx = async () => {
    setExporting(true);
    try {
      const sections = await buildDashboardSections();
      exportToPptx('tracehub-dashboard-summary', 'Dashboard Summary', subtitle, sections);
    } finally { setExporting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Dashboard</h1>
          <p className="text-sm text-ink/60 mt-0.5">Your asset inventory at a glance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportDashboardPdf} disabled={exporting} title="Export dashboard summary as PDF" aria-label="Export PDF" className="text-ink/50 hover:text-link p-2 rounded-lg border border-primary-100 hover:bg-primary-50 transition-colors disabled:opacity-50">
            <FileText size={17} />
          </button>
          <button onClick={handleExportDashboardPptx} disabled={exporting} title="Export dashboard summary as PowerPoint" aria-label="Export PowerPoint" className="text-ink/50 hover:text-link p-2 rounded-lg border border-primary-100 hover:bg-primary-50 transition-colors disabled:opacity-50">
            <Presentation size={17} />
          </button>
          <Link to="/scan"><Button variant="outline"><ScanLine size={16} /> Scan asset</Button></Link>
          <Link to="/assets/new"><Button><Plus size={16} /> Add asset</Button></Link>
        </div>
      </div>

      <WelcomeInsightBanner overview={overview} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Boxes} label={t('dashboard.totalAssets')} value={overview?.assetCounts.total ?? 0} to="/assets" />
        <Stat icon={ClipboardList} label={t('dashboard.activeAssignments')} value={overview?.activeAssignments ?? 0} tone="accent" to="/assignments" />
        <Stat icon={AlertTriangle} label={t('dashboard.overdueReturns')} value={overview?.overdueAssignments ?? 0} tone={overview?.overdueAssignments ? 'danger' : 'primary'} to="/assignments" />
        <Stat icon={TrendingDown} label={t('dashboard.dueForDisposal')} value={overview?.upcomingDisposals ?? 0} tone="warning" to="/assets" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-ink mb-4">{t('dashboard.assetStatusBreakdown')}</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {Object.entries(overview?.assetCounts || {}).filter(([k]) => k !== 'total').map(([status, count]) => {
            const total = overview.assetCounts.total || 1;
            const pct = Math.round((count / total) * 100);
            const colors = { available: 'bg-accent', assigned: 'bg-secondary', maintenance: 'bg-amber-400', disposed: 'bg-ink/30' };
            return (
              <Link key={status} to={`/assets?status=${status}`} className="block group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-ink/70 group-hover:text-ink transition-colors">{status}</span>
                  <span className="font-medium text-ink">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-primary-50 overflow-hidden">
                  <div className={`h-full rounded-full ${colors[status] || 'bg-primary'}`} style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-ink mb-4">{t('dashboard.fleetValue')}</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-ink/50">Total purchase value</p>
            <p className="text-xl font-bold text-ink">{company?.currency || 'USD'} {Number(overview?.totalPurchaseValue || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/50">Current estimated value (AI)</p>
            <p className="text-xl font-bold text-link">{company?.currency || 'USD'} {Number(overview?.totalCurrentValue || 0).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <IntelligenceKpiSection currency={company?.currency || 'USD'} />
    </div>
  );
}

function IntelligenceKpiSection({ currency }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/reports/intelligence-overview')
      .then(({ data }) => setData(data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load intelligence data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl p-4 bg-primary-50/50 h-[68px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-5 border border-red-200">
        <p className="text-sm text-red-600 font-medium">Couldn't load Intelligence KPIs</p>
        <p className="text-xs text-ink/50 mt-1">{error}</p>
      </Card>
    );
  }

  if (!data) return null;

  const chips = [
    { label: 'Healthy assets', value: data.healthyCount, tone: 'accent' },
    { label: 'Critical assets', value: data.criticalCount, tone: data.criticalCount > 0 ? 'danger' : 'primary' },
    { label: 'Near disposal', value: data.nearDisposalCount, tone: data.nearDisposalCount > 0 ? 'warning' : 'primary' },
    { label: 'Due maintenance', value: data.dueMaintenanceCount, tone: 'primary' },
    { label: 'Warranty expiring (60d)', value: data.warrantyExpiringCount, tone: 'primary' },
    { label: 'Idle assets', value: data.idleCount, tone: 'primary' },
  ];
  const chipTones = {
    accent: 'bg-green-50 text-accent-dark', danger: 'bg-red-50 text-red-600',
    warning: 'bg-amber-50 text-amber-600', primary: 'bg-primary-50 text-ink',
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {chips.map((c) => (
          <div key={c.label} className={`rounded-xl p-4 ${chipTones[c.tone]}`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs mt-0.5 opacity-80">{c.label}</p>
          </div>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-ink mb-4">{t('dashboard.depreciationProjections')}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <p className="text-xs text-ink/50">Depreciation today</p>
            <p className="text-lg font-bold text-ink">{currency} {Number(data.depreciationToday).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/50">Monthly asset loss</p>
            <p className="text-lg font-bold text-ink">{currency} {Number(data.monthlyAssetLoss).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/50">Replacement budget needed</p>
            <p className="text-lg font-bold text-link">{currency} {Number(data.replacementBudget).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/50">Projected disposal cost</p>
            <p className="text-lg font-bold text-ink">{currency} {Number(data.projectedDisposalCost).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/50" title="Assets not yet flagged today, but whose engine-suggested disposal date falls within the next 12 months.">Projected replacement cost (12mo)</p>
            <p className="text-lg font-bold text-ink">{currency} {Number(data.projectedReplacementCost).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <RankedList title="Most valuable assets" items={data.mostValuable} currency={currency} valueKey="aiEstimatedCurrentValue" />
        <RankedList title="Most repaired assets" items={data.mostRepaired} currency={currency} valueKey="repairCount" suffix=" repairs" />
        <RankedList title="Most expensive to maintain" items={data.mostExpensiveToMaintain} currency={currency} valueKey={(a) => Number(a.maintenanceCostTotal || 0) + Number(a.repairCostTotal || 0)} />
      </div>

      <AssignmentTrackingPanel />
      <FleetIntelligencePanel />
      <FleetInsightsPanel />
      <LearningLoopPanel />
    </>
  );
}

function daysBetween(from, to = new Date()) {
  return Math.floor((new Date(to) - new Date(from)) / 86400000);
}

function AssignmentTrackingPanel() {
  const { company } = useAuth();
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    client.get('/reports/assignment-tracking').then(({ data }) => setAssignments(data.assignments)).catch(() => setAssignments([]));
  }, []);

  const exportRows = () => assignments.map((a) => ({
    asset: a.asset?.name || '', assetTag: a.asset?.assetTag || '', assignedTo: a.assigneeName,
    email: a.contactEmail || '', phone: a.contactPhone || '', issued: new Date(a.assignedAt).toLocaleDateString(),
    dueDate: a.expectedReturnDate || '', daysHeld: a.daysHeld, overdue: a.isOverdue ? `Yes (${a.daysOverdue}d)` : 'No',
  }));
  const handleCsv = () => exportToCsv('tracehub-assigned-assets', exportRows());
  const handlePdf = () => exportToPdf(
    'tracehub-assigned-assets', 'Assets Currently Assigned', `${company?.name || ''} · Generated ${new Date().toLocaleDateString()}`,
    [{
      heading: 'Assigned assets',
      columns: ['Asset', 'Assigned to', 'Contact', 'Issued', 'Due', 'Days held', 'Overdue'],
      rows: assignments.map((a) => [
        a.asset?.name || '', a.assigneeName, [a.contactEmail, a.contactPhone].filter(Boolean).join(' / ') || '—',
        new Date(a.assignedAt).toLocaleDateString(), a.expectedReturnDate || '—', a.daysHeld,
        a.isOverdue ? `${a.daysOverdue}d overdue` : 'On time',
      ]),
    }],
  );
  const handlePptx = () => exportToPptx(
    'tracehub-assigned-assets', 'Assets Currently Assigned', `${company?.name || ''} · Generated ${new Date().toLocaleDateString()}`,
    [{
      heading: 'Assigned assets',
      columns: ['Asset', 'Assigned to', 'Contact', 'Due', 'Status'],
      rows: assignments.map((a) => [
        a.asset?.name || '', a.assigneeName, [a.contactEmail, a.contactPhone].filter(Boolean).join(' / ') || '—',
        a.expectedReturnDate || '—', a.isOverdue ? `${a.daysOverdue}d overdue` : `${a.daysHeld}d held`,
      ]),
    }],
  );

  if (assignments === null) {
    return (
      <Card className="p-5">
        <div className="h-6 w-48 bg-primary-50/50 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-primary-50/50 animate-pulse" />)}
        </div>
      </Card>
    );
  }

  if (assignments.length === 0) return null;

  const overdueCount = assignments.filter((a) => a.isOverdue).length;
  const visibleAssignments = filter === 'overdue' ? assignments.filter((a) => a.isOverdue)
    : filter === 'ontime' ? assignments.filter((a) => !a.isOverdue) : assignments;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h3 className="font-semibold text-ink flex items-center gap-2 text-sm sm:text-base"><ClipboardList size={16} className="text-primary shrink-0" /> {t('dashboard.assetsCurrentlyAssigned')}</h3>
        <div className="flex items-center gap-1">
          {overdueCount > 0 && (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full mr-1">{overdueCount} overdue</span>
          )}
          <select
            value={filter} onChange={(e) => setFilter(e.target.value)}
            className="text-xs rounded-md border border-primary-100 px-2 py-1.5 mr-1 focus-ring focus:border-secondary bg-transparent text-ink"
          >
            <option value="all">All</option>
            <option value="overdue">Overdue only</option>
            <option value="ontime">On time only</option>
          </select>
          <button onClick={handleCsv} title="Export CSV" aria-label="Export CSV" className="text-ink/40 hover:text-link p-1.5 rounded-md hover:bg-primary-50 transition-colors"><Download size={14} /></button>
          <button onClick={handlePdf} title="Export PDF" aria-label="Export PDF" className="text-ink/40 hover:text-link p-1.5 rounded-md hover:bg-primary-50 transition-colors"><FileText size={14} /></button>
          <button onClick={handlePptx} title="Export PowerPoint" aria-label="Export PowerPoint" className="text-ink/40 hover:text-link p-1.5 rounded-md hover:bg-primary-50 transition-colors"><Presentation size={14} /></button>
        </div>
      </div>
      <p className="text-xs text-ink/50 mb-4">Who has what, when it was issued, and how long it's been out.</p>
      <div className="space-y-2">
        {visibleAssignments.length === 0 ? (
          <p className="text-sm text-ink/50 text-center py-4">No assignments match this filter.</p>
        ) : visibleAssignments.map((a) => (
          <div
            key={a.id}
            className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg ${a.isOverdue ? 'bg-red-50' : 'bg-primary-50/40'}`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                <Link to={`/assets/${a.asset?.id}`} className="hover:text-link">{a.asset?.name}</Link>
                <span className="text-ink/40 font-normal"> \u2192 {a.assigneeName}</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-ink/50">
                <span className="flex items-center gap-1"><Calendar size={11} /> Issued {new Date(a.assignedAt).toLocaleDateString()}</span>
                {a.expectedReturnDate && <span>Due {a.expectedReturnDate}</span>}
                {a.contactEmail && <span className="flex items-center gap-1"><Mail size={11} /> {a.contactEmail}</span>}
                {a.contactPhone && <span className="flex items-center gap-1"><Phone size={11} /> {a.contactPhone}</span>}
              </div>
            </div>
            <div className="shrink-0 text-right">
              {a.isOverdue ? (
                <span className="text-sm font-bold text-red-600">{a.daysHeld}d held — {a.daysOverdue}d overdue</span>
              ) : (
                <span className="text-sm font-medium text-ink/70">{a.daysHeld}d held</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const HEALTH_TIER_META = [
  { key: 'excellent', label: 'Excellent', dot: '#15803D' },
  { key: 'healthy', label: 'Healthy', dot: '#22C55E' },
  { key: 'needsAttention', label: 'Needs Attention', dot: '#D97706' },
  { key: 'highRisk', label: 'High Risk', dot: '#EA580C' },
  { key: 'critical', label: 'Critical', dot: '#DC2626' },
];

function FleetIntelligencePanel() {
  const { company } = useAuth();
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    client.get('/reports/fleet-intelligence-summary').then(({ data }) => setData(data)).catch(() => setData(false));
  }, []);

  if (data === null) {
    return (
      <Card className="p-5">
        <div className="h-6 w-56 bg-primary-50/50 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 rounded-lg bg-primary-50/50 animate-pulse" />)}
        </div>
      </Card>
    );
  }
  if (!data) return null;

  const gradeColor = { A: '#15803D', B: '#22C55E', C: '#D97706', D: '#EA580C', F: '#DC2626' }[data.fleetGrade] || '#94A3B8';
  const riskColor = { Low: 'text-accent-dark', Medium: 'text-amber-600', High: 'text-red-600' };
  const totalTiered = Object.values(data.healthTiers).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-ink flex items-center gap-2"><Gauge size={16} className="text-primary" /> {t('dashboard.fleetIntelligence')}</h3>
        {data.fleetGrade && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink/50">Overall Fleet Grade</span>
            <span className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: gradeColor }}>{data.fleetGrade}</span>
          </div>
        )}
      </div>
      <p className="text-xs text-ink/50 mb-4">Portfolio-level view across your whole fleet — real aggregates, not per-asset detail.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-primary-50/50 rounded-lg p-3">
          <p className="text-xs text-ink/50">Portfolio Health</p>
          <p className="text-lg font-bold text-ink">{data.portfolioHealth != null ? `${data.portfolioHealth}%` : '—'}</p>
        </div>
        <div className="bg-primary-50/50 rounded-lg p-3">
          <p className="text-xs text-ink/50">Asset Availability</p>
          <p className="text-lg font-bold text-ink">{data.assetAvailabilityPct != null ? `${data.assetAvailabilityPct}%` : '—'}</p>
        </div>
        <div className="bg-primary-50/50 rounded-lg p-3">
          <p className="text-xs text-ink/50">Capital Risk</p>
          <p className={`text-lg font-bold ${riskColor[data.financialRisk] || 'text-ink'}`}>{data.capitalRiskPct}%</p>
        </div>
        <div className="bg-primary-50/50 rounded-lg p-3">
          <p className="text-xs text-ink/50">Financial / Operational Risk</p>
          <p className="text-sm font-bold">
            <span className={riskColor[data.financialRisk]}>{data.financialRisk}</span>
            <span className="text-ink/30 mx-1">/</span>
            <span className={riskColor[data.operationalRisk]}>{data.operationalRisk}</span>
          </p>
        </div>
      </div>

      <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-2">Executive Heat Map</p>
      <div className="flex flex-wrap gap-2 mb-1">
        {HEALTH_TIER_META.map((tier) => {
          const count = data.healthTiers[tier.key];
          if (!count) return null;
          return (
            <Link
              key={tier.key}
              to={`/assets?health=${tier.key}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
              style={{ backgroundColor: `${tier.dot}18`, color: tier.dot }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.dot }} />
              {tier.label} · {count}
            </Link>
          );
        })}
        {totalTiered === 0 && <p className="text-sm text-ink/50">No assets have a computed health score yet.</p>}
      </div>

      {data.projectedSavings > 0 && (
        <div className="mt-4 bg-primary-800 text-white rounded-lg p-3.5 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm">
            You've spent <strong>{company?.currency || 'USD'} {data.projectedSavings.toLocaleString()}</strong> maintaining assets the AI recommends replacing — money you'd stop spending by acting on it.
          </p>
        </div>
      )}
    </Card>
  );
}

function FleetInsightsPanel() {
  const { t } = useTranslation();
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    client.get('/reports/fleet-insights').then(({ data }) => setInsights(data.insights)).catch(() => setInsights([]));
  }, []);

  const severityDot = { danger: 'bg-red-500', warning: 'bg-amber-400', info: 'bg-secondary' };

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-ink mb-1 flex items-center gap-2"><Sparkles size={16} className="text-link" /> {t('dashboard.aiInsightsPanel')}</h3>
      <p className="text-xs text-ink/50 mb-4">Rule-based patterns detected across your fleet — real numbers from your own asset data, not fabricated.</p>
      {insights === null ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-9 rounded-lg bg-primary-50/50 animate-pulse" />)}
        </div>
      ) : insights.length === 0 ? (
        <p className="text-sm text-ink/50 py-4 text-center">No notable patterns right now — your fleet looks steady.</p>
      ) : (
        <ul className="space-y-3">
          {insights.map((ins, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink/80">
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${severityDot[ins.severity] || 'bg-primary'}`} />
              {ins.text}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function LearningLoopPanel() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/reports/learning-loop-summary').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return null;

  const totalDecisions = stats.recommendationsFollowed + stats.recommendationsRejected;
  if (totalDecisions === 0) return null; // nothing to show yet for a brand-new company

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-ink mb-1">{t('dashboard.aiLearningLoop')}</h3>
      <p className="text-xs text-ink/50 mb-4">
        How this company's own disposal-decision history is feeding back into the engine's confidence scoring.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-xl font-bold text-ink">{stats.recommendationsFollowed}</p>
          <p className="text-xs text-ink/50 mt-0.5">Recommendations followed</p>
        </div>
        <div>
          <p className="text-xl font-bold text-ink">{stats.recommendationsRejected}</p>
          <p className="text-xs text-ink/50 mt-0.5">Recommendations rejected</p>
        </div>
        <div>
          <p className="text-xl font-bold text-ink">{stats.reliabilityRate != null ? `${stats.reliabilityRate}%` : '—'}</p>
          <p className="text-xs text-ink/50 mt-0.5">Rejected cases later followed by a real failure</p>
        </div>
        <div>
          <p className="text-xl font-bold text-ink">{stats.confidenceAdjustment > 0 ? '+' : ''}{stats.confidenceAdjustment}</p>
          <p className="text-xs text-ink/50 mt-0.5">Current confidence adjustment</p>
        </div>
      </div>
      {!stats.hasEnoughHistory && (
        <p className="text-xs text-ink/40 mt-4">
          Not yet applying an adjustment — needs at least 5 evaluated rejections before trusting the rate ({stats.rejectionsEvaluated} so far, {stats.rejectionsPendingEvaluation} still pending their 30-day evaluation window).
        </p>
      )}
    </Card>
  );
}

function RankedList({ title, items, currency, valueKey, suffix = '' }) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-ink mb-3 text-sm">{title}</h3>
      {!items || items.length === 0 ? (
        <p className="text-sm text-ink/50 py-6 text-center">No data yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((a) => {
            const value = typeof valueKey === 'function' ? valueKey(a) : a[valueKey];
            return (
              <li key={a.id}>
                <Link to={`/assets/${a.id}`} className="flex items-center justify-between text-sm group">
                  <span className="text-ink/80 group-hover:text-link transition-colors truncate pr-2">{a.name}</span>
                  <span className="font-medium text-ink shrink-0">
                    {suffix ? `${value}${suffix}` : `${currency} ${Number(value).toLocaleString()}`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
