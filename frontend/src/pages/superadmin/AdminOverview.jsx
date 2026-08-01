import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Boxes, Users, DollarSign, Sparkles, AlertTriangle,
  Plus, UserPlus, FileBarChart, Activity, ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import client from '../../api/client';
import { Card, Spinner, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const PLAN_COLORS = ['#1A4D8F', '#4DA3FF', '#7ED957', '#8CC2FF', '#5CB93A'];

function WelcomeInsightBanner() {
  const { user } = useAuth();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/super-admin/ai-insights').then(({ data }) => setInsight(data)).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

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
          <p className="text-sm font-semibold text-primary-100/80">{greeting}, {user?.firstName}</p>
          {loading ? (
            <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse mt-2" />
          ) : (
            <p className="mt-1.5 text-lg text-white leading-relaxed">{insight?.insight}</p>
          )}
          {insight && !insight.configured && (
            <p className="mt-2 text-xs text-primary-200/50">Add an ANTHROPIC_API_KEY for AI-generated analysis \u2014 showing a computed summary for now.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/super-admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  const cards = [
    { icon: Building2, label: 'Total companies', value: stats.totalCompanies, sub: `${stats.activeCompanies} active \u00b7 ${stats.trialCompanies} trialing`, to: '/admin/companies' },
    { icon: Boxes, label: 'Total assets tracked', value: stats.totalAssets, sub: `${stats.assignedCount} assigned \u00b7 ${stats.availableCount} available`, to: '/admin/companies' },
    { icon: Users, label: 'Total users', value: stats.totalUsers, to: '/admin/companies' },
    { icon: DollarSign, label: 'Total revenue', value: `USD ${Number(stats.revenueTotal).toLocaleString()}`, sub: `${stats.activeSubs} active subs \u00b7 ${stats.pastDueSubs} past due`, to: '/admin/plans' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Platform overview</h1>
        <p className="text-sm text-ink/60 mt-0.5">TraceHub Inventory across all tenant companies.</p>
      </div>

      <WelcomeInsightBanner />

      {stats.disposalAlerts > 0 && (
        <Link to="/admin/companies" className="flex items-center justify-between gap-3 bg-amber-50 hover:bg-amber-100 transition-colors rounded-xl px-4 py-3 text-sm">
          <span className="flex items-center gap-2 font-medium text-amber-800">
            <AlertTriangle size={16} /> {stats.disposalAlerts} asset{stats.disposalAlerts === 1 ? '' : 's'} nearing suggested disposal date across the platform
          </span>
          <ArrowRight size={15} className="text-amber-700" />
        </Link>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, label, value, sub, to }) => (
          <Link key={label} to={to}>
            <Card className="p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-150 cursor-pointer h-full">
              <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><Icon size={18} /></div>
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="text-xs text-ink/60 mt-1">{label}</p>
              {sub && <p className="text-xs text-ink/40 mt-1">{sub}</p>}
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-ink mb-4">Asset growth &amp; disposal, last 6 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stats.assetGrowthSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAF1FA" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#2C2C2C99' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#2C2C2C99' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EAF1FA', fontSize: 13 }} />
            <Line type="monotone" dataKey="registered" name="Registered" stroke="#1A4D8F" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="disposed" name="Disposed" stroke="#7ED957" strokeWidth={2.5} dot={{ r: 3 }} strokeDasharray="4 3" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm font-semibold text-ink mb-4">Revenue by plan</p>
          {stats.revenueByPlan.length === 0 ? (
            <p className="text-sm text-ink/50 py-8 text-center">No successful payments yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.revenueByPlan} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {stats.revenueByPlan.map((entry, i) => <Cell key={entry.name} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} contentStyle={{ borderRadius: 10, border: '1px solid #EAF1FA', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
            {stats.revenueByPlan.map((p, i) => (
              <span key={p.name} className="flex items-center gap-1.5 text-xs text-ink/60">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: PLAN_COLORS[i % PLAN_COLORS.length] }} />
                {p.name}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-ink flex items-center gap-1.5"><Activity size={15} /> Global system audit log</p>
          </div>
          {stats.recentAuditLog.length === 0 ? (
            <p className="text-sm text-ink/50 py-8 text-center">No activity recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentAuditLog.map((log) => (
                <li key={log.id} className="flex items-start gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-ink">
                      <span className="font-medium">{log.userName || 'System'}</span>
                      {log.companyName && <span className="text-ink/50"> at {log.companyName}</span>}
                      <span className="text-ink/50"> \u2014 {log.action.replace(/\./g, ' ').replace(/_/g, ' ')}</span>
                    </p>
                    <p className="text-xs text-ink/40">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-ink mb-3">Command center</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/companies"><Button variant="outline"><UserPlus size={16} /> View companies</Button></Link>
          <Link to="/admin/plans"><Button variant="outline"><Plus size={16} /> Manage plans</Button></Link>
          <Link to="/admin/content"><Button variant="outline"><FileBarChart size={16} /> Edit homepage content</Button></Link>
        </div>
      </Card>
    </div>
  );
}
