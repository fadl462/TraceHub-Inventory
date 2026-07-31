const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AssetLocationEvent = sequelize.define('AssetLocationEvent', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    assetId: { type: DataTypes.UUID, allowNull: false },
    locationId: { type: DataTypes.UUID, allowNull: true },
    scannedByUserId: { type: DataTypes.UUID, allowNull: true },
    eventType: {
      type: DataTypes.ENUM('scan_in', 'scan_out', 'transfer', 'manual_update', 'stock_check'),
      defaultValue: 'scan_in',
    },
    deviceLatitude: { type: DataTypes.FLOAT, allowNull: true }, // phone GPS at scan time (optional, best-effort)
    deviceLongitude: { type: DataTypes.FLOAT, allowNull: true },
    note: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'asset_location_events',
    timestamps: true,
    indexes: [{ fields: ['assetId'] }],
  });

  return AssetLocationEvent;
};
