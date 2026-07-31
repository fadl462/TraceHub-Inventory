import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import client from '../../api/client';
import { Card, Spinner } from '../../components/ui';

const COLORS = ['#1A4D8F', '#4DA3FF', '#7ED957', '#F4A261', '#94A3B8'];

export default function ReportsPage() {
  const [breakdown, setBreakdown] = useState([]);
  const [depreciation, setDepreciation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/reports/assets-by-category'),
      client.get('/reports/depreciation'),
    ]).then(([bd, dep]) => {
      setBreakdown(bd.data.breakdown.map((b) => ({ name: b.AssetCategory?.name || 'Uncategorized', value: Number(b.count) })));
      setDepreciation(dep.data.assets);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Reports & analytics</h1>
        <p className="text-sm text-ink/60 mt-0.5">Insights into asset usage, categories, and depreciation.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-4">Assets by category</h3>
          {breakdown.length === 0 ? (
            <p className="text-sm text-ink/50 py-10 text-center">No categorized assets yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-4">Depreciation report</h3>
          {depreciation.length === 0 ? (
            <p className="text-sm text-ink/50 py-10 text-center">No priced assets yet.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-ink/40 text-left">
                  <tr>
                    <th className="pb-2">Asset</th>
                    <th className="pb-2">Purchased</th>
                    <th className="pb-2">Current value</th>
                    <th className="pb-2">Disposal date</th>
                  </tr>
                </thead>
                <tbody>
                  {depreciation.map((a) => (
                    <tr key={a.id} className="border-t border-primary-50">
                      <td className="py-2">
                        <p className="font-medium text-ink">{a.name}</p>
                        <p className="text-xs text-ink/40">{a.assetTag}</p>
                      </td>
                      <td className="py-2 text-ink/70">{Number(a.purchasePrice).toLocaleString()}</td>
                      <td className="py-2 text-primary font-medium">{Number(a.aiEstimatedCurrentValue || 0).toLocaleString()}</td>
                      <td className="py-2 text-ink/70">{a.aiSuggestedDisposalDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
