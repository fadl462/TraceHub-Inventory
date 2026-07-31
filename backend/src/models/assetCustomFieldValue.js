const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AssetCustomFieldValue = sequelize.define('AssetCustomFieldValue', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    assetId: { type: DataTypes.UUID, allowNull: false },
    fieldId: { type: DataTypes.UUID, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'asset_custom_field_values',
    timestamps: true,
    indexes: [{ unique: true, fields: ['assetId', 'fieldId'] }],
  });

  return AssetCustomFieldValue;
};
