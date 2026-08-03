import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Check, CreditCard } from 'lucide-react';
import client from '../../api/client';
import { Card, Button, Badge, Spinner } from '../../components/ui';

export default function BillingPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: plansData }, { data: subData }, { data: invoicesData }] = await Promise.all([
        client.get('/plans'),
        client.get('/billing/subscription'),
        client.get('/billing/invoices'),
      ]);
      setPlans(plansData.plans);
      setSubscription(subData.subscription);
      setInvoices(invoicesData.invoices);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const subscribe = async (planId) => {
    setCheckoutLoading(planId);
    try {
      const { data } = await client.post('/billing/checkout', { planId, billingCycle: 'monthly' });
      window.location.href = data.checkoutUrl;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not start checkout. Payment gateway may not be configured yet.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{t('billing.title')}</h1>
        <p className="text-sm text-ink/60 mt-0.5">Manage your plan, payment method, and invoices.</p>
      </div>

      {subscription && (
        <Card className="p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-ink/60">Current plan</p>
            <p className="text-lg font-bold text-ink">{subscription.SubscriptionPlan?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={subscription.status === 'active' ? 'success' : subscription.status === 'trialing' ? 'info' : 'warning'}>{subscription.status}</Badge>
            <span className="text-sm text-ink/60">Renews/ends {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <Card key={p.id} className={`p-5 flex flex-col ${subscription?.planId === p.id ? 'ring-2 ring-primary' : ''}`}>
            <p className="font-semibold text-ink">{p.name}</p>
            <p className="text-2xl font-bold text-link mt-2">{p.currency} {Number(p.priceMonthly).toLocaleString()}<span className="text-sm font-normal text-ink/50">/mo</span></p>
            <p className="text-xs text-ink/50 mt-1">{p.assetLimit === -1 ? 'Unlimited assets' : `${p.assetLimit} assets`} · {p.userLimit === -1 ? 'Unlimited users' : `${p.userLimit} users`}</p>
            <ul className="mt-4 space-y-1.5 flex-1">
              {p.features.map((f) => (
                <li key={f} className="text-xs text-ink/70 flex items-center gap-1.5"><Check size={13} className="text-accent-dark" /> {f.replace(/_/g, ' ')}</li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full" variant={subscription?.planId === p.id ? 'outline' : 'primary'}
              disabled={subscription?.planId === p.id || checkoutLoading === p.id}
              onClick={() => subscribe(p.id)}
            >
              {subscription?.planId === p.id ? 'Current plan' : checkoutLoading === p.id ? 'Redirecting...' : <><CreditCard size={15} /> Subscribe</>}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-ink mb-4">Invoices</h3>
        {invoices.length === 0 ? (
          <p className="text-sm text-ink/50">No invoices yet.</p>
        ) : (
          <div className="divide-y divide-primary-50">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-ink/70">{inv.invoiceNumber || inv.txRef}</span>
                <span className="text-ink/70">{inv.currency} {Number(inv.amount).toLocaleString()}</span>
                <Badge tone={inv.status === 'successful' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'}>{inv.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
