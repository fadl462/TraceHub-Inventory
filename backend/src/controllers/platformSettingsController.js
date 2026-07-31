const { PlatformSettings } = require('../models');
const { maskSecret } = require('../utils/crypto');
const { logAction } = require('../middleware/audit');
const { sendMail, reloadTransporter } = require('../utils/mailer');

async function getOrCreateDefault() {
  const [settings] = await PlatformSettings.findOrCreate({ where: { id: 'default' } });
  return settings;
}

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------
async function getBranding(req, res, next) {
  try {
    const s = await getOrCreateDefault();
    res.json({
      appName: s.appName, logoLightUrl: s.logoLightUrl, logoDarkUrl: s.logoDarkUrl, faviconUrl: s.faviconUrl,
    });
  } catch (err) { next(err); }
}

async function updateBranding(req, res, next) {
  try {
    const s = await getOrCreateDefault();
    const before = s.toJSON();
    const { appName, logoLightUrl, logoDarkUrl, faviconUrl } = req.body;
    if (appName !== undefined) s.appName = appName;
    if (logoLightUrl !== undefined) s.logoLightUrl = logoLightUrl;
    if (logoDarkUrl !== undefined) s.logoDarkUrl = logoDarkUrl;
    if (faviconUrl !== undefined) s.faviconUrl = faviconUrl;
    await s.save();
    await logAction(req, { action: 'platformSettings.branding.update', entityType: 'PlatformSettings', entityId: 'default', before: { appName: before.appName }, after: { appName: s.appName } });
    res.json({ appName: s.appName, logoLightUrl: s.logoLightUrl, logoDarkUrl: s.logoDarkUrl, faviconUrl: s.faviconUrl });
  } catch (err) { next(err); }
}

// ---------------------------------------------------------------------------
// SMTP / Email
// ---------------------------------------------------------------------------
async function getSmtp(req, res, next) {
  try {
    const s = await getOrCreateDefault();
    res.json({
      smtpHost: s.smtpHost, smtpPort: s.smtpPort, smtpSecure: s.smtpSecure,
      smtpUser: s.smtpUser, smtpSenderName: s.smtpSenderName,
      smtpPasswordMasked: maskSecret(s.getSmtpPassword()),
      hasPassword: !!s.smtpPasswordEncrypted,
    });
  } catch (err) { next(err); }
}

async function updateSmtp(req, res, next) {
  try {
    const s = await getOrCreateDefault();
    const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword, smtpSenderName } = req.body;
    if (smtpHost !== undefined) s.smtpHost = smtpHost;
    if (smtpPort !== undefined) s.smtpPort = smtpPort;
    if (smtpSecure !== undefined) s.smtpSecure = smtpSecure;
    if (smtpUser !== undefined) s.smtpUser = smtpUser;
    if (smtpSenderName !== undefined) s.smtpSenderName = smtpSenderName;
    // Only overwrite the stored password if a new one was actually typed in
    // (the UI sends a masked placeholder otherwise, never the real value back)
    if (smtpPassword) s.setSmtpPassword(smtpPassword);
    await s.save();
    reloadTransporter();
    await logAction(req, { action: 'platformSettings.smtp.update', entityType: 'PlatformSettings', entityId: 'default' });
    res.json({ message: 'SMTP settings saved' });
  } catch (err) { next(err); }
}

async function testSmtp(req, res, next) {
  try {
    const { toEmail } = req.body;
    if (!toEmail) return res.status(400).json({ error: 'toEmail is required' });
    await sendMail({
      to: toEmail,
      subject: 'TraceHub Inventory - SMTP test',
      html: '<p>This is a test email confirming your SMTP configuration is working.</p>',
    });
    res.json({ message: `Test email sent to ${toEmail}` });
  } catch (err) {
    res.status(502).json({ error: `Failed to send test email: ${err.message}` });
  }
}

// ---------------------------------------------------------------------------
// Payments / Flutterwave
// ---------------------------------------------------------------------------
async function getPayments(req, res, next) {
  try {
    const s = await getOrCreateDefault();
    res.json({
      flwMode: s.flwMode,
      flwPublicKey: s.flwPublicKey,
      flwSecretKeyMasked: maskSecret(s.getFlwSecretKey()),
      hasSecretKey: !!s.flwSecretKeyEncrypted,
      hasEncryptionKey: !!s.flwEncryptionKeyEncrypted,
    });
  } catch (err) { next(err); }
}

async function updatePayments(req, res, next) {
  try {
    const s = await getOrCreateDefault();
    const { flwMode, flwPublicKey, flwSecretKey, flwEncryptionKey } = req.body;
    if (flwMode !== undefined) s.flwMode = flwMode;
    if (flwPublicKey !== undefined) s.flwPublicKey = flwPublicKey;
    if (flwSecretKey) s.setFlwSecretKey(flwSecretKey);
    if (flwEncryptionKey) s.setFlwEncryptionKey(flwEncryptionKey);
    await s.save();
    await logAction(req, { action: 'platformSettings.payments.update', entityType: 'PlatformSettings', entityId: 'default', after: { flwMode: s.flwMode } });
    res.json({ message: 'Payment settings saved' });
  } catch (err) { next(err); }
}

async function testPayments(req, res, next) {
  try {
    const flw = require('../utils/flutterwave');
    const { v4: uuidv4 } = require('uuid');
    const txRef = `TH-TEST-${uuidv4()}`;
    const checkout = await flw.initiateCheckout({
      txRef,
      amount: 1,
      currency: 'USD',
      customerEmail: req.user.email,
      customerName: `${req.user.firstName} ${req.user.lastName}`,
      redirectUrl: `${process.env.CLIENT_URL}/billing/callback`,
      meta: { test: true },
    });
    res.json({ message: 'Test transaction initiated successfully', checkoutUrl: checkout.link });
  } catch (err) {
    res.status(502).json({ error: `Flutterwave test failed: ${err.message}` });
  }
}

module.exports = {
  getBranding, updateBranding, getSmtp, updateSmtp, testSmtp, getPayments, updatePayments, testPayments,
};
