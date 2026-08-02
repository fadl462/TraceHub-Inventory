import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, ClipboardList, RotateCcw, CheckCircle2, Circle, Mail, Phone } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Badge, statusTone, EmptyState, Spinner } from '../../components/ui';

function daysBetween(from, to = new Date()) {
  return Math.floor((new Date(to) - new Date(from)) / 86400000);
}

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

  const togglePaid = async (a) => {
    try {
      await client.patch(`/assignments/${a.id}/hire-payment`, { paid: !a.hireFeePaid });
      toast.success(a.hireFeePaid ? 'Marked as unpaid' : 'Marked as paid \u2014 confirmation email sent');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update payment status');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Assignments</h1>
          <p className="text-sm text-ink/60 mt-0.5">Track who has which asset, when it's due back, and whether hire fees are paid.</p>
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
                  <th className="px-5 py-3 font-medium">Issued</th>
                  <th className="px-5 py-3 font-medium">Return date</th>
                  <th className="px-5 py-3 font-medium">Days held</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Hire fee</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const email = a.assignee?.email || a.externalAssigneeEmail;
                  const phone = a.assignee?.phone || a.externalAssigneePhone;
                  const isActive = a.status === 'active' || a.status === 'overdue';
                  const daysHeld = isActive ? daysBetween(a.assignedAt) : null;
                  const daysOverdue = isActive && a.expectedReturnDate ? daysBetween(a.expectedReturnDate) : -1;
                  const isOverdue = isActive && daysOverdue >= 0;
                  return (
                    <tr key={a.id} className="border-b border-primary-50 last:border-0 hover:bg-primary-50/40">
                      <td className="px-5 py-3">
                        <Link to={`/assets/${a.assetId}`} className="font-medium text-ink hover:text-link">{a.Asset?.name}</Link>
                        <p className="text-xs text-ink/50 font-mono">{a.Asset?.assetTag}</p>
                      </td>
                      <td className="px-5 py-3 text-ink/80">
                        <p>{a.assignee ? `${a.assignee.firstName} ${a.assignee.lastName}` : a.externalAssigneeName}</p>
                        {(email || phone) && (
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            {email && <span className="text-xs text-ink/50 flex items-center gap-1"><Mail size={11} /> {email}</span>}
                            {phone && <span className="text-xs text-ink/50 flex items-center gap-1"><Phone size={11} /> {phone}</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-ink/70">{a.assignedAt ? new Date(a.assignedAt).toLocaleDateString() : '\u2014'}</td>
                      <td className="px-5 py-3 text-ink/70">{a.expectedReturnDate || '\u2014'}</td>
                      <td className="px-5 py-3">
                        {daysHeld == null ? '\u2014' : isOverdue ? (
                          <span className="font-semibold text-red-600">{daysHeld}d ({daysOverdue}d overdue)</span>
                        ) : (
                          <span className="text-ink/70">{daysHeld}d</span>
                        )}
                      </td>
                      <td className="px-5 py-3"><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                      <td className="px-5 py-3">
                        {a.hireFeeAmount ? (
                          <button
                            onClick={() => togglePaid(a)}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 transition-colors ${
                              a.hireFeePaid ? 'bg-green-50 text-accent-dark hover:bg-green-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                          >
                            {a.hireFeePaid ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                            {a.hireFeeCurrency} {Number(a.hireFeeAmount).toFixed(2)} \u00b7 {a.hireFeePaid ? 'Paid' : 'Unpaid'}
                          </button>
                        ) : (
                          <span className="text-ink/30 text-xs">\u2014</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {isActive ? (
                          <button onClick={() => markReturned(a.id)} className="text-secondary hover:underline text-xs font-medium inline-flex items-center gap-1">
                            <RotateCcw size={13} /> Mark returned
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
