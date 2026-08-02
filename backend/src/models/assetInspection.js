const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AssetInspection = sequelize.define('AssetInspection', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    assetId: { type: DataTypes.UUID, allowNull: false },
    inspectedByUserId: { type: DataTypes.UUID, allowNull: true },
    score: { type: DataTypes.DECIMAL(5, 2), allowNull: false }, // 0-100
    condition: {
      type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'critical'),
      allowNull: true,
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    inspectedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'asset_inspections',
    timestamps: true,
    indexes: [{ fields: ['assetId'] }],
  });

  return AssetInspection;
};
