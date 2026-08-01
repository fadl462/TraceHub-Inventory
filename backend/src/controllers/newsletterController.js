const { NewsletterSubscriber } = require('../models');

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email: String(email).toLowerCase().trim() },
      defaults: { isActive: true },
    });
    if (!created && !subscriber.isActive) {
      subscriber.isActive = true;
      await subscriber.save();
    }
    res.json({ message: created ? 'Subscribed! Thanks for joining.' : 'You\u2019re already subscribed.' });
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const subscribers = await NewsletterSubscriber.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ subscribers, total: subscribers.length });
  } catch (err) { next(err); }
}

module.exports = { subscribe, listAll };
