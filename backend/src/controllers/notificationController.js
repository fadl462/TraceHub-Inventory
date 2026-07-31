const { Notification } = require('../models');

async function listMyNotifications(req, res, next) {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
    const unreadCount = await Notification.count({ where: { userId: req.user.id, isRead: false } });
    res.json({ notifications, unreadCount });
  } catch (err) { next(err); }
}

async function markRead(req, res, next) {
  try {
    const n = await Notification.findByPk(req.params.id);
    if (!n || n.userId !== req.user.id) return res.status(404).json({ error: 'Notification not found' });
    n.isRead = true;
    await n.save();
    res.json({ notification: n });
  } catch (err) { next(err); }
}

async function markAllRead(req, res, next) {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { next(err); }
}

module.exports = { listMyNotifications, markRead, markAllRead };
