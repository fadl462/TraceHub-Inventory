import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Plus, Lightbulb, ChevronUp, Trash2, Filter } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Card, Button, Badge, statusTone, EmptyState, Spinner, Select,
} from '../components/ui';

const STATUS_LABELS = {
  open: 'Open', planned: 'Planned', in_progress: 'In progress', completed: 'Completed', declined: 'Declined',
};

function timeAgo(d) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(d).toLocaleDateString();
}

export default function FeatureRequestsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [votingIds, setVotingIds] = useState(new Set());

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/feature-requests');
      setRequests(data.requests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Give your idea a title'); return; }
    setSubmitting(true);
    try {
      await client.post('/feature-requests', form);
      toast.success('Thanks! Your idea is live - vote for it to help it stand out.');
      setForm({ title: '', description: '' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVote = async (id) => {
    if (votingIds.has(id)) return; // guard against double-click while a vote is in flight
    setVotingIds((s) => new Set(s).add(id));
    // Optimistic update so the count/highlight feels instant, corrected by the real response.
    setRequests((rs) => rs.map((r) => (r.id === id
      ? { ...r, hasVoted: !r.hasVoted, voteCount: r.voteCount + (r.hasVoted ? -1 : 1) }
      : r)));
    try {
      const { data } = await client.post(`/feature-requests/${id}/vote`);
      setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, hasVoted: data.voted, voteCount: data.voteCount } : r)));
    } catch (err) {
      toast.error('Failed to register your vote - please try again');
      load();
    } finally {
      setVotingIds((s) => { const next = new Set(s); next.delete(id); return next; });
    }
  };

  const removeRequest = async (id) => {
    if (!confirm('Remove this request?')) return;
    try {
      await client.delete(`/feature-requests/${id}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove');
    }
  };

  const filtered = statusFilter ? requests.filter((r) => r.status === statusFilter) : requests;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2"><Lightbulb size={20} className="text-primary" /> {t('featureRequests.title')}</h1>
          <p className="text-sm text-ink/60 mt-0.5">Suggest an improvement, or vote for one already suggested — the ideas with the most support across every TraceHub customer rise to the top.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}><Plus size={16} /> {t('featureRequests.suggestIdea')}</Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/80">Title *</span>
              <input
                required maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Bulk-import assets from a CSV file"
                className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/80">Description (optional)</span>
              <textarea
                rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What would this help you do that's hard or impossible today?"
                className="w-full rounded-lg border border-primary-100 px-3.5 py-2.5 text-sm focus-ring focus:border-secondary resize-none"
              />
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit idea'}</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <Filter size={14} className="text-ink/40" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
          <option value="">{t('featureRequests.allStatuses')}</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={Lightbulb} title="No ideas here yet" description="Be the first to suggest an improvement." /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id} className="p-4 flex items-start gap-4">
              <button
                onClick={() => toggleVote(r.id)}
                className={`flex flex-col items-center justify-center w-14 h-16 rounded-lg border shrink-0 transition-colors ${
                  r.hasVoted ? 'bg-primary text-white border-primary' : 'bg-primary-50/50 text-ink/70 border-primary-100 hover:bg-primary-50'
                }`}
                title={r.hasVoted ? 'Remove your vote' : 'Vote for this'}
              >
                <ChevronUp size={16} />
                <span className="text-sm font-bold">{r.voteCount}</span>
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-ink">{r.title}</h3>
                  <Badge tone={statusTone(r.status)}>{STATUS_LABELS[r.status]}</Badge>
                </div>
                {r.description && <p className="text-sm text-ink/60 mt-1">{r.description}</p>}
                {r.statusNote && (
                  <p className="text-xs text-ink/50 mt-2 bg-primary-50/50 rounded-md px-2.5 py-1.5 inline-block">{r.statusNote}</p>
                )}
                <p className="text-xs text-ink/40 mt-2">Suggested by {r.createdByName} · {timeAgo(r.createdAt)}</p>
              </div>
              {(user?.role === 'super_admin' || (r.createdByUserId === user?.id && r.status === 'open')) && (
                <button onClick={() => removeRequest(r.id)} className="text-ink/30 hover:text-red-600 shrink-0"><Trash2 size={15} /></button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
