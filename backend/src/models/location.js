const { v4: uuidv4 } = require('uuid');

// Implements Option B from the agreed tracking approach: cost-effective,
// software-based location tracking. Staff scan assets at defined checkpoints
// (warehouses, branches, delivery hubs) rather than via physical IoT/GPS hardware.
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false }, // "Main Warehouse", "Accra Branch"
    address: { type: DataTypes.STRING, allowNull: true },
    latitude: { type: DataTypes.FLOAT, allowNull: true },
    longitude: { type: DataTypes.FLOAT, allowNull: true },
    geofenceRadiusMeters: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 100 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'locations',
    timestamps: true,
  });

  return Location;
};
