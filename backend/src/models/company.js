const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: {
      type: DataTypes.ENUM('company', 'individual'),
      allowNull: false,
      defaultValue: 'company',
    },
    industry: { type: DataTypes.STRING, allowNull: true },
    logoUrl: { type: DataTypes.STRING, allowNull: true },
    currency: { type: DataTypes.STRING, defaultValue: 'USD' },
    timezone: { type: DataTypes.STRING, defaultValue: 'Africa/Accra' },
    country: { type: DataTypes.STRING, allowNull: true },
    // Which regional price a company sees/pays - set from the country chosen
    // at signup. Defaults to 'ghana' to match this platform's own
    // Africa/Accra timezone default, but is a real, separate field (not
    // derived from timezone) so a company can be corrected later without
    // resetting their clock settings.
    pricingRegion: {
      type: DataTypes.ENUM('ghana', 'africa', 'global'),
      allowNull: false,
      defaultValue: 'ghana',
    },
    customDomain: { type: DataTypes.STRING, allowNull: true },
    // General settings blob (payment API preferences, branding overrides, etc.)
    settings: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '{}',
      get() {
        const raw = this.getDataValue('settings');
        try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
      },
      set(val) {
        this.setDataValue('settings', JSON.stringify(val || {}));
      },
    },
    status: {
      type: DataTypes.ENUM('trial', 'active', 'suspended', 'cancelled'),
      defaultValue: 'trial',
    },
    trialEndsAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'companies',
    timestamps: true,
  });

  return Company;
};
