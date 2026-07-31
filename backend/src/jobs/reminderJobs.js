const cron = require('node-cron');
const { Op } = require('sequelize');
const {
  Assignment, Asset, User, Notification, Company, Subscription,
} = require('../models');
const { sendMail } = require('../utils/mailer');

function toDateOnly(d) { return new Date(d).toISOString().slice(0, 10); }

/**
 * Sends the two reminders promised in the spec:
 *  - 3 days before the expected return date
 *  - on the day of the return date itself
 * to BOTH the company admin and the person the asset was assigned to.
 */
async function processReturnReminders() {
  const today = new Date();
  const in3Days = toDateOnly(new Date(today.getTime() + 3 * 86400000));
  const todayStr = toDateOnly(today);

  const dueSoon = await Assignment.findAll({
    where: {
      status: 'active',
      expectedReturnDate: { [Op.in]: [in3Days, todayStr] },
    },
    include: [
      { model: Asset },
      { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
  });

  for (const assignment of dueSoon) {
    const isDueDay = assignment.expectedReturnDate === todayStr;
    const already = isDueDay ? assignment.reminderDueDaySentAt : assignment.reminder3DaySentAt;
    if (already) continue;

    const asset = assignment.Asset;
    const recipientEmail = assignment.assignee?.email || assignment.externalAssigneeEmail;
    const recipientName = assignment.assignee?.firstName || assignment.externalAssigneeName || 'there';

    const subject = isDueDay
      ? `Return due today: ${asset?.name}`
      : `Reminder: ${asset?.name} is due back in 3 days`;
    const body = isDueDay
      ? `<p>Hi ${recipientName},</p><p><strong>${asset?.name}</strong> (${asset?.assetTag}) is due for return today. Please return it or contact your admin if you need an extension.</p>`
      : `<p>Hi ${recipientName},</p><p>This is a reminder that <strong>${asset?.name}</strong> (${asset?.assetTag}) is due for return on <strong>${assignment.expectedReturnDate}</strong> (3 days from now).</p>`;

    // eslint-disable-next-line no-await-in-loop
    if (recipientEmail) await sendMail({ to: recipientEmail, subject, html: body }).catch(() => {});

    // Also notify the company admin(s), per spec ("both to the company admin and the user")
    // eslint-disable-next-line no-await-in-loop
    const admins = await User.findAll({ where: { companyId: assignment.companyId, role: 'company_admin' } });
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(admins.map((admin) => sendMail({
      to: admin.email,
      subject: `[Admin copy] ${subject}`,
      html: `<p>Hi ${admin.firstName},</p>${body}`,
    }).catch(() => {})));

    // eslint-disable-next-line no-await-in-loop
    await Promise.all(admins.map((admin) => Notification.create({
      companyId: assignment.companyId,
      userId: admin.id,
      type: isDueDay ? 'return_reminder_dueday' : 'return_reminder_3day',
      channel: 'in_app',
      title: subject,
      body: `${asset?.name} (${asset?.assetTag}) assigned to ${recipientName}`,
      sentAt: new Date(),
      meta: { assignmentId: assignment.id, assetId: asset?.id },
    })));

    if (isDueDay) {
      assignment.reminderDueDaySentAt = new Date();
      assignment.status = 'overdue'; // will flip back to returned/active when checked in
    } else {
      assignment.reminder3DaySentAt = new Date();
    }
    // eslint-disable-next-line no-await-in-loop
    await assignment.save();
  }
}

/** Flags trials/subscriptions nearing expiry so companies get an in-app warning before being blocked */
async function processSubscriptionWarnings() {
  const in3Days = new Date(Date.now() + 3 * 86400000);
  const expiringSoon = await Subscription.findAll({
    where: {
      status: { [Op.in]: ['trialing', 'active'] },
      currentPeriodEnd: { [Op.lte]: in3Days },
    },
  });

  for (const sub of expiringSoon) {
    // eslint-disable-next-line no-await-in-loop
    const admins = await User.findAll({ where: { companyId: sub.companyId, role: 'company_admin' } });
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(admins.map((admin) => Notification.create({
      companyId: sub.companyId,
      userId: admin.id,
      type: 'subscription_renewal',
      channel: 'in_app',
      title: sub.status === 'trialing' ? 'Your free trial is ending soon' : 'Your subscription renews soon',
      body: `Your ${sub.status === 'trialing' ? 'trial' : 'subscription'} period ends on ${toDateOnly(sub.currentPeriodEnd)}.`,
    })));
  }

  // Expire trials/subscriptions past their period end
  const expired = await Subscription.findAll({
    where: { status: { [Op.in]: ['trialing', 'active'] }, currentPeriodEnd: { [Op.lt]: new Date() } },
  });
  for (const sub of expired) {
    sub.status = 'expired';
    // eslint-disable-next-line no-await-in-loop
    await sub.save();
  }
}

function startCronJobs() {
  // Runs once daily at 07:00 server time
  cron.schedule('0 7 * * *', () => {
    processReturnReminders().catch((e) => console.error('[cron] return reminders failed:', e));
    processSubscriptionWarnings().catch((e) => console.error('[cron] subscription warnings failed:', e));
  });
  console.log('[cron] Reminder jobs scheduled (daily 07:00).');
}

module.exports = { startCronJobs, processReturnReminders, processSubscriptionWarnings };
