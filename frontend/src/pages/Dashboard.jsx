import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, ClipboardList, AlertTriangle, TrendingDown, Plus, ScanLine } from 'lucide-react';
import client from '../api/client';
import { Card, Button, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

function Stat({ icon: Icon, label, value, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-50 text-primary', accent: 'bg-green-50 text-accent-dark',
    warning: 'bg-amber-50 text-amber-600', danger: 'bg-red-50 text-red-600',
  };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink leading-none">{value}</p>
        <p className="text-xs text-ink/60 mt-1">{label}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user, company } = useAuth();
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
          <h1 className="text-xl font-bold text-ink">Welcome back, {user?.firstName}</h1>
          <p className="text-sm text-ink/60 mt-0.5">Here's what's happening with {company?.name}'s assets.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/scan"><Button variant="outline"><ScanLine size={16} /> Scan asset</Button></Link>
          <Link to="/assets/new"><Button><Plus size={16} /> Add asset</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Boxes} label="Total assets" value={overview?.assetCounts.total ?? 0} />
        <Stat icon={ClipboardList} label="Active assignments" value={overview?.activeAssignments ?? 0} tone="accent" />
        <Stat icon={AlertTriangle} label="Overdue returns" value={overview?.overdueAssignments ?? 0} tone={overview?.overdueAssignments ? 'danger' : 'primary'} />
        <Stat icon={TrendingDown} label="Due for disposal (90d)" value={overview?.upcomingDisposals ?? 0} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-ink mb-4">Asset status breakdown</h3>
          <div className="space-y-3">
            {Object.entries(overview?.assetCounts || {}).filter(([k]) => k !== 'total').map(([status, count]) => {
              const total = overview.assetCounts.total || 1;
              const pct = Math.round((count / total) * 100);
              const colors = { available: 'bg-accent', assigned: 'bg-secondary', maintenance: 'bg-amber-400', disposed: 'bg-ink/30' };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-ink/70">{status}</span>
                    <span className="font-medium text-ink">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-primary-50 overflow-hidden">
                    <div className={`h-full rounded-full ${colors[status] || 'bg-primary'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-ink mb-4">Fleet value</h3>
          <div className="space-y-4">
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
    </div>
  );
}
