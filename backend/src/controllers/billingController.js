const { v4: uuidv4 } = require('uuid');
const {
  Subscription, SubscriptionPlan, Payment, Company, Notification,
} = require('../models');
const { getActiveSubscription } = require('../middleware/planLimits');
const flw = require('../utils/flutterwave');
const { sendMail } = require('../utils/mailer');
const { logAction } = require('../middleware/audit');

async function getMySubscription(req, res, next) {
  try {
    const sub = await getActiveSubscription(req.companyId);
    res.json({ subscription: sub });
  } catch (err) { next(err); }
}

/** Step 1: initiate a Flutterwave checkout for a plan/billing-cycle choice */
async function startCheckout(req, res, next) {
  try {
    const { planId, billingCycle } = req.body; // billingCycle: 'monthly' | 'annual'
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const amount = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
    const txRef = `TH-${uuidv4()}`;

    const payment = await Payment.create({
      companyId: req.companyId,
      provider: 'flutterwave',
      txRef,
      amount,
      currency: plan.currency,
      status: 'pending',
      meta: { planId, billingCycle },
    });

    const checkout = await flw.initiateCheckout({
      txRef,
      amount,
      currency: plan.currency,
      customerEmail: req.user.email,
      customerName: `${req.user.firstName} ${req.user.lastName}`,
      redirectUrl: `${process.env.CLIENT_URL}/billing/callback`,
      meta: { companyId: req.companyId, planId, billingCycle, paymentId: payment.id },
    });

    res.json({ checkoutUrl: checkout.link, txRef });
  } catch (err) { next(err); }
}

/** Step 2: called after redirect back from Flutterwave (or polled by the client) to finalize */
async function verifyCheckout(req, res, next) {
  try {
    const { transactionId, txRef } = req.body;
    const payment = await Payment.findOne({ where: { txRef } });
    if (!payment) return res.status(404).json({ error: 'Payment record not found' });

    const verified = await flw.verifyTransaction(transactionId);
    if (verified.status !== 'successful' || Number(verified.amount) < Number(payment.amount)) {
      payment.status = 'failed';
      await payment.save();
      return res.status(402).json({ error: 'Payment could not be verified as successful.' });
    }

    await applySuccessfulPayment(payment, verified);
    res.json({ message: 'Payment verified and subscription activated.' });
  } catch (err) { next(err); }
}

async function applySuccessfulPayment(payment, flwTransaction) {
  payment.status = 'successful';
  payment.flwTransactionId = String(flwTransaction.id);
  payment.paymentMethod = flwTransaction.payment_type;
  payment.paidAt = new Date();
  payment.invoiceNumber = `INV-${Date.now()}`;
  await payment.save();

  const { planId, billingCycle } = payment.meta;
  const plan = await SubscriptionPlan.findByPk(planId);
  const periodDays = billingCycle === 'annual' ? 365 : 30;
  const currentPeriodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000);

  let sub = await Subscription.findOne({
    where: { companyId: payment.companyId },
    order: [['createdAt', 'DESC']],
  });

  if (!sub) {
    sub = await Subscription.create({
      companyId: payment.companyId, planId, billingCycle, status: 'active', currentPeriodEnd,
    });
  } else {
    sub.planId = planId;
    sub.billingCycle = billingCycle;
    sub.status = 'active';
    sub.currentPeriodEnd = currentPeriodEnd;
    sub.paymentFailureCount = 0;
    sub.lastPaymentFailedAt = null;
    await sub.save();
  }
  payment.subscriptionId = sub.id;
  await payment.save();

  const company = await Company.findByPk(payment.companyId);
  if (company) { company.status = 'active'; await company.save(); }

  return sub;
}

/** Flutterwave webhook - the authoritative source of truth for payment events (renewals, failures) */
async function webhook(req, res, next) {
  try {
    const signature = req.headers['verif-hash'];
    if (!flw.verifyWebhookSignature(signature)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;
    if (event.event === 'charge.completed' && event.data?.status === 'successful') {
      const payment = await Payment.findOne({ where: { txRef: event.data.tx_ref } });
      if (payment && payment.status !== 'successful') {
        await applySuccessfulPayment(payment, event.data);
      }
    }

    if (event.event === 'charge.failed' || (event.data && event.data.status === 'failed')) {
      const payment = await Payment.findOne({ where: { txRef: event.data.tx_ref } });
      if (payment) {
        payment.status = 'failed';
        await payment.save();
        const sub = await Subscription.findOne({ where: { companyId: payment.companyId }, order: [['createdAt', 'DESC']] });
        if (sub) {
          sub.paymentFailureCount += 1;
          sub.lastPaymentFailedAt = new Date();
          // Per spec: on repeated payment failure, downgrade to basic / mark past_due rather than hard-cutting access
          sub.status = 'past_due';
          await sub.save();
          await Notification.create({
            companyId: payment.companyId, type: 'payment_failed', channel: 'in_app',
            title: 'Subscription payment failed',
            body: 'Your last subscription payment failed. Please update your payment details to avoid service interruption.',
          });
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err) { next(err); }
}

async function listInvoices(req, res, next) {
  try {
    const payments = await Payment.findAll({ where: { companyId: req.companyId }, order: [['createdAt', 'DESC']] });
    res.json({ invoices: payments });
  } catch (err) { next(err); }
}

/** Company Admin can cancel auto-renewal (still active until period end) */
async function cancelSubscription(req, res, next) {
  try {
    const sub = await getActiveSubscription(req.companyId);
    if (!sub) return res.status(404).json({ error: 'No active subscription found' });
    sub.cancelAtPeriodEnd = true;
    await sub.save();
    await logAction(req, { action: 'subscription.cancel', entityType: 'Subscription', entityId: sub.id });
    res.json({ message: 'Auto-renewal cancelled. Your plan remains active until the end of the current billing period.', subscription: sub });
  } catch (err) { next(err); }
}

module.exports = {
  getMySubscription, startCheckout, verifyCheckout, webhook, listInvoices, cancelSubscription, applySuccessfulPayment,
};
