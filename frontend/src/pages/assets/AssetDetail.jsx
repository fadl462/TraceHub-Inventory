import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Download, Archive, UserPlus, MapPin, Sparkles, Clock } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Badge, statusTone, Spinner } from '../../components/ui';

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [qr, setQr] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: assetData }, { data: qrData }, { data: locData }] = await Promise.all([
        client.get(`/assets/${id}`),
        client.get(`/assets/${id}/qr`),
        client.get(`/locations/history/${id}`),
      ]);
      setAsset(assetData.asset);
      setQr(qrData.qrDataUrl);
      setLocationHistory(locData.events);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const archive = async () => {
    if (!confirm('Archive/dispose this asset? This cannot be undone.')) return;
    try {
      await client.post(`/assets/${id}/archive`);
      toast.success('Asset archived');
      navigate('/assets');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to archive');
    }
  };

  if (loading || !asset) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink">{asset.name}</h1>
            <Badge tone={statusTone(asset.status)}>{asset.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-sm text-ink/60 mt-0.5 font-mono">{asset.assetTag}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to={`/assignments/new?assetId=${asset.id}`}><Button variant="outline"><UserPlus size={16} /> Assign</Button></Link>
          <Button variant="danger" onClick={archive}><Archive size={16} /> Archive</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-6 lg:col-span-2 space-y-5">
          <h3 className="font-semibold text-ink">Asset details</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Category" value={asset.AssetCategory?.name || '—'} />
            <Detail label="Brand / Model" value={[asset.brand, asset.model].filter(Boolean).join(' / ') || '—'} />
            <Detail label="Color" value={asset.color || '—'} />
            <Detail label="Serial number" value={asset.serialNumber || '—'} />
            <Detail label="Condition" value={asset.condition} />
            <Detail label="Manufacture year" value={asset.manufactureYear || '—'} />
            <Detail label="Purchase date" value={asset.purchaseDate || '—'} />
            <Detail label="Purchase price" value={asset.purchasePrice ? `${asset.currency} ${Number(asset.purchasePrice).toLocaleString()}` : '—'} />
            <Detail label="Location" value={asset.Location?.name || asset.freeTextLocation || '—'} />
          </div>
          {asset.description && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Description</p>
              <p className="text-sm text-ink/80">{asset.description}</p>
            </div>
          )}

          {asset.purchasePrice && (
            <div className="rounded-lg bg-accent/10 border border-accent/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-accent-dark" />
                <p className="font-medium text-ink text-sm">AI-driven depreciation</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <Detail label="Useful life" value={`${asset.aiUsefulLifeYears} years`} />
                <Detail label="Scrap value" value={`${asset.currency} ${Number(asset.aiScrapValue || 0).toLocaleString()}`} />
                <Detail label="Current estimated value" value={`${asset.currency} ${Number(asset.aiEstimatedCurrentValue || 0).toLocaleString()}`} />
                <Detail label="Suggested disposal date" value={asset.aiSuggestedDisposalDate} />
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium text-ink text-sm mb-3 flex items-center gap-2"><Clock size={15} /> Recent assignments</h4>
            {asset.Assignments?.length ? (
              <div className="space-y-2">
                {asset.Assignments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm border-b border-primary-50 pb-2">
                    <span className="text-ink/80">{a.externalAssigneeName || 'Staff member'} {a.expectedReturnDate && `· due ${a.expectedReturnDate}`}</span>
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-ink/50">No assignment history yet.</p>}
          </div>

          <div>
            <h4 className="font-medium text-ink text-sm mb-3 flex items-center gap-2"><MapPin size={15} /> Location activity</h4>
            {locationHistory.length ? (
              <div className="space-y-2">
                {locationHistory.slice(0, 6).map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-sm border-b border-primary-50 pb-2">
                    <span className="text-ink/80">{e.eventType.replace('_', ' ')} — {e.Location?.name || 'Unspecified'}</span>
                    <span className="text-xs text-ink/40">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-ink/50">No scan activity recorded yet.</p>}
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center h-fit">
          <h3 className="font-semibold text-ink mb-4 self-start">Scan tag</h3>
          {qr && <img src={qr} alt="Asset QR code" className="w-48 h-48 rounded-lg border border-primary-100" />}
          <p className="text-xs text-ink/50 mt-3">Print and attach this to the physical asset. Staff can scan it to update location or status instantly.</p>
          <a href={qr} download={`${asset.assetTag}-qr.png`} className="mt-4 w-full">
            <Button variant="outline" className="w-full"><Download size={16} /> Download QR</Button>
          </a>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink/40">{label}</p>
      <p className="text-ink font-medium capitalize">{value}</p>
    </div>
  );
}
