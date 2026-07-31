const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // Trial, Basic, Pro, Enterprise
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
    assetLimit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 }, // -1 = unlimited
    userLimit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    priceMonthly: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    priceAnnual: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING, defaultValue: 'GHS' },
    features: {
      // JSON list of feature flags e.g. ["gps_events","reporting","api_access","custom_domain"]
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('features');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(val) { this.setDataValue('features', JSON.stringify(val || [])); },
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'subscription_plans',
    timestamps: true,
  });

  return SubscriptionPlan;
};
