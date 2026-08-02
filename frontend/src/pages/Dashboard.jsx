import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, ClipboardList, AlertTriangle, TrendingDown, Plus, ScanLine, Sparkles } from 'lucide-react';
import client from '../api/client';
import { Card, Button, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

function Stat({ icon: Icon, label, value, tone = 'primary', to }) {
  const tones = {
    primary: 'bg-primary-50 text-primary', accent: 'bg-green-50 text-accent-dark',
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
          <p className="text-sm font-semibold text-white/70">{greeting}, {user?.firstName} \u2014 here's what's happening with {company?.name}</p>
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
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/reports/overview').then(({ data }) => setOverview(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Dashboard</h1>
          <p className="text-sm text-ink/60 mt-0.5">Your asset inventory at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/scan"><Button variant="outline"><ScanLine size={16} /> Scan asset</Button></Link>
          <Link to="/assets/new"><Button><Plus size={16} /> Add asset</Button></Link>
        </div>
      </div>

      <WelcomeInsightBanner overview={overview} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Boxes} label="Total assets" value={overview?.assetCounts.total ?? 0} to="/assets" />
        <Stat icon={ClipboardList} label="Active assignments" value={overview?.activeAssignments ?? 0} tone="accent" to="/assignments" />
        <Stat icon={AlertTriangle} label="Overdue returns" value={overview?.overdueAssignments ?? 0} tone={overview?.overdueAssignments ? 'danger' : 'primary'} to="/assignments" />
        <Stat icon={TrendingDown} label="Due for disposal (90d)" value={overview?.upcomingDisposals ?? 0} tone="warning" to="/assets" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-ink mb-4">Asset status breakdown</h3>
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
        <h3 className="font-semibold text-ink mb-4">Fleet value</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-ink/50">Total purchase value</p>
            <p className="text-xl font-bold text-ink">{company?.currency || 'USD'} {Number(overview?.totalPurchaseValue || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-ink/50">Current estimated value (AI)</p>
            <p className="text-xl font-bold text-primary">{company?.currency || 'USD'} {Number(overview?.totalCurrentValue || 0).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <IntelligenceKpiSection currency={company?.currency || 'USD'} />
    </div>
  );
}

function IntelligenceKpiSection({ currency }) {
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
        <h3 className="font-semibold text-ink mb-4">Depreciation &amp; replacement projections</h3>
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
            <p className="text-lg font-bold text-primary">{currency} {Number(data.replacementBudget).toLocaleString()}</p>
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

      <FleetInsightsPanel />
      <LearningLoopPanel />
    </>
  );
}

function FleetInsightsPanel() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    client.get('/reports/fleet-insights').then(({ data }) => setInsights(data.insights)).catch(() => setInsights([]));
  }, []);

  const severityDot = { danger: 'bg-red-500', warning: 'bg-amber-400', info: 'bg-secondary' };

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-ink mb-1 flex items-center gap-2"><Sparkles size={16} className="text-primary" /> AI Insights Panel</h3>
      <p className="text-xs text-ink/50 mb-4">Rule-based patterns detected across your fleet \u2014 real numbers from your own asset data, not fabricated.</p>
      {insights === null ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-9 rounded-lg bg-primary-50/50 animate-pulse" />)}
        </div>
      ) : insights.length === 0 ? (
        <p className="text-sm text-ink/50 py-4 text-center">No notable patterns right now \u2014 your fleet looks steady.</p>
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
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/reports/learning-loop-summary').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return null;

  const totalDecisions = stats.recommendationsFollowed + stats.recommendationsRejected;
  if (totalDecisions === 0) return null; // nothing to show yet for a brand-new company

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-ink mb-1">AI Learning Loop</h3>
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
          <p className="text-xl font-bold text-ink">{stats.reliabilityRate != null ? `${stats.reliabilityRate}%` : '\u2014'}</p>
          <p className="text-xs text-ink/50 mt-0.5">Rejected cases later followed by a real failure</p>
        </div>
        <div>
          <p className="text-xl font-bold text-ink">{stats.confidenceAdjustment > 0 ? '+' : ''}{stats.confidenceAdjustment}</p>
          <p className="text-xs text-ink/50 mt-0.5">Current confidence adjustment</p>
        </div>
      </div>
      {!stats.hasEnoughHistory && (
        <p className="text-xs text-ink/40 mt-4">
          Not yet applying an adjustment \u2014 needs at least 5 evaluated rejections before trusting the rate ({stats.rejectionsEvaluated} so far, {stats.rejectionsPendingEvaluation} still pending their 30-day evaluation window).
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
                  <span className="text-ink/80 group-hover:text-primary transition-colors truncate pr-2">{a.name}</span>
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
