const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: true },
    userId: { type: DataTypes.UUID, allowNull: true },
    type: {
      type: DataTypes.ENUM(
        'return_reminder_3day',
        'return_reminder_dueday',
        'assignment_created',
        'subscription_renewal',
        'payment_failed',
        'asset_limit_warning',
        'disposal_due',
        'system'
      ),
      allowNull: false,
    },
    channel: { type: DataTypes.ENUM('email', 'in_app', 'sms'), defaultValue: 'in_app' },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: true },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    sentAt: { type: DataTypes.DATE, allowNull: true },
    meta: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '{}',
      get() {
        const raw = this.getDataValue('meta');
        try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
      },
      set(val) { this.setDataValue('meta', JSON.stringify(val || {})); },
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
  });

  return Notification;
};
