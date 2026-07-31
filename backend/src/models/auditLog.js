const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: true },
    userId: { type: DataTypes.UUID, allowNull: true },
    action: { type: DataTypes.STRING, allowNull: false }, // e.g. "asset.create", "user.role_change"
    entityType: { type: DataTypes.STRING, allowNull: true },
    entityId: { type: DataTypes.STRING, allowNull: true },
    ipAddress: { type: DataTypes.STRING, allowNull: true },
    userAgent: { type: DataTypes.STRING, allowNull: true },
    before: {
      type: DataTypes.TEXT, allowNull: true,
      get() { const r = this.getDataValue('before'); try { return r ? JSON.parse(r) : null; } catch { return null; } },
      set(v) { this.setDataValue('before', v == null ? null : JSON.stringify(v)); },
    },
    after: {
      type: DataTypes.TEXT, allowNull: true,
      get() { const r = this.getDataValue('after'); try { return r ? JSON.parse(r) : null; } catch { return null; } },
      set(v) { this.setDataValue('after', v == null ? null : JSON.stringify(v)); },
    },
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
  });

  return AuditLog;
};
