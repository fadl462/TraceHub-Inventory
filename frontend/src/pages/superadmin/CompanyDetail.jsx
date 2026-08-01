import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Boxes, DollarSign } from 'lucide-react';
import client from '../../api/client';
import { Card, Badge, statusTone, Spinner } from '../../components/ui';

export default function CompanyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get(`/super-admin/companies/${id}`),
      client.get('/users', { params: { companyId: id } }),
    ]).then(([companyRes, usersRes]) => {
      setData(companyRes.data);
      setUsers(usersRes.data.users);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;
  if (!data) return <p className="text-sm text-ink/60">Company not found.</p>;

  const { company, assetCount, userCount, revenueTotal } = data;
  const sub = company.Subscriptions?.[0];

  return (
    <div className="space-y-6">
      <Link to="/admin/companies" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink font-medium">
        <ArrowLeft size={15} /> All companies
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2">
            <Building2 size={20} className="text-primary" /> {company.name}
          </h1>
          <p className="text-sm text-ink/60 mt-0.5">{company.slug} \u00b7 {company.industry || 'No industry set'}</p>
        </div>
        <Badge tone={statusTone(company.status)}>{company.status}</Badge>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><Boxes size={18} /></div>
          <p className="text-2xl font-bold text-ink">{assetCount}</p>
          <p className="text-xs text-ink/60 mt-1">Assets tracked</p>
        </Card>
        <Card className="p-5">
          <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><Users size={18} /></div>
          <p className="text-2xl font-bold text-ink">{userCount}</p>
          <p className="text-xs text-ink/60 mt-1">Users</p>
        </Card>
        <Card className="p-5">
          <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3"><DollarSign size={18} /></div>
          <p className="text-2xl font-bold text-ink">USD {Number(revenueTotal).toLocaleString()}</p>
          <p className="text-xs text-ink/60 mt-1">Total revenue</p>
        </Card>
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

      <Card className="overflow-hidden">
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
    </div>
  );
}
