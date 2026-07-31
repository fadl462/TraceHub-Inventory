const nodemailer = require('nodemailer');

let transporter = null;
let senderName = null;
let senderFallback = null;

/** Forces the next sendMail call to rebuild the transporter from current settings. */
function reloadTransporter() {
  transporter = null;
}

async function getTransporter() {
  if (transporter) return transporter;

  // Prefer DB-configured settings (Super Admin > Email/SMTP panel) so the
  // platform can be fully operated without editing server .env files.
  let dbSettings = null;
  try {
    const { PlatformSettings } = require('../models');
    dbSettings = await PlatformSettings.findByPk('default');
  } catch {
    dbSettings = null;
  }

  const host = dbSettings?.smtpHost || process.env.SMTP_HOST;
  const port = dbSettings?.smtpPort || Number(process.env.SMTP_PORT) || 587;
  const secure = dbSettings ? !!dbSettings.smtpSecure : process.env.SMTP_SECURE === 'true';
  const user = dbSettings?.smtpUser || process.env.SMTP_USER;
  const pass = dbSettings ? dbSettings.getSmtpPassword() : process.env.SMTP_PASS;
  senderName = dbSettings?.smtpSenderName || null;
  senderFallback = process.env.MAIL_FROM || 'TraceHub Inventory <no-reply@tracehub.app>';

  if (!host || !user) {
    transporter = {
      sendMail: async (opts) => {
        console.log('[mailer:stub] Email not sent (SMTP not configured). Would have sent:', {
          to: opts.to, subject: opts.subject,
        });
        return { messageId: 'stub', accepted: [opts.to] };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host, port, secure, auth: { user, pass },
  });
  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const t = await getTransporter();
  const from = senderName ? `${senderName} <${process.env.SMTP_USER || 'no-reply@tracehub.app'}>` : senderFallback;
  return t.sendMail({
    from,
    to,
    subject,
    html,
    text: text || html?.replace(/<[^>]+>/g, ' '),
  });
}

module.exports = { sendMail, reloadTransporter };
