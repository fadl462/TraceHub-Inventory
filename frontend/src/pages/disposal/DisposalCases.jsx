import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import client from '../../api/client';
import { Card, Badge, Spinner, EmptyState, Select, Button } from '../../components/ui';

const STAGE_LABELS = {
  flagged: 'Flagged', manager_review: 'Manager review', finance_review: 'Finance review',
  approved: 'Approved', auctioning: 'Auctioning', selling: 'Selling', donating: 'Donating',
  scrapping: 'Scrapping', recycling: 'Recycling', disposed: 'Disposed', rejected: 'Rejected',
};

const STAGE_TONE = {
  flagged: 'warning', manager_review: 'info', finance_review: 'info', approved: 'success',
  auctioning: 'default', selling: 'default', donating: 'default', scrapping: 'default', recycling: 'default',
  disposed: 'success', rejected: 'danger',
};

const NEXT_STEPS = {
  flagged: [{ to: 'manager_review', label: 'Send to manager review' }],
  manager_review: [{ to: 'finance_review', label: 'Approve \u2192 finance review' }],
  finance_review: [{ to: 'approved', label: 'Approve for disposal' }],
  approved: [
    { to: 'auctioning', label: 'Send to auction' }, { to: 'selling', label: 'List for sale' },
    { to: 'donating', label: 'Donate' }, { to: 'scrapping', label: 'Scrap' }, { to: 'recycling', label: 'Recycle' },
  ],
  auctioning: [{ to: 'disposed', label: 'Mark disposed' }],
  selling: [{ to: 'disposed', label: 'Mark disposed' }],
  donating: [{ to: 'disposed', label: 'Mark disposed' }],
  scrapping: [{ to: 'disposed', label: 'Mark disposed' }],
  recycling: [{ to: 'disposed', label: 'Mark disposed' }],
};

export default function DisposalCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [saleAmount, setSaleAmount] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/disposal-cases', { params: filter ? { status: filter } : {} });
      setCases(data.cases);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [filter]);

  const transition = async (id, toStatus) => {
    const payload = { toStatus };
    if (toStatus === 'disposed' && saleAmount[id]) payload.finalSaleAmount = Number(saleAmount[id]);
    try {
      await client.post(`/disposal-cases/${id}/transition`, payload);
      toast.success(`Moved to ${STAGE_LABELS[toStatus]}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const reject = async (id) => {
    const reason = prompt('Reason for rejecting this disposal case?');
    if (reason === null) return;
    try {
      await client.post(`/disposal-cases/${id}/transition`, { toStatus: 'rejected', rejectionReason: reason });
      toast.success('Case rejected');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2"><Trash2 size={20} className="text-link" /> Disposal cases</h1>
          <p className="text-sm text-ink/60 mt-0.5">Flagged \u2192 Manager review \u2192 Finance review \u2192 Approved \u2192 Disposed.</p>
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-52">
          <option value="">All stages</option>
          {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : cases.length === 0 ? (
          <EmptyState
            icon={Trash2}
            title="No disposal cases"
            description="Open one from an asset's detail page when the Intelligence Engine recommends disposal, repair, or replacement."
          />
        ) : (
          <div className="divide-y divide-primary-50">
            {cases.map((c) => {
              const nextSteps = NEXT_STEPS[c.status] || [];
              const isFinal = c.status === 'disposed' || c.status === 'rejected';
              return (
                <div key={c.id} className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <Link to={`/assets/${c.assetId}`} className="font-medium text-ink hover:text-link">{c.Asset?.name}</Link>
                      <p className="text-xs text-ink/50 font-mono">{c.Asset?.assetTag}</p>
                      {c.engineRecommendation && (
                        <p className="text-xs text-ink/50 mt-1">Engine said: <span className="font-medium">{c.engineRecommendation}</span> ({c.engineScore}% readiness)</p>
                      )}
                      <p className="text-xs text-ink/40 mt-1">Opened by {c.initiatedBy ? `${c.initiatedBy.firstName} ${c.initiatedBy.lastName}` : 'system'} · {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge tone={STAGE_TONE[c.status]}>{STAGE_LABELS[c.status]}</Badge>
                  </div>

                  {!isFinal && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {c.status === 'approved' && nextSteps.length > 0 && (
                        <p className="text-xs text-ink/50 w-full mb-1">Choose a disposal method:</p>
                      )}
                      {nextSteps.map((step) => (
                        <Button key={step.to} variant="outline" onClick={() => transition(c.id, step.to)}>
                          {step.label} <ArrowRight size={14} />
                        </Button>
                      ))}
                      {['auctioning', 'selling', 'donating', 'scrapping', 'recycling'].includes(c.status) && (
                        <input
                          type="number"
                          placeholder="Final sale amount (optional)"
                          value={saleAmount[c.id] || ''}
                          onChange={(e) => setSaleAmount({ ...saleAmount, [c.id]: e.target.value })}
                          className="text-sm px-3 py-2 rounded-lg border border-primary-100 w-56"
                        />
                      )}
                      {['flagged', 'manager_review', 'finance_review'].includes(c.status) && (
                        <button onClick={() => reject(c.id)} className="text-xs text-red-600 hover:underline inline-flex items-center gap-1 ml-1">
                          <XCircle size={13} /> Reject
                        </button>
                      )}
                    </div>
                  )}

                  {c.status === 'disposed' && (
                    <p className="mt-2 text-xs text-accent-dark flex items-center gap-1">
                      <CheckCircle2 size={13} /> Disposed {new Date(c.disposedAt).toLocaleDateString()}
                      {c.finalSaleAmount != null && ` — ${c.finalSaleCurrency || ''} ${Number(c.finalSaleAmount).toLocaleString()}`}
                    </p>
                  )}
                  {c.status === 'rejected' && c.rejectionReason && (
                    <p className="mt-2 text-xs text-red-600">Rejected: {c.rejectionReason}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
