import { useEffect, useState } from 'react';
import { Building2, Boxes, Users, DollarSign } from 'lucide-react';
import client from '../../api/client';
import { Card, Spinner } from '../../components/ui';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/super-admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  const cards = [
    { icon: Building2, label: 'Total companies', value: stats.totalCompanies, sub: `${stats.activeCompanies} active · ${stats.trialCompanies} trialing` },
    { icon: Boxes, label: 'Total assets tracked', value: stats.totalAssets },
    { icon: Users, label: 'Total users', value: stats.totalUsers },
    { icon: DollarSign, label: 'Total revenue', value: `GHS ${Number(stats.revenueTotal).toLocaleString()}`, sub: `${stats.activeSubs} active subs · ${stats.pastDueSubs} past due` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Platform overview</h1>
        <p className="text-sm text-ink/60 mt-0.5">TraceHub Inventory across all tenant companies.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, label, value, sub }) => (
          <Card key={label} className="p-5">
            <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><Icon size={18} /></div>
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-ink/60 mt-1">{label}</p>
            {sub && <p className="text-xs text-ink/40 mt-1">{sub}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
