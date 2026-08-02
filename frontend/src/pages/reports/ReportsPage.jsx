import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, FileText, Presentation } from 'lucide-react';
import client from '../../api/client';
import { Card, Spinner, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { exportToCsv } from '../../utils/exportCsv';
import { exportToPdf } from '../../utils/exportPdf';
import { exportToPptx } from '../../utils/exportPptx';

const COLORS = ['#1A4D8F', '#4DA3FF', '#7ED957', '#F4A261', '#94A3B8'];

export default function ReportsPage() {
  const { company } = useAuth();
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

  const subtitle = `${company?.name || ''} \u00b7 Generated ${new Date().toLocaleDateString()}`;
  const reportSections = () => [
    {
      heading: 'Assets by category',
      columns: ['Category', 'Asset count'],
      rows: breakdown.map((b) => [b.name, b.value]),
    },
    {
      heading: 'Depreciation report',
      columns: ['Asset', 'Tag', 'Purchased', 'Current value', 'Disposal date'],
      rows: depreciation.map((a) => [
        a.name, a.assetTag, Number(a.purchasePrice).toLocaleString(),
        Number(a.aiEstimatedCurrentValue || 0).toLocaleString(), a.aiSuggestedDisposalDate || '\u2014',
      ]),
    },
  ];

  const handleExportCsv = () => {
    exportToCsv('tracehub-depreciation-report', depreciation.map((a) => ({
      asset: a.name, tag: a.assetTag, purchasePrice: a.purchasePrice,
      currentValue: a.aiEstimatedCurrentValue || 0, disposalDate: a.aiSuggestedDisposalDate || '',
    })));
  };
  const handleExportPdf = () => exportToPdf('tracehub-reports', 'Reports & Analytics', subtitle, reportSections());
  const handleExportPptx = () => exportToPptx('tracehub-reports', 'Reports & Analytics', subtitle, reportSections());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Reports & analytics</h1>
          <p className="text-sm text-ink/60 mt-0.5">Insights into asset usage, categories, and depreciation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportCsv}><Download size={15} /> CSV</Button>
          <Button variant="outline" onClick={handleExportPdf}><FileText size={15} /> PDF</Button>
          <Button variant="outline" onClick={handleExportPptx}><Presentation size={15} /> PowerPoint</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-4">Assets by category</h3>
          {breakdown.length === 0 ? (
            <p className="text-sm text-ink/50 py-10 text-center">No categorized assets yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                    {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
                {breakdown.map((b, i) => (
                  <span key={b.name} className="flex items-center gap-1.5 text-xs text-ink/60">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {b.name} ({b.value})
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-4">Depreciation report</h3>
          {depreciation.length === 0 ? (
            <p className="text-sm text-ink/50 py-10 text-center">No priced assets yet.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="text-xs uppercase tracking-wide text-ink/40 text-left">
                  <tr>
                    <th className="pb-2 whitespace-nowrap">Asset</th>
                    <th className="pb-2 whitespace-nowrap">Purchased</th>
                    <th className="pb-2 whitespace-nowrap">Current value</th>
                    <th className="pb-2 whitespace-nowrap">Disposal date</th>
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
                      <td className="py-2 text-link font-medium">{Number(a.aiEstimatedCurrentValue || 0).toLocaleString()}</td>
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
