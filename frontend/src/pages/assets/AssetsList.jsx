import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Boxes, QrCode } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Input, Select, Badge, statusTone, EmptyState, Spinner } from '../../components/ui';

export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/assets', { params: { search, status, page, pageSize: 20 } });
      setAssets(data.assets);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status, page]);
  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Assets</h1>
          <p className="text-sm text-ink/60 mt-0.5">{total} asset{total !== 1 ? 's' : ''} registered</p>
        </div>
        <Link to="/assets/new"><Button><Plus size={16} /> Add asset</Button></Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              className="w-full rounded-lg border border-primary-100 pl-9 pr-3 py-2.5 text-sm focus-ring focus:border-secondary"
              placeholder="Search by name, tag, serial, brand..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="in_maintenance">In maintenance</option>
            <option value="reserved">Reserved</option>
            <option value="disposed">Disposed</option>
            <option value="lost">Lost</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : assets.length === 0 ? (
          <EmptyState
            icon={Boxes} title="No assets yet"
            description="Register your first asset to start tracking it with TraceHub."
            action={<Link to="/assets/new"><Button><Plus size={16} /> Add your first asset</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-50 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium">Tag</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Current value</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b border-primary-50 last:border-0 hover:bg-primary-50/40">
                    <td className="px-5 py-3">
                      <Link to={`/assets/${a.id}`} className="font-medium text-ink hover:text-primary">{a.name}</Link>
                      <p className="text-xs text-ink/50">{a.brand} {a.model}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink/70">{a.assetTag}</td>
                    <td className="px-5 py-3 text-ink/70">{a.AssetCategory?.name || '—'}</td>
                    <td className="px-5 py-3 text-ink/70">{a.Location?.name || a.freeTextLocation || '—'}</td>
                    <td className="px-5 py-3"><Badge tone={statusTone(a.status)}>{a.status.replace('_', ' ')}</Badge></td>
                    <td className="px-5 py-3 text-ink/70">{a.aiEstimatedCurrentValue != null ? `${a.currency} ${Number(a.aiEstimatedCurrentValue).toLocaleString()}` : '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/assets/${a.id}`} className="text-secondary hover:underline text-xs font-medium inline-flex items-center gap-1">
                        <QrCode size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="px-3 py-2 text-sm text-ink/60">Page {page}</span>
          <Button variant="outline" disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
