const cron = require('node-cron');
const { Op } = require('sequelize');
const {
  Assignment, Asset, User, Notification, Company, Subscription, PlatformSettings, DisposalCase, BlogPost,
} = require('../models');
const { sendMail } = require('../utils/mailer');
const { evaluateOutcomes } = require('../utils/learningLoop');

/**
 * Scheduled blog publishing: a post is created with isPublished=false and
 * publishedAt set to its intended future publish time. This job simply
 * checks whether that time has arrived and flips isPublished to true -
 * the post then appears exactly as if it had been published by hand at
 * that moment, since every public query already filters on isPublished.
 * Runs every 15 minutes (not once daily like the other jobs below) so a
 * 9am-scheduled post actually goes live close to 9am, not hours late.
 */
async function processScheduledBlogPosts() {
  const due = await BlogPost.findAll({
    where: { isPublished: false, publishedAt: { [Op.lte]: new Date() } },
  });
  for (const post of due) {
    post.isPublished = true;
    // eslint-disable-next-line no-await-in-loop
    await post.save();
    console.log(`[cron] Auto-published scheduled blog post: "${post.title}" (${post.locale})`);
  }
}

/**
 * AI Learning Loop: for every company, check rejected-and-ignored disposal
 * recommendations that are now old enough to judge, and record whether a
 * real failure followed. See utils/learningLoop.js for the full rationale.
 */
async function processLearningLoopEvaluation() {
  const companies = await Company.findAll({ attributes: ['id'] });
  for (const company of companies) {
    // eslint-disable-next-line no-await-in-loop
    await evaluateOutcomes(company.id, { DisposalCase, Asset }).catch((e) => console.error(`[cron] learning loop evaluation failed for company ${company.id}:`, e.message));
  }
}

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

/**
 * Once an assignment is overdue, sends a fresh alert EVERY day it remains
 * unreturned (not just the single due-day reminder above) to both the
 * borrower and the company's admins, with a running day count so nobody
 * has to do the math themselves. Idempotent per calendar day via
 * lastOverdueAlertSentAt, so running this more than once on the same day
 * is safe.
 */
async function processOverdueDailyAlerts() {
  const todayStr = toDateOnly(new Date());

  const overdue = await Assignment.findAll({
    where: {
      status: 'overdue',
      [Op.or]: [{ lastOverdueAlertSentAt: null }, { lastOverdueAlertSentAt: { [Op.ne]: todayStr } }],
    },
    include: [
      { model: Asset },
      { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
    ],
  });

  for (const assignment of overdue) {
    const asset = assignment.Asset;
    const recipientEmail = assignment.assignee?.email || assignment.externalAssigneeEmail;
    const recipientName = assignment.assignee?.firstName || assignment.externalAssigneeName || 'there';
    const daysOverdue = Math.max(1, Math.floor((Date.now() - new Date(assignment.expectedReturnDate).getTime()) / 86400000));

    const subject = `Overdue ${daysOverdue} day${daysOverdue === 1 ? '' : 's'}: ${asset?.name} needs to be returned`;
    const borrowerBody = `<p>Hi ${recipientName},</p><p><strong>${asset?.name}</strong> (${asset?.assetTag}) was due back on <strong>${assignment.expectedReturnDate}</strong> and is now <strong>${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue</strong>. Please return it as soon as possible or contact your admin if you need an extension.</p>`;

    // eslint-disable-next-line no-await-in-loop
    if (recipientEmail) await sendMail({ to: recipientEmail, subject, html: borrowerBody }).catch(() => {});

    // eslint-disable-next-line no-await-in-loop
    const admins = await User.findAll({ where: { companyId: assignment.companyId, role: 'company_admin' } });
    const contactLine = [assignment.assignee?.email || assignment.externalAssigneeEmail, assignment.assignee?.phone || assignment.externalAssigneePhone]
      .filter(Boolean).join(' \u00b7 ');
    const adminBody = `<p>Hi {name},</p><p><strong>${asset?.name}</strong> (${asset?.assetTag}), assigned to <strong>${recipientName}</strong>${contactLine ? ` (${contactLine})` : ''}, was due back on <strong>${assignment.expectedReturnDate}</strong> and is now <strong>${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue</strong>.</p>`;
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(admins.map((admin) => sendMail({
      to: admin.email,
      subject: `[Overdue - Day ${daysOverdue}] ${subject}`,
      html: adminBody.replace('{name}', admin.firstName),
    }).catch(() => {})));

    // eslint-disable-next-line no-await-in-loop
    await Promise.all(admins.map((admin) => Notification.create({
      companyId: assignment.companyId,
      userId: admin.id,
      type: 'return_overdue_daily',
      channel: 'in_app',
      title: subject,
      body: `${asset?.name} (${asset?.assetTag}) with ${recipientName}${contactLine ? ` \u2014 ${contactLine}` : ''}`,
      sentAt: new Date(),
      meta: { assignmentId: assignment.id, assetId: asset?.id, daysOverdue },
    })));

    assignment.lastOverdueAlertSentAt = todayStr;
    // eslint-disable-next-line no-await-in-loop
    await assignment.save();
  }

  return { alertsSent: overdue.length };
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
    Promise.all([processReturnReminders(), processOverdueDailyAlerts(), processSubscriptionWarnings(), processLearningLoopEvaluation()])
      .then(() => recordCronRun())
      .catch((e) => console.error('[cron] jobs failed:', e));
  });
  console.log('[cron] Reminder jobs scheduled (daily 07:00).');

  // Runs every 15 minutes so scheduled blog posts go live close to their
  // intended time rather than waiting for the next once-daily pass.
  cron.schedule('*/15 * * * *', () => {
    processScheduledBlogPosts().catch((e) => console.error('[cron] scheduled blog publish failed:', e));
  });
  console.log('[cron] Scheduled blog publishing checked every 15 minutes.');
}

async function recordCronRun() {
  try {
    const [settings] = await PlatformSettings.findOrCreate({ where: { id: 'default' } });
    settings.lastCronRunAt = new Date();
    await settings.save();
  } catch (e) {
    console.error('[cron] failed to record last run time:', e.message);
  }
}

module.exports = {
  startCronJobs, processReturnReminders, processOverdueDailyAlerts, processSubscriptionWarnings, processLearningLoopEvaluation, processScheduledBlogPosts,
};
