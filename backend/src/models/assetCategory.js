const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AssetCategory = sequelize.define('AssetCategory', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: true }, // null = global/built-in category
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    isGlobal: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'asset_categories',
    timestamps: true,
    indexes: [{ unique: true, fields: ['companyId', 'name'] }],
  });

  return AssetCategory;
};
