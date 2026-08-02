import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Download } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Spinner, EmptyState } from '../../components/ui';
import { exportToCsv } from '../../utils/exportCsv';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client.get('/super-admin/audit-log', { params: { page, pageSize: 30 } })
      .then(({ data }) => { setLogs(data.logs); setTotalPages(data.totalPages); })
      .finally(() => setLoading(false));
  }, [page]);

  const exportCsv = () => {
    exportToCsv('audit-log-full', logs.map((l) => ({
      date: new Date(l.createdAt).toISOString(), user: l.userName || 'System', company: l.companyName || '', action: l.action, entityType: l.entityType,
    })));
  };

  return (
    <div className="space-y-5">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium">
        <ArrowLeft size={15} /> Platform overview
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2"><Activity size={20} className="text-link" /> Global audit log</h1>
          <p className="text-sm text-ink/60 mt-0.5">Every recorded action across all tenant companies.</p>
        </div>
        {logs.length > 0 && <Button variant="outline" onClick={exportCsv}><Download size={15} /> Export CSV</Button>}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : logs.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Actions taken across the platform will show up here." />
        ) : (
          <div className="divide-y divide-primary-50">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-4 flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-ink">
                    <span className="font-medium">{log.userName || 'System'}</span>
                    {log.companyName && <span className="text-ink/50"> at {log.companyName}</span>}
                    <span className="text-ink/50"> \u2014 {log.action.replace(/\./g, ' ').replace(/_/g, ' ')}</span>
                    {log.entityType && <span className="text-ink/40"> ({log.entityType})</span>}
                  </p>
                  <p className="text-xs text-ink/40 mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm text-ink/60">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
