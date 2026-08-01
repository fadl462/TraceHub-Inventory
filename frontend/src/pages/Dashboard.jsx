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
    <Card className="p-6 bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '28px 28px',
      }}
      />
      <div className="relative flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primary-100/80">{greeting}, {user?.firstName} \u2014 here's what's happening with {company?.name}</p>
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
    </div>
  );
}
