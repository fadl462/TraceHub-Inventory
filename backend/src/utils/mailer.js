const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    // No SMTP configured - fall back to a JSON-logging transport so the app
    // still runs end-to-end in dev/demo without crashing on missing creds.
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
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  return t.sendMail({
    from: process.env.MAIL_FROM || 'TraceHub Inventory <no-reply@tracehub.app>',
    to,
    subject,
    html,
    text: text || html?.replace(/<[^>]+>/g, ' '),
  });
}

module.exports = { sendMail };
