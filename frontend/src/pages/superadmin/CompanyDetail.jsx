import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Building2, Users, Boxes, DollarSign, Globe, Clock, Link2, Calendar,
} from 'lucide-react';
import client from '../../api/client';
import { Card, Badge, statusTone, Spinner } from '../../components/ui';

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '\u2014';
}

export default function CompanyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get(`/super-admin/companies/${id}`),
      client.get('/users', { params: { companyId: id } }),
      client.get('/assets', { params: { companyId: id, pageSize: 10 } }),
    ]).then(([companyRes, usersRes, assetsRes]) => {
      setData(companyRes.data);
      setUsers(usersRes.data.users);
      setAssets(assetsRes.data.assets);
    }).finally(() => setLoading(false));
  }, [id]);

  const scrollTo = (elId) => document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;
  if (!data) return <p className="text-sm text-ink/60">Company not found.</p>;

  const { company, assetCount, userCount, revenueTotal, payments } = data;
  const sub = company.Subscriptions?.[0];

  return (
    <div className="space-y-6">
      <Link to="/admin/companies" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium">
        <ArrowLeft size={15} /> All companies
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2">
            <Building2 size={20} className="text-primary" /> {company.name}
          </h1>
          <p className="text-sm text-ink/60 mt-0.5">{company.slug} \u00b7 {company.industry || 'No industry set'}</p>
        </div>
        <Badge tone={statusTone(company.status)}>{company.status}</Badge>
      </div>

      {/* Full registration details - everything captured at signup */}
      <Card className="p-5">
        <p className="text-sm font-semibold text-ink mb-4">Registration details</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Building2 size={15} className="text-ink/40 mt-0.5 shrink-0" />
            <div><p className="text-ink/50 text-xs">Account type</p><p className="text-ink capitalize">{company.type}</p></div>
          </div>
          <div className="flex items-start gap-2">
            <Globe size={15} className="text-ink/40 mt-0.5 shrink-0" />
            <div><p className="text-ink/50 text-xs">Currency</p><p className="text-ink">{company.currency}</p></div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={15} className="text-ink/40 mt-0.5 shrink-0" />
            <div><p className="text-ink/50 text-xs">Timezone</p><p className="text-ink">{company.timezone}</p></div>
          </div>
          <div className="flex items-start gap-2">
            <Link2 size={15} className="text-ink/40 mt-0.5 shrink-0" />
            <div><p className="text-ink/50 text-xs">Custom domain</p><p className="text-ink">{company.customDomain || 'Not set'}</p></div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar size={15} className="text-ink/40 mt-0.5 shrink-0" />
            <div><p className="text-ink/50 text-xs">Registered on</p><p className="text-ink">{formatDate(company.createdAt)}</p></div>
          </div>
          {company.trialEndsAt && (
            <div className="flex items-start gap-2">
              <Calendar size={15} className="text-ink/40 mt-0.5 shrink-0" />
              <div><p className="text-ink/50 text-xs">Trial ends</p><p className="text-ink">{formatDate(company.trialEndsAt)}</p></div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        <button onClick={() => scrollTo('assets-section')} className="text-left">
          <Card className="p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-150 cursor-pointer h-full">
            <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><Boxes size={18} /></div>
            <p className="text-2xl font-bold text-ink">{assetCount}</p>
            <p className="text-xs text-ink/60 mt-1">Assets tracked</p>
          </Card>
        </button>
        <button onClick={() => scrollTo('users-section')} className="text-left">
          <Card className="p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-150 cursor-pointer h-full">
            <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><Users size={18} /></div>
            <p className="text-2xl font-bold text-ink">{userCount}</p>
            <p className="text-xs text-ink/60 mt-1">Users</p>
          </Card>
        </button>
        <button onClick={() => scrollTo('invoices-section')} className="text-left">
          <Card className="p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-150 cursor-pointer h-full">
            <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><DollarSign size={18} /></div>
            <p className="text-2xl font-bold text-ink">USD {Number(revenueTotal).toLocaleString()}</p>
            <p className="text-xs text-ink/60 mt-1">Total revenue</p>
          </Card>
        </button>
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-ink mb-3">Subscription</p>
        {sub ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink/70">{sub.SubscriptionPlan?.name} \u00b7 {sub.billingCycle}</span>
            <Badge tone={sub.status === 'active' ? 'success' : sub.status === 'past_due' ? 'warning' : 'default'}>{sub.status}</Badge>
          </div>
        ) : (
          <p className="text-sm text-ink/50">No subscription on record.</p>
        )}
      </Card>

      <Card id="assets-section" className="overflow-hidden scroll-mt-4">
        <div className="px-5 py-3 border-b border-primary-50">
          <p className="text-sm font-semibold text-ink">Recent assets</p>
        </div>
        {assets.length === 0 ? (
          <p className="text-sm text-ink/50 py-8 text-center">No assets registered yet.</p>
        ) : (
          <div className="divide-y divide-primary-50">
            {assets.map((a) => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-ink">{a.name}</p>
                  <p className="text-xs text-ink/50 font-mono">{a.assetTag}</p>
                </div>
                <Badge tone={statusTone(a.status)}>{a.status.replace('_', ' ')}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card id="users-section" className="overflow-hidden scroll-mt-4">
        <div className="px-5 py-3 border-b border-primary-50">
          <p className="text-sm font-semibold text-ink">Users at this company</p>
        </div>
        {users.length === 0 ? (
          <p className="text-sm text-ink/50 py-8 text-center">No users found.</p>
        ) : (
          <div className="divide-y divide-primary-50">
            {users.map((u) => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-ink">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-ink/50">{u.email}</p>
                </div>
                <Badge tone="default">{u.role.replace('_', ' ')}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card id="invoices-section" className="overflow-hidden scroll-mt-4">
        <div className="px-5 py-3 border-b border-primary-50">
          <p className="text-sm font-semibold text-ink">Invoices &amp; payment history</p>
        </div>
        {!payments || payments.length === 0 ? (
          <p className="text-sm text-ink/50 py-8 text-center">No payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-50 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Method</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-primary-50 last:border-0">
                    <td className="px-5 py-3 text-ink/70">{formatDate(p.paidAt || p.createdAt)}</td>
                    <td className="px-5 py-3 text-ink/70 font-mono text-xs">{p.invoiceNumber || p.txRef}</td>
                    <td className="px-5 py-3 text-ink font-medium">{p.currency} {Number(p.amount).toFixed(2)}</td>
                    <td className="px-5 py-3 text-ink/70 capitalize">{p.paymentMethod || '\u2014'}</td>
                    <td className="px-5 py-3">
                      <Badge tone={p.status === 'successful' ? 'success' : p.status === 'failed' ? 'danger' : 'warning'}>{p.status}</Badge>
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
