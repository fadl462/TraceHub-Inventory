import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, ClipboardList, RotateCcw } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Badge, statusTone, EmptyState, Spinner } from '../../components/ui';

export default function AssignmentsList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/assignments');
      setAssignments(data.assignments);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markReturned = async (id) => {
    try {
      await client.post(`/assignments/${id}/return`);
      toast.success('Marked as returned');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Assignments</h1>
          <p className="text-sm text-ink/60 mt-0.5">Track who has which asset, and when it's due back.</p>
        </div>
        <Link to="/assignments/new"><Button><Plus size={16} /> New assignment</Button></Link>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : assignments.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No assignments yet" description="Assign an asset to a staff member or an outside party to track its return." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-50 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium">Assigned to</th>
                  <th className="px-5 py-3 font-medium">Return date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id} className="border-b border-primary-50 last:border-0 hover:bg-primary-50/40">
                    <td className="px-5 py-3">
                      <Link to={`/assets/${a.assetId}`} className="font-medium text-ink hover:text-primary">{a.Asset?.name}</Link>
                      <p className="text-xs text-ink/50 font-mono">{a.Asset?.assetTag}</p>
                    </td>
                    <td className="px-5 py-3 text-ink/80">
                      {a.assignee ? `${a.assignee.firstName} ${a.assignee.lastName}` : a.externalAssigneeName}
                    </td>
                    <td className="px-5 py-3 text-ink/70">{a.expectedReturnDate || '—'}</td>
                    <td className="px-5 py-3"><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      {a.status === 'active' || a.status === 'overdue' ? (
                        <button onClick={() => markReturned(a.id)} className="text-secondary hover:underline text-xs font-medium inline-flex items-center gap-1">
                          <RotateCcw size={13} /> Mark returned
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
