const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: true }, // null for super_admin
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(val) { this.setDataValue('email', String(val).toLowerCase().trim()); },
    },
    phone: { type: DataTypes.STRING, allowNull: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    // Role hierarchy per project spec: Super Admin > Company Admin > Manager > Staff
    role: {
      type: DataTypes.ENUM('super_admin', 'company_admin', 'manager', 'staff'),
      allowNull: false,
      defaultValue: 'staff',
    },
    // Fine-grained module permissions layered on top of role (JSON map of moduleKey -> [actions])
    permissions: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '{}',
      get() {
        const raw = this.getDataValue('permissions');
        try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
      },
      set(val) { this.setDataValue('permissions', JSON.stringify(val || {})); },
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    // Two-factor authentication (TOTP, e.g. Google/Microsoft Authenticator)
    twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    twoFactorSecret: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
