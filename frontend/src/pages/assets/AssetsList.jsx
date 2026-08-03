import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Boxes, QrCode } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Input, Select, Badge, statusTone, EmptyState, Spinner } from '../../components/ui';

// Matches the exact tier bands used by the real Health Score engine
// (assetIntelligence.js: Excellent >=90, Healthy >=75, Needs Attention >=60,
// High Risk >=40, Critical <40) - not a separate UI-invented scale.
function healthColor(score) {
  if (score >= 90) return 'text-accent-dark';
  if (score >= 75) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}
function healthDot(score) {
  if (score >= 90) return '#15803D';
  if (score >= 75) return '#16A34A';
  if (score >= 60) return '#D97706';
  if (score >= 40) return '#EA580C';
  return '#DC2626';
}
function failureColor(pct) {
  if (pct < 20) return 'text-accent-dark';
  if (pct < 45) return 'text-amber-600';
  if (pct < 70) return 'text-orange-600';
  return 'text-red-600';
}
function recommendationTone(rec) {
  if (rec === 'KEEP') return 'success';
  if (rec === 'REPAIR') return 'warning';
  return 'danger'; // SELL / SCRAP / REPLACE
}

export default function AssetsList() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [health] = useState(searchParams.get('health') || '');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/assets', { params: { search, status, categoryId, locationId, health, page, pageSize: 20 } });
      setAssets(data.assets);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    client.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
    client.get('/locations').then(({ data }) => setLocations(data.locations)).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [status, categoryId, locationId, page]);
  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">{t('assets.title')}</h1>
          <p className="text-sm text-ink/60 mt-0.5">{total} asset{total !== 1 ? 's' : ''} registered</p>
        </div>
        <Link to="/assets/new"><Button><Plus size={16} /> {t('assets.addAsset')}</Button></Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              className="w-full rounded-lg border border-primary-100 pl-9 pr-3 py-2.5 text-sm focus-ring focus:border-secondary"
              placeholder="Search by name, tag, serial, brand..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
            <option value="">{t('assets.allStatuses')}</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="in_maintenance">In maintenance</option>
            <option value="reserved">Reserved</option>
            <option value="disposed">Disposed</option>
            <option value="lost">Lost</option>
          </Select>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="sm:w-48">
            <option value="">{t('assets.allCategories')}</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="sm:w-48">
            <option value="">{t('assets.allLocations')}</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
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
                  <th className="px-5 py-3 font-medium">{t('assets.asset')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.tag')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.category')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.location')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.status')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.health')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.failureRisk')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.aiRecommendation')}</th>
                  <th className="px-5 py-3 font-medium">{t('assets.currentValue')}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b border-primary-50 last:border-0 hover:bg-primary-50/40">
                    <td className="px-5 py-3">
                      <Link to={`/assets/${a.id}`} className="font-medium text-ink hover:text-link">{a.name}</Link>
                      <p className="text-xs text-ink/50">{a.brand} {a.model}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink/70">{a.assetTag}</td>
                    <td className="px-5 py-3 text-ink/70">{a.AssetCategory?.name || '—'}</td>
                    <td className="px-5 py-3 text-ink/70">{a.Location?.name || a.freeTextLocation || '—'}</td>
                    <td className="px-5 py-3"><Badge tone={statusTone(a.status)}>{a.status.replace('_', ' ')}</Badge></td>
                    <td className="px-5 py-3">
                      {a.healthScore != null ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${healthColor(a.healthScore)}`}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: healthDot(a.healthScore) }} />
                          {a.healthScore}%
                        </span>
                      ) : <span className="text-ink/30 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {a.failureProbability180d != null ? (
                        <span className={`text-xs font-semibold ${failureColor(a.failureProbability180d)}`}>{a.failureProbability180d}%</span>
                      ) : <span className="text-ink/30 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {a.disposalRecommendation ? (
                        <Badge tone={recommendationTone(a.disposalRecommendation)}>{a.disposalRecommendation}</Badge>
                      ) : <span className="text-ink/30 text-xs">—</span>}
                    </td>
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
