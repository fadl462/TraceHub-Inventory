const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    planId: { type: DataTypes.UUID, allowNull: false },
    billingCycle: { type: DataTypes.ENUM('trial', 'monthly', 'annual'), defaultValue: 'trial' },
    status: {
      type: DataTypes.ENUM('trialing', 'active', 'past_due', 'cancelled', 'expired'),
      defaultValue: 'trialing',
    },
    startDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    currentPeriodEnd: { type: DataTypes.DATE, allowNull: false },
    cancelAtPeriodEnd: { type: DataTypes.BOOLEAN, defaultValue: false },
    // Flutterwave subscription/plan reference for auto-renewal
    flwPlanId: { type: DataTypes.STRING, allowNull: true },
    flwSubscriptionId: { type: DataTypes.STRING, allowNull: true },
    lastPaymentFailedAt: { type: DataTypes.DATE, allowNull: true },
    paymentFailureCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'subscriptions',
    timestamps: true,
  });

  return Subscription;
};
