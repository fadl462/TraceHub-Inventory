const crypto = require('crypto');

const FLW_BASE = 'https://api.flutterwave.com/v3';

/** Prefers Super Admin-configured DB settings, falling back to .env */
async function getConfig() {
  let dbSettings = null;
  try {
    const { PlatformSettings } = require('../models');
    dbSettings = await PlatformSettings.findByPk('default');
  } catch {
    dbSettings = null;
  }
  return {
    secretKey: dbSettings?.getFlwSecretKey() || process.env.FLW_SECRET_KEY,
    publicKey: dbSettings?.flwPublicKey || process.env.FLW_PUBLIC_KEY,
    mode: dbSettings?.flwMode || (process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'),
  };
}

async function assertConfigured() {
  const cfg = await getConfig();
  if (!cfg.secretKey) {
    const err = new Error('Flutterwave is not configured. Set it up in Super Admin > Payments, or via FLW_SECRET_KEY/FLW_PUBLIC_KEY in your environment.');
    err.statusCode = 501;
    throw err;
  }
  return cfg;
}

/**
 * Initiates a Flutterwave standard checkout session for a subscription payment.
 * Docs: https://developer.flutterwave.com/docs/collecting-payments/standard
 */
async function initiateCheckout({ txRef, amount, currency, customerEmail, customerName, redirectUrl, meta }) {
  const cfg = await assertConfigured();
  const resp = await fetch(`${FLW_BASE}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency: currency || 'USD',
      redirect_url: redirectUrl,
      customer: { email: customerEmail, name: customerName },
      customizations: {
        title: 'TraceHub Inventory Subscription',
        description: 'Asset & Inventory Management Platform subscription',
        logo: `${process.env.APP_URL}/branding/tracehub-logo.png`,
      },
      meta,
    }),
  });
  const data = await resp.json();
  if (!resp.ok || data.status !== 'success') {
    const err = new Error(data.message || 'Failed to initiate Flutterwave checkout');
    err.statusCode = 502;
    throw err;
  }
  return data.data; // { link, ... }
}

/** Verifies a transaction by id after redirect/webhook, per Flutterwave best practice (always re-verify server-side) */
async function verifyTransaction(transactionId) {
  const cfg = await assertConfigured();
  const resp = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${cfg.secretKey}` },
  });
  const data = await resp.json();
  if (!resp.ok) {
    const err = new Error(data.message || 'Failed to verify Flutterwave transaction');
    err.statusCode = 502;
    throw err;
  }
  return data.data;
}

/** Validates the `verif-hash` header Flutterwave sends on webhook calls */
function verifyWebhookSignature(headerHash) {
  const secretHash = process.env.FLW_WEBHOOK_SECRET_HASH;
  if (!secretHash || !headerHash) return false;
  const a = Buffer.from(headerHash);
  const b = Buffer.from(secretHash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = { initiateCheckout, verifyTransaction, verifyWebhookSignature, getConfig };
