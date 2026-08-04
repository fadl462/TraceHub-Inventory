const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // Free, Essential, Professional, Business, Enterprise
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
    assetLimit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 }, // -1 = unlimited
    userLimit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    // Global (US/Europe) pricing - the baseline used when a company's region
    // isn't one of the discounted regions below, or hasn't been set at all.
    priceMonthly: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    priceAnnual: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING, defaultValue: 'USD' },
    // Real regional pricing, not just a marketing idea - a company in Ghana or
    // elsewhere in Africa genuinely pays less than the global rate, keeping
    // the platform accessible in the markets it's actually built for (no
    // hardware requirement, local billing, full language support) while
    // still capturing willingness-to-pay in higher-income markets. Stored as
    // JSON (same pattern as `features` below) so adding a new region later
    // is a data change, not a schema migration.
    // Shape: { ghana: { monthly, annual }, africa: { monthly, annual } }
    regionalPricing: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '{}',
      get() {
        const raw = this.getDataValue('regionalPricing');
        try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
      },
      set(val) { this.setDataValue('regionalPricing', JSON.stringify(val || {})); },
    },
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
